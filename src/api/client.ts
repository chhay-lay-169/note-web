import axios from 'axios';

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

const apiClient = axios.create({
    baseURL: baseApiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
