import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { TaskCard } from '../tasks/TaskCard';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { tasks } = useTask();

  // Current viewed month state (Defaulting to September 2026 based on dummy data timeline)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 8, 1)); // 0-indexed month 8 = September
  const [selectedDayStr, setSelectedDayStr] = useState<string>('2026-09-30');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  // Helper calculation for month days grid
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Shift Monday as first day of week if preferred
  const startingOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map tasks to dates string e.g. "2026-09-30": Task[]
  const tasksByDate: { [key: string]: typeof tasks } = {};
  tasks.forEach((t) => {
    if (!tasksByDate[t.deadlineDate]) {
      tasksByDate[t.deadlineDate] = [];
    }
    tasksByDate[t.deadlineDate].push(t);
  });

  const selectedDateTasks = tasksByDate[selectedDayStr] || [];

  return (
    <div className="p-4 space-y-4 pb-10 animate-fade-in">
      {/* Month Navigation Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                {monthNames[month]} {year}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Pilih tanggal untuk melihat jadwal deadline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-2">
          <span>Sen</span>
          <span>Sel</span>
          <span>Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span>Sab</span>
          <span>Min</span>
        </div>

        {/* Month Grid Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty padding slots */}
          {Array.from({ length: startingOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-11 rounded-xl bg-transparent" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const formattedDayNum = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
            const formattedMonthNum = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
            const dateStr = `${year}-${formattedMonthNum}-${formattedDayNum}`;

            const hasTasks = tasksByDate[dateStr] && tasksByDate[dateStr].length > 0;
            const isSelected = selectedDayStr === dateStr;

            // Check if any high priority task on this date
            const hasHighPriority = hasTasks && tasksByDate[dateStr].some((t) => t.priority === 'Tinggi');

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDayStr(dateStr)}
                className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-500/30 scale-105 z-10'
                    : hasTasks
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-xs">{dayNum}</span>

                {/* Indicator Dots */}
                {hasTasks && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected
                          ? 'bg-white'
                          : hasHighPriority
                          ? 'bg-rose-500'
                          : 'bg-blue-600'
                      }`}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Tasks List Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Tugas Tanggal {selectedDayStr}</span>
          </h3>
          <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
            {selectedDateTasks.length} Tugas
          </span>
        </div>

        {selectedDateTasks.length > 0 ? (
          <div className="space-y-3">
            {selectedDateTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs text-slate-800 dark:text-white">Tidak Ada Deadline Hari Ini</p>
            <p className="text-[11px] text-slate-400">
              Hari ini tidak ada tenggat waktu pengumpulan tugas yang harus diselesaikan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
