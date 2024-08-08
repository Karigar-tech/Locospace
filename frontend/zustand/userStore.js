import {create} from 'zustand';

const userStore = create((set) => ({
    user: null,
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
}));

export default userStore;