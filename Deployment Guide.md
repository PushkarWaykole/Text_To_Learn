# Text-to-Learn: Project Showcase & Documentation

Text-to-Learn is a production-grade AI-powered course generator that transforms any topic into a structured, multi-module learning experience. It leverages Large Language Models, YouTube search integration, and Text-to-Speech (TTS) to provide a rich, interactive educational platform.

## 🚀 implementation Status: 100% Core Features Completed
All milestones from the [Implementation Plan](./implementation_plan.md) (excluding production deployment) have been successfully implemented.

| Milestone | Feature | Status | Implementation Detail |
| :--- | :--- | :--- | :--- |
| 1-3 | **Foundation** | ✅ Done | Modular Node/Express & React (Vite) structure. |
| 4 | **Authentication** | ✅ Done | Secure Auth0 integration with silent token refreshing. |
| 5 | **Database** | ✅ Done | MongoDB (Mongoose) with Course, Module, User, and Video Models. |
| 6-7 | **UI/UX** | ✅ Done | Glassmorphic design, Sidebar navigation, & Dynamic Lesson Rendering. |
| 8-9 | **AI Engine** | ✅ Done | Structured Gemini Pro prompts & Automated YouTube video pairing. |
| 10 | **Accessibility** | ✅ Done | Multilingual TTS (Hinglish support) via Google TTS API. |
| 11 | **Export** | ✅ Done | Professional PDF generation for offline learning. |

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework**: `React 18` (Vite)
- **Styling**: `Tailwind CSS` + Custom CSS Variables (Glassmorphism)
- **Routing**: `React Router v7`
- **State Management**: `Zustand`
- **Authentication**: `@auth0/auth0-react`
- **Exporting**: `jsPDF`, `html2canvas` (Available for client-side snapshots)

### Backend (Server)
- **Runtime**: `Node.js` (Express.js)
- **Database**: `MongoDB` (Mongoose ODM)
- **AI Integration**: `@google/generative-ai` (Gemini 2.5 Flash/Pro)
- **Video API**: `yt-search`
- **Audio API**: `google-tts-api`
- **PDF Gen**: `pdfkit`
- **Security**: `helmet`, `cors`, `express-oauth2-jwt-bearer`

---

## ✨ Features Spotlight

1.  **AI Course Synthesis**: Generate a 3-5 module course on any topic in seconds.
2.  **Context-Aware Video Search**: Automatically finds the most relevant YouTube tutorials for each sub-topic.
3.  **Interactive Quizzes**: Test your knowledge with AI-generated MCQs; progress is tracked per user.
4.  **Audio Lessons**: Integrated TTS allows users to listen to lesson content (supports Hinglish).
5.  **Professional PDF Export**: Export any module as a cleanly formatted PDF for offline reference.
6.  **Progress Tracking**: Visualize your learning journey with auto-saving module completion states.
7.  **Adaptive Theme**: High-contrast Dark and Light modes for comfortable long-term reading.

---

## 🌐 Detailed Free Hosting & Deployment Guide

Follow this step-by-step guide to take your application live using free-tier services.

### Phase 1: Database Setup (MongoDB Atlas)
1.  **Register**: Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/).
2.  **Create Cluster**: Deploy a "Shared" cluster (FREE).
3.  **Network Access**: Allow access from `0.0.0.0/0` (required for Render's dynamic IPs).
4.  **Database User**: Create a user with read/write permissions.
5.  **Connection String**: Copy the `mongodb+srv://...` URI.

### Phase 2: Backend Deployment (Render)
1.  **Create Service**: On [Render](https://render.com/), create a new **Web Service** and connect your GitHub repo.
2.  **Configure**:
    - **Root Directory**: `server`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
3.  **Environment Variables**:
    - `MONGO_URI`: Your MongoDB Atlas connection string.
    - `GEMINI_API_KEY`: Your key from Google AI Studio.
    - `AUTH0_ISSUER_BASE_URL`: `https://YOUR_DOMAIN.auth0.com/`
    - `AUTH0_AUDIENCE`: Your Auth0 API Identifier.
    - `CLIENT_URL`: The URL of your Vercel deployment (update this after Phase 3).
    - `PORT`: `5000` (Render will override this, but good to have).

### Phase 3: Frontend Deployment (Vercel)
1.  **Import Project**: In [Vercel](https://vercel.com/), import your repo.
2.  **Configure**:
    - **Root Directory**: `client`
    - **Framework Preset**: `Vite`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
3.  **Environment Variables**:
    - `VITE_API_URL`: Your Render Web Service URL (e.g., `https://text-to-learn-api.onrender.com`).
    - `VITE_AUTH0_DOMAIN`: `YOUR_DOMAIN.auth0.com`
    - `VITE_AUTH0_CLIENT_ID`: Your Auth0 Application Client ID.
    - `VITE_AUTH0_AUDIENCE`: Your Auth0 API Identifier (same as `AUTH0_AUDIENCE` on backend).

### Phase 4: Auth0 Integration Security
1.  Go to your **Auth0 Dashboard** > **Applications** > **[Your App]** > **Settings**.
2.  **Allowed Callback URLs**: `https://your-app-name.vercel.app`
3.  **Allowed Logout URLs**: `https://your-app-name.vercel.app`
4.  **Allowed Web Origins**: `https://your-app-name.vercel.app`
5.  Save Changes.

---

## 🔧 Local Development Setup
1.  **Clone**: `git clone <repo-url>`
2.  **Server**: `cd server && npm install && npm run dev` (Ensure `.env` exists).
3.  **Client**: `cd client && npm install && npm run dev` (Ensure `.env` exists).

