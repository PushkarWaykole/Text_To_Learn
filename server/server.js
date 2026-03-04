import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Test Route
app.get('/', (req, res) => {
    res.send('Text-to-Learn API is running... test');
});

app.get('/info', (req, res) => {
    res.send('This is a text to learn backend test3');
});

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/text-to-learn')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
