import React from 'react';
import { useTask } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Search, Filter, BookOpen, Plus, AlertCircle, X } from 'lucide-react';

export const TaskList: React.FC = () => {
  const {
    tasks,
    courses,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    courseFilter,
    setCourseFilter,
    setIsAddTaskOpen,
  } = useTask();

  const statusOptions = ['Semua', 'Belum Selesai', 'Sedang Dikerjakan', 'Selesai'];

  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'Belum Selesai') {
      matchesStatus = task.status !== 'Selesai';
    } else if (statusFilter === 'Sedang Dikerjakan') {
      matchesStatus = task.status === 'Sedang Dikerjakan';
    } else if (statusFilter === 'Selesai') {
      matchesStatus = task.status === 'Selesai';
    }

    // Priority filter
    let matchesPriority = true;
    if (priorityFilter !== 'Semua') {
      matchesPriority = task.priority === priorityFilter;
    }

    // Course filter
    let matchesCourse = true;
    if (courseFilter !== 'Semua') {
      matchesCourse = task.courseId === courseFilter;
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesCourse;
  });

  return (
    <div className="p-4 space-y-4 pb-10 animate-fade-in">
      {/* Header & Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tugas atau mata kuliah..."
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white shadow-soft"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {statusOptions.map((opt) => {
            const isActive = statusFilter === opt;
            return (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters Dropdown Row (Course & Priority) */}
        <div className="flex items-center gap-2">
          {/* Priority Filter */}
          <div className="flex-1 flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-xs font-medium cursor-pointer"
            >
              <option value="Semua" className="dark:bg-slate-900">Prioritas: Semua</option>
              <option value="Tinggi" className="dark:bg-slate-900">Prioritas Tinggi</option>
              <option value="Sedang" className="dark:bg-slate-900">Prioritas Sedang</option>
              <option value="Rendah" className="dark:bg-slate-900">Prioritas Rendah</option>
            </select>
          </div>

          {/* Course Filter */}
          <div className="flex-1 flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-xs font-medium truncate cursor-pointer"
            >
              <option value="Semua" className="dark:bg-slate-900">Matkul: Semua</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id} className="dark:bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List Items Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>Menampilkan <strong>{filteredTasks.length}</strong> tugas</span>
        {(searchQuery || statusFilter !== 'Semua' || priorityFilter !== 'Semua' || courseFilter !== 'Semua') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('Semua');
              setPriorityFilter('Semua');
              setCourseFilter('Semua');
            }}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Task Cards List */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white">Tugas Tidak Ditemukan</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Tidak ada tugas yang sesuai dengan kriteria pencarian atau filter yang kamu pilih.
          </p>
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tugas Baru</span>
          </button>
        </div>
      )}
    </div>
  );
};
