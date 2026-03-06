import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import LessonRenderer from '../components/LessonRenderer';
import confetti from 'canvas-confetti';

export default function CoursePage() {
    const { courseId, moduleId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [quizChoices, setQuizChoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isModulesOpen, setIsModulesOpen] = useState(false);

    useEffect(() => {
        if (!isModulesOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [isModulesOpen]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/api/courses/${courseId}`);
                const data = res.data;
                setCourse(data);
                setQuizChoices(data.quizChoices || []);

                // Auto-Resume logic: If no moduleId in URL, find first incomplete lesson
                if (!moduleId && data.modules && data.modules.length > 0) {
                    const completedIds = data.completedModules || [];
                    const firstIncomplete = data.modules.find(m => !completedIds.includes(m._id));

                    if (firstIncomplete) {
                        navigate(`/course/${courseId}/module/${firstIncomplete._id}`, { replace: true });
                    } else {
                        // All modules completed, default to first module
                        navigate(`/course/${courseId}/module/${data.modules[0]._id}`, { replace: true });
                    }
                }
            } catch (err) {
                console.error("Failed to load course:", err);
                setError("Could not load course. It might not exist or you don't have permission.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId, moduleId, navigate]);

    const handleModuleComplete = async (targetModuleId, nextPath) => {
        try {
            await axiosInstance.post(`/api/courses/${courseId}/complete/${targetModuleId}`);

            // Update local state to show completion instantly
            setCourse(prev => ({
                ...prev,
                completedModules: prev.completedModules?.includes(targetModuleId)
                    ? prev.completedModules
                    : [...(prev.completedModules || []), targetModuleId]
            }));

            if (nextPath) {
                navigate(nextPath);
            } else if (!nextPath && targetModuleId === course.modules[course.modules.length - 1]._id) {
                // Celebration!
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#6366f1', '#a5b4fc', '#ffffff']
                });

                setTimeout(() => {
                    alert("🎉 Congratulations! You have completed this course.");
                    navigate('/');
                }, 500);
            }
        } catch (err) {
            console.error("Failed to mark module as complete:", err);
            if (nextPath) navigate(nextPath);
        }
    };

    const handleSaveQuiz = async (questionIndex, selectedOption) => {
        try {
            const res = await axiosInstance.post(`/api/courses/${courseId}/module/${activeModule._id}/quiz-choice`, {
                questionIndex,
                selectedOption
            });
            setQuizChoices(res.data.quizChoices);
        } catch (err) {
            console.error("Failed to save quiz choice:", err);
        }
    };

    const handleResetQuiz = async (questionIndex) => {
        try {
            const res = await axiosInstance.post(`/api/courses/${courseId}/module/${activeModule._id}/quiz-choice/reset`, {
                questionIndex
            });
            setQuizChoices(res.data.quizChoices);
        } catch (err) {
            console.error("Failed to reset quiz choice:", err);
        }
    };

    const downloadPDF = async () => {
        if (!course || !activeModule) return;

        setIsExporting(true);
        try {
            // Request PDF from backend (Pure data-to-PDF, extremely stable)
            const response = await axiosInstance.get(`/api/courses/module/${activeModule._id}/pdf`, {
                responseType: 'blob'
            });

            // Create a link and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${activeModule.title.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDF Export failed:", err);
            alert("Failed to generate PDF. Please try again later.");
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
                <div className="animate-spin w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, textAlign: 'center', padding: '0 16px', background: 'var(--bg-color)' }}>
                <h2 style={{ fontSize: 30, color: '#ef4444', fontWeight: 800 }}>Oops!</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 450 }}>{error}</p>
                <Link to="/" className="btn-primary">Return to Dashboard</Link>
            </div>
        );
    }

    // Find active module, default to first module if not found
    const activeModule = course.modules?.find(m => m._id === moduleId) || course.modules?.[0];

    // Filter choices for the active module only
    const activeModuleChoices = quizChoices?.filter(c => c.moduleId === activeModule?._id);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
            {/* Sidebar layout for the course */}
            <div
                className={`sidebar-backdrop ${isModulesOpen ? 'sidebar-backdrop-show' : ''}`}
                onClick={() => setIsModulesOpen(false)}
                aria-hidden={!isModulesOpen}
            />
            <aside className={`course-sidebar ${isModulesOpen ? 'course-sidebar-open' : ''}`}>

                {/* Course Header */}
                <div style={{ padding: 24, borderBottom: '1px solid var(--sidebar-border)', background: 'var(--sidebar-bg)', backdropFilter: 'blur(8px)' }}>
                    <Link to="/" className="text-sm" style={{ color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', marginBottom: 16, marginTop: 8, fontWeight: 600 }}>
                        <span style={{ marginRight: 8 }}>←</span> Back to Dashboard
                    </Link>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 8 }}>
                        {course.topic}
                    </div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-color)', lineHeight: 1.2 }}>
                        {course.title}
                    </h1>
                </div>

                {/* Modules List */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {course.modules?.map((m, i) => {
                            const isActive = activeModule?._id === m._id;
                            const isDone = course.completedModules?.includes(m._id);
                            return (
                                <Link
                                    key={m._id}
                                    to={`/course/${course._id}/module/${m._id}`}
                                    className={`block p-4 rounded-xl border transition-all duration-200`}
                                    style={{
                                        textDecoration: 'none',
                                        background: isActive ? '#6366f1' : 'var(--glass-bg)',
                                        borderColor: isActive ? '#4f46e5' : 'var(--glass-border)',
                                        boxShadow: isActive ? '0 10px 15px -3px rgba(99, 102, 241, 0.3)' : 'none'
                                    }}
                                    onClick={() => setIsModulesOpen(false)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ fontSize: 10, fontWeight: 800, marginBottom: 4, color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' }}>
                                            MODULE {i + 1}
                                        </div>
                                        {isDone && <span style={{ fontSize: 12 }}>✅</span>}
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? 'white' : 'var(--text-color)' }}>
                                        {m.title}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="course-main">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="mobile-topbar">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsModulesOpen(true)}
                        aria-label="Open modules"
                        type="button"
                    >
                        ☰
                    </button>
                    <div style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 900,
                        letterSpacing: '-0.02em',
                        textAlign: 'center'
                    }}>
                        {course?.title || 'Course'}
                    </div>
                    <div style={{ width: 44 }} />
                </div>

                <div
                    className="custom-scrollbar"
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        width: '100%',
                        maxWidth: 1000,
                        margin: '0 auto',
                        padding: 'clamp(20px, 4vw, 64px) clamp(16px, 4vw, 48px)'
                    }}
                >

                    <div className="course-header">
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <span style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', fontWeight: 700, padding: '4px 10px', borderRadius: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Module {(activeModule?.order ?? 0) + 1}
                                </span>
                                {course.completedModules?.includes(activeModule?._id) && (
                                    <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>
                                        Completed ✅
                                    </span>
                                )}
                            </div>
                            <h2 style={{
                                fontSize: 'clamp(24px, 4vw, 40px)',
                                fontWeight: 900,
                                color: 'var(--text-color)',
                                letterSpacing: '-0.02em',
                                margin: 0,
                                lineHeight: 1.1
                            }}>
                                {activeModule?.title || 'Unknown Module'}
                            </h2>
                        </div>
                        <div className="course-header-actions">
                            <button
                                onClick={() => handleModuleComplete(activeModule?._id, null)}
                                disabled={course.completedModules?.includes(activeModule?._id)}
                                className={`mark-read-btn h-10 px-6 rounded-lg font-bold text-sm transition-all border whitespace-nowrap`}
                                style={{
                                    cursor: course.completedModules?.includes(activeModule?._id) ? 'default' : 'pointer',
                                    background: course.completedModules?.includes(activeModule?._id) ? 'rgba(16,185,129,0.1)' : '#6366f1',
                                    borderColor: course.completedModules?.includes(activeModule?._id) ? 'rgba(16,185,129,0.2)' : '#4f46e5',
                                    color: course.completedModules?.includes(activeModule?._id) ? '#10b981' : 'white',
                                    boxShadow: course.completedModules?.includes(activeModule?._id) ? 'none' : '0 4px 12px rgba(99,102,241,0.2)'
                                }}
                            >
                                {course.completedModules?.includes(activeModule?._id) ? 'Completed' : 'Mark as Read'}
                            </button>
                            <button
                                onClick={downloadPDF}
                                disabled={isExporting}
                                className="glass-hover course-pdf-btn"
                                style={{
                                    height: 40, padding: '0 20px', borderRadius: 8, border: '1px solid var(--glass-border)',
                                    background: 'var(--glass-bg)', color: 'var(--text-color)',
                                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                                    fontSize: 14, fontWeight: 600, transition: '0.2s', opacity: isExporting ? 0.5 : 1
                                }}
                            >
                                {isExporting ? 'Generating...' : '📄 Generate PDF'}
                            </button>
                        </div>
                    </div>

                    <div id="course-content">
                        <LessonRenderer
                            content={activeModule?.content || []}
                            quizChoices={activeModuleChoices}
                            onSaveQuiz={handleSaveQuiz}
                            onResetQuiz={handleResetQuiz}
                        />
                    </div>

                    {/* Module Navigation */}
                    {course.modules?.length > 0 && activeModule && (
                        <div className="course-nav" style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--sidebar-border)' }}>
                            {activeModule.order > 0 ? (
                                <Link
                                    to={`/course/${course._id}/module/${course.modules[activeModule.order - 1]._id}`}
                                    className="btn-ghost"
                                    style={{ display: 'flex', alignItems: 'center', paddingRight: 24, textDecoration: 'none' }}
                                >
                                    <span style={{ marginRight: 12, fontSize: 18, opacity: 0.6 }}>←</span>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Previous</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-color)', maxWidth: 300 }}>
                                            {course.modules[activeModule.order - 1].title}
                                        </div>
                                    </div>
                                </Link>
                            ) : <div />}

                            {activeModule.order < course.modules.length - 1 ? (
                                <button
                                    onClick={() => handleModuleComplete(activeModule._id, `/course/${course._id}/module/${course.modules[activeModule.order + 1]._id}`)}
                                    className="btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', paddingLeft: 24 }}
                                >
                                    <div style={{ textAlign: 'right', marginRight: 12 }}>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', uppercase: true }}>Next Module</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, maxWidth: 300 }}>
                                            {course.modules[activeModule.order + 1].title}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 18 }}>→</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleModuleComplete(activeModule._id, null)}
                                    style={{
                                        padding: '10px 24px', borderRadius: 10, background: 'rgba(16,185,129,0.1)',
                                        color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 800,
                                        cursor: 'pointer', transition: '0.2s'
                                    }}
                                    onMouseEnter={e => e.target.style.background = 'rgba(16,185,129,0.2)'}
                                    onMouseLeave={e => e.target.style.background = 'rgba(16,185,129,0.1)'}
                                >
                                    🎉 Finish Course
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
