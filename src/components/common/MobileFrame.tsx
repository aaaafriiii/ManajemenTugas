import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Wifi, Battery, Maximize2, Smartphone } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { isMobileFrameEnabled, toggleMobileFrame } = useTheme();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isMobileFrameEnabled) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-md mx-auto min-h-screen relative pb-20">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-center font-sans antialiased">
      {/* Top Banner Toolbar for Usability Testing Simulator */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between px-2 text-slate-300 text-xs font-medium">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span>Mobile Prototype Mode</span>
          <span className="bg-blue-600/30 text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-500/30">
            Design Thinking UI/UX
          </span>
        </div>
        <button
          onClick={toggleMobileFrame}
          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg border border-slate-700 transition"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Full Screen</span>
        </button>
      </div>

      {/* iPhone Outer Shell */}
      <div className="relative w-full max-w-[410px] h-[850px] bg-slate-950 rounded-[50px] p-3 shadow-2xl border-[4px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
        </div>

        {/* Screen Content Container */}
        <div className="relative w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[40px] overflow-hidden flex flex-col">
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-slate-900 dark:text-white text-xs font-semibold select-none z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <span>{timeStr || '09:41'}</span>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative pb-20">
            {children}
          </div>

          {/* Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
