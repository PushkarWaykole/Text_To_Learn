import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import { setupAxiosInterceptors } from './utils/axiosInstance';

function Home() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Profile />
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
      <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Text-to-Learn</h1>
      <p className="text-lg text-gray-600">AI-Powered Course Generator (Pushkar)</p>
    </div>
  );
}

function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Set up Axios interceptor once Auth0 is ready.
  // Re-runs whenever auth state changes (e.g. after login/logout).
  useEffect(() => {
    setupAxiosInterceptors(getAccessTokenSilently);
  }, [getAccessTokenSilently, isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
