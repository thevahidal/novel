import create from 'zustand';
import { persist } from 'zustand/middleware';

const useUser = create(
  persist(
    (set, get) => ({
      user: {},
      setUser: (params) => {
        set(() => ({ user: params }));
      },
      logoutUser: () => {
        set((state) => ({ user: {} }));
      },
    }),
    { name: 'store' }
  )
);
export default useUser;
