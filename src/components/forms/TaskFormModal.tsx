import React, { useState, useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import type { TaskPriority, TaskStatus } from '../../types';
import { X, Plus, Trash2, Calendar, Clock, BookOpen, Sparkles } from 'lucide-react';

export const TaskFormModal: React.FC = () => {
  const {
    isAddTaskOpen,
    setIsAddTaskOpen,
    selectedTaskEdit,
    setSelectedTaskEdit,
    courses,
    addTask,
    updateTask,
    setIsAddCourseOpen,
  } = useTask();

  const isOpen = isAddTaskOpen || !!selectedTaskEdit;

  // Form Fields
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [description, setDescription] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('23:59');
  const [priority, setPriority] = useState<TaskPriority>('Sedang');
  const [status, setStatus] = useState<TaskStatus>('Belum Dikerjakan');
  const [notes, setNotes] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Form Errors
  const [errors, setErrors] = useState<{ title?: string; courseId?: string; deadlineDate?: string }>({});

  useEffect(() => {
    if (selectedTaskEdit) {
      setTitle(selectedTaskEdit.title);
      setCourseId(selectedTaskEdit.courseId);
      setDescription(selectedTaskEdit.description || '');
      setDeadlineDate(selectedTaskEdit.deadlineDate);
      setDeadlineTime(selectedTaskEdit.deadlineTime || '23:59');
      setPriority(selectedTaskEdit.priority);
      setStatus(selectedTaskEdit.status);
      setNotes(selectedTaskEdit.notes || '');
      setSubtasks(selectedTaskEdit.subtasks || []);
    } else {
      // Reset form
      setTitle('');
      setCourseId(courses[0]?.id || '');
      setDescription('');
      
      // Default deadline to 3 days from today
      const d = new Date();
      d.setDate(d.getDate() + 3);
      setDeadlineDate(d.toISOString().split('T')[0]);
      setDeadlineTime('23:59');
      
      setPriority('Sedang');
      setStatus('Belum Dikerjakan');
      setNotes('');
      setSubtasks([]);
    }
    setErrors({});
  }, [selectedTaskEdit, isAddTaskOpen, courses]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsAddTaskOpen(false);
    setSelectedTaskEdit(null);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: 'st_' + Date.now(), title: newSubtaskTitle.trim(), completed: false },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const validate = (): boolean => {
    const newErrors: { title?: string; courseId?: string; deadlineDate?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Nama tugas wajib diisi.';
    }
    if (!courseId) {
      newErrors.courseId = 'Silakan pilih mata kuliah.';
    }
    if (!deadlineDate) {
      newErrors.deadlineDate = 'Tanggal deadline wajib dipilih.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedCourse = courses.find((c) => c.id === courseId);
    const courseName = selectedCourse ? selectedCourse.name : 'Umum';

    const completedCount = subtasks.filter((s) => s.completed).length;
    const computedProgress =
      subtasks.length > 0
        ? Math.round((completedCount / subtasks.length) * 100)
        : status === 'Selesai'
        ? 100
        : status === 'Sedang Dikerjakan'
        ? 50
        : 0;

    if (selectedTaskEdit) {
      updateTask(selectedTaskEdit.id, {
        title: title.trim(),
        courseId,
        courseName,
        description: description.trim(),
        deadlineDate,
        deadlineTime,
        priority,
        status,
        progress: computedProgress,
        notes: notes.trim(),
        subtasks,
      });
    } else {
      addTask({
        title: title.trim(),
        courseId,
        courseName,
        description: description.trim(),
        deadlineDate,
        deadlineTime,
        priority,
        status,
        progress: computedProgress,
        notes: notes.trim(),
        subtasks,
      });
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Modal Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {selectedTaskEdit ? 'Edit Tugas Kuliah' : 'Tambah Tugas Baru'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs no-scrollbar">
          {/* Task Name */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Tugas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Laporan Analisis UX Shopee"
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border ${
                errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.title}</p>}
          </div>

          {/* Course Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Mata Kuliah <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsAddCourseOpen(true)}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Tambah Matkul Baru
              </button>
            </div>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border ${
                  errors.courseId ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium`}
              >
                <option value="">-- Pilih Mata Kuliah --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-slate-900">
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
            {errors.courseId && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.courseId}</p>}
          </div>

          {/* Deadline Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Deadline <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border ${
                    errors.deadlineDate ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white`}
                />
              </div>
              {errors.deadlineDate && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.deadlineDate}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Waktu Jam
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              >
                <option value="Rendah" className="dark:bg-slate-900">Rendah</option>
                <option value="Sedang" className="dark:bg-slate-900">Sedang</option>
                <option value="Tinggi" className="dark:bg-slate-900">Tinggi (Urgent)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status Initial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              >
                <option value="Belum Dikerjakan" className="dark:bg-slate-900">Belum Dikerjakan</option>
                <option value="Sedang Dikerjakan" className="dark:bg-slate-900">Sedang Dikerjakan</option>
                <option value="Selesai" className="dark:bg-slate-900">Selesai</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi Instuksi Tugas
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail instruksi tugas dari dosen..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none"
            />
          </div>

          {/* Checklist Subtasks Builder */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Checklist Sub-tugas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                placeholder="Tambah item checklist (e.g. Buat wireframe)..."
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs transition"
              >
                + Tambah
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => {
                          setSubtasks(subtasks.map(item => item.id === st.id ? { ...item, completed: !item.completed } : item));
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={st.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                        {st.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes / Catatan Extra */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Catatan Tambahan (URL / Format File)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Format file PDF max 10MB di LMS Kampus"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition active:scale-95"
            >
              {selectedTaskEdit ? 'Simpan Perubahan' : 'Simpan Tugas Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
