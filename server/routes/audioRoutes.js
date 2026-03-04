import { Router } from 'express';
import { checkJwt } from '../middlewares/authMiddleware.js';
import { generateAudio } from '../controllers/audioController.js';

const router = Router();

// POST /api/audio/tts — Generates Text-to-Speech audio slices
router.post('/tts', checkJwt, generateAudio);

export default router;
