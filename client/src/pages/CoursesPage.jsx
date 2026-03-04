import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Sidebar from '../components/Sidebar';

export default function CoursesPage() {
    const [myCourses, setMyCourses] = useState([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);

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
                            My Courses
                        </h1>
                        <span className="badge badge-indigo">{myCourses.length} courses</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: 15 }}>
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
                            borderStyle: 'dashed', borderColor: 'rgba(99,102,241,0.2)',
                            maxWidth: 600
                        }}>
                            <div style={{ fontSize: 56, marginBottom: 16 }}>🎓</div>
                            <h3 style={{ fontWeight: 700, fontSize: 18, color: '#f1f5f9', marginBottom: 8 }}>
                                No courses yet
                            </h3>
                            <p style={{ color: '#64748b', fontSize: 14, margin: '0 auto 24px' }}>
                                Head over to the Dashboard to create your first free AI course.
                            </p>
                            <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                                ✨ Go to Dashboard
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {myCourses.map(course => (
                                <Link to={`/course/${course._id}`} key={course._id} className="glass glass-hover flex flex-col p-6 h-full" style={{ textDecoration: 'none' }}>
                                    <h3 className="text-lg font-bold text-slate-100 mb-2">{course.title}</h3>
                                    <p className="text-sm text-slate-400 mb-4">{course.topic}</p>
                                    <div className="mt-auto flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                        <span>{course.modules?.length || 0} Modules</span>
                                        <span className="text-indigo-400">View Course →</span>
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
