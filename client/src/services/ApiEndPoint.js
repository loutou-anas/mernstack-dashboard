import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Ensures cookies are sent with requests
});

instance.interceptors.request.use((config) => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
            const response = await axios.post('http://localhost:8000/api/auth/refresh-token', {}, { withCredentials: true });
            const newToken = response.data.accessToken;  // Corrected from 'token' to 'accessToken'

            // Store the new token
            localStorage.setItem('token', newToken);
            instance.defaults.headers['Authorization'] = `Bearer ${newToken}`;

            // Retry the original request with the new token
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return instance(originalRequest);
        } catch (tokenRefreshError) {
            // If token refresh fails, log the user out or handle appropriately
            console.error('Token refresh failed:', tokenRefreshError);
            return Promise.reject(tokenRefreshError);
        }
    }
    return Promise.reject(error);
});


export const get = (url, params) => instance.get(url, { params });
export const put = (url, data) => instance.put(url, data);
export const delet = (url) => instance.delete(url);
export const post = (url, data, config) => {
    return instance.post(url, data, config);
};
