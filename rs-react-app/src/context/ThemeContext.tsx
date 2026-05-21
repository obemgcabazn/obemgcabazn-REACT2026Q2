import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.tsx';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');

  const toggleTheme = () => {
    const anotherTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(anotherTheme);
    document.documentElement.classList.toggle('dark', anotherTheme === 'dark');
  };

  document.documentElement.classList.toggle('dark', theme === 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used to use');
  }
  return ctx;
}
