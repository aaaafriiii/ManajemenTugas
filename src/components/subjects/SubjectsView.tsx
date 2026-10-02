import React from 'react';
import { useTask } from '../../context/TaskContext';
import { BookOpen, Plus, User, Trash2, ArrowRight } from 'lucide-react';

export const SubjectsView: React.FC = () => {
  const { courses, tasks, setCourseFilter, setActiveTab, setIsAddCourseOpen, deleteCourse } = useTask();

  return (
    <div className="p-4 space-y-4 pb-10 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-500/30">
              Semester Genap 2026
            </span>
            <h2 className="text-xl font-bold mt-2">Mata Kuliah Aktif</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Kelola daftar mata kuliah dan pantau progress penyelesaian tugas per semester.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <BookOpen className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Action Add Button */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Daftar Matkul ({courses.length})
        </h3>
        <button
          onClick={() => setIsAddCourseOpen(true)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Matkul</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-3">
        {courses.map((course) => {
          const courseTasks = tasks.filter((t) => t.courseId === course.id);
          const completedCourseTasks = courseTasks.filter((t) => t.status === 'Selesai');
          const courseProgress =
            courseTasks.length > 0
              ? Math.round((completedCourseTasks.length / courseTasks.length) * 100)
              : 0;

          return (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md transition space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${course.color || 'bg-blue-600 text-white'}`}>
                    {course.code.substring(0, 3)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {course.code}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {course.name}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Hapus mata kuliah "${course.name}"?`)) {
                      deleteCourse(course.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Lecturer Info */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Dosen: <strong>{course.lecturer}</strong></span>
              </div>

              {/* Progress & Task Stats */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span>Progress Tugas ({completedCourseTasks.length}/{courseTasks.length} Selesai)</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{courseProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>
              </div>

              {/* View Tasks Trigger */}
              <button
                onClick={() => {
                  setCourseFilter(course.id);
                  setActiveTab('tasks');
                }}
                className="w-full pt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline border-t border-slate-100 dark:border-slate-800/80"
              >
                <span>Lihat {courseTasks.length} Tugas Kuliah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
