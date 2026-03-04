import { Router } from 'express';
import { checkJwt } from '../middlewares/authMiddleware.js';
import { generateCourse, getMyCourses, getCourseById, getUserStats, completeModule, saveQuizChoice, resetQuizChoice } from '../controllers/courseController.js';
import { exportModuleToPDF } from '../controllers/pdfController.js';

const router = Router();

// POST /api/courses/generate — Uses Gemini API to build a course JSON and saves to DB
router.post('/generate', checkJwt, generateCourse);

// GET /api/courses/stats — Get user stats (courses created, lessons completed)
router.get('/stats', checkJwt, getUserStats);

// GET /api/courses — Get all non-deleted courses created by the user
router.get('/', checkJwt, getMyCourses);

// GET /api/courses/:courseId — Get a single course & its modules by ID
router.get('/:courseId', checkJwt, getCourseById);

// POST /api/courses/:courseId/complete/:moduleId — Mark a module as completed
router.post('/:courseId/complete/:moduleId', checkJwt, completeModule);

// POST /api/courses/:courseId/module/:moduleId/quiz-choice — Save a quiz choice
router.post('/:courseId/module/:moduleId/quiz-choice', checkJwt, saveQuizChoice);

// POST /api/courses/:courseId/module/:moduleId/quiz-choice/reset — Reset a quiz choice
router.post('/:courseId/module/:moduleId/quiz-choice/reset', checkJwt, resetQuizChoice);

// GET /api/courses/module/:moduleId/pdf — Export module to PDF (Pure data, no UI artifacts)
router.get('/module/:moduleId/pdf', checkJwt, exportModuleToPDF);

export default router;
