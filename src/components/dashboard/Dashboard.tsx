import React from 'react';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { TaskCard } from '../tasks/TaskCard';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { tasks, setActiveTab, setStatusFilter, setPriorityFilter } = useTask();
  const { user } = useAuth();

  // Task Statistics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'Belum Dikerjakan').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'Sedang Dikerjakan').length;
  const completedTasks = tasks.filter((t) => t.status === 'Selesai').length;

  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter Urgent Deadlines (< 3 days and not finished)
  const urgentTasks = tasks
    .filter((t) => t.status !== 'Selesai')
    .sort((a, b) => new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime())
    .slice(0, 2);

  // Filter High Priority tasks
  const highPriorityTasks = tasks
    .filter((t) => t.priority === 'Tinggi' && t.status !== 'Selesai')
    .slice(0, 2);

  return (
    <div className="p-2 sm:p-4 space-y-6 pb-8 animate-fade-in">
      {/* User Greeting & Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-blue-100 mb-2">
              <Award className="w-4 h-4 text-amber-300" />
              <span>{user.major} • Semester 7</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Halo, {user.name.split(' ')[0]} 👋</h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 font-medium max-w-md">
              Ada <strong className="text-white underline font-bold">{pendingTasks + inProgressTasks} tugas aktif</strong> yang membutuhkan perhatianmu minggu ini.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white/30 overflow-hidden shadow-lg shrink-0 hover:scale-105 transition"
          >
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          </button>
        </div>

        {/* Overall Completion Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 relative z-10">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-200" />
              Total Progress Perkuliahan
            </span>
            <span className="font-bold text-amber-300">{overallProgress}% Selesai</span>
          </div>
          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Ringkasan Status Tugas</h3>
          <button
            onClick={() => { setStatusFilter('Semua'); setActiveTab('tasks'); }}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua Tugas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Semua Tugas */}
          <div
            onClick={() => { setStatusFilter('Semua'); setActiveTab('tasks'); }}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Semua Tugas</span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">{totalTasks}</p>
          </div>

          {/* Belum Dikerjakan */}
          <div
            onClick={() => { setStatusFilter('Belum Dikerjakan'); setActiveTab('tasks'); }}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Belum Dikerjakan</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">{pendingTasks}</p>
          </div>

          {/* Sedang Dikerjakan */}
          <div
            onClick={() => { setStatusFilter('Sedang Dikerjakan'); setActiveTab('tasks'); }}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sedang Dikerjakan</span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">{inProgressTasks}</p>
          </div>

          {/* Selesai */}
          <div
            onClick={() => { setStatusFilter('Selesai'); setActiveTab('tasks'); }}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-400 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tugas Selesai</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">{completedTasks}</p>
          </div>
        </div>
      </div>

      {/* Two Column Grid for Desktop: Urgent Deadlines vs High Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Deadlines Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Deadline Terdekat</h3>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Lihat Kalender
            </button>
          </div>

          {urgentTasks.length > 0 ? (
            <div className="space-y-3">
              {urgentTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-500 font-medium">
              Tidak ada deadline mendesak saat ini. Bagus! 🎉
            </div>
          )}
        </div>

        {/* High Priority Tasks Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Tugas Prioritas Tinggi</h3>
            </div>
            <button
              onClick={() => { setPriorityFilter('Tinggi'); setActiveTab('tasks'); }}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Filter Prioritas
            </button>
          </div>

          {highPriorityTasks.length > 0 ? (
            <div className="space-y-3">
              {highPriorityTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-500 font-medium">
              Tidak ada tugas prioritas tinggi yang belum dikerjakan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
