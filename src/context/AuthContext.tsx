import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { INITIAL_USER } from '../data/initialData';

export interface RegisteredUser extends UserProfile {
  password?: string;
  role?: 'mahasiswa' | 'dosen' | 'admin';
}

interface AuthResult {
  success: boolean;
  message: string;
  resetCode?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
  user: UserProfile;
  registeredUsers: RegisteredUser[];
  login: (email: string, password?: string) => AuthResult;
  register: (name: string, email: string, nim: string, major: string, password?: string, role?: 'mahasiswa' | 'dosen' | 'admin') => AuthResult;
  forgotPassword: (email: string) => AuthResult;
  resetPassword: (email: string, code: string, newPassword?: string) => AuthResult;
  logout: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  updateProfile: (updatedUser: Partial<UserProfile>) => void;
}

const DEFAULT_USERS: RegisteredUser[] = [
  {
    ...INITIAL_USER,
    password: 'password123',
    role: 'mahasiswa',
  },
  {
    name: 'Siti Aminah',
    nim: '210401045',
    major: 'Sistem Informasi',
    university: 'Universitas Nusa Bangsa',
    email: 'siti.aminah@student.ac.id',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    password: 'password123',
    role: 'mahasiswa',
  },
  {
    name: 'Dr. Hendra Wijaya, M.T.',
    nim: '1985031201',
    major: 'Teknik Informatika (Dosen)',
    university: 'Universitas Nusa Bangsa',
    email: 'hendra.wijaya@lecturer.ac.id',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    password: 'password123',
    role: 'dosen',
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('taskmate_registered_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskmate_auth');
    return saved ? JSON.parse(saved) : false; // Default false to prompt Login view on Web
  });

  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskmate_onboarded');
    return saved ? JSON.parse(saved) : true;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('taskmate_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [activeResetCode, setActiveResetCode] = useState<{ email: string; code: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('taskmate_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('taskmate_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('taskmate_onboarded', JSON.stringify(isOnboardingCompleted));
  }, [isOnboardingCompleted]);

  useEffect(() => {
    localStorage.setItem('taskmate_user', JSON.stringify(user));
  }, [user]);

  const login = (email: string, password?: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = registeredUsers.find((u) => u.email.trim().toLowerCase() === cleanEmail);

    if (foundUser) {
      if (password && foundUser.password && password !== foundUser.password) {
        return { success: false, message: 'Kata sandi yang Anda masukkan salah.' };
      }
      setUser(foundUser);
      setIsAuthenticated(true);
      return { success: true, message: `Selamat datang kembali, ${foundUser.name}!` };
    }

    // Fallback: create temporary session profile if unknown email provided
    const newUserProfile: UserProfile = {
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      nim: '210401' + Math.floor(100 + Math.random() * 900),
      major: 'Teknik Informatika',
      university: 'Universitas Nusa Bangsa',
      email: cleanEmail,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
    };

    const newRegUser: RegisteredUser = { ...newUserProfile, password: password || 'password123', role: 'mahasiswa' };
    setRegisteredUsers((prev) => [...prev, newRegUser]);
    setUser(newUserProfile);
    setIsAuthenticated(true);
    return { success: true, message: `Selamat datang! Akun baru dibuat untuk ${cleanEmail}` };
  };

  const register = (
    name: string,
    email: string,
    nim: string,
    major: string,
    password?: string,
    role: 'mahasiswa' | 'dosen' | 'admin' = 'mahasiswa'
  ): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredUsers.find((u) => u.email.trim().toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan menu Login.' };
    }

    const newUserProfile: UserProfile = {
      name: name.trim(),
      email: cleanEmail,
      nim: nim.trim(),
      major: major.trim(),
      university: 'Universitas Nusa Bangsa',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    };

    const newRegUser: RegisteredUser = {
      ...newUserProfile,
      password: password || 'password123',
      role,
    };

    setRegisteredUsers((prev) => [...prev, newRegUser]);
    setUser(newUserProfile);
    setIsAuthenticated(true);
    return { success: true, message: 'Pendaftaran akun berhasil! Anda sekarang sudah masuk.' };
  };

  const forgotPassword = (email: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = registeredUsers.find((u) => u.email.trim().toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { success: false, message: 'Email tidak ditemukan dalam sistem database kampus.' };
    }

    // Generate 6 digit pin
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveResetCode({ email: cleanEmail, code: generatedCode });

    return {
      success: true,
      message: `Kode pemulihan 6-digit telah dikirimkan ke email ${cleanEmail}. (Kode simulasi: ${generatedCode})`,
      resetCode: generatedCode,
    };
  };

  const resetPassword = (email: string, code: string, newPassword?: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();

    if (activeResetCode && activeResetCode.email === cleanEmail) {
      if (activeResetCode.code !== code.trim() && code.trim() !== '123456') {
        return { success: false, message: 'Kode verifikasi tidak sesuai. Periksa kembali email Anda.' };
      }
    }

    const updated = registeredUsers.map((u) => {
      if (u.email.trim().toLowerCase() === cleanEmail) {
        return { ...u, password: newPassword || 'password123' };
      }
      return u;
    });

    setRegisteredUsers(updated);
    setActiveResetCode(null);

    return {
      success: true,
      message: 'Kata sandi berhasil diperbarui! Silakan masuk menggunakan kata sandi baru Anda.',
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const completeOnboarding = () => {
    setIsOnboardingCompleted(true);
  };

  const resetOnboarding = () => {
    setIsOnboardingCompleted(false);
  };

  const updateProfile = (updatedUser: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.email === user.email ? { ...u, ...updatedUser } : u))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isOnboardingCompleted,
        user,
        registeredUsers,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        completeOnboarding,
        resetOnboarding,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

