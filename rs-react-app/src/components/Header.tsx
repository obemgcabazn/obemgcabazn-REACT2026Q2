import './header.scss';
import TestError from './TestError.tsx';
import { NavLink } from 'react-router';

export const Header = () => {
  return (
    <header>
      <div className="container flex-aic-sb">
        <h3>Pokemon Searching App</h3>
        <nav>
          <NavLink to="/" className="button__header">
            Main Page
          </NavLink>
          <NavLink to="/about" className="button__header">
            About
          </NavLink>
          <TestError />
        </nav>
      </div>
    </header>
  );
};
