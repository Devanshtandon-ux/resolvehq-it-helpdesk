import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Palette, Moon, Sun, RotateCcw, X, Check } from 'lucide-react';

const PRESET_OPTIONS = [
  { id: 'lavender', name: 'Soft Lavender', bg: '#F7F5FF', accent: '#7C3AED', text: '#1E1B4B' },
  { id: 'cloud', name: 'Pure Cloud', bg: '#F8FAFC', accent: '#2563EB', text: '#0F172A' },
  { id: 'ivory', name: 'Warm Ivory', bg: '#FFF9F0', accent: '#EA580C', text: '#431407' },
  { id: 'mint', name: 'Mint Fresh', bg: '#F0FBF6', accent: '#059669', text: '#064E3B' },
  { id: 'rose', name: 'Rose Quartz', bg: '#FFF4F6', accent: '#E11D48', text: '#4C0519' },
] as const;

export const ThemeCustomizer: React.FC = () => {
  const { theme, setPreset, setCustomColor, toggleDarkMode, resetTheme, isCustomizing, setIsCustomizing } = useTheme();

  if (!isCustomizing) {
    return (
      <button
        onClick={() => setIsCustomizing(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-lg border border-slate-200/80 dark:border-slate-700 hover:shadow-xl hover:scale-105 transition-all text-xs font-semibold"
        title="Customize Appearance"
        aria-label="Customize theme appearance"
      >
        <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <span className="hidden sm:inline">Theme</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800 p-5 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Appearance & Theme</h4>
        </div>
        <button
          onClick={() => setIsCustomizing(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
          aria-label="Close customizer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-4 space-y-4">
        {/* Preset themes */}
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2.5">
            Curated Themes
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {PRESET_OPTIONS.map((item) => {
              const isSelected = theme.preset === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPreset(item.id)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                    isSelected
                      ? 'border-indigo-600/50 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200 font-semibold'
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full border border-black/10 flex items-center justify-center shrink-0"
                      style={{ backgroundColor: item.bg }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.accent }} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
            Custom Background Tint
          </label>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={theme.bgHex}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent p-0.5"
              aria-label="Pick custom background color"
            />
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">
              {theme.bgHex}
            </span>
            {theme.preset === 'custom' && (
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded font-medium">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Mode & Reset */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme.isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          <button
            onClick={resetTheme}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors px-2 py-1"
            title="Reset to Soft Lavender"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
