import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const DEFAULT_ADMIN_ID = (import.meta as any).env?.VITE_ADMIN_ID || "ADMIN-001";

type AdminState = {
  isAuthed: boolean;
  adminId: string;
  login: (adminId: string) => boolean;
  lock: () => void;
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthed: false,
      adminId: "",
      login: (adminId) => {
        const normalized = adminId.trim();
        const ok = normalized === DEFAULT_ADMIN_ID;
        if (!ok) return false;
        set({ isAuthed: true, adminId: normalized });
        return true;
      },
      lock: () => set({ isAuthed: false, adminId: "" }),
    }),
    {
      name: "beverage_admin_auth_v1",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
);
