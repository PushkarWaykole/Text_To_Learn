import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../utils/axiosInstance';

const NAV_ITEMS = [
    { icon: '🏠', label: 'Dashboard', path: '/' },
    { icon: '📚', label: 'My Courses', path: '/courses' },
    { icon: '📥', label: 'Downloads', path: '/downloads' },
];

export default function Sidebar() {
    const { user, logout } = useAuth0();
    const location = useLocation();
    const [recentCourses, setRecentCourses] = useState([]);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await axiosInstance.get('/api/courses');
                setRecentCourses(res.data.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch recent courses", err);
            }
        };
        fetchRecent();
    }, []);

    return (
        <aside className="sidebar z-50">
            {/* Logo */}
            <div style={{ padding: '0 8px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                    <span style={{ fontSize: 22 }}>🧠</span>
                    <span style={{
                        fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 17,
                        color: '#f1f5f9', letterSpacing: '-0.02em',
                    }}>
                        Text<span className="gradient-text">-to-Learn</span>
                    </span>
                </Link>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1 }}>
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

                {/* Recent Courses */}
                {recentCourses.length > 0 && (
                    <div className="mt-8 mb-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Recent Courses
                    </div>
                )}
                {recentCourses.map(course => (
                    <Link key={course._id} to={`/course/${course._id}`} className="sidebar-link truncate opacity-70 hover:opacity-100 pl-4 py-2" style={{ textDecoration: 'none' }}>
                        <span className="text-xs mr-2">▪</span> {course.topic || course.title}
                    </Link>
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
    );
}
