import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Props {
  isDark: boolean;
  toggle: () => void;
}

export const useToggleMood = create<Props>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggle: () => {
        const { isDark } = get();
        set({ isDark: !isDark });
      },
    }),
    {
      name: "toggle-dark-light-mood",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface UseSocketStore {
  sessionId: string | undefined;
  addSessionId: (value: string | undefined) => void;
}

export const useSocketStore = create<UseSocketStore>((set, get) => ({
  sessionId: "",
  addSessionId: (id) => {
    set({ sessionId: id });
  },
}));
