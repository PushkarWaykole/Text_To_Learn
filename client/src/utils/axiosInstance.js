import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create a base axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Call this once in your app root (e.g. App.jsx) to attach the Auth0
 * token silently to every outgoing request automatically.
 *
 * Usage:
 *   const { getAccessTokenSilently } = useAuth0();
 *   setupAxiosInterceptors(getAccessTokenSilently);
 */
export function setupAxiosInterceptors(getAccessTokenSilently) {
    axiosInstance.interceptors.request.use(
        async (config) => {
            try {
                const token = await getAccessTokenSilently();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                // Token not available (user not logged in) — let request go through
                // without auth header; protected routes will reject it with 401.
                console.warn('Could not get access token silently:', error.message);
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Global response error handler — surface 401s clearly
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.error('Unauthorized: token may be expired or missing.');
            }
            return Promise.reject(error);
        }
    );
}

export default axiosInstance;
