import type { TaskPriority, TaskStatus } from '../types';

export const formatDateID = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const getDaysRemaining = (dateStr: string): { text: string; urgent: boolean; expired: boolean } => {
  if (!dateStr) return { text: '', urgent: false, expired: false };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { text: `Lewat ${Math.abs(diffDays)} hari`, urgent: true, expired: true };
  } else if (diffDays === 0) {
    return { text: 'Hari ini', urgent: true, expired: false };
  } else if (diffDays === 1) {
    return { text: 'Besok', urgent: true, expired: false };
  } else {
    return { text: `${diffDays} hari lagi`, urgent: diffDays <= 3, expired: false };
  }
};

export const getPriorityBadge = (priority: TaskPriority) => {
  switch (priority) {
    case 'Tinggi':
      return {
        label: 'Prioritas Tinggi',
        bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
        dotColor: 'bg-rose-500',
      };
    case 'Sedang':
      return {
        label: 'Prioritas Sedang',
        bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
        dotColor: 'bg-amber-500',
      };
    case 'Rendah':
      return {
        label: 'Prioritas Rendah',
        bg: 'bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800',
        dotColor: 'bg-sky-500',
      };
  }
};

export const getStatusBadge = (status: TaskStatus) => {
  switch (status) {
    case 'Belum Dikerjakan':
      return {
        label: 'Belum Dikerjakan',
        bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
        iconColor: 'text-slate-500',
      };
    case 'Sedang Dikerjakan':
      return {
        label: 'Sedang Dikerjakan',
        bg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-500',
      };
    case 'Selesai':
      return {
        label: 'Selesai',
        bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
        iconColor: 'text-emerald-500',
      };
  }
};
