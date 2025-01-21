import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1'
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('authUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/users/login', {
                username,
                password,
            });

            if (response.data.success) {
                const { user, accessToken } = response.data.data;
                setUser(user);
                sessionStorage.setItem('token', accessToken);
                sessionStorage.setItem('authUser', JSON.stringify(user));
                if (user.avatar) {
                    localStorage.setItem('avatar', user.avatar);
                }
                return { success: true };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('authUser');
        localStorage.removeItem('avatar');
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default api; 