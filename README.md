# Text-to-Learn: AI-Powered Course Generator

Text-to-Learn is a production-grade AI platform that transforms any topic into a structured, multi-module learning experience. It leverages Large Language Models, YouTube integration, and Text-to-Speech to provide a rich, interactive educational environment.

---

## ✨ Showcase & Core Features

- **AI Course Synthesis**: Generate 3-5 module courses on any topic in seconds using Gemini 2.5 Flash.
- **Context-Aware Video Search**: Automatically pairs each lesson with the most relevant YouTube tutorials.
- **Interactive Quizzes**: Test knowledge with AI-generated MCQs; progress is tracked per user.
- **Audio Lessons**: High-quality TTS allows users to listen to lesson content (supports Hinglish).
- **Professional PDF Export**: Export any module as a cleanly formatted PDF for offline learning.
- **Premium Glassmorphic UI**: High-contrast Dark and Light modes for a superior learning experience.

---

## 🛠️ Implementation & Local Setup Guide

Follow these steps to get the project running locally.

### 1. Prerequisites
- **Node.js**: v18+ installed.
- **MongoDB**: Local instance running or a MongoDB Atlas URI.
- **Auth0**: An account for authentication setup.
- **Google Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/).

### 2. Backend Configuration (`/server`)
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file based on [.env.example](./server/.env.example):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/text-to-learn
   AUTH0_ISSUER_BASE_URL=https://your-auth0-domain.auth0.com/
   AUTH0_AUDIENCE=your_auth0_audience
   CLIENT_URL=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the server: `npm run dev`

### 3. Frontend Configuration (`/client`)
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file based on [.env.example](./client/.env.example):
   ```env
   VITE_AUTH0_DOMAIN=your_auth0_domain
   VITE_AUTH0_CLIENT_ID=your_auth0_client_id
   VITE_AUTH0_AUDIENCE=your_auth0_audience
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend: `npm run dev`

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Tailwind CSS, Zustand, React Router v7 |
| **Backend** | Node.js, Express, Mongoose, PDFKit |
| **AI/External** | Google Gemini (Course & Prompt Gen), Google TTS, YouTube API |
| **Security** | Auth0 (OAuth2 / JWT), Helmet, Express Rate Limit |

---

