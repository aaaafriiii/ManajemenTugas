export type TaskPriority = 'Rendah' | 'Sedang' | 'Tinggi';
export type TaskStatus = 'Belum Dikerjakan' | 'Sedang Dikerjakan' | 'Selesai';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  description: string;
  deadlineDate: string; // YYYY-MM-DD format
  deadlineTime: string; // HH:mm format
  priority: TaskPriority;
  status: TaskStatus;
  progress: number; // 0 - 100
  notes?: string;
  subtasks: SubTask[];
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  lecturer: string;
  color: string; // tailwind color token or hex
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'new' | 'reminder' | 'system';
  date: string;
  read: boolean;
  taskId?: string;
}

export interface UserProfile {
  name: string;
  nim: string;
  major: string;
  university: string;
  email: string;
  avatarUrl: string;
}

export type MainNavTab = 'dashboard' | 'tasks' | 'calendar' | 'stats' | 'profile';
export type SecondaryNavTab = 'subjects' | 'notifications';
export type ActiveTab = MainNavTab | SecondaryNavTab;
