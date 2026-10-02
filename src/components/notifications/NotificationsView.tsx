import React from 'react';
import { useTask } from '../../context/TaskContext';
import { Bell, CheckCheck, Clock, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setSelectedTaskDetail, tasks } = useTask();

  const handleNotifClick = (notif: (typeof notifications)[0]) => {
    markNotificationRead(notif.id);
    if (notif.taskId) {
      const targetTask = tasks.find((t) => t.id === notif.taskId);
      if (targetTask) {
        setSelectedTaskDetail(targetTask);
      }
    }
  };

  return (
    <div className="p-4 space-y-4 pb-10 animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Pusat Notifikasi</h2>
            <p className="text-[11px] text-slate-500 font-medium">Pengingat deadline & aktivitas tugas</p>
          </div>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Tandai Dibaca</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-2.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 ${
                notif.read
                  ? 'bg-white dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  : 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-slate-900 dark:text-white shadow-soft'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon based on type */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.type === 'deadline'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : notif.type === 'new'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {notif.type === 'deadline' && <Clock className="w-4 h-4 stroke-[2.5]" />}
                  {notif.type === 'new' && <Sparkles className="w-4 h-4" />}
                  {notif.type === 'reminder' && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs leading-snug">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold block pt-0.5">
                    {notif.date}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <Bell className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-bold text-xs text-slate-700 dark:text-slate-300">Belum Ada Notifikasi</p>
        </div>
      )}
    </div>
  );
};
