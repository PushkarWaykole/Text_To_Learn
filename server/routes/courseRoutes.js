import { Router } from 'express';
import { checkJwt } from '../middlewares/authMiddleware.js';
import { generateCourse, getMyCourses, getCourseById } from '../controllers/courseController.js';

const router = Router();

// POST /api/courses/generate — Uses Gemini API to build a course JSON and saves to DB
router.post('/generate', checkJwt, generateCourse);

// GET /api/courses — Get all non-deleted courses created by the user
router.get('/', checkJwt, getMyCourses);

// GET /api/courses/:courseId — Get a single course & its modules by ID
router.get('/:courseId', checkJwt, getCourseById);

export default router;
