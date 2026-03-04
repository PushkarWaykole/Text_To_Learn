import googleTTS from 'google-tts-api';

export const generateAudio = async (req, res, next) => {
    try {
        const { text, lang } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required to generate audio." });
        }

        // google-tts-api has a hard limit of roughly 200 characters per request
        // To handle paragraphs, we must safely split the text into manageable chunks
        const chunks = text.match(/[^.!?]+[.!?]+|\s*.*$/g) || [];

        let audioUrls = [];

        // Determine language code (Milestone 10: Multilingual Hinglish support)
        // If lang is 'hi' we use Hindi. Default to standard 'en'.
        const targetLang = lang === 'hi' ? 'hi' : 'en';

        // We fetch the base64 or direct URL for the chunks
        for (const chunk of chunks) {
            const trimmed = chunk.trim();
            if (trimmed.length > 0) {
                const url = googleTTS.getAudioUrl(trimmed, {
                    lang: targetLang,
                    slow: false,
                    host: 'https://translate.google.com',
                });
                audioUrls.push(url);
            }
        }

        // Return the array of audio playback URLs to the frontend
        res.status(200).json({ audioUrls });

    } catch (err) {
        console.error("Audio TTS gen error:", err);
        next(err);
    }
};
