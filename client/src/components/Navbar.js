import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { manager, logout, isAuthenticated } = useAuth(); // hiring manager only
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          SmartSubmissions
        </Link>

        {/* Menu Links */}
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/hiring-manager"
                className={`navbar-link ${isActive('/dashboard/hiring-manager')}`}
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className={`navbar-link ${isActive('/profile')}`}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-secondary navbar-link-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`navbar-link ${isActive('/login')}`}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
