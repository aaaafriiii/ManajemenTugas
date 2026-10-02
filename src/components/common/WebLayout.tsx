import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  BookOpen,
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  Plus,
  Smartphone,
  Maximize2,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import type { ActiveTab } from '../../types';

interface WebLayoutProps {
  children: React.ReactNode;
}

export const WebLayout: React.FC<WebLayoutProps> = ({ children }) => {
  const { activeTab, setActiveTab, setIsAddTaskOpen, unreadNotificationsCount, tasks } = useTask();
  const { isDarkMode, toggleDarkMode, isMobileFrameEnabled, toggleMobileFrame } = useTheme();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = tasks.filter((t) => t.status !== 'Selesai').length;

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Beranda', icon: Home },
    { id: 'tasks', label: 'Daftar Tugas', icon: CheckSquare, badge: pendingCount },
    { id: 'calendar', label: 'Kalender Deadline', icon: Calendar },
    { id: 'stats', label: 'Statistik Progress', icon: BarChart3 },
    { id: 'subjects', label: 'Mata Kuliah', icon: BookOpen },
    { id: 'notifications', label: 'Notifikasi', icon: Bell, badge: unreadNotificationsCount },
    { id: 'profile', label: 'Profil Saya', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-500 selection:text-white">
      {/* Top Notice Bar / Mode Indicator */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full px-2 sm:px-6">
          <span className="flex items-center gap-1.5 font-semibold text-blue-400">
            <GraduationCap className="w-4 h-4" />
            <span>TaskMate Web App</span>
          </span>
          <span className="hidden sm:inline-block text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            Sistem Manajemen Tugas Kuliah & Evaluasi Interaksi Mahasiswa
          </span>
        </div>

        <button
          onClick={toggleMobileFrame}
          className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-md text-[11px] font-semibold border border-slate-700 transition shrink-0"
          title={isMobileFrameEnabled ? 'Matikan mode simulator' : 'Beralih ke simulator smartphone'}
        >
          {isMobileFrameEnabled ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{isMobileFrameEnabled ? 'Buka Web Layar Penuh' : 'Mode Smartphone'}</span>
        </button>
      </div>

      {/* Main Container Split: Sidebar + Main Content */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 sticky top-0 h-[calc(100vh-33px)] shrink-0 justify-between">
          <div>
            {/* Logo Branding */}
            <div className="flex items-center gap-3 px-3 py-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/25">
                TM
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-none">
                  TaskMate
                </h1>
                <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-1">
                  Portal Mahasiswa
                </p>
              </div>
            </div>

            {/* Quick Add Task Button */}
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="w-full py-3 px-4 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Tugas Baru</span>
            </button>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer User Info */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.nim}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                <span>{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
              </button>

              <button
                onClick={logout}
                title="Keluar Akun"
                className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Web Navbar */}
          <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
            {/* Mobile Menu Toggle & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center gap-2">
                <div className="lg:hidden w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  TM
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white capitalize">
                    {activeTab === 'dashboard' && 'Beranda Utama'}
                    {activeTab === 'tasks' && 'Kelola Daftar Tugas'}
                    {activeTab === 'calendar' && 'Kalender Akademik & Deadline'}
                    {activeTab === 'stats' && 'Statistik & Analisis Belajar'}
                    {activeTab === 'subjects' && 'Daftar Mata Kuliah'}
                    {activeTab === 'notifications' && 'Pusat Notifikasi & Pengingat'}
                    {activeTab === 'profile' && 'Profil Mahasiswa'}
                  </h2>
                </div>
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Add Task Button (Visible on mobile/tablet header) */}
              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="lg:hidden px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah Tugas</span>
              </button>

              {/* Notifications Icon Button */}
              <button
                onClick={() => setActiveTab('notifications')}
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Pusat Notifikasi"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Profile Avatar Quick Switch */}
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover ring-2 ring-blue-500/30"
                />
                <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            </div>
          </header>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-2 animate-fade-in z-20">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl font-semibold text-sm transition ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-rose-600 font-bold text-xs p-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Aplikasi</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Body View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
