import axios from 'axios';

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

const apiClient = axios.create({
    baseURL: baseApiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Check if error is 401 and code is TOKEN_EXPIRED
        if (
            error.response?.status === 401 && 
            error.response.data?.code === 'TOKEN_EXPIRED' && 
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;
            
            try {
                // Dynamic import to avoid circular dependency
                const { useAuthStore } = await import('../stores/authStore');
                const authStore = useAuthStore();
                
                const newToken = await authStore.refreshAccessToken();
                
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;
