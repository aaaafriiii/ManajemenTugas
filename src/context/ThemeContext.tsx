import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isMobileFrameEnabled: boolean;
  toggleMobileFrame: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskmate_theme');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isMobileFrameEnabled, setIsMobileFrameEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskmate_mobile_frame');
    if (saved !== null) return JSON.parse(saved);
    return false; // Default false for Web Application experience
  });

  useEffect(() => {
    localStorage.setItem('taskmate_theme', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('taskmate_mobile_frame', JSON.stringify(isMobileFrameEnabled));
  }, [isMobileFrameEnabled]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleMobileFrame = () => setIsMobileFrameEnabled((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, isMobileFrameEnabled, toggleMobileFrame }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
