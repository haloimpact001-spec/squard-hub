import { create } from 'zustand';

interface UIState {
  isAuthOpen: boolean;
  isProfileOpen: boolean;
  isRewardsOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  setProfileOpen: (open: boolean) => void;
  setRewardsOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAuthOpen: false,
  isProfileOpen: false,
  isRewardsOpen: false,
  setAuthOpen: (open) => set({ isAuthOpen: open }),
  setProfileOpen: (open) => set({ isProfileOpen: open }),
  setRewardsOpen: (open) => set({ isRewardsOpen: open }),
}));