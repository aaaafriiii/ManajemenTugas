import React from 'react';
import { useTask } from '../../context/TaskContext';
import { getPriorityBadge, getStatusBadge, getDaysRemaining, formatDateID } from '../../utils/formatters';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Edit,
  Trash2,
  ListChecks,
  FileText,
  BookOpen,
} from 'lucide-react';

export const TaskDetailModal: React.FC = () => {
  const {
    selectedTaskDetail,
    setSelectedTaskDetail,
    setSelectedTaskEdit,
    deleteTask,
    toggleTaskStatus,
    toggleSubtask,
  } = useTask();

  if (!selectedTaskDetail) return null;

  const task = selectedTaskDetail;
  const priorityInfo = getPriorityBadge(task.priority);
  const statusInfo = getStatusBadge(task.status);
  const daysInfo = getDaysRemaining(task.deadlineDate);

  const handleEdit = () => {
    setSelectedTaskEdit(task);
    setSelectedTaskDetail(null);
  };

  const handleDelete = () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus tugas "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Modal Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {task.courseName}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${priorityInfo.bg}`}>
              {task.priority}
            </span>
          </div>
          <button
            onClick={() => setSelectedTaskDetail(null)}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 no-scrollbar">
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {task.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${statusInfo.bg}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {task.status}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDateID(task.deadlineDate)} ({task.deadlineTime || '23:59'})
              </span>
              <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                daysInfo.urgent ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                {daysInfo.text}
              </span>
            </div>
          </div>

          {/* Progress Bar & Slider */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">Progress Pengerjaan</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{task.progress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Deskripsi Tugas
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl whitespace-pre-line">
                {task.description}
              </p>
            </div>
          )}

          {/* Interactive Checklist Subtasks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-blue-500" />
                <span>Checklist Sub-tugas ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})</span>
              </h4>
            </div>

            {task.subtasks.length > 0 ? (
              <div className="space-y-1.5">
                {task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => toggleSubtask(task.id, st.id)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 pointer-events-none cursor-pointer"
                    />
                    <span className={`text-xs font-medium ${
                      st.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-center text-xs text-slate-400 italic">
                Belum ada sub-tugas rincian. Edit tugas untuk membuat checklist.
              </div>
            )}
          </div>

          {/* Notes / Catatan Tambahan */}
          {task.notes && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Catatan Tambahan</span>
              </h4>
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                {task.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-2">
          {/* Status Toggle Primary Button */}
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition ${
              task.status === 'Selesai'
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{task.status === 'Selesai' ? 'Batal Selesai' : 'Tandai Selesai'}</span>
          </button>

          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <Edit className="w-4 h-4 text-blue-500" />
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="p-3 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
