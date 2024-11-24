import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Token has expired, refresh it
      return api
        .post('/refresh-token')
        .then((response) => {
          // Update the token and retry the original request
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${response.data.token}`;
          return api(error.config);
        })
        .catch((error) => {
          // Handle token refresh error
          console.error('Token refresh error:', error);
          throw error;
        });
    } else {
      throw error;
    }
  }
);

api.interceptors.request.use(
  (config) => config,
  (error) => {
    throw error;
  }
);

export default api;
