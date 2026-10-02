import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  Sparkles,
  BookOpen,
  Calendar,
  TrendingUp,
  RefreshCw,
  Sun,
  Moon,
  Smartphone,
  Maximize2,
} from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

export const AuthScreen: React.FC = () => {
  const { login, register, forgotPassword, resetPassword } = useAuth();
  const { isDarkMode, toggleDarkMode, isMobileFrameEnabled, toggleMobileFrame } = useTheme();

  const [mode, setMode] = useState<AuthMode>('login');

  // Form input states
  const [email, setEmail] = useState('achmad.syahputra@student.ac.id');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Register extra fields
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [major, setMajor] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password & reset fields
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [generatedDemoCode, setGeneratedDemoCode] = useState<string | null>(null);

  // UI status feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Resend timer countdown effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const clearAlerts = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    clearAlerts();
    setMode(newMode);
  };

  // Quick Demo Account Auto-Fill
  const handleQuickDemo = (userEmail: string) => {
    clearAlerts();
    setEmail(userEmail);
    setPassword('password123');
    setMode('login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          setErrorMsg('Harap isi email dan kata sandi Anda.');
          setLoading(false);
          return;
        }
        const res = login(email, password);
        if (!res.success) {
          setErrorMsg(res.message);
        }
      } else if (mode === 'register') {
        if (!name.trim() || !email.trim() || !nim.trim() || !major.trim() || !password) {
          setErrorMsg('Harap lengkapi seluruh formulir pendaftaran.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Konfirmasi kata sandi tidak cocok.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Kata sandi minimal 6 karakter.');
          setLoading(false);
          return;
        }
        if (!agreeTerms) {
          setErrorMsg('Anda harus menyetujui Ketentuan Layanan.');
          setLoading(false);
          return;
        }

        const res = register(name, email, nim, major, password);
        if (!res.success) {
          setErrorMsg(res.message);
        } else {
          setSuccessMsg(res.message);
        }
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setErrorMsg('Harap masukkan alamat email mahasiswa/dosen Anda.');
          setLoading(false);
          return;
        }
        const res = forgotPassword(email);
        if (!res.success) {
          setErrorMsg(res.message);
        } else {
          setSuccessMsg(res.message);
          setGeneratedDemoCode(res.resetCode || '123456');
          setResetCode(res.resetCode || '123456');
          setResendTimer(60);
          setMode('reset');
        }
      } else if (mode === 'reset') {
        if (!resetCode.trim()) {
          setErrorMsg('Harap masukkan 6 digit kode pemulihan.');
          setLoading(false);
          return;
        }
        if (!newPassword || newPassword.length < 6) {
          setErrorMsg('Kata sandi baru minimal 6 karakter.');
          setLoading(false);
          return;
        }
        const res = resetPassword(email, resetCode, newPassword);
        if (!res.success) {
          setErrorMsg(res.message);
        } else {
          setSuccessMsg(res.message);
          setPassword(newPassword);
          setTimeout(() => {
            setMode('login');
          }, 1500);
        }
      }
      setLoading(false);
    }, 400);
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'Lemah', color: 'bg-rose-500' };
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { score: 3, label: 'Kuat', color: 'bg-emerald-500' };
    }
    return { score: 2, label: 'Sedang', color: 'bg-amber-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden transition-colors selection:bg-blue-500 selection:text-white">
      {/* Background Decorative Gradients & Grid */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">
            TM
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white block leading-none">TaskMate</span>
            <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">Portal Web Akademik</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={toggleMobileFrame}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {isMobileFrameEnabled ? <Maximize2 className="w-4 h-4 text-blue-400" /> : <Smartphone className="w-4 h-4 text-blue-400" />}
            <span>{isMobileFrameEnabled ? 'Layar Penuh' : 'Mode Mobile'}</span>
          </button>
        </div>
      </header>

      {/* Main Split Content Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Side (Desktop Presentation Showcase) */}
          <div className="hidden lg:block lg:col-span-6 space-y-8 pr-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>Platform Manajemen Tugas Kuliah #1</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Kelola Tugas & Deadline <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-300 bg-clip-text text-transparent">
                Lebih Efisien & Tepat Waktu
              </span>
            </h1>

            <p className="text-slate-300 text-sm xl:text-base leading-relaxed max-w-lg">
              Solusi terpadu mahasiswa untuk mengatur jadwal kuliah, prioritas tugas, pengingat deadline otomatis, dan analisis statistik kemajuan akademik dalam satu platform modern.
            </p>

            {/* Feature Badges Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-lg pt-2">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Manajemen Tugas</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Filter status, prioritas, & sub-tugas interaktif</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Kalender Deadline</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tampilan kalender & hitung mundur otomatis</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Visual Analytics</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Grafik statistik penyelesaian tugas</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Keamanan Kampus</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Autentikasi akun NIM & SSO Mahasiswa</p>
                </div>
              </div>
            </div>

            {/* Testimonial / Counter Pill */}
            <div className="pt-2 flex items-center gap-6">
              <div>
                <span className="text-2xl font-black text-white">99.8%</span>
                <span className="text-xs text-slate-400 block font-medium">Pengumpulan Tepat Waktu</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-2xl font-black text-white">12,500+</span>
                <span className="text-xs text-slate-400 block font-medium">Tugas Selesai Terorganisir</span>
              </div>
            </div>
          </div>

          {/* Right Side (Auth Forms Card Container) */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/50 relative overflow-hidden">
              
              {/* Form Navigation Tabs */}
              <div className="flex items-center justify-between p-1 bg-slate-900/80 rounded-2xl border border-slate-700/50 mb-6">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                    mode === 'login'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Masuk Akun
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                    mode === 'register'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Daftar Baru
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('forgot')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                    mode === 'forgot' || mode === 'reset'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Lupa Sandi
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-6">
                <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  {mode === 'login' && 'Selamat Datang Kembali! 👋'}
                  {mode === 'register' && 'Pendaftaran Akun Mahasiswa 🎓'}
                  {mode === 'forgot' && 'Reset Kata Sandi 🔒'}
                  {mode === 'reset' && 'Buat Kata Sandi Baru 🔑'}
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {mode === 'login' && 'Masukkan alamat email & kata sandi akun portal Anda.'}
                  {mode === 'register' && 'Lengkapi identitas diri Anda untuk membuat akun TaskMate baru.'}
                  {mode === 'forgot' && 'Masukkan email terdaftar untuk menerima instruksi kode pemulihan.'}
                  {mode === 'reset' && 'Masukkan kode pemulihan 6-digit & kata sandi baru Anda.'}
                </p>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Alert */}
              {successMsg && (
                <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Active Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* REGISTER FIELDS: Name, NIM, Major */}
                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Nama Lengkap Mahasiswa
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Contoh: Achmad Syahputra"
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          NIM / NIDN
                        </label>
                        <input
                          type="text"
                          value={nim}
                          onChange={(e) => setNim(e.target.value)}
                          placeholder="210401012"
                          className="w-full px-3.5 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Program Studi
                        </label>
                        <div className="relative">
                          <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            placeholder="Teknik Informatika"
                            className="w-full pl-9 pr-3 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* COMMON EMAIL FIELD */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Alamat Email Kampus / Personal
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mahasiswa@student.ac.id"
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                      required
                    />
                  </div>
                </div>

                {/* RESET STEP: Reset Code & New Password */}
                {mode === 'reset' && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          Kode Pemulihan (6 Digit)
                        </label>
                        {generatedDemoCode && (
                          <span className="text-[11px] text-emerald-400 font-mono font-bold">
                            Pin Simulasi: {generatedDemoCode}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          placeholder="Masukkan 6-digit kode pin"
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono tracking-wider"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* LOGIN & REGISTER PASSWORD FIELDS */}
                {(mode === 'login' || mode === 'register') && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Kata Sandi
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => handleSwitchMode('forgot')}
                          className="text-xs font-bold text-blue-400 hover:underline"
                        >
                          Lupa Kata Sandi?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Bar for Register */}
                    {mode === 'register' && password && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden flex gap-1">
                          <div className={`h-full flex-1 ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-700'}`} />
                          <div className={`h-full flex-1 ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-700'}`} />
                          <div className={`h-full flex-1 ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-700'}`} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{passwordStrength.label}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* REGISTER: CONFIRM PASSWORD */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* LOGIN: REMEMBER ME CHECKBOX */}
                {mode === 'login' && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Ingat sesi login saya</span>
                    </label>
                  </div>
                )}

                {/* REGISTER: TERMS CHECKBOX */}
                {mode === 'register' && (
                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300 font-medium leading-tight">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500 shrink-0 mt-0.5"
                      />
                      <span>
                        Saya menyetujui <span className="text-blue-400 underline">Ketentuan Layanan</span> &{' '}
                        <span className="text-blue-400 underline">Kebijakan Privasi</span> Mahasiswa.
                      </span>
                    </label>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition duration-200 active:scale-[0.99] disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>
                        {mode === 'login' && 'Masuk Akun Portal'}
                        {mode === 'register' && 'Daftar Akun Mahasiswa'}
                        {mode === 'forgot' && 'Kirim Kode Pemulihan'}
                        {mode === 'reset' && 'Simpan Kata Sandi Baru'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* QUICK DEMO ACCOUNTS STRIP */}
              {mode === 'login' && (
                <div className="mt-6 pt-5 border-t border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      Quick Access Demo Accounts:
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('achmad.syahputra@student.ac.id')}
                      className="p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 rounded-xl text-left transition flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                        M1
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">Achmad Syahputra</p>
                        <p className="text-[10px] text-slate-400 truncate">Mahasiswa (Informatika)</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemo('siti.aminah@student.ac.id')}
                      className="p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 rounded-xl text-left transition flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                        M2
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">Siti Aminah</p>
                        <p className="text-[10px] text-slate-400 truncate">Mahasiswa (Sistem Info)</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* FOOTER SWITCHER */}
              <div className="mt-6 text-center text-xs text-slate-400">
                {mode === 'login' && (
                  <p>
                    Belum memiliki akun mahasiswa?{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('register')}
                      className="font-bold text-blue-400 hover:underline"
                    >
                      Daftar Akun Baru Di Sini
                    </button>
                  </p>
                )}
                {mode === 'register' && (
                  <p>
                    Sudah terdaftar sebelumnya?{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('login')}
                      className="font-bold text-blue-400 hover:underline"
                    >
                      Masuk ke Akun Anda
                    </button>
                  </p>
                )}
                {(mode === 'forgot' || mode === 'reset') && (
                  <p>
                    Sudah ingat kata sandi Anda?{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('login')}
                      className="font-bold text-blue-400 hover:underline"
                    >
                      Kembali ke Halaman Login
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-800/60">
        &copy; {new Date().getFullYear()} TaskMate Web Portal. Program Studi Teknik Informatika & Sistem Informasi.
      </footer>
    </div>
  );
};
