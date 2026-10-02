import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  accentColor: string;
  badge: string;
}

export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: 'Kelola Semua Tugasmu',
      subtitle: 'Semua Matkul Terorganisir',
      description: 'Catat tugas kuliah dari berbagai mata kuliah dalam satu tempat yang rapi, terstruktur, dan mudah diakses kapan saja.',
      icon: Calendar,
      accentColor: 'from-blue-500 to-indigo-600',
      badge: 'Manajemen Terpusat',
    },
    {
      id: 2,
      title: 'Jangan Lewatkan Deadline',
      subtitle: 'Pengingat Waktu Akurat',
      description: 'Pantau sisa waktu pengerjaan tugas dengan indikator visual dan notifikasi pengingat sebelum waktu pengumpulan berakhir.',
      icon: Clock,
      accentColor: 'from-amber-500 to-rose-600',
      badge: 'Prioritas & Urgensi',
    },
    {
      id: 3,
      title: 'Selesaikan Tugas Tepat Waktu',
      subtitle: 'Tingkatkan Nilai Akademik',
      description: 'Atur jadwal pengerjaan, pantau progress harian, dan capai target akademikmu tanpa panik di menit-menit terakhir.',
      icon: CheckCircle2,
      accentColor: 'from-emerald-500 to-teal-600',
      badge: 'Produktivitas Mahasiswa',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const activeSlide = slides[currentSlide];
  const IconComponent = activeSlide.icon;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background Glow Deco */}
      <div className="absolute top-10 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Controls */}
      <div className="flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            TM
          </div>
          <span className="font-bold tracking-tight text-slate-200">TaskMate</span>
        </div>
        <button
          onClick={handleSkip}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          Lewati
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="my-auto py-8 z-10 flex flex-col items-center text-center animate-fade-in key={currentSlide}">
        {/* Graphic Illustration Card */}
        <div className="relative mb-8">
          <div className={`w-36 h-36 rounded-3xl bg-gradient-to-tr ${activeSlide.accentColor} flex items-center justify-center shadow-2xl shadow-blue-500/20 transform hover:scale-105 transition duration-300`}>
            <IconComponent className="w-20 h-20 text-white stroke-[1.8]" />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-blue-300 shadow-md">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{activeSlide.badge}</span>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2 max-w-xs">
          {activeSlide.title}
        </h2>
        <p className="text-xs font-semibold text-blue-400 mb-4 tracking-wide uppercase">
          {activeSlide.subtitle}
        </p>
        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
          {activeSlide.description}
        </p>
      </div>

      {/* Bottom Navigation & Action */}
      <div className="z-10 pb-4 flex flex-col gap-6">
        {/* Indicator Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-blue-500'
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition duration-200 active:scale-[0.99]"
        >
          <span>{currentSlide === slides.length - 1 ? 'Mulai Sekarang' : 'Lanjut'}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
