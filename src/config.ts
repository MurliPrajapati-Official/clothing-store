export const getApiUrl = () => {
  // 1. Check if an environment variable is explicitly set
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  // 2. Determine based on current environment
  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' || 
                  window.location.hostname.startsWith('192.168.');

  if (isLocal) {
    return 'http://localhost:3000';
  }

  // 3. Production Fallback
  // User provided backend: https://uniform-trends-backend.murliprajapati228.workers.dev
  return 'https://uniform-trends-backend.murliprajapati228.workers.dev';
};
