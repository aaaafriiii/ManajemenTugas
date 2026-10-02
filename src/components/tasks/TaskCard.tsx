import React from 'react';
import type { Task } from '../../types';
import { useTask } from '../../context/TaskContext';
import { getDaysRemaining, getPriorityBadge, getStatusBadge, formatDateID } from '../../utils/formatters';
import { Clock, CheckCircle2, ChevronRight, ListChecks, Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { setSelectedTaskDetail, toggleTaskStatus } = useTask();
  const priorityInfo = getPriorityBadge(task.priority);
  const statusInfo = getStatusBadge(task.status);
  const daysInfo = getDaysRemaining(task.deadlineDate);

  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div
      onClick={() => setSelectedTaskDetail(task)}
      className="group bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-soft-lg hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200 cursor-pointer relative overflow-hidden"
    >
      {/* Urgency Color Top Bar Accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          task.status === 'Selesai'
            ? 'bg-emerald-500'
            : daysInfo.urgent
            ? 'bg-rose-500'
            : 'bg-blue-500'
        }`}
      />

      <div className="flex items-start justify-between gap-3 pt-1">
        {/* Course Tag & Priority */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-semibold text-[11px]">
            {task.courseName}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${priorityInfo.bg}`}>
            {task.priority}
          </span>
        </div>

        {/* Quick Status Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskStatus(task.id);
          }}
          title={`Ubah Status: ${statusInfo.label}`}
          className={`p-1.5 rounded-xl transition ${
            task.status === 'Selesai'
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 hover:bg-emerald-200'
              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600'
          }`}
        >
          <CheckCircle2 className={`w-5 h-5 ${task.status === 'Selesai' ? 'fill-emerald-500 text-white' : ''}`} />
        </button>
      </div>

      {/* Task Title */}
      <h3 className={`mt-2.5 text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
        task.status === 'Selesai' ? 'line-through text-slate-400 dark:text-slate-500' : ''
      }`}>
        {task.title}
      </h3>

      {/* Subtasks summary preview */}
      {totalSubtasks > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <ListChecks className="w-3.5 h-3.5 text-blue-500" />
          <span>Checklist: <strong>{completedSubtasks}/{totalSubtasks}</strong> sub-tugas selesai</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">{task.progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              task.status === 'Selesai'
                ? 'bg-emerald-500'
                : task.progress > 50
                ? 'bg-blue-600'
                : 'bg-indigo-500'
            }`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      {/* Footer Info: Deadline & Arrow */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {/* Deadline Date */}
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDateID(task.deadlineDate)}</span>
          </div>

          {/* Days Remaining Pill */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            daysInfo.expired
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
              : daysInfo.urgent
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            <Clock className="w-3 h-3 stroke-[2.5]" />
            <span>{daysInfo.text}</span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};
