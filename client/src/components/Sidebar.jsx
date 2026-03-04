import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../utils/axiosInstance';

const NAV_ITEMS = [
    { icon: '🏠', label: 'Dashboard', path: '/' },
    { icon: '📚', label: 'My Courses', path: '/courses' },
];

export default function Sidebar() {
    const { user, logout } = useAuth0();
    const location = useLocation();
    const [recentCourses, setRecentCourses] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark mode
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await axiosInstance.get('/api/courses');
                // Removed slice to show all courses
                setRecentCourses(res.data);
            } catch (err) {
                console.error("Failed to fetch recent courses", err);
            }
        };
        fetchRecent();
    }, []);

    return (
        <aside className="sidebar z-50">
            {/* Logo */}
            <div style={{ padding: '0 8px 28px', borderBottom: '1px solid var(--sidebar-border)', marginBottom: 20 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                    <span style={{ fontSize: 22 }}>🧠</span>
                    <span style={{
                        fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17,
                        color: 'var(--text-color)', letterSpacing: '-0.02em',
                    }}>
                        Text<span className="gradient-text">-to-Learn</span>
                    </span>
                </Link>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="custom-scrollbar">
                <div style={{ flexShrink: 0 }}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                                style={{ display: 'flex', textDecoration: 'none' }}
                            >
                                <span style={{ fontSize: 16 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Recent Courses Section */}
                {recentCourses.length > 0 && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div className="mt-8 mb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Recent Courses
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                            {recentCourses.map(course => (
                                <Link
                                    key={course._id}
                                    to={`/course/${course._id}`}
                                    className="sidebar-link opacity-70 hover:opacity-100 pl-4 py-2"
                                    style={{
                                        textDecoration: 'none',
                                        display: 'block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    <span className="text-xs mr-2">▪</span> {course.topic || course.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* User profile at bottom */}
            <div style={{
                borderTop: '1px solid var(--sidebar-border)',
                paddingTop: 16, marginTop: 'auto',
            }}>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="sidebar-link"
                    style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}
                >
                    <span style={{ fontSize: 16 }}>{isDarkMode ? '☀️' : '🌙'}</span>
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'var(--input-bg)' }}>
                    <img
                        src={user?.picture}
                        alt={user?.name}
                        style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.5)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
    );
}
