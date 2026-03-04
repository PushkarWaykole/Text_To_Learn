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

    return (
        <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#0a0a0f' }}>

            {/* Background orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            {/* Nav */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 48px',
                background: 'rgba(10,10,15,0.7)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 26 }}>🧠</span>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 20, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                        Text<span className="gradient-text">-to-Learn</span>
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-ghost" onClick={() => loginWithRedirect()}>Sign In</button>
                    <button className="btn-primary" onClick={() => loginWithRedirect()} disabled={isLoading}>
                        {isLoading ? 'Loading…' : 'Get Started →'}
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '120px 24px 80px',
                position: 'relative', zIndex: 10, textAlign: 'center',
            }}>
                <div className="badge badge-indigo fade-up" style={{ marginBottom: 24 }}>
                    ✨ Powered by Google Gemini AI
                </div>

                <h1 className="fade-up fade-up-1" style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                    fontWeight: 900,
                    lineHeight: 1.08,
                    letterSpacing: '-0.04em',
                    color: '#f1f5f9',
                    maxWidth: 900,
                    marginBottom: 24,
                }}>
                    Turn Any Topic Into a{' '}
                    <span className="gradient-text">Complete Course</span>{' '}
                    in Seconds
                </h1>

                <p className="fade-up fade-up-2" style={{
                    fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                    color: '#94a3b8',
                    maxWidth: 600,
                    lineHeight: 1.7,
                    marginBottom: 40,
                }}>
                    Text-to-Learn uses AI to generate structured, multi-module courses with
                    embedded videos, multilingual audio, and PDF export — instantly.
                </p>

                <div className="fade-up fade-up-3" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                        className="btn-primary"
                        style={{ fontSize: 17, padding: '15px 36px', borderRadius: 14 }}
                        onClick={() => loginWithRedirect()}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading…' : '🚀 Start Learning Free'}
                    </button>
                    <button className="btn-ghost" style={{ fontSize: 15, padding: '14px 28px' }}
                        onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                        See Features ↓
                    </button>
                </div>

                {/* Hero visual mockup */}
                <div className="fade-up fade-up-4 glass" style={{
                    marginTop: 64, maxWidth: 800, width: '100%', padding: 24,
                    boxShadow: '0 40px 120px rgba(99,102,241,0.2)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)', marginLeft: 8 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        {/* Fake sidebar */}
                        <div style={{ width: 140, flexShrink: 0 }}>
                            {['Introduction', 'Core Concepts', 'Advanced Topics', 'Exercises', 'Summary'].map((item, i) => (
                                <div key={i} className="skeleton" style={{
                                    height: 32, marginBottom: 8, borderRadius: 8,
                                    opacity: i === 0 ? 1 : 0.5 + i * 0.1,
                                    background: i === 0
                                        ? 'rgba(99, 102, 241, 0.25)'
                                        : undefined,
                                }}>
                                    {i === 0 && <span style={{ padding: '6px 10px', fontSize: 12, color: '#a5b4fc', display: 'block' }}>📖 {item}</span>}
                                </div>
                            ))}
                        </div>
                        {/* Fake content */}
                        <div style={{ flex: 1 }}>
                            <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 12 }} />
                            <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
                            <div className="skeleton" style={{ height: 14, width: '85%', marginBottom: 8 }} />
                            <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 16 }} />
                            <div className="skeleton" style={{ height: 100, borderRadius: 10, marginBottom: 12 }} />
                            <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
                            <div className="skeleton" style={{ height: 14, width: '80%' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" style={{ padding: '100px 24px', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div className="badge badge-emerald" style={{ marginBottom: 16 }}>Features</div>
                        <h2 style={{
                            fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                            fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#f1f5f9',
                            letterSpacing: '-0.03em',
                        }}>
                            Everything You Need to Learn Faster
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
                        {features.map((f, i) => (
                            <div key={i} className="glass glass-hover" style={{ padding: 28 }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14, marginBottom: 18,
                                    background: `linear-gradient(135deg, ${f.color.replace('from-', '').replace('to-', '')})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 26,
                                    backgroundImage: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                                }}>
                                    <span>{f.icon}</span>
                                </div>
                                <h3 style={{ fontWeight: 700, fontSize: 17, color: '#f1f5f9', marginBottom: 10 }}>{f.title}</h3>
                                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section style={{ padding: '80px 24px', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <div className="badge badge-indigo" style={{ marginBottom: 16 }}>How it works</div>
                    <h2 style={{
                        fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#f1f5f9',
                        letterSpacing: '-0.03em', marginBottom: 56,
                    }}>
                        From Topic to Course in 4 Steps
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
                        {steps.map((s, i) => (
                            <div key={i} className="glass" style={{ padding: 28, textAlign: 'left', position: 'relative' }}>
                                <div style={{
                                    fontFamily: 'Outfit, sans-serif', fontSize: 42, fontWeight: 900,
                                    color: 'white', lineHeight: 1, marginBottom: 12,
                                }}>{s.num}</div>
                                <h4 style={{ fontWeight: 700, fontSize: 16, color: '#f1f5f9', marginBottom: 8 }}>{s.title}</h4>
                                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
                                {i < steps.length - 1 && (
                                    <div style={{
                                        display: 'none', // hide on small screens; CSS grid handles layout
                                    }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section style={{ padding: '80px 24px 120px', position: 'relative', zIndex: 10 }}>
                <div className="glass" style={{
                    maxWidth: 760, margin: '0 auto', padding: '60px 48px', textAlign: 'center',
                    background: 'rgba(99, 102, 241, 0.08)',
                    borderColor: 'rgba(99, 102, 241, 0.25)',
                    boxShadow: '0 0 80px rgba(99, 102, 241, 0.12)',
                }}>
                    <h2 style={{
                        fontFamily: 'Outfit, sans-serif', fontWeight: 900,
                        fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: '#f1f5f9',
                        letterSpacing: '-0.03em', marginBottom: 16,
                    }}>
                        Ready to learn smarter?
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: 16 }}>
                        Join now and generate your first AI course in under 30 seconds.
                    </p>
                    <button
                        className="btn-primary"
                        style={{ fontSize: 17, padding: '15px 40px', borderRadius: 14 }}
                        onClick={() => loginWithRedirect()}
                    >
                        🚀 Get Started — It's Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                padding: '24px 48px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#475569', fontSize: 13, position: 'relative', zIndex: 10,
            }}>
                <span>© 2026 Text-to-Learn · Built for Hackathon 🚀</span>
            </footer>
        </div>
    );
}
