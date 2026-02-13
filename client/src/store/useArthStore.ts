import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    name: string;
    monthly_income: number;
    age: number;
}

interface ArthState {
    user: User | null;
    token: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useArthStore = create<ArthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    setUser: (user: User | null) => set({ user }),
    setToken: (token: string | null) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        set({ token });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
    },
}));
