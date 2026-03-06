import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const features = [
    {
        icon: '🤖',
        title: 'AI-Powered Generation',
        desc: 'Paste any topic and Gemini AI instantly structures it into a full multi-module course with rich lesson content.',
        color: 'from-indigo-500 to-violet-500',
    },
    {
        icon: '🎬',
        title: 'YouTube Integration',
        desc: 'Relevant video lectures are automatically fetched and embedded into each lesson — zero manual searching.',
        color: 'from-rose-500 to-pink-500',
    },
    {
        icon: '🌐',
        title: 'Multilingual (Hinglish)',
        desc: 'Get AI-narrated audio explanations in Hinglish using Google Gemini TTS for inclusive, accessible learning.',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        icon: '📄',
        title: 'PDF Export',
        desc: 'Download any lesson as a beautifully formatted PDF — study offline, share with peers, or print it.',
        color: 'from-amber-500 to-orange-500',
    },
];

const steps = [
    { num: '01', title: 'Sign In', desc: 'Log in securely with your Google account.' },
    { num: '02', title: 'Enter a Topic', desc: 'Type anything — "Quantum Computing", "React Hooks", "WW2 History".' },
    { num: '03', title: 'AI Builds Your Course', desc: 'Gemini generates structured modules with lessons, videos & audio.' },
    { num: '04', title: 'Learn & Download', desc: 'Read, watch, listen, and export your course to PDF.' },
];

export default function LandingPage() {
    const { loginWithRedirect, isLoading } = useAuth0();
    const [isDarkMode, setIsDarkMode] = React.useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark mode
    });

    React.useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: 'var(--bg-color)', color: 'var(--text-color)', transition: '0.4s ease' }}>

            {/* Background orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            {/* Nav */}
            <nav className="landing-nav" style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px clamp(16px, 4vw, 48px)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--glass-border)',
            }}>
                <div className="landing-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 26 }}>🧠</span>
                    <span className="landing-nav-title" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-color)', letterSpacing: '-0.02em' }}>
                        Text<span className="gradient-text">-to-Learn</span>
                    </span>
                </div>
                <div className="landing-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'var(--input-bg)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-color)',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 14,
                            fontWeight: 600,
                            transition: '0.2s'
                        }}
                        className="glass-hover"
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                    <button
                        className="landing-nav-login"
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: '0.2s', padding: '10px 10px', borderRadius: 10 }}
                        onMouseEnter={e => e.target.style.color = 'var(--text-color)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                        onClick={() => loginWithRedirect()}
                    >
                        Log In
                    </button>
                    <button className="btn-primary landing-nav-signup" style={{ padding: '12px 18px', borderRadius: 12, fontSize: 14 }} onClick={() => loginWithRedirect()} disabled={isLoading}>
                        {isLoading ? 'Loading…' : 'Sign Up'}
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '160px 24px 100px',
                position: 'relative', zIndex: 10, textAlign: 'center',
            }}>
                <div className="badge badge-indigo landing-new-badge animate-bounce fade-up" style={{ marginBottom: 32, fontSize: 13, padding: '6px 16px' }}>
                    🚀 New: Gemini 2.5 Flash Support Integrated
                </div>

                <h1 className="fade-up fade-up-1" style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                    fontWeight: 900,
                    lineHeight: 1.02,
                    letterSpacing: '-0.05em',
                    color: 'var(--text-color)',
                    maxWidth: 1000,
                    marginBottom: 32,
                    textShadow: '0 0 40px rgba(99,102,241,0.1)'
                }}>
                    Your Personalized <br />
                    <span className="gradient-text">Learning Universe</span> <br />
                    Built by AI
                </h1>

                <p className="fade-up fade-up-2" style={{
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                    color: 'var(--text-secondary)',
                    maxWidth: 700,
                    lineHeight: 1.6,
                    marginBottom: 56,
                }}>
                    Stop searching. Start learning. Text-to-Learn transforms your curiosities
                    into structured modules with video, audio, and quizzes — instantly.
                </p>

                <div className="fade-up fade-up-3 landing-cta" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                        className="btn-primary"
                        style={{ fontSize: 'clamp(16px, 4vw, 18px)', padding: 'clamp(14px, 3.5vw, 18px) clamp(22px, 6vw, 48px)', borderRadius: 16, minHeight: 48 }}
                        onClick={() => loginWithRedirect()}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading…' : 'Get Started for Free'}
                    </button>
                    <button className="glass-hover landing-cta-secondary" style={{
                        fontSize: 'clamp(15px, 3.8vw, 16px)', padding: 'clamp(13px, 3.2vw, 16px) clamp(18px, 5vw, 32px)', borderRadius: 16, border: '1px solid var(--glass-border)',
                        background: 'var(--glass-bg)', color: 'var(--text-color)', cursor: 'pointer', transition: '0.3s', minHeight: 48
                    }}
                        onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                        Explore Features
                    </button>
                </div>

                {/* Tech Stack Bar */}
                <div className="fade-up fade-up-4" style={{ marginTop: 100, width: '100%', opacity: 0.8 }}>
                    <p style={{ fontSize: 13, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 32, fontWeight: 600 }}>Built with Industry Standards</p>
                    <div style={{
                        display: 'flex',
                        gap: 'min(50px, 8vw)',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {[
                            { name: 'Google Gemini', logo: null },
                            { name: 'React', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
                            { name: 'Auth0', logo: 'https://www.vectorlogo.zone/logos/auth0/auth0-icon.svg' },
                            { name: 'Node.js', logo: 'https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg' },
                            { name: 'MongoDB', logo: 'https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg' },
                            { name: 'Tailwind', logo: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg' }
                        ].map(tech => (
                            <div
                                key={tech.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    filter: 'grayscale(1) opacity(0.6)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'default'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.filter = 'grayscale(0) opacity(1)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.filter = 'grayscale(1) opacity(0.6)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {tech.logo && <img src={tech.logo} alt={tech.name} style={{ height: 24, width: 'auto', objectFit: 'contain' }} />}
                                <span style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section style={{ padding: '120px 24px', background: 'var(--input-bg)' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--text-color)', marginBottom: 60, letterSpacing: '-0.02em' }}>
                        The Future vs The Past
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
                        {/* Old Way */}
                        <div className="glass" style={{ padding: 40, textAlign: 'left', borderColor: 'rgba(239, 68, 68, 0.1)' }}>
                            <div style={{ fontSize: 32, marginBottom: 20 }}>🐌</div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#ef4444', marginBottom: 16 }}>Traditional Search</h3>
                            <ul style={{ color: 'var(--text-secondary)', spaceY: '12px', paddingLeft: 0, listStyle: 'none' }}>
                                <li style={{ marginBottom: 12 }}>❌ Hours of searching YouTube</li>
                                <li style={{ marginBottom: 12 }}>❌ Fragmented tutorial series</li>
                                <li style={{ marginBottom: 12 }}>❌ No structured reading material</li>
                                <li>❌ Impossible to export offline</li>
                            </ul>
                        </div>
                        {/* New Way */}
                        <div className="glass" style={{ padding: 40, textAlign: 'left', borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}>
                            <div style={{ fontSize: 32, marginBottom: 20 }}>⚡</div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#10b981', marginBottom: 16 }}>Text-to-Learn AI</h3>
                            <ul style={{ color: 'var(--text-secondary)', spaceY: '12px', paddingLeft: 0, listStyle: 'none' }}>
                                <li style={{ marginBottom: 12 }}>✅ Structural flow in 10 seconds</li>
                                <li style={{ marginBottom: 12 }}>✅ Curated videos for every block</li>
                                <li style={{ marginBottom: 12 }}>✅ Natural AI Narration (TTS)</li>
                                <li>✅ Pro-grade PDF Exports</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" style={{ padding: '140px 24px', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 80 }}>
                        <div className="badge badge-emerald" style={{ marginBottom: 20, padding: '6px 16px' }}>Ecosystem</div>
                        <h2 style={{
                            fontFamily: 'Outfit, sans-serif', fontWeight: 900,
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--text-color)',
                            letterSpacing: '-0.04em', lineHeight: 1.1
                        }}>
                            Hyper-Personalized <br /> <span className="gradient-text">Learning Tools</span>
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
                        {features.map((f, i) => (
                            <div key={i} className="glass glass-hover" style={{ padding: 40, borderRadius: 24 }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: 20, marginBottom: 24,
                                    background: `linear-gradient(135deg, ${f.color.replace('from-', '').replace('to-', '')})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 32,
                                    backgroundImage: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                }}>
                                    <span>{f.icon}</span>
                                </div>
                                <h3 style={{ fontWeight: 800, fontSize: 22, color: 'var(--text-color)', marginBottom: 14 }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section style={{ padding: '120px 24px', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
                    <div className="badge badge-indigo" style={{ marginBottom: 20, padding: '6px 16px' }}>Workflow</div>
                    <h2 style={{
                        fontFamily: 'Outfit, sans-serif', fontWeight: 900,
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--text-color)',
                        letterSpacing: '-0.04em', marginBottom: 80, lineHeight: 1.1,
                    }}>
                        Your Learning Journey <br /> in <span className="gradient-text">4 Simple Steps</span>
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
                        {steps.map((s, i) => (
                            <div key={i} className="glass" style={{
                                padding: 40, textAlign: 'center', position: 'relative', borderRadius: 28,
                                background: 'var(--glass-bg)',
                                borderColor: 'var(--glass-border)'
                            }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: 20, marginBottom: 24,
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 32, color: 'white', margin: '0 auto',
                                    boxShadow: '0 8px 30px rgba(99,102,241,0.3)',
                                    position: 'relative', zIndex: 2
                                }}>
                                    <span>{['🔑', '✍️', '🏗️', '🎓'][i]}</span>
                                </div>
                                <div style={{
                                    fontFamily: 'Outfit, sans-serif', fontSize: 64, fontWeight: 900,
                                    color: 'var(--text-color)', opacity: 0.05, lineHeight: 1, position: 'absolute', top: 20, left: 20, zIndex: 0,
                                }}>{s.num}</div>
                                <h4 style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-color)', marginBottom: 12, position: 'relative', zIndex: 1 }}>{s.title}</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section style={{ padding: '100px 24px 160px', position: 'relative', zIndex: 10 }}>
                <div className="glass" style={{
                    maxWidth: 1000, margin: '0 auto', padding: '100px 60px', textAlign: 'center',
                    background: 'radial-gradient(circle at top left, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.05))',
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                    boxShadow: '0 0 120px rgba(99, 102, 241, 0.2)',
                    borderRadius: 40
                }}>
                    <h2 style={{
                        fontFamily: 'Outfit, sans-serif', fontWeight: 900,
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--text-color)',
                        letterSpacing: '-0.05em', marginBottom: 24, lineHeight: 1.05
                    }}>
                        Stop Wondering. <br /> Start Mastering.
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 56, fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: 600, margin: '0 auto 56px' }}>
                        Your journey from curiosity to expertise is only one click away. Join thousands learning smarter with AI.
                    </p>
                    <button
                        className="btn-primary"
                        style={{ fontSize: 20, padding: '20px 64px', borderRadius: 20 }}
                        onClick={() => loginWithRedirect()}
                    >
                        🚀 Launch Your Future
                    </button>
                    <p style={{ marginTop: 24, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
                        Free forever for individual learners. No credit card required.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                borderTop: '1px solid var(--sidebar-border)',
                padding: '48px 48px',
                textAlign: 'center',
                color: 'var(--text-secondary)', fontSize: 14, position: 'relative', zIndex: 10,
                display: 'flex', flexDirection: 'column', gap: 16
            }}>
                <span>© 2026 Text-to-Learn · Built by <a href="https://github.com/PushkarWaykole" target="_blank" style={{ color: 'inherit', fontWeight: 600 }}>Pushkar</a></span>
            </footer>
        </div>
    );
}
