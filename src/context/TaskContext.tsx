import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Task, Course, NotificationItem, ActiveTab, TaskStatus } from '../types';
import { INITIAL_TASKS, INITIAL_COURSES, INITIAL_NOTIFICATIONS } from '../data/initialData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  text: string;
}

interface TaskContextType {
  tasks: Task[];
  courses: Course[];
  notifications: NotificationItem[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string; // 'Semua' | 'Belum Selesai' | 'Sedang Dikerjakan' | 'Selesai'
  setStatusFilter: (filter: string) => void;
  priorityFilter: string; // 'Semua' | 'Tinggi' | 'Sedang' | 'Rendah'
  setPriorityFilter: (filter: string) => void;
  courseFilter: string; // 'Semua' | courseId
  setCourseFilter: (courseId: string) => void;

  // Task Actions
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, taskData: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string, status?: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // Course Actions
  addCourse: (courseData: Omit<Course, 'id'>) => void;
  deleteCourse: (id: string) => void;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Modal & Selection state
  selectedTaskDetail: Task | null;
  setSelectedTaskDetail: (task: Task | null) => void;
  selectedTaskEdit: Task | null;
  setSelectedTaskEdit: (task: Task | null) => void;
  isAddTaskOpen: boolean;
  setIsAddTaskOpen: (open: boolean) => void;
  isAddCourseOpen: boolean;
  setIsAddCourseOpen: (open: boolean) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  removeToast: (id: string) => void;

  // Reset
  resetAllData: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskmate_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('taskmate_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('taskmate_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [priorityFilter, setPriorityFilter] = useState('Semua');
  const [courseFilter, setCourseFilter] = useState('Semua');

  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);
  const [selectedTaskEdit, setSelectedTaskEdit] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('taskmate_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskmate_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('taskmate_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' | 'danger' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Tugas berhasil ditambahkan! ✨', 'success');

    // Add notification
    const newNotif: NotificationItem = {
      id: 'n_' + Date.now(),
      title: 'Tugas Baru Dibuat 📝',
      message: `Tugas "${newTask.title}" telah ditambahkan ke jadwal.`,
      type: 'new',
      date: 'Baru saja',
      read: false,
      taskId: newTask.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...taskData } : t))
    );
    if (selectedTaskDetail && selectedTaskDetail.id === id) {
      setSelectedTaskDetail((prev) => (prev ? { ...prev, ...taskData } : null));
    }
    showToast('Tugas berhasil diperbarui! 👍', 'info');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTaskDetail?.id === id) setSelectedTaskDetail(null);
    showToast('Tugas telah dihapus', 'warning');
  };

  const toggleTaskStatus = (id: string, targetStatus?: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        let nextStatus: TaskStatus = targetStatus || t.status;
        if (!targetStatus) {
          if (t.status === 'Belum Dikerjakan') nextStatus = 'Sedang Dikerjakan';
          else if (t.status === 'Sedang Dikerjakan') nextStatus = 'Selesai';
          else nextStatus = 'Belum Dikerjakan';
        }
        const nextProgress = nextStatus === 'Selesai' ? 100 : nextStatus === 'Belum Dikerjakan' ? 0 : Math.max(t.progress, 50);
        
        // Auto update subtasks if completed
        const updatedSubtasks = t.subtasks.map(st => ({ ...st, completed: nextStatus === 'Selesai' }));

        const updated = {
          ...t,
          status: nextStatus,
          progress: nextProgress,
          subtasks: updatedSubtasks,
        };

        if (selectedTaskDetail?.id === id) {
          setSelectedTaskDetail(updated);
        }
        return updated;
      })
    );
    showToast('Status tugas diperbarui', 'info');
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const completedCount = updatedSubtasks.filter((st) => st.completed).length;
        const newProgress = updatedSubtasks.length > 0 ? Math.round((completedCount / updatedSubtasks.length) * 100) : t.progress;
        
        let newStatus: TaskStatus = t.status;
        if (newProgress === 100) newStatus = 'Selesai';
        else if (newProgress > 0 && t.status === 'Belum Dikerjakan') newStatus = 'Sedang Dikerjakan';

        const updated = {
          ...t,
          subtasks: updatedSubtasks,
          progress: newProgress,
          status: newStatus,
        };

        if (selectedTaskDetail?.id === taskId) {
          setSelectedTaskDetail(updated);
        }

        return updated;
      })
    );
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: 'c_' + Date.now(),
    };
    setCourses((prev) => [...prev, newCourse]);
    showToast(`Mata kuliah ${newCourse.name} berhasil ditambahkan`, 'success');
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast('Mata kuliah dihapus', 'warning');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Semua notifikasi ditandai dibaca', 'info');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const resetAllData = () => {
    setTasks(INITIAL_TASKS);
    setCourses(INITIAL_COURSES);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem('taskmate_tasks');
    localStorage.removeItem('taskmate_courses');
    localStorage.removeItem('taskmate_notifications');
    showToast('Data aplikasi berhasil di-reset ke versi awal', 'info');
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        courses,
        notifications,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        courseFilter,
        setCourseFilter,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        toggleSubtask,
        addCourse,
        deleteCourse,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        selectedTaskDetail,
        setSelectedTaskDetail,
        selectedTaskEdit,
        setSelectedTaskEdit,
        isAddTaskOpen,
        setIsAddTaskOpen,
        isAddCourseOpen,
        setIsAddCourseOpen,
        toasts,
        showToast,
        removeToast,
        resetAllData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within TaskProvider');
  return context;
};
