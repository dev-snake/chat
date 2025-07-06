import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: !!localStorage.getItem('token'),
    }),

    actions: {
        async login(username: string, password: string) {
            try {
                const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                    username,
                    password,
                });

                if (!response.data.success) {
                    throw new Error(response.data.error || response.data.message);
                }

                this.token = response.data.data.access_token;
                this.user = response.data.data.user;
                this.isAuthenticated = true;

                localStorage.setItem('token', this.token!);
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

                return { success: true };
            } catch (error: any) {
                return { success: false, error: error.message };
            }
        },

        async register(username: string, email: string, password: string) {
            try {
                const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                    username,
                    email,
                    password,
                });

                if (!response.data.success) {
                    throw new Error(response.data.error || response.data.message);
                }

                this.token = response.data.data.access_token;
                this.user = response.data.data.user;
                this.isAuthenticated = true;

                localStorage.setItem('token', this.token!);
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

                return { success: true };
            } catch (error: any) {
                return { success: false, error: error.message };
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        },

        async initializeAuth() {
            const token = localStorage.getItem('token');
            if (token) {
                this.token = token;
                this.isAuthenticated = true;
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                // Verify token and get user info
                await this.verifyToken(token);
            }
        },

        async verifyToken(token: string) {
            try {
                const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.data.success) {
                    throw new Error(response.data.error || response.data.message);
                }

                this.user = response.data.data;
                this.isAuthenticated = true;
            } catch (error) {
                // Token invalid, logout
                this.logout();
            }
        },
    },
});
