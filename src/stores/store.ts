import { create } from "zustand";

interface StoreState {
  date: Date;
  setDate: (date: Date) => void;
  newEntryOpen: boolean;
  setNewEntryOpen: (newEntryOpen: boolean) => void;
}

export const useStore = create<StoreState>()((set) => ({
  date: new Date(),
  setDate: (date) => set({ date }),
  newEntryOpen: true,
  setNewEntryOpen: (newEntryOpen) => set({ newEntryOpen }),
}));
