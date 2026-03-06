import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Sidebar from '../components/Sidebar';

export default function CoursesPage() {
    const [myCourses, setMyCourses] = useState([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axiosInstance.get('/api/courses');
                setMyCourses(res.data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setIsLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="app-shell">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main content */}
            <main className="app-main">
                <div className="mobile-topbar">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open menu"
                        type="button"
                    >
                        ☰
                    </button>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Text<span className="gradient-text">-to-Learn</span>
                    </div>
                    <div style={{ width: 44 }} />
                </div>

                {/* Background orbs */}
                <div style={{
                    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent)',
                    top: -100, right: -100, pointerEvents: 'none',
                    opacity: document.body.classList.contains('dark-mode') ? 1 : 0.3
                }} />

                {/* Header */}
                <div className="fade-up" style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <h1 style={{
                            fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--text-color)',
                            letterSpacing: '-0.03em', lineHeight: 1.1,
                        }}>
                            My Courses
                        </h1>
                        <span className="badge badge-indigo">{myCourses.length} courses</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                        All the courses you've generated so far.
                    </p>
                </div>

                <div className="fade-up fade-up-1">
                    {isLoadingCourses ? (
                        <div className="flex justify-center p-12 text-slate-500">
                            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                        </div>
                    ) : myCourses.length === 0 ? (
                        <div className="glass" style={{
                            padding: '60px 40px', textAlign: 'center',
                            borderStyle: 'dashed', borderColor: 'var(--glass-border)',
                            maxWidth: 600
                        }}>
                            <div style={{ fontSize: 56, marginBottom: 16 }}>🎓</div>
                            <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-color)', marginBottom: 8 }}>
                                No courses yet
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 auto 24px' }}>
                                Head over to the Dashboard to create your first free AI course.
                            </p>
                            <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                                ✨ Go to Dashboard
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {myCourses.map(course => (
                                <Link to={`/course/${course._id}`} key={course._id} className="glass glass-hover p-8 h-full flex flex-col" style={{ textDecoration: 'none' }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-color)', marginBottom: 8 }}>{course.title}</h3>
                                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>{course.topic}</p>
                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{course.modules?.length || 0} Modules</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>View →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
