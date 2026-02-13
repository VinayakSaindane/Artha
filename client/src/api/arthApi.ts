import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor for auth token
api.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const incomeApi = {
    getIncome: () => api.get('/income'),
    createIncome: (data: any) => api.post('/income', data),
    deleteIncome: (id: any) => api.delete(`/income/${id}`),
};

export const expensesApi = {
    getExpenses: () => api.get('/expenses'),
    createExpense: (data: any) => api.post('/expenses', data),
    deleteExpense: (id: any) => api.delete(`/expenses/${id}`),
    getSummary: () => api.get('/expenses/summary'),
};

export const shieldApi = {
    analyze: (data: { text?: string; file?: File }) => {
        const formData = new FormData();
        if (data.file) {
            formData.append('file', data.file);
        }
        if (data.text) {
            formData.append('text', data.text);
        }
        return api.post('/shield/analyze', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    getHistory: () => api.get('/shield/history'),
};

export const scoreApi = {
    predict: (data: any) => api.post('/score/predict', data),
};

export const pulseApi = {
    analyze: () => api.get('/pulse/analyze'),
    scenario: (data: any) => api.post('/pulse/scenario', data),
};

export const goalsApi = {
    getGoals: () => api.get('/goals'),
    createGoal: (data: any) => api.post('/goals', data),
    updateGoal: (id: any, data: any) => api.put(`/goals/${id}`, data),
    plan: (data: any) => api.post('/goals/plan', data),
};

export const festivalApi = {
    plan: (data: { name: string; date: string }) => api.post('/festival/plan', data),
    getFestivals: () => api.get('/festival'),
};

export const limitsApi = {
    setLimits: (limits: any) => api.post('/limits', { limits }),
    getLimits: () => api.get('/limits'),
};

export const advisorApi = {
    getStrategy: (data: any) => api.post('/advisor/strategy', data),
};

export default api;
