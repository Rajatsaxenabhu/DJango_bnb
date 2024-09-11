import { create } from "zustand";

interface LoginModalStore {
    isOpen: boolean;
    user: {                        // Store backend response user data
        id: string;
        name: string;
      } | null; 
    setUser: (user: { id: string; name: string;}) => void; 
    open: () => void;
    close: () => void;
}

const useLoginModal = create<LoginModalStore>((set) => ({
    isOpen: false,
    user: null,
    setUser: (user) => set({ user }),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}));

export default useLoginModal;