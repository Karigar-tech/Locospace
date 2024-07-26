import create from 'zustand';

const useAuthStore = create((set) => ({
  token: null,
  setToken: (newToken) => set({ token: newToken }),
  getToken: () => {
    const { token } = useAuthStore.getState();
    return token;
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null });
  },
}));

export default useAuthStore;
