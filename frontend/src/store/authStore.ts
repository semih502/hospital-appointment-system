import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Role, UserProfile, JwtResponse } from '../types/auth';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;

  // Eylemler (Actions)
  setAuth: (data: JwtResponse) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<UserProfile>) => void;
}

/**
 * Kullanici oturum ve yetki durumunu tarayici localStorage'i ile
 * senkronize yoneten Zustand Store bileseni.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      setAuth: (data: JwtResponse) => {
        const userProfile: UserProfile = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        };

        set({
          user: userProfile,
          token: data.token,
          role: data.role,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('hospital-auth-storage');
      },

      updateUser: (updatedFields) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        }));
      },
    }),
    {
      name: 'hospital-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
