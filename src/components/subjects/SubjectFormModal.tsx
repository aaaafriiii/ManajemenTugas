import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { X, BookOpen } from 'lucide-react';

export const SubjectFormModal: React.FC = () => {
  const { isAddCourseOpen, setIsAddCourseOpen, addCourse } = useTask();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [color, setColor] = useState('bg-blue-500 text-white');

  const [error, setError] = useState('');

  if (!isAddCourseOpen) return null;

  const colorOptions = [
    { label: 'Biru', value: 'bg-blue-500 text-white' },
    { label: 'Indigo', value: 'bg-indigo-500 text-white' },
    { label: 'Emerald', value: 'bg-emerald-500 text-white' },
    { label: 'Purple', value: 'bg-purple-500 text-white' },
    { label: 'Amber', value: 'bg-amber-500 text-white' },
    { label: 'Rose', value: 'bg-rose-500 text-white' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !lecturer.trim()) {
      setError('Harap lengkapi semua bidang.');
      return;
    }

    addCourse({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      lecturer: lecturer.trim(),
      color,
    });

    setName('');
    setCode('');
    setLecturer('');
    setError('');
    setIsAddCourseOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Tambah Mata Kuliah Baru
            </h3>
          </div>
          <button
            onClick={() => setIsAddCourseOpen(false)}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Mata Kuliah
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kecerdasan Buatan"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kode Matkul
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="IF401"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white uppercase font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Warna Tema Card
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium"
              >
                {colorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="dark:bg-slate-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Dosen Pengampu
            </label>
            <input
              type="text"
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
              placeholder="Dr. Hendra Wijaya, M.T."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddCourseOpen(false)}
              className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
            >
              Simpan Matkul
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
