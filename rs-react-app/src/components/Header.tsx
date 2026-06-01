import './header.scss';
import TestError from './TestError.tsx';
import { NavLink } from 'react-router';
import { ThemeSwitcher } from './ThemeSwitcher.tsx';
import { useQueryClient } from '@tanstack/react-query';

export const Header = () => {
  const queryClient = useQueryClient();

  const refreshCache = () => {
    queryClient.clear();
  };

  return (
    <header>
      <div className="container flex-aic-sb">
        <h3>Pokemon Searching App</h3>
        <nav>
          <NavLink to="/" className="button__main">
            Main Page
          </NavLink>
          <NavLink to="/about" className="button__main">
            About
          </NavLink>
          <TestError />
          <button className="button__main" onClick={refreshCache}>
            Refresh
          </button>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
};
