import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const NAV_ITEMS = [
    { icon: '🏠', label: 'Dashboard', id: 'dashboard' },
    { icon: '📚', label: 'My Courses', id: 'courses' },
    { icon: '✨', label: 'Generate', id: 'generate' },
    { icon: '📥', label: 'Downloads', id: 'downloads' },
];

const SAMPLE_TOPICS = [
    'Introduction to Machine Learning',
    'React Hooks Deep Dive',
    'History of the Roman Empire',
    'Blockchain & Web3 Basics',
    'Data Structures & Algorithms',
];

export default function HomePage() {
    const { user, logout } = useAuth0();
    const [prompt, setPrompt] = useState('');
    const [activeNav, setActiveNav] = useState('dashboard');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setIsGenerating(true);
        // Milestone 8 will wire up the real API call
        setTimeout(() => setIsGenerating(false), 2000);
    };

    const firstName = user?.name?.split(' ')[0] || 'there';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>

            {/* Sidebar */}
            <aside className="sidebar">
                {/* Logo */}
                <div style={{ padding: '0 8px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 22 }}>🧠</span>
                        <span style={{
                            fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17,
                            color: '#f1f5f9', letterSpacing: '-0.02em',
                        }}>
                            Text<span className="gradient-text">-to-Learn</span>
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1 }}>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            className={`sidebar-link ${activeNav === item.id ? 'active' : ''}`}
                            onClick={() => setActiveNav(item.id)}
                        >
                            <span style={{ fontSize: 16 }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* User profile at bottom */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: 16, marginTop: 16,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10 }}>
                        <img
                            src={user?.picture}
                            alt={user?.name}
                            style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.5)' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.name}
                            </div>
                            <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.email}
                            </div>
                        </div>
                    </div>
                    <button
                        className="sidebar-link"
                        style={{ marginTop: 4, color: '#ef4444' }}
                        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    >
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>

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
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{
                                        width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                                        borderTop: '2px solid white', borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite', display: 'inline-block',
                                    }} />
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
                        { label: 'Courses Created', value: '0', icon: '📚', color: '#6366f1' },
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

                {/* My Courses — Empty State */}
                <div className="fade-up fade-up-3">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, color: '#f1f5f9' }}>
                            My Courses
                        </h2>
                        <span className="badge badge-indigo">0 courses</span>
                    </div>

                    {/* Empty state */}
                    <div className="glass" style={{
                        padding: '60px 40px', textAlign: 'center',
                        borderStyle: 'dashed', borderColor: 'rgba(99,102,241,0.2)',
                    }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>🎓</div>
                        <h3 style={{ fontWeight: 700, fontSize: 18, color: '#f1f5f9', marginBottom: 8 }}>
                            No courses yet
                        </h3>
                        <p style={{ color: '#64748b', fontSize: 14, maxWidth: 340, margin: '0 auto 24px' }}>
                            Generate your first AI-powered course above. It takes less than 30 seconds!
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                setActiveNav('generate');
                                document.querySelector('.input-dark')?.focus();
                            }}
                        >
                            ✨ Create First Course
                        </button>
                    </div>
                </div>

            </main>

            {/* Spin keyframe inline */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
