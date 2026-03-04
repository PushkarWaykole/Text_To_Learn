import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Sidebar from '../components/Sidebar';

const SAMPLE_TOPICS = [
    'Introduction to Machine Learning',
    'React Hooks Deep Dive',
    'History of the Roman Empire',
    'Blockchain & Web3 Basics',
    'Data Structures & Algorithms',
];

export default function HomePage() {
    const { user } = useAuth0();
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [coursesCount, setCoursesCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get('/api/courses');
                setCoursesCount(res.data.length);
            } catch (error) {
                console.error("Failed to fetch courses count:", error);
            }
        };
        fetchStats();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setIsGenerating(true);
        try {
            const res = await axiosInstance.post('/api/courses/generate', { topic: prompt });
            if (res.data._id) {
                navigate(`/course/${res.data._id}`);
            }
        } catch (error) {
            console.error("Generation failed:", error);
            alert(`Error generating course: ${error.response?.data?.error || error.message}. \nIf you just added your GEMINI_API_KEY to server/.env, you MUST manually restart the backend server (nodemon) so the .env file gets reloaded!`);
        } finally {
            setIsGenerating(false);
        }
    };

    const firstName = user?.name?.split(' ')[0] || 'there';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
            <Sidebar />

            {/* Main content */}
            <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px', position: 'relative', overflow: 'hidden' }}>

                {/* Background orbs (subtle) */}
                <div style={{
                    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent)',
                    top: -100, right: -100, pointerEvents: 'none',
                }} />

                {/* Header greeting */}
                <div className="fade-up" style={{ marginBottom: 40 }}>
                    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 4 }}>{greeting},</p>
                    <h1 style={{
                        fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#f1f5f9',
                        letterSpacing: '-0.03em', lineHeight: 1.1,
                    }}>
                        {firstName} 👋
                    </h1>
                    <p style={{ color: '#475569', marginTop: 6, fontSize: 15 }}>
                        What do you want to learn today?
                    </p>
                </div>

                {/* Generate Course Card */}
                <div className="fade-up fade-up-1 glass" style={{
                    padding: '36px 40px', marginBottom: 40,
                    borderColor: 'rgba(99,102,241,0.2)',
                    boxShadow: '0 0 60px rgba(99,102,241,0.08)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 22 }}>✨</span>
                        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 20, color: '#f1f5f9' }}>
                            Generate a New Course
                        </h2>
                    </div>
                    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                        Type any topic below and AI will build a full structured course for you.
                    </p>

                    <form onSubmit={handleGenerate} style={{ display: 'flex', gap: 12 }}>
                        <input
                            className="input-dark"
                            type="text"
                            placeholder='e.g. "Introduction to Quantum Computing"'
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ whiteSpace: 'nowrap', minWidth: 140 }}
                            disabled={isGenerating || !prompt.trim()}
                        >
                            {isGenerating ? (
                                <span style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-white animate-spin"></div>
                                    Generating…
                                </span>
                            ) : '🚀 Generate'}
                        </button>
                    </form>

                    {/* Quick topic suggestions */}
                    <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        <span style={{ fontSize: 12, color: '#475569', alignSelf: 'center' }}>Try:</span>
                        {SAMPLE_TOPICS.map((topic) => (
                            <button
                                key={topic}
                                onClick={() => setPrompt(topic)}
                                style={{
                                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 999, padding: '4px 12px', fontSize: 12, color: '#94a3b8',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                                onMouseEnter={e => { e.target.style.borderColor = 'rgba(99,102,241,0.4)'; e.target.style.color = '#a5b4fc'; }}
                                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.color = '#94a3b8'; }}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats row */}
                <div className="fade-up fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
                    {[
                        { label: 'Courses Created', value: coursesCount.toString(), icon: '📚', color: '#6366f1' },
                        { label: 'Lessons Completed', value: '0', icon: '✅', color: '#10b981' },
                        { label: 'PDFs Exported', value: '0', icon: '📄', color: '#f59e0b' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass glass-hover" style={{ padding: '24px 28px' }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                            <div style={{
                                fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800,
                                color: stat.color, lineHeight: 1,
                            }}>{stat.value}</div>
                            <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
