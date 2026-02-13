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
    login: (data: any) => {
        // FastAPI expects form data for OAuth2PasswordRequestForm
        const formData = new FormData();
        formData.append('username', data.email);
        formData.append('password', data.password);
        return api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    getMe: () => api.get('/auth/me'),
};

export const expensesApi = {
    getExpenses: () => api.get('/expenses'),
    createExpense: (data: any) => api.post('/expenses', data),
    deleteExpense: (id: any) => api.delete(`/expenses/${id}`),
    getSummary: () => api.get('/expenses/summary'),
};

export const shieldApi = {
    analyze: (text: string) => api.post('/shield/analyze', { text }),
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

export default api;
