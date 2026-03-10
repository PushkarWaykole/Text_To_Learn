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

const FUN_MESSAGES = [
    "Cooking the modules... 👨‍🍳",
    "Seasoning the curriculum... 🧂",
    "Sprinkling some AI magic... ✨",
    "Consulting the digital oracles... 🔮",
    "Baking the perfect lesson plan... 🥧",
    "Aligning the pedagogical stars... 🌌",
    "Teaching the AI some new tricks... 🤖",
    "Brewing a fresh pot of wisdom... ☕",
    "Hyper-threading the knowledge... 🧵",
    "Almost there! Knowledge is power... ⚡"
];

export default function HomePage() {
    const { user } = useAuth0();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [popup, setPopup] = useState(null);
    const [coursesCount, setCoursesCount] = useState(0);
    const [lessonsCompleted, setLessonsCompleted] = useState(0);
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        let interval;
        if (isGenerating) {
            interval = setInterval(() => {
                setMsgIndex((prev) => (prev + 1) % FUN_MESSAGES.length);
            }, 2800);
        } else {
            setMsgIndex(0);
        }
        return () => clearInterval(interval);
    }, [isGenerating]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get('/api/courses/stats');
                setCoursesCount(res.data.coursesCreated);
                setLessonsCompleted(res.data.lessonsCompleted);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
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
            const status = error?.response?.status;
            const serverMsg = error?.response?.data?.error;

            if (status === 403 && typeof serverMsg === 'string' && serverMsg.toLowerCase().includes('course limit')) {
                setPopup({
                    title: "Course limit reached",
                    message:
                        "This is a small hobby project (built with love, not a big budget). To keep the servers happy and the AI bill from sprinting away, each account can create up to 5 courses.",
                    primaryLabel: "Go to My Courses",
                    primaryAction: () => navigate('/courses'),
                    secondaryLabel: "Got it",
                    secondaryAction: () => setPopup(null),
                });
            } else {
                setPopup({
                    title: "Couldn’t generate the course",
                    message: serverMsg || error.message || "Something went wrong. Please try again.",
                    primaryLabel: "Close",
                    primaryAction: () => setPopup(null),
                });
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const firstName = user?.name?.split(' ')[0] || 'there';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="app-shell">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main content */}
            <main className="app-main home-main">
                {popup && (
                    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setPopup(null)}>
                        <div className="modal-card glass" onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em' }}>
                                        {popup.title}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-ghost"
                                    style={{ padding: '8px 10px', borderRadius: 10 }}
                                    onClick={() => setPopup(null)}
                                    aria-label="Close dialog"
                                >
                                    ✕
                                </button>
                            </div>

                            <div style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-line', marginTop: 12 }}>
                                {popup.message}
                            </div>

                            <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                {popup.secondaryLabel && (
                                    <button type="button" className="btn-ghost" onClick={popup.secondaryAction}>
                                        {popup.secondaryLabel}
                                    </button>
                                )}
                                {popup.primaryLabel && (
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        style={{ padding: '12px 18px', borderRadius: 12, fontSize: 14 }}
                                        onClick={popup.primaryAction}
                                    >
                                        {popup.primaryLabel}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mobile-topbar home-topbar" style={{
                    padding: "14px 20px",
                    backdropFilter: "blur(20px)",
                    background: "rgba(10,10,20,0.6)",
                    borderBottom: "1px solid var(--sidebar-border)",
                }}>
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-label="Toggle menu"
                        type="button"
                    >
                        {isSidebarOpen ? "✕" : "☰"}
                    </button>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Text<span className="gradient-text">-to-Learn</span>
                    </div>
                    <div style={{ width: 44 }} />
                </div>

                {/* Background orbs (subtle) */}
                <div style={{
                    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent)',
                    top: -100, right: -100, pointerEvents: 'none',
                }} />

                {/* Header greeting */}
                <div className="fade-up" style={{ marginBottom: 40 }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 4 }}>{greeting},</p>
                    <h1 style={{
                        fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--text-color)',
                        letterSpacing: '-0.03em', lineHeight: 1.1,
                    }}>
                        {firstName} 👋
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 15 }}>
                        What do you want to learn today?
                    </p>
                </div>

                {/* Generate Course Card */}
                <div className="fade-up fade-up-1 glass generate-card" style={{
                    padding: '36px 40px', marginBottom: 40,
                    borderColor: 'var(--glass-border)',
                    boxShadow: '0 0 60px rgba(99,102,241,0.08)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 22 }}>✨</span>
                        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-color)' }}>
                            Generate a New Course
                        </h2>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                        Type any topic below and AI will build a full structured course for you.
                    </p>

                    <form
                        onSubmit={handleGenerate}
                        className="flex flex-col md:flex-row gap-3 w-full"
                    >
                        <input
                            className="input-dark w-full md:w-[80%]"
                            type="text"
                            placeholder='e.g. "Introduction to Quantum Computing"'
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="btn-primary w-full md:w-[20%]"
                            disabled={isGenerating || !prompt.trim()}
                        >
                            🚀 Generate
                        </button>
                    </form>

                    {/* Quick topic suggestions */}
                    <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', alignSelf: 'center' }}>Try:</span>
                        {SAMPLE_TOPICS.map((topic) => (
                            <button
                                key={topic}
                                onClick={() => setPrompt(topic)}
                                style={{
                                    background: 'var(--input-bg)', border: '1px solid var(--input-border)',
                                    borderRadius: 999, padding: '4px 12px', fontSize: 12, color: 'var(--text-secondary)',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                                onMouseEnter={e => { e.target.style.borderColor = 'rgba(99,102,241,0.4)'; e.target.style.color = 'var(--text-color)'; }}
                                onMouseLeave={e => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.color = 'var(--text-secondary)'; }}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats row */}
                <div
                    className="fade-up fade-up-2"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: 16,
                        marginBottom: 40,
                        maxWidth: 800,
                        width: '100%',
                    }}
                >
                    {[
                        { label: 'Courses Created', value: coursesCount.toString(), icon: '📚', color: '#6366f1' },
                        { label: 'Lessons Completed', value: lessonsCompleted.toString(), icon: '✅', color: '#10b981' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass glass-hover" style={{ padding: '20px 18px' }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                            <div style={{
                                fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800,
                                color: stat.color, lineHeight: 1,
                            }}>{stat.value}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* New Content: Daily Insight & Exploration */}
                <div className="fade-up fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>

                    {/* Daily Insight */}
                    <div className="glass" style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.05, transform: 'rotate(15deg)' }}>💡</div>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text-color)', marginBottom: 16 }}>
                            Daily Learning Insight
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, fontStyle: 'italic' }}>
                            "The beautiful thing about learning is that no one can take it away from you."
                        </p>
                        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: 14 }}>🎯</div>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Tip: Try generating courses on interdisciplinary topics for unique AI insights.</span>
                        </div>
                    </div>

                    {/* Explore Categories (Full Width Grid) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
                        {[
                            { label: 'Web Dev', icon: '💻', topic: 'Next.js and Tailwind CSS' },
                            { label: 'Space', icon: '🚀', topic: 'The James Webb Telescope' },
                            { label: 'Biology', icon: '🧬', topic: 'CRISPR Gene Editing' },
                            { label: 'Art', icon: '🎨', topic: 'Impressionist Movement' },
                        ].map(cat => (
                            <button
                                key={cat.label}
                                onClick={() => setPrompt(cat.topic)}
                                className="glass-hover"
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: 24,
                                    padding: '32px 24px',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ fontSize: 32, marginBottom: 12 }}>{cat.icon}</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-color)' }}>{cat.label}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>Explore Courses</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="fade-up fade-up-4" style={{ marginTop: 60, padding: '40px', borderTop: '1px solid var(--sidebar-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ color: 'var(--text-color)', fontWeight: 700, marginBottom: 4 }}>Ready for a challenge?</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Select a trending <br />topic and push your boundaries.</p>
                    </div>
                    <button className="btn-ghost" onClick={() => setPrompt('Quantum Cryptography Basics')}>
                        Surprise Me 🎲
                    </button>
                </div>

                {/* Loading Overlay */}
                {/* Loading Overlay */}
                {isGenerating && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'var(--bg-color)', opacity: 0.95,
                        backdropFilter: 'blur(12px)', zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <div className="glass" style={{
                            width: 'min(450px, calc(100vw - 32px))',
                            padding: 'clamp(24px, 6vw, 48px) clamp(18px, 6vw, 64px)',
                            textAlign: 'center',
                            borderColor: 'var(--glass-border)',
                            boxShadow: '0 0 100px rgba(99,102,241,0.2)'
                        }}>
                            <div style={{ marginBottom: 32, position: 'relative' }}>
                                <div className="animate-spin" style={{
                                    width: 80, height: 80, borderRadius: '50%',
                                    border: '4px solid var(--glass-border)',
                                    borderTopColor: 'var(--color-primary-500)', margin: '0 auto'
                                }}></div>
                                <span style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)', fontSize: 32
                                }}>🎓</span>
                            </div>

                            <h2 style={{
                                fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800,
                                color: 'var(--text-color)', marginBottom: 12, letterSpacing: '-0.02em'
                            }}>
                                Building your course...
                            </h2>

                            <p style={{
                                color: 'var(--text-secondary)', fontSize: 18, fontWeight: 500,
                                minHeight: '1.5em', transition: 'all 0.5s ease-in-out'
                            }}>
                                {FUN_MESSAGES[msgIndex]}
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}


