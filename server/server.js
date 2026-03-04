import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import protectedRoutes from './routes/protectedRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & Logging Middlewares ─────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ── Global Rate Limiter ────────────────────────────────────────────────────
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                  // max 100 requests per windowMs per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Public Info Route ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send('Text-to-Learn API is running.');
});

// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/api', protectedRoutes);

// ── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`[Error] ${status} — ${message}`);
    res.status(status).json({ error: message });
});

// ── Database Connection ────────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/text-to-learn')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// ── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
