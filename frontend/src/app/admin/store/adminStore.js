import { create } from 'zustand';
import axios from 'axios';

// Base URL configuration (no longer used for real requests)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL
});

// Mock Admin Data
const mockAdmin = {
  _id: 'admin-123',
  name: 'Master Admin',
  email: 'admin@nowstay.com',
  role: 'superadmin'
};

const useAdminStore = create((set, get) => ({
  admin: JSON.parse(localStorage.getItem('adminUser')) || null,
  token: localStorage.getItem('adminToken') || null,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  loading: false,

  setToken: (token) => {
    if (token) {
      localStorage.setItem('adminToken', token);
      set({ token, isAuthenticated: true });
    } else {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      set({ token: null, isAuthenticated: false, admin: null });
    }
  },

  login: async (email, password) => {
    console.log('Master Admin Mock Login with:', email, password);
    const mockToken = 'mock-admin-token-' + Date.now();
    localStorage.setItem('adminToken', mockToken);
    localStorage.setItem('adminUser', JSON.stringify(mockAdmin));
    set({ admin: mockAdmin, token: mockToken, isAuthenticated: true, loading: false });
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    set({ admin: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('adminToken');
    const user = JSON.parse(localStorage.getItem('adminUser'));
    if (token && user) {
      set({
        admin: user,
        token,
        isAuthenticated: true,
        loading: false
      });
    } else {
      set({ isAuthenticated: false, admin: null, loading: false });
    }
  }
}));

export { axiosInstance };
export default useAdminStore;
