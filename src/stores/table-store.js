import {create} from 'zustand';

export const useTableStore = create((set) => ({
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  resetCurrentPage: () => set({ currentPage: 1 }),
  nextPage: () => set((s) => ({ currentPage: s.currentPage + 1 })),
  prevPage: () => set((s) => ({ currentPage: Math.max(1, s.currentPage - 1) })),
}));
