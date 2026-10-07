import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeConfig, ThemePreset } from '../types';

interface ThemeContextType {
  theme: ThemeConfig;
  setPreset: (preset: ThemePreset) => void;
  setCustomColor: (hex: string) => void;
  toggleDarkMode: () => void;
  resetTheme: () => void;
  isCustomizing: boolean;
  setIsCustomizing: (val: boolean) => void;
}

const PRESETS: Record<Exclude<ThemePreset, 'custom'>, ThemeConfig> = {
  lavender: {
    preset: 'lavender',
    bgHex: '#F7F5FF',
    surfaceHex: '#FFFFFF',
    accentHex: '#7C3AED',
    accentHoverHex: '#6D28D9',
    textPrimaryHex: '#1E1B4B',
    textSecondaryHex: '#6B7280',
    borderHex: 'rgba(124, 58, 237, 0.12)',
    isDark: false,
  },
  cloud: {
    preset: 'cloud',
    bgHex: '#F8FAFC',
    surfaceHex: '#FFFFFF',
    accentHex: '#2563EB',
    accentHoverHex: '#1D4ED8',
    textPrimaryHex: '#0F172A',
    textSecondaryHex: '#64748B',
    borderHex: 'rgba(59, 130, 246, 0.12)',
    isDark: false,
  },
  ivory: {
    preset: 'ivory',
    bgHex: '#FFF9F0',
    surfaceHex: '#FFFFFF',
    accentHex: '#EA580C',
    accentHoverHex: '#C2410C',
    textPrimaryHex: '#431407',
    textSecondaryHex: '#78716C',
    borderHex: 'rgba(249, 115, 22, 0.14)',
    isDark: false,
  },
  mint: {
    preset: 'mint',
    bgHex: '#F0FBF6',
    surfaceHex: '#FFFFFF',
    accentHex: '#059669',
    accentHoverHex: '#047857',
    textPrimaryHex: '#064E3B',
    textSecondaryHex: '#4B5563',
    borderHex: 'rgba(16, 185, 129, 0.14)',
    isDark: false,
  },
  rose: {
    preset: 'rose',
    bgHex: '#FFF4F6',
    surfaceHex: '#FFFFFF',
    accentHex: '#E11D48',
    accentHoverHex: '#BE123C',
    textPrimaryHex: '#4C0519',
    textSecondaryHex: '#6B7280',
    borderHex: 'rgba(244, 63, 94, 0.14)',
    isDark: false,
  },
};

const DEFAULT_THEME = PRESETS.lavender;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('resolvehq_theme');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_THEME;
  });

  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.preset);

    if (theme.isDark) {
      root.classList.add('dark');
      root.style.setProperty('--bg-page', '#0F172A');
      root.style.setProperty('--bg-surface', '#1E293B');
      root.style.setProperty('--bg-surface-subtle', '#334155');
      root.style.setProperty('--text-primary', '#F8FAFC');
      root.style.setProperty('--text-secondary', '#94A3B8');
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--border-strong', 'rgba(255, 255, 255, 0.18)');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-page', theme.bgHex);
      root.style.setProperty('--bg-surface', theme.surfaceHex);
      root.style.setProperty('--accent', theme.accentHex);
      root.style.setProperty('--accent-hover', theme.accentHoverHex);
      root.style.setProperty('--text-primary', theme.textPrimaryHex);
      root.style.setProperty('--text-secondary', theme.textSecondaryHex);
      root.style.setProperty('--border-subtle', theme.borderHex);
    }

    try {
      localStorage.setItem('resolvehq_theme', JSON.stringify(theme));
    } catch {
      // ignore
    }
  }, [theme]);

  const setPreset = (preset: ThemePreset) => {
    if (preset === 'custom') return;
    const base = PRESETS[preset];
    setTheme({
      ...base,
      isDark: theme.isDark,
    });
  };

  const setCustomColor = (hex: string) => {
    // Generate a complementary palette from custom color
    setTheme({
      preset: 'custom',
      bgHex: hex,
      surfaceHex: '#FFFFFF',
      accentHex: '#4F46E5',
      accentHoverHex: '#4338CA',
      textPrimaryHex: '#111827',
      textSecondaryHex: '#4B5563',
      borderHex: 'rgba(79, 70, 229, 0.15)',
      isDark: false,
    });
  };

  const toggleDarkMode = () => {
    setTheme(prev => ({ ...prev, isDark: !prev.isDark }));
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setPreset,
        setCustomColor,
        toggleDarkMode,
        resetTheme,
        isCustomizing,
        setIsCustomizing,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
