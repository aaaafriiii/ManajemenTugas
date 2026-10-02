import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTask } from '../../context/TaskContext';
import { EditProfileModal } from './EditProfileModal';
import {
  User,
  GraduationCap,
  Building,
  Mail,
  Moon,
  Sun,
  Bell,
  LogOut,
  RotateCcw,
  Smartphone,
  Edit,
  Sparkles,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, logout, resetOnboarding } = useAuth();
  const { isDarkMode, toggleDarkMode, isMobileFrameEnabled, toggleMobileFrame } = useTheme();
  const { resetAllData } = useTask();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="p-4 space-y-4 pb-10 animate-fade-in">
      {/* Student ID Card Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-5 text-white shadow-soft-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-xs text-blue-200 uppercase tracking-widest">
              Kartu Tanda Mahasiswa
            </span>
          </div>
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profil</span>
          </button>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-16 h-16 rounded-2xl border-2 border-white/40 object-cover shadow-md shrink-0"
          />
          <div>
            <h2 className="text-lg font-black tracking-tight leading-tight">{user.name}</h2>
            <p className="text-xs text-amber-300 font-mono font-bold mt-0.5">NIM: {user.nim}</p>
            <p className="text-xs text-blue-100 mt-1 font-medium">{user.major}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 text-xs text-blue-200 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-blue-300" />
          <span>{user.university}</span>
        </div>
      </div>

      {/* Detail Account Info */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Informasi Akun
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              Email Student
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{user.email}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Status Akademik
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
              Mahasiswa Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Application Settings Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Pengaturan Aplikasi
        </h3>

        <div className="space-y-2 text-xs">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Mode Gelap (Dark Mode)</p>
                <p className="text-[11px] text-slate-400">Ganti tampilan tema gelap/terang</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Pengingat Deadline</p>
                <p className="text-[11px] text-slate-400">Notifikasi otomatis pengingat tugas</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Mobile Frame Simulator Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Frame Simulator Prototype</p>
                <p className="text-[11px] text-slate-400">Tampilkan bingkai smartphone fisik</p>
              </div>
            </div>
            <button
              onClick={toggleMobileFrame}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                isMobileFrameEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isMobileFrameEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Usability Testing & Design Thinking Reset Tool */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 space-y-3 shadow-md">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h4 className="font-bold text-xs text-slate-200">Alat Pengujian Usability (UX Research)</h4>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Gunakan tombol di bawah untuk mengulangi alur pengujian Design Thinking atau mereset data tugas awal.
        </p>
        <div className="flex gap-2 pt-1">
          <button
            onClick={resetOnboarding}
            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition border border-slate-700"
          >
            Ulangi Onboarding
          </button>
          <button
            onClick={resetAllData}
            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl font-bold text-xs transition border border-slate-700 flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Demo</span>
          </button>
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={logout}
        className="w-full py-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition"
      >
        <LogOut className="w-4 h-4" />
        <span>Keluar dari Akun (Logout)</span>
      </button>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal onClose={() => setIsEditProfileOpen(false)} />
      )}
    </div>
  );
};
