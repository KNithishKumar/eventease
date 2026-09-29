import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import {
  FiLogOut,
  FiGrid,
  FiPlusCircle,
  FiMenu,
  FiX,
  FiSearch
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const getDashboardPath = () => {
    if (user?.role === 'student') return '/student/dashboard';
    if (user?.role === 'organizer') return '/organizer/dashboard';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/events?search=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200 font-[Segoe UI]">
      {/* ================= LOGO BAR ================= */}
      <div className="border-b border-neutral-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Link to="/" className="group">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-[Segoe UI]">
                Event<span className="text-primary-600">Ease</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= NAVIGATION BAR ================= */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-16 flex items-center justify-between gap-6 py-2">
            
            {/* LEFT SIDE: Search Bar */}
            <div className="flex items-center gap-4">
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex w-full max-w-xs relative"
              >
                <FiSearch
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Search events, workshops..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-[Segoe UI] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </form>
            </div>

            {/* RIGHT SIDE: Navigation Links, Notifications & Logout */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-2 mr-2">
                {/* Browse Events */}
                <Link
                  to="/events"
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive('/events')
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                  }`}
                >
                  Browse Events
                </Link>

                {/* Dashboard */}
                {isAuthenticated && (
                  <Link
                    to={getDashboardPath()}
                    className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border ${
                      location.pathname.startsWith('/student') ||
                      location.pathname.startsWith('/organizer') ||
                      location.pathname.startsWith('/admin')
                        ? 'bg-primary-50 border-primary-200 text-primary-600'
                        : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                    }`}
                  >
                    <FiGrid size={15} />
                    Dashboard
                  </Link>
                )}

                {/* Create Event */}
                {user?.role === 'organizer' && (
                  <Link
                    to="/organizer/events/create"
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-primary-600 hover:bg-primary-700 transition-colors flex items-center gap-2"
                  >
                    <FiPlusCircle size={15} />
                    Create Event
                  </Link>
                )}
              </nav>

              {/* Notifications */}
              {isAuthenticated && <NotificationDropdown />}

              {/* Logout with Icon & Text / Auth Buttons */}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider shrink-0"
                  title="Logout"
                >
                  <FiLogOut size={16} />
                  <span>LOGOUT</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-neutral-200">
                  <Link
                    to="/login"
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-800 border border-neutral-200 hover:bg-neutral-100 transition-colors"
                  >
                    LOG IN
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                  >
                    SIGN UP
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex sm:hidden items-center gap-2">
              {isAuthenticated && <NotificationDropdown />}

              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="w-9 h-9 flex items-center justify-center bg-neutral-50 border border-neutral-200 text-neutral-900"
              >
                {mobileMenuOpen ? <FiX size={19} /> : <FiMenu size={19} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-4 font-[Segoe UI]">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search events..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-[Segoe UI] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </form>

          {/* Mobile Navigation Links */}
          <div className="space-y-2">
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 text-xs font-bold uppercase tracking-wider border ${
                isActive('/events')
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-800'
              }`}
            >
              Browse Events
            </Link>

            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-800"
              >
                <FiGrid size={16} />
                Dashboard
              </Link>
            )}

            {user?.role === 'organizer' && (
              <Link
                to="/organizer/events/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 bg-primary-600 text-white text-xs font-bold uppercase tracking-wider"
              >
                <FiPlusCircle size={16} />
                Create Event
              </Link>
            )}
          </div>

          {/* Mobile Logout Action */}
          {isAuthenticated ? (
            <div className="pt-3 border-t border-neutral-200">
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-800 hover:text-primary-600 flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider"
              >
                <FiLogOut size={16} />
                <span>LOGOUT</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-neutral-200 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-800"
              >
                Log In
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 bg-primary-600 text-xs font-bold uppercase tracking-wider text-white"
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