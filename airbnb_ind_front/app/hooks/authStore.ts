import { create } from 'zustand';

interface AuthStore {
  token: string | null;
  userId: string | null;
  userName: string | null;
  avatarImage: string | null;
  login: (token: string, userId: string, userName: string) => void;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (userName: string, avatarImage: string) => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem('authToken') || null,
  userId: localStorage.getItem('userId') || null,
  userName: localStorage.getItem('userName') || null,
  avatarImage: localStorage.getItem('avatarImage') || null,

  // Login function
  login: (token, userId, userName) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    set({ token, userId, userName });
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('avatarImage');
    set({ token: null, userId: null, userName: null, avatarImage: null });
  },

  // Fetch user profile details from backend using userId
  fetchUserProfile: async () => {
    const userId = get().userId;
    if (userId) {
      try {
        const response = await fetch(`/api/users/${userId}/profile`, {
          headers: {
            Authorization: `Bearer ${get().token}`,
          },
        });
        const data = await response.json();
        set({
          userName: data.userName,
          avatarImage: data.avatarImage,
        });
        localStorage.setItem('userName', data.userName);
        localStorage.setItem('avatarImage', data.avatarImage);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    }
  },

  // Update user profile and store details
  updateUserProfile: (userName, avatarImage) => {
    set({ userName, avatarImage });
    localStorage.setItem('userName', userName);
    localStorage.setItem('avatarImage', avatarImage);
  },
}));

export default useAuthStore;
