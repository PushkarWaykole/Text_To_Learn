import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function DownloadsPage() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
            <Sidebar />

            {/* Main content */}
            <main style={{ marginLeft: 240, flex: 1, padding: '40px 48px', position: 'relative', overflow: 'hidden' }}>

                {/* Background orbs */}
                <div style={{
                    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent)',
                    top: -100, right: -100, pointerEvents: 'none',
                }} />

                {/* Header */}
                <div className="fade-up" style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <h1 style={{
                            fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#f1f5f9',
                            letterSpacing: '-0.03em', lineHeight: 1.1,
                        }}>
                            Downloads
                        </h1>
                    </div>
                    <p style={{ color: '#64748b', fontSize: 15 }}>
                        Access PDF copies of courses you've exported offline. (Milestone 11 Feature)
                    </p>
                </div>

                <div className="fade-up fade-up-1">
                    <div className="glass" style={{
                        padding: '60px 40px', textAlign: 'center',
                        borderStyle: 'dashed', borderColor: 'rgba(99,102,241,0.2)',
                        maxWidth: 600
                    }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>📄</div>
                        <h3 style={{ fontWeight: 700, fontSize: 18, color: '#f1f5f9', marginBottom: 8 }}>
                            PDF Export System Pipeline
                        </h3>
                        <p style={{ color: '#64748b', fontSize: 14, margin: '0 auto 24px' }}>
                            This feature will act as your offline library vault. It will be wired up during Milestone 11.
                        </p>
                        <Link to="/courses" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                            ← Back to My Courses
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    );
}
