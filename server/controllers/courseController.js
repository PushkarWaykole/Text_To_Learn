import { GoogleGenerativeAI } from '@google/generative-ai';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import User from '../models/User.js';
import VideoCache from '../models/VideoCache.js';
import ytSearch from 'yt-search';
import UserProgress from '../models/UserProgress.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateCoursePrompt = (topic) => `
You are an expert AI educator. Your task is to generate a comprehensive, highly-structured micro-course about the topic: "${topic}".
Output ONLY a strictly valid JSON array containing 3 to 5 modules. Do NOT wrap the JSON in markdown formatting blocks like \`\`\`json. Output just the raw JSON array.
Each module must have this exact structure:
{
  "title": "Module Title",
  "order": 0,
  "content": [
     // Array of content blocks.
     // Types allowed: heading, paragraph, code, mcq, videoSearch
  ]
}

Content block examples:
1. {"type": "heading", "level": 1, "text": "Main Heading"}
2. {"type": "paragraph", "text": "Detailed explanation..."}
3. {"type": "code", "language": "javascript", "code": "console.log('hi');"}
4. {"type": "mcq", "question": "What is X?", "options": ["A", "B", "C", "D"], "answer": "B"}
5. {"type": "videoSearch", "searchQuery": "Best short tutorial video for exactly this specific topic", "description": "Quick context explaining what this video covers..."}

Rules:
- Give at least 3 content blocks per module. Include at least 1 "videoSearch" block per module!
- Keep paragraphs concise but educational.
- For every videoSearch block, provide a brief 'description' explaining what the video is about.
- Ensure the JSON is 100% valid and parseable.
- Modules must follow a clear logical progression from beginner to advanced topics.
- ONLY output the JSON array, no conversational text.
`;

const fetchYoutubeVideoUrl = async (query) => {
    try {
        const normalizedQuery = query.toLowerCase().trim();

        // 1. Check local DB cache first
        const cached = await VideoCache.findOne({ searchQuery: normalizedQuery });
        if (cached) {
            console.log(`[Cache Hit] Video for: ${normalizedQuery}`);
            return cached.videoUrl;
        }

        console.log(`[Cache Miss] Searching YT for: ${normalizedQuery}`);
        const result = await ytSearch(normalizedQuery);
        const firstVideo = result?.videos?.[0];

        let videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // default fallback

        if (firstVideo && firstVideo.videoId) {
            videoUrl = `https://www.youtube.com/embed/${firstVideo.videoId}`;

            // 2. Save result to cache for future users
            try {
                await VideoCache.create({
                    searchQuery: normalizedQuery,
                    videoUrl
                });
            } catch (cacheErr) {
                console.error('Cache save error:', cacheErr.message);
            }
        }

        return videoUrl;

    } catch (err) {
        console.error('yt-search Error:', err.message);
        return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    }
};

export const generateCourse = async (req, res, next) => {
    try {
        const auth0Id = req.auth?.payload?.sub;
        const { topic } = req.body;

        if (!topic) return res.status(400).json({ error: "Topic is required" });

        const user = await User.findOne({ auth0Id });
        if (!user) return res.status(404).json({ error: "User not found. Please sync." });

        // Enforce per-user course/project cap (server-side, authoritative)
        const existingCount = await Course.countDocuments({ creator: user._id, isDeleted: false });
        if (existingCount >= 5) {
            return res.status(403).json({ error: "Course limit reached (max 5). Delete an existing course to create a new one." });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is undefined in process.env");
            return res.status(500).json({ error: "GEMINI_API_KEY is missing. Did you restart the server?" });
        }

        // Masked log for debugging


        // 1. Call Gemini - Reverting to 2.5-flash which worked in earlier runs
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let textResponse;
        try {
            const result = await model.generateContent(generateCoursePrompt(topic));
            textResponse = result.response.text();
            console.log("[AI] Response received successfully");
        } catch (aiErr) {
            console.error("Gemini API Error:", aiErr);
            return res.status(500).json({
                error: `Gemini API Error: ${aiErr.message}. If you just added the key, restart your server.`,
                details: aiErr.message
            });
        }

        // 2. Parse AI response safely
        let modulesData;
        try {
            // Remove markdown code blocks if the AI accidentally added them
            const cleanedText = textResponse.replace(/```json/gi, '').replace(/```/gi, '').trim();
            modulesData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("AI Output parsing failed:", textResponse);
            return res.status(500).json({ error: "Failed to parse AI response into valid JSON." });
        }

        if (!Array.isArray(modulesData)) {
            return res.status(500).json({ error: "AI response was not an array." });
        }

        // 3. Create Course
        const course = new Course({
            title: `Crash Course: ${topic}`,
            topic,
            creator: user._id,
        });
        await course.save();

        // 4. Process Modules (Fetch YT videos)
        const moduleDocs = [];
        for (let i = 0; i < modulesData.length; i++) {
            const mod = modulesData[i];

            // Replace 'videoSearch' with 'video' containing actual YouTube embed URLs
            for (let j = 0; j < mod.content.length; j++) {
                const block = mod.content[j];
                if (block.type === 'videoSearch') {
                    const videoUrl = await fetchYoutubeVideoUrl(block.searchQuery);
                    mod.content[j] = {
                        type: 'video',
                        url: videoUrl,
                        description: block.description || ''
                    };
                }
            }

            const moduleDoc = new Module({
                course: course._id,
                title: mod.title, // User AI Title
                order: i, // Force sequential order to avoid AI confusion
                content: mod.content,
            });
            await moduleDoc.save();
            moduleDocs.push(moduleDoc);
        }

        // 5. Update Course with Modules
        course.modules = moduleDocs.map(m => m._id);
        await course.save();

        // Let's populate the modules so the frontend gets the full tree immediately
        await course.populate('modules');

        return res.status(201).json(course);
    } catch (err) {
        next(err);
    }
};

export const getMyCourses = async (req, res, next) => {
    try {
        const auth0Id = req.auth?.payload?.sub;
        const user = await User.findOne({ auth0Id });
        if (!user) return res.status(404).json({ error: "User not found" });

        const courses = await Course.find({ creator: user._id, isDeleted: { $ne: true } })
            .sort({ createdAt: -1 })
            .populate('modules');

        res.json(courses);
    } catch (err) {
        next(err);
    }
};

export const getCourseById = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const auth0Id = req.auth?.payload?.sub;
        const user = await User.findOne({ auth0Id });

        if (!user) return res.status(404).json({ error: "User not found" });

        const course = await Course.findOne({ _id: courseId, creator: user._id, isDeleted: { $ne: true } })
            .populate('modules');

        if (!course) return res.status(404).json({ error: "Course not found" });

        // Fetch progress to see which modules are completed
        const progress = await UserProgress.findOne({ user: user._id, course: courseId });

        res.json({
            ...course.toObject(),
            completedModules: progress ? progress.completedModules : [],
            quizChoices: progress ? progress.quizChoices : []
        });
    } catch (err) {
        next(err);
    }
};

export const getUserStats = async (req, res, next) => {
    try {
        const auth0Id = req.auth?.payload?.sub;
        const user = await User.findOne({ auth0Id });
        if (!user) return res.status(404).json({ error: "User not found" });

        const coursesCount = await Course.countDocuments({ creator: user._id, isDeleted: { $ne: true } });

        const progressDocs = await UserProgress.find({ user: user._id });
        let totalCompletedLessons = 0;
        progressDocs.forEach(p => {
            totalCompletedLessons += p.completedModules.length;
        });

        res.json({
            coursesCreated: coursesCount,
            lessonsCompleted: totalCompletedLessons
        });
    } catch (err) {
        next(err);
    }
};

export const completeModule = async (req, res, next) => {
    try {
        const { courseId, moduleId } = req.params;
        const auth0Id = req.auth?.payload?.sub;
        const user = await User.findOne({ auth0Id });
        if (!user) return res.status(404).json({ error: "User not found" });

        let progress = await UserProgress.findOne({ user: user._id, course: courseId });
        if (!progress) {
            progress = new UserProgress({ user: user._id, course: courseId, completedModules: [], quizChoices: [] });
        }

        if (!progress.completedModules.includes(moduleId)) {
            progress.completedModules.push(moduleId);
            await progress.save();
        }

        res.json(progress);
    } catch (err) {
        next(err);
    }
};

export const saveQuizChoice = async (req, res, next) => {
    try {
        const { courseId, moduleId } = req.params;
        const { questionIndex, selectedOption } = req.body;
        const auth0Id = req.auth?.payload?.sub;
        const user = await User.findOne({ auth0Id });
        if (!user) return res.status(404).json({ error: "User not found" });

        let progress = await UserProgress.findOne({ user: user._id, course: courseId });
        if (!progress) {
            progress = new UserProgress({ user: user._id, course: courseId, completedModules: [], quizChoices: [] });
        }

        // Find if this question was already answered
        const choiceIdx = progress.quizChoices.findIndex(
            c => c.moduleId.toString() === moduleId && c.questionIndex === questionIndex
        );

        if (choiceIdx > -1) {
            progress.quizChoices[choiceIdx].selectedOption = selectedOption;
        } else {
            progress.quizChoices.push({ moduleId, questionIndex, selectedOption });
        }

        await progress.save();
        res.json(progress);
    } catch (err) {
        next(err);
    }
};

export const resetQuizChoice = async (req, res, next) => {
    try {
        const { courseId, moduleId } = req.params;
        const { questionIndex } = req.body; // Index of the quiz block in the module
        const auth0Id = req.auth?.payload?.sub;
        const user = await User.findOne({ auth0Id });
        if (!user) return res.status(404).json({ error: "User not found" });

        let progress = await UserProgress.findOne({ user: user._id, course: courseId });
        if (progress) {
            progress.quizChoices = progress.quizChoices.filter(
                c => !(c.moduleId.toString() === moduleId && c.questionIndex === questionIndex)
            );
            await progress.save();
        }

        res.json(progress || { quizChoices: [] });
    } catch (err) {
        next(err);
    }
};
