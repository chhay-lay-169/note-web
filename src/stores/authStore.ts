import { defineStore } from 'pinia';
import apiClient from '../api/client';
import type { LoginDto, RegisterDto, TokenResponseDto } from '../types/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        loading: false,
        error: null as string | null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(dto: LoginDto) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.post<TokenResponseDto>('/auth/login', dto);
                this.token = response.data.accessToken;
                this.refreshToken = response.data.refreshToken;
                localStorage.setItem('accessToken', this.token);
                localStorage.setItem('refreshToken', this.refreshToken);
                return true;
            } catch (err: any) {
                this.error = err.response?.data || 'Login failed';
                return false;
            } finally {
                this.loading = false;
            }
        },
        async register(dto: RegisterDto) {
            this.loading = true;
            this.error = null;
            try {
                await apiClient.post('/auth/register', dto);
                return true;
            } catch (err: any) {
                this.error = err.response?.data || 'Registration failed';
                return false;
            } finally {
                this.loading = false;
            }
        },
        async refreshAccessToken() {
            if (!this.refreshToken) {
                this.logout();
                return null;
            }

            try {
                // We use the refresh token in the Authorization header for this specific request
                const response = await apiClient.post<TokenResponseDto>('/auth/refresh', 
                {
                    accessToken: this.token,
                    refreshToken: this.refreshToken
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.refreshToken}`
                    }
                });
                
                this.token = response.data.accessToken;
                this.refreshToken = response.data.refreshToken;
                localStorage.setItem('accessToken', this.token);
                localStorage.setItem('refreshToken', this.refreshToken);
                
                return this.token;
            } catch (err) {
                this.logout();
                return null;
            }
        },
        logout() {
            this.token = null;
            this.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }
});
