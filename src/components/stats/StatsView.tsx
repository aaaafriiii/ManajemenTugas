import React from 'react';
import { useTask } from '../../context/TaskContext';
import { BarChart3, TrendingUp, CheckCircle2, Clock, BookOpen, Award, Target } from 'lucide-react';

export const StatsView: React.FC = () => {
  const { tasks, courses } = useTask();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Selesai').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'Sedang Dikerjakan').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Belum Dikerjakan').length;

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Mock weekly activity completion numbers for chart (Senin - Minggu)
  const weeklyData = [
    { day: 'Sen', count: 2, label: '2 Tugas' },
    { day: 'Sel', count: 4, label: '4 Tugas' },
    { day: 'Rab', count: 1, label: '1 Tugas' },
    { day: 'Kam', count: 3, label: '3 Tugas' },
    { day: 'Jum', count: 5, label: '5 Tugas' },
    { day: 'Sab', count: 2, label: '2 Tugas' },
    { day: 'Min', count: 1, label: '1 Tugas' },
  ];

  const maxWeeklyCount = Math.max(...weeklyData.map((d) => d.count), 5);

  return (
    <div className="p-4 space-y-5 pb-10 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-blue-100 mb-2">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Indeks Performa Akademik</span>
            </div>
            <h2 className="text-xl font-black">Statistik Produktivitas</h2>
            <p className="text-xs text-blue-100 mt-1 max-w-xs">
              Pantau tingkat penyelesaian tugas dan konsistensi pengerjaan tugas kuliahmu.
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-amber-300">{completionPercentage}%</span>
            <span className="text-[10px] block text-blue-200 font-bold uppercase">Selesai</span>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Tugas */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Tugas</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalTasks}</p>
          <span className="text-[10px] text-slate-400 font-medium">Dari seluruh matkul</span>
        </div>

        {/* Tugas Selesai */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Tugas Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{completedTasks}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Tepat waktu</span>
        </div>

        {/* Belum Selesai */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Belum Selesai</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{pendingTasks + inProgressTasks}</p>
          <span className="text-[10px] text-amber-600 font-medium">Dalam proses</span>
        </div>

        {/* Target Mingguan */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Tingkat Ketepatan</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">100%</p>
          <span className="text-[10px] text-blue-600 font-medium">Bebas terlambat</span>
        </div>
      </div>

      {/* Weekly Completed Chart (Grafik Tugas Selesai Setiap Minggu) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Grafik Tugas Selesai Minggu Ini
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Senin - Minggu</span>
        </div>

        {/* SVG Custom Bar Chart */}
        <div className="h-40 flex items-end justify-between pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
          {weeklyData.map((item, idx) => {
            const heightPercent = Math.round((item.count / maxWeeklyCount) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-2 group flex-1">
                {/* Tooltip on hover */}
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600 transition">
                  {item.count}
                </span>

                {/* Bar */}
                <div className="w-7 h-28 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden flex items-end p-0.5">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-lg group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-500"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day label */}
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Completion Breakdown (Progress Berdasarkan Mata Kuliah) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Progress Per Mata Kuliah
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {courses.map((course) => {
            const courseTasks = tasks.filter((t) => t.courseId === course.id);
            const courseCompleted = courseTasks.filter((t) => t.status === 'Selesai').length;
            const percent =
              courseTasks.length > 0
                ? Math.round((courseCompleted / courseTasks.length) * 100)
                : 0;

            return (
              <div key={course.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{course.name}</span>
                  <span className="text-slate-500">{courseCompleted}/{courseTasks.length} ({percent}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
