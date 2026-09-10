import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';
import {
  FiSun,
  FiMoon,
  FiLogOut,
  FiCalendar,
  FiGrid,
  FiPlusCircle,
  FiMenu,
  FiX
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (user?.role === 'student') return '/student/dashboard';
    if (user?.role === 'organizer') return '/organizer/dashboard';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <FiCalendar size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                Event<span className="text-indigo-600 dark:text-indigo-400">Ease</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/events"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/events')
                  ? 'bg-neutral-100 text-indigo-600 dark:bg-neutral-800 dark:text-indigo-400'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Browse Events
            </Link>

            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  location.pathname.startsWith('/student') ||
                  location.pathname.startsWith('/organizer') ||
                  location.pathname.startsWith('/admin')
                    ? 'bg-neutral-100 text-indigo-600 dark:bg-neutral-800 dark:text-indigo-400'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <FiGrid size={15} />
                <span>Dashboard</span>
              </Link>
            )}

            {user?.role === 'organizer' && (
              <Link
                to="/organizer/events/create"
                className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center space-x-1.5"
              >
                <FiPlusCircle size={15} />
                <span>Create Event</span>
              </Link>
            )}
          </nav>

          {/* Actions (Theme, Notifications, User Auth) */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Toggle theme"
            >
              
              {isDark ? <FiSun size={18}/> : <FiMoon size={18} />}
            </button>

            {isAuthenticated && <NotificationDropdown />}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-neutral-200 dark:border-neutral-800">
                <div className="text-right">
                  <p className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">{user.name}</p>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 rounded-md text-neutral-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Logout"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-md text-neutral-600 dark:text-neutral-300">
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {isAuthenticated && <NotificationDropdown />}

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Browse Events
          </Link>

          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Dashboard ({user.role})
            </Link>
          )}

          {user?.role === 'organizer' && (
            <Link
              to="/organizer/events/create"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-bold text-indigo-600 dark:text-indigo-400"
            >
              + Create Event
            </Link>
          )}

          {isAuthenticated ? (
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium border border-neutral-300 dark:border-neutral-700 rounded-md"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-white bg-indigo-600 rounded-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
