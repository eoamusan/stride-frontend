import { create } from 'zustand';

/**
 * Modal store to manage named modals and optional payload data.
 * Usage examples:
 * const open = useModalStore((s) => s.modals['addComponent']?.open)
 * const openModal = useModalStore((s) => s.openModal)
 * openModal('addComponent', { some: 'data' })
 */
export const useModalStore = create((set, get) => ({
  modals: {},

  openModal: (name, data = null) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [name]: {
          ...(state.modals[name] || {}),
          open: true,
          data: data ?? state.modals[name]?.data ?? null,
        },
      },
    })),

  closeModal: (name) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [name]: {
          ...(state.modals[name] || {}),
          open: false,
        },
      },
    })),

  toggleModal: (name, data = undefined) =>
    set((state) => {
      const current = state.modals[name] || { open: false, data: null };
      const newOpen = !current.open;
      return {
        modals: {
          ...state.modals,
          [name]: {
            open: newOpen,
            data: data === undefined ? current.data : data,
          },
        },
      };
    }),

  setModalData: (name, data) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [name]: {
          ...(state.modals[name] || {}),
          data,
        },
      },
    })),

  // Simple helpers for common usage
  open: (name) => {
    const state = get();
    return !!(state.modals[name] && state.modals[name].open);
  },

  handleOpen: (name, data = null) => get().openModal(name, data),

  handleClose: (name) => get().closeModal(name),

  resetModal: (name) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [name]: { open: false, data: null },
      },
    })),

  closeAll: () => set({ modals: {} }),

  getModal: (name) => {
    const state = get();
    return state.modals[name] || { open: false, data: null };
  },
}));
