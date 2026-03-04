import { Router } from 'express';
import { checkJwt } from '../middlewares/authMiddleware.js';
import { syncUser } from '../controllers/authController.js';

const router = Router();

/**
 * POST /api/auth/sync
 * Requires a valid Auth0 Bearer token.
 * Upserts the authenticated user into MongoDB.
 */
router.post('/sync', checkJwt, syncUser);

export default router;
