
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'default' | 'dark' | 'gradient';
type LayoutType = 'sidebar' | 'horizontal';

interface ThemeAndLayoutContextType {
  theme: ThemeType;
  layout: LayoutType;
  setTheme: (theme: ThemeType) => void;
  setLayout: (layout: LayoutType) => void;
}

const ThemeAndLayoutContext = createContext<ThemeAndLayoutContextType | undefined>(undefined);

export function ThemeAndLayoutProvider({ children }: { children: React.ReactNode }) {
  // Get stored preferences or use defaults
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const storedTheme = localStorage.getItem('vidya-theme');
    return (storedTheme as ThemeType) || 'default';
  });
  
  const [layout, setLayoutState] = useState<LayoutType>(() => {
    const storedLayout = localStorage.getItem('vidya-layout');
    return (storedLayout as LayoutType) || 'sidebar';
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('vidya-theme', theme);
    
    // Apply theme classes to document
    document.documentElement.classList.remove('theme-default', 'theme-dark', 'theme-gradient');
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Apply dark mode class for the dark theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Update localStorage when layout changes
  useEffect(() => {
    localStorage.setItem('vidya-layout', layout);
  }, [layout]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const setLayout = (newLayout: LayoutType) => {
    setLayoutState(newLayout);
  };

  return (
    <ThemeAndLayoutContext.Provider value={{ theme, layout, setTheme, setLayout }}>
      {children}
    </ThemeAndLayoutContext.Provider>
  );
}

export function useThemeAndLayout() {
  const context = useContext(ThemeAndLayoutContext);
  if (context === undefined) {
    throw new Error('useThemeAndLayout must be used within a ThemeAndLayoutProvider');
  }
  return context;
}
