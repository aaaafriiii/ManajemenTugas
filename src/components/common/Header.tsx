import React from 'react';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, Moon, Sun, BookOpen, Smartphone, Maximize2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, unreadNotificationsCount } = useTask();
  const { isDarkMode, toggleDarkMode, isMobileFrameEnabled, toggleMobileFrame } = useTheme();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'TaskMate';
      case 'tasks':
        return 'Daftar Tugas';
      case 'calendar':
        return 'Kalender Deadline';
      case 'stats':
        return 'Statistik & Progress';
      case 'profile':
        return 'Profil Student';
      case 'subjects':
        return 'Mata Kuliah';
      case 'notifications':
        return 'Pusat Notifikasi';
      default:
        return 'TaskMate';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 transition-colors">
      <div className="flex items-center justify-between">
        {/* Left Title / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-extrabold text-lg">
            TM
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
              {getTitle()}
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Manajemen Tugas Kuliah
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Quick Courses Link */}
          <button
            onClick={() => setActiveTab('subjects')}
            title="Kelola Mata Kuliah"
            className={`p-2 rounded-xl transition ${
              activeTab === 'subjects'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setActiveTab('notifications')}
            title="Notifikasi"
            className={`relative p-2 rounded-xl transition ${
              activeTab === 'notifications'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Frame Toggle Button (Desktop view only) */}
          <button
            onClick={toggleMobileFrame}
            title={isMobileFrameEnabled ? 'Beralih ke Layar Penuh' : 'Beralih ke Simulator Smartphone'}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {isMobileFrameEnabled ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{isMobileFrameEnabled ? 'Full' : 'Frame'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
