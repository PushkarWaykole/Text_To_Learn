import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import LessonRenderer from '../components/LessonRenderer';

export default function CoursePage() {
    const { courseId, moduleId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/api/courses/${courseId}`);
                setCourse(res.data);
            } catch (err) {
                console.error("Failed to load course:", err);
                setError("Could not load course. It might not exist or you don't have permission.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex bg-slate-950 min-h-screen items-center justify-center">
                <div className="animate-spin w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="flex bg-slate-950 min-h-screen items-center justify-center flex-col gap-6 text-center px-4">
                <h2 className="text-3xl text-rose-500 font-bold">Oops!</h2>
                <p className="text-slate-400 max-w-md">{error}</p>
                <Link to="/" className="btn-primary">Return to Dashboard</Link>
            </div>
        );
    }

    // Find active module, default to first module if not found
    const activeModule = course.modules?.find(m => m._id === moduleId) || course.modules?.[0];

    return (
        <div className="flex bg-slate-950 min-h-screen">
            {/* Sidebar layout for the course */}
            <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 shadow-2xl z-20">

                {/* Course Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
                    <Link to="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center mb-4 mt-2">
                        <span className="mr-2">←</span> Back to Dashboard
                    </Link>
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                        {course.topic}
                    </div>
                    <h1 className="text-xl font-bold text-slate-100 leading-tight">
                        {course.title}
                    </h1>
                </div>

                {/* Modules List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {course.modules?.map((m, i) => {
                        const isActive = activeModule?._id === m._id;
                        return (
                            <Link
                                key={m._id}
                                to={`/course/${course._id}/module/${m._id}`}
                                className={`block p-4 rounded-xl border transition-all duration-200 ${isActive
                                        ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-500/20'
                                        : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-700/50 text-slate-300'
                                    }`}
                            >
                                <div className={`text-xs font-bold mb-1 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                                    MODULE {i + 1}
                                </div>
                                <div className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                    {m.title}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-80 min-h-screen flex flex-col pb-[env(safe-area-inset-bottom)] relative overflow-x-hidden">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto px-12 py-16 custom-scrollbar relative">

                    <div className="mb-12 border-b border-slate-800 pb-8 content-start">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold px-2.5 py-1 rounded text-xs uppercase tracking-wider">
                                Module {(activeModule?.order ?? 0) + 1}
                            </span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white tracking-tight">
                            {activeModule?.title || 'Unknown Module'}
                        </h2>
                    </div>

                    <LessonRenderer content={activeModule?.content || []} />

                    {/* Module Navigation */}
                    {course.modules?.length > 0 && activeModule && (
                        <div className="mt-16 pt-8 border-t border-slate-800 flex justify-between">
                            {activeModule.order > 0 ? (
                                <Link
                                    to={`/course/${course._id}/module/${course.modules[activeModule.order - 1]._id}`}
                                    className="btn-ghost flex items-center pr-6"
                                >
                                    <span className="mr-3 text-lg opacity-60">←</span>
                                    <div className="text-left">
                                        <div className="text-xs text-slate-500 font-medium">Previous Module</div>
                                        <div className="text-sm font-semibold truncate max-w-[200px]">{course.modules[activeModule.order - 1].title}</div>
                                    </div>
                                </Link>
                            ) : <div />}

                            {activeModule.order < course.modules.length - 1 ? (
                                <Link
                                    to={`/course/${course._id}/module/${course.modules[activeModule.order + 1]._id}`}
                                    className="btn-primary flex items-center pl-6"
                                >
                                    <div className="text-right mr-3">
                                        <div className="text-[10px] text-white/70 uppercase">Next Module</div>
                                        <div className="text-sm font-bold truncate max-w-[200px]">{course.modules[activeModule.order + 1].title}</div>
                                    </div>
                                    <span className="text-lg">→</span>
                                </Link>
                            ) : (
                                <button className="px-6 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold hover:bg-emerald-500/30 transition-colors">
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
