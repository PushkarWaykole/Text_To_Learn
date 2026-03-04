import { Router } from 'express';
import { checkJwt } from '../middlewares/authMiddleware.js';

const router = Router();

// GET /api/protected — requires a valid Auth0 Bearer token
router.get('/protected', checkJwt, (req, res) => {
    res.json({
        message: 'Success! You are authenticated.',
        user: req.auth,
    });
});

export default router;
