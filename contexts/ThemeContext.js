'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export const CATEGORY_THEMES = {
  default: {
    label: 'Default',
    primary: '#5bc1d5',
    accent: '#1f77a3',
    bg: '#ffffff',
    soft: '#f0f9fb',
    pill: '#e0f4f8',
    pillText: '#1f77a3',
    logoFilter: 'none',
    gradient: 'linear-gradient(135deg, #e0f4f8 0%, #ffffff 100%)',
    emoji: '✈️',
  },
  treks: {
    label: 'Treks',
    primary: '#4CAF82',
    accent: '#2e7d60',
    bg: '#f4fbf7',
    soft: '#e8f5ee',
    pill: '#c8e6d4',
    pillText: '#2e7d60',
    logoFilter: 'hue-rotate(-50deg) saturate(1.3) brightness(0.95)',
    gradient: 'linear-gradient(135deg, #c8e6d4 0%, #b3d9f0 60%, #ffffff 100%)',
    emoji: '🏔️',
  },
  honeymoon: {
    label: 'Honeymoon',
    primary: '#e8748a',
    accent: '#c0395a',
    bg: '#fdf5f7',
    soft: '#fce4ec',
    pill: '#f8bbd0',
    pillText: '#c0395a',
    logoFilter: 'hue-rotate(195deg) saturate(1.2) brightness(0.95)',
    gradient: 'linear-gradient(135deg, #f8bbd0 0%, #fce4ec 60%, #ffffff 100%)',
    emoji: '💕',
  },
  beaches: {
    label: 'Beaches',
    primary: '#52a8e0',
    accent: '#1565a0',
    bg: '#f5fbff',
    soft: '#e3f2fd',
    pill: '#c5dff7',
    pillText: '#1565a0',
    logoFilter: 'hue-rotate(10deg) saturate(1.1)',
    gradient: 'linear-gradient(135deg, #c5dff7 0%, #f5e9cc 60%, #ffffff 100%)',
    emoji: '🏖️',
  },
  offbeat: {
    label: 'Offbeat',
    primary: '#9c72c8',
    accent: '#6a3fa3',
    bg: '#faf6ff',
    soft: '#f3e5f5',
    pill: '#e1bee7',
    pillText: '#6a3fa3',
    logoFilter: 'hue-rotate(120deg) saturate(1.2) brightness(0.95)',
    gradient: 'linear-gradient(135deg, #e1bee7 0%, #f3e5f5 60%, #ffffff 100%)',
    emoji: '🌿',
  },
  wildlife: {
    label: 'Wildlife',
    primary: '#6baf6b',
    accent: '#4a7c4a',
    bg: '#f6faf2',
    soft: '#e8f5e9',
    pill: '#c8e6c9',
    pillText: '#3a6b3a',
    logoFilter: 'hue-rotate(-40deg) saturate(1.2) brightness(0.9)',
    gradient: 'linear-gradient(135deg, #c8e6c9 0%, #dcedc8 60%, #ffffff 100%)',
    emoji: '🦁',
  },
  heritage: {
    label: 'Heritage',
    primary: '#e8a045',
    accent: '#b5620e',
    bg: '#fffbf3',
    soft: '#fff3e0',
    pill: '#ffe0b2',
    pillText: '#b5620e',
    logoFilter: 'hue-rotate(230deg) saturate(1.3) brightness(0.95)',
    gradient: 'linear-gradient(135deg, #ffe0b2 0%, #fff3e0 60%, #ffffff 100%)',
    emoji: '🏛️',
  },
  womens: {
    label: "Women's Only",
    primary: '#e882b0',
    accent: '#ad2f6d',
    bg: '#fff5fb',
    soft: '#fce4f0',
    pill: '#f8bbd0',
    pillText: '#ad2f6d',
    logoFilter: 'hue-rotate(175deg) saturate(1.3) brightness(0.95)',
    gradient: 'linear-gradient(135deg, #f8bbd0 0%, #fce4f0 60%, #ffffff 100%)',
    emoji: '👸',
  },
  weekend: {
    label: 'Weekend Escapes',
    primary: '#ff8a65',
    accent: '#d84315',
    bg: '#fff8f5',
    soft: '#fbe9e7',
    pill: '#ffccbc',
    pillText: '#d84315',
    logoFilter: 'hue-rotate(220deg) saturate(1.2) brightness(0.95)',
    gradient: 'linear-gradient(135deg, #ffccbc 0%, #fbe9e7 60%, #ffffff 100%)',
    emoji: '🌅',
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [category, setCategory] = useState('default');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedCat = localStorage.getItem('tt-theme-category');
    if (savedCat && CATEGORY_THEMES[savedCat]) setCategory(savedCat);
    const savedMode = localStorage.getItem('tt-dark-mode');
    // default dark unless explicitly set to 'light'
    setDarkMode(savedMode !== 'light');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.default;

  const applyTheme = (key) => {
    setCategory(key);
    localStorage.setItem('tt-theme-category', key);
  };

  const toggleDarkMode = () => {
    setDarkMode(d => {
      const next = !d;
      localStorage.setItem('tt-dark-mode', next ? 'dark' : 'light');
      return next;
    });
  };

  const pageBg = darkMode ? '#0d0d0d' : theme.bg;

  return (
    <ThemeContext.Provider value={{ category, theme, applyTheme, CATEGORY_THEMES, darkMode, toggleDarkMode }}>
      <style suppressHydrationWarning>{`
        :root {
          --theme-primary: ${theme.primary};
          --theme-accent: ${theme.accent};
          --theme-soft: ${darkMode ? '#1a1a1a' : theme.soft};
          --theme-pill: ${darkMode ? '#2a2a2a' : theme.pill};
          --theme-pill-text: ${darkMode ? theme.primary : theme.pillText};
        }
        body {
          background-color: ${pageBg} !important;
          color: ${darkMode ? '#e5e7eb' : '#374151'} !important;
          transition: background-color 0.4s ease, color 0.4s ease;
        }
      `}</style>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
