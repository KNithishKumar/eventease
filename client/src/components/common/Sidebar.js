import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiCalendar,
  FiPlusCircle,
  FiUser,
  FiLogOut,
  FiBell,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getDashboardPath = () => {
    if (user?.role === 'student') return '/student/dashboard';
    if (user?.role === 'organizer') return '/organizer/dashboard';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`relative bg-white border-r border-neutral-200 min-h-screen flex flex-col justify-between p-4 font-[Segoe UI] transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle Button (Arrow Icon positioned on sidebar edge) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-neutral-200 text-neutral-600 hover:text-primary-600 p-1 rounded-full shadow-sm z-10 focus:outline-none transition-colors"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
      </button>

      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="pb-4 border-b border-neutral-200 text-center">
          <Link to="/" className="inline-block">
            {isCollapsed ? (
              <span className="text-2xl font-extrabold text-neutral-900">
                E<span className="text-primary-600">.</span>
              </span>
            ) : (
              <span className="text-2xl font-extrabold tracking-tight text-neutral-900 font-[Segoe UI]">
                Event<span className="text-primary-600">Ease</span>
              </span>
            )}
          </Link>
        </div>

        {/* Square Profile Badge */}
        {isAuthenticated && user && (
          <div
            className={`bg-neutral-50 border border-neutral-200 flex items-center ${
              isCollapsed ? 'justify-center p-2' : 'p-3 space-x-3'
            }`}
          >
            <Link
              to={user.role === 'student' ? '/student/profile' : getDashboardPath()}
              className="w-10 h-10 border border-neutral-200 bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0 hover:bg-primary-600 transition-colors"
              title={isCollapsed ? user.name : undefined}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <FiUser size={18} />}
            </Link>

            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-900 truncate">
                  {user.name}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 block">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Sidebar Navigation Links */}
        <nav className="space-y-2">
          <Link
            to="/events"
            title={isCollapsed ? 'Browse Events' : undefined}
            className={`flex items-center text-xs font-bold uppercase tracking-wider border transition-colors ${
              isCollapsed ? 'justify-center p-3' : 'space-x-2.5 px-3.5 py-3'
            } ${
              isActive('/events')
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
            }`}
          >
            <FiCalendar size={16} className="shrink-0" />
            {!isCollapsed && <span>Browse Events</span>}
          </Link>

          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              title={isCollapsed ? 'Dashboard' : undefined}
              className={`flex items-center text-xs font-bold uppercase tracking-wider border transition-colors ${
                isCollapsed ? 'justify-center p-3' : 'space-x-2.5 px-3.5 py-3'
              } ${
                location.pathname.includes('/dashboard')
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
              }`}
            >
              <FiGrid size={16} className="shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          )}

          {user?.role === 'organizer' && (
            <Link
              to="/organizer/events/create"
              title={isCollapsed ? 'Create Event' : undefined}
              className={`flex items-center text-xs font-bold uppercase tracking-wider border transition-colors ${
                isCollapsed ? 'justify-center p-3' : 'space-x-2.5 px-3.5 py-3'
              } ${
                isActive('/organizer/events/create')
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
              }`}
            >
              <FiPlusCircle size={16} className="shrink-0" />
              {!isCollapsed && <span>Create Event</span>}
            </Link>
          )}

          {isAuthenticated && user?.role === 'student' && (
            <Link
              to="/student/profile"
              title={isCollapsed ? 'My Profile' : undefined}
              className={`flex items-center text-xs font-bold uppercase tracking-wider border transition-colors ${
                isCollapsed ? 'justify-center p-3' : 'space-x-2.5 px-3.5 py-3'
              } ${
                isActive('/student/profile')
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
              }`}
            >
              <FiUser size={16} className="shrink-0" />
              {!isCollapsed && <span>My Profile</span>}
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
            title={isCollapsed ? 'Logout' : undefined}
            className={`w-full flex items-center border border-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors bg-neutral-100 hover:bg-neutral-200 ${
              isCollapsed ? 'justify-center p-3' : 'justify-center space-x-2 px-3.5 py-3'
            }`}
          >
            <FiLogOut size={16} className="shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;