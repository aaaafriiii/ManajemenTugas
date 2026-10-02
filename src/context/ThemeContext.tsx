import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isMobileFrameEnabled: boolean;
  toggleMobileFrame: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('taskmate_theme_mode');
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;

    const oldSaved = localStorage.getItem('taskmate_theme');
    if (oldSaved !== null) {
      return JSON.parse(oldSaved) ? 'dark' : 'light';
    }

    return 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [isMobileFrameEnabled, setIsMobileFrameEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskmate_mobile_frame');
    if (saved !== null) return JSON.parse(saved);
    return false; // Default false for Web Application experience
  });

  // Calculate and apply dark mode based on themeMode and system preference
  useEffect(() => {
    localStorage.setItem('taskmate_theme_mode', themeMode);

    const updateActualTheme = () => {
      let isDark = false;
      if (themeMode === 'dark') {
        isDark = true;
      } else if (themeMode === 'light') {
        isDark = false;
      } else if (themeMode === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDarkMode(isDark);
      localStorage.setItem('taskmate_theme', JSON.stringify(isDark));

      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    };

    updateActualTheme();

    // Listen for system theme preference changes if mode is 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (themeMode === 'system') {
        updateActualTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('taskmate_mobile_frame', JSON.stringify(isMobileFrameEnabled));
  }, [isMobileFrameEnabled]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleDarkMode = () => {
    setThemeModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleMobileFrame = () => {
    setIsMobileFrameEnabled((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        isDarkMode,
        toggleDarkMode,
        isMobileFrameEnabled,
        toggleMobileFrame,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
