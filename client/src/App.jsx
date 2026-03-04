import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { setupAxiosInterceptors } from './utils/axiosInstance';
import axiosInstance from './utils/axiosInstance';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import CoursesPage from './pages/CoursesPage';

// Full-screen loading screen shown while Auth0 initialises
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-color)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      transition: 'background 0.4s ease'
    }}>
      <div style={{ fontSize: 36 }}>🧠</div>
      <div style={{
        width: 40, height: 40,
        border: '3px solid var(--glass-border)',
        borderTop: '3px solid var(--color-primary-500)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
        Initialising…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const { getAccessTokenSilently, isAuthenticated, isLoading, user } = useAuth0();
  const [isReady, setIsReady] = React.useState(false);

  // Apply theme immediately to prevent flashing
  React.useLayoutEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || !savedTheme) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // 1. Setup interceptors and sync user once authenticated
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setIsReady(true);
      return;
    }

    const initApp = async () => {
      try {
        // Setup interceptors
        setupAxiosInterceptors(getAccessTokenSilently);

        // Sync user to DB
        await axiosInstance.post('/api/auth/sync', {
          email: user.email,
          name: user.name,
          picture: user.picture,
        });

        console.log('✅ App initialised and user synced.');
        setIsReady(true);
      } catch (err) {
        console.error('App initialisation failed:', err.response?.data || err.message);
        // Even if sync fails, let them in so they aren't stuck on loading screen
        // Better to show the app with error states than a blank loader
        setIsReady(true);
      }
    };

    initApp();
  }, [isLoading, isAuthenticated, getAccessTokenSilently, user]);

  // Show spinner while Auth0 SDK or App Sync is initialising
  if (isLoading || !isReady) return <LoadingScreen />;

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<LandingPage />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/course/:courseId/module/:moduleId" element={<CoursePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
