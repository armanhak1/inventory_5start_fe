// API Configuration
// To use localStorage instead of API, set USE_API to false
export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  USE_API: true, // Set to false to use localStorage
};

