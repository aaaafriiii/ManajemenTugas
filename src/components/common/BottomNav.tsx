import React from 'react';
import { useTask } from '../../context/TaskContext';
import { Home, CheckSquare, Calendar, BarChart3, User, Plus } from 'lucide-react';
import type { MainNavTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsAddTaskOpen } = useTask();

  const navItems: { id: MainNavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Beranda', icon: Home },
    { id: 'tasks', label: 'Tugas', icon: CheckSquare },
    { id: 'calendar', label: 'Kalender', icon: Calendar },
    { id: 'stats', label: 'Statistik', icon: BarChart3 },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-fade-in" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Floating Add Task Trigger */}
        <button
          onClick={() => setIsAddTaskOpen(true)}
          aria-label="Tambah Tugas"
          title="Tambah Tugas Baru"
          className="absolute -top-6 right-6 sm:right-8 w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </nav>
  );
};
