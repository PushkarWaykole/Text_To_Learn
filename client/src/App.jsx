import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setupAxiosInterceptors } from './utils/axiosInstance';
import axiosInstance from './utils/axiosInstance';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';

// Full-screen loading screen shown while Auth0 initialises
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
    }}>
      <div style={{ fontSize: 36 }}>🧠</div>
      <div style={{
        width: 40, height: 40,
        border: '3px solid rgba(99,102,241,0.2)',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#475569', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
        Initialising…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const { getAccessTokenSilently, isAuthenticated, isLoading, user } = useAuth0();

  // 1. Register Axios interceptor whenever auth state changes
  useEffect(() => {
    setupAxiosInterceptors(getAccessTokenSilently);
  }, [getAccessTokenSilently, isAuthenticated]);

  // 2. On login: upsert user document in MongoDB
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const syncUserToDb = async () => {
      try {
        await axiosInstance.post('/api/auth/sync', {
          email: user.email,
          name: user.name,
          picture: user.picture,
        });
        console.log('✅ User synced to DB.');
      } catch (err) {
        console.error('User sync failed:', err.response?.data || err.message);
      }
    };

    syncUserToDb();
  }, [isAuthenticated, user]);

  // Show spinner while Auth0 SDK is initialising
  if (isLoading) return <LoadingScreen />;

  // Route: show landing page for guests, dashboard for authenticated users
  return isAuthenticated ? <HomePage /> : <LandingPage />;
}
