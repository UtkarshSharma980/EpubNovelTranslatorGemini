import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'navbar-link active' : 'navbar-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Novel Translator
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/" className={isActive('/')}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/novels" className={isActive('/novels')}>
              My Novels
            </Link>
          </li>
          <li>
            <Link to="/upload" className={isActive('/upload')}>
              Upload EPUB
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
