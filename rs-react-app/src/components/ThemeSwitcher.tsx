import './theme-switcher.scss';
import { useTheme } from '../context/ThemeContext.tsx';

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`ds-switch ${theme === 'dark' ? 'ds-switch--checked' : ''} ds-switch--enabled`}
    >
      <button
        type="button"
        role="switch"
        className="ds-switch__control"
        onClick={toggleTheme}
      >
        <span className="ds-switch__track" aria-hidden="true">
          <span className="ds-switch__thumb" />
        </span>
        <span
          className={`ds-switch__text ${theme === 'dark' ? 'ds-switch__text--active' : ''}`}
        >
          {theme}
        </span>
      </button>
    </div>
  );
};
