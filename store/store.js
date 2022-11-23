import create from 'zustand';
import { persist } from 'zustand/middleware';
import { colorLuminance, getRandomColor } from '../utils/colors';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: {},
      setUser: (params) => {
        set(() => ({ user: params }));
      },
      logoutUser: () => {
        set(() => ({ user: {} }));
      },
    }),
    { name: 'users' }
  )
);

const useUserColorStore = create(
  persist(
    (set, get) => ({
      colors: {},
      getUserColor: (params) => {
        let color = get().colors[params];

        if (!color) {
          color = colorLuminance(getRandomColor(), -0.5);
          set((state) => ({ colors: { ...state.colors, [params]: color } }));
        }

        return color;
      },
    }),
    { name: 'colors' }
  )
);

export { useUserStore, useUserColorStore };
