import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiCalendar,
  FiPlusCircle,
  FiUser,
  FiLogOut,
  FiBell
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    if (user?.role === 'student') return '/student/dashboard';
    if (user?.role === 'organizer') return '/organizer/dashboard';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen flex flex-col justify-between p-4 font-[Segoe UI]">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="pb-4 border-b border-neutral-200 text-center">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-extrabold tracking-tight text-neutral-900 font-[Segoe UI]">
              Event<span className="text-primary-600">Ease</span>
            </span>
          </Link>
        </div>

        {/* Square Profile Badge (Sidebar Top) */}
        {isAuthenticated && user && (
          <div className="p-3 bg-neutral-50 border border-neutral-200 flex items-center space-x-3">
            {/* Square Profile Logo / Avatar */}
            <Link
              to={user.role === 'student' ? '/student/profile' : getDashboardPath()}
              className="w-10 h-10 border border-neutral-200 bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0 hover:bg-primary-600 transition-colors"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <FiUser size={18} />}
            </Link>

            {/* Name & Role Details */}
            <div className="overflow-hidden">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-900 truncate">
                {user.name}
              </p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 block">
                {user.role}
              </span>
            </div>
          </div>
        )}

        {/* Sidebar Navigation Links */}
        <nav className="space-y-2">
          <Link
            to="/events"
            className={`flex items-center space-x-2.5 px-3.5 py-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
              isActive('/events')
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
            }`}
          >
            <FiCalendar size={16} />
            <span>Browse Events</span>
          </Link>

          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              className={`flex items-center space-x-2.5 px-3.5 py-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
                location.pathname.includes('/dashboard')
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
              }`}
            >
              <FiGrid size={16} />
              <span>Dashboard</span>
            </Link>
          )}

          {user?.role === 'organizer' && (
            <Link
              to="/organizer/events/create"
              className={`flex items-center space-x-2.5 px-3.5 py-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
                isActive('/organizer/events/create')
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
              }`}
            >
              <FiPlusCircle size={16} />
              <span>Create Event</span>
            </Link>
          )}

          {isAuthenticated && user?.role === 'student' && (
            <Link
              to="/student/profile"
              className={`flex items-center space-x-2.5 px-3.5 py-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
                isActive('/student/profile')
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
              }`}
            >
              <FiUser size={16} />
              <span>My Profile</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Bottom Section: Logout Action */}
      {isAuthenticated && (
        <div className="pt-4 border-t border-neutral-200">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center justify-center space-x-2 px-3.5 py-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;