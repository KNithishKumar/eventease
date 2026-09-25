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
  FiX,
  FiSearch,
  FiSettings,
  FiUser
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
  <header className="sticky pt-10 top-0 z-40 w-full bg-white/95 dark:bg-black backdrop-blur-md border-b border-[#e2eaf5] dark:border-[#222c54] transition-colors">

    {/* ================= LOGO BAR ================= */}
    <div className="border-b border-[#e2eaf5] dark:border-[#222c54]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-center">

          <Link to="/" className="group pb-10">
            <span className="text-4xl sm:text-5xl font-extrabold font-[Seouge UI] tracking-tight text-[#1e2448] dark:text-white">
              Event<span className="text-[#ff4d79]">Ease</span>
            </span>
          </Link>

        </div>
      </div>
    </div>

    {/* ================= NAVIGATION BAR ================= */}
<div className="border-t border-[#e2eaf4] dark:border-[#283562]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="min-h-16 flex items-center justify-between gap-6">

      {/* Search */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex w-full max-w-sm relative"
      >
        <FiSearch
          size={20}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a95a8]"
        />

        <input
          type="text"
          placeholder="Search events, workshops, hackathons..."
          value={navSearch}
          onChange={(e) => setNavSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5
          bg-[#f8fafc] dark:bg-black
          border border-[#e2eaf4] dark:border-[#283562]
          text-l text-[#1e2448] dark:text-white
          placeholder-[#8a95a8]
          focus:outline-none
          focus:border-[#ff4d79]
          focus:ring-1 focus:ring-[#ff4d79]/30
          transition-all
          font-[Verdana]"
        />
      </form>

      {/* Navigation */}
      <nav className="hidden lg:flex items-center gap-1">

        {/* Browse Events */}
        <Link
          to="/events"
          className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
            isActive('/events')
              ? 'text-[#ff4d79]'
              : 'text-[#64748b] dark:text-neutral-300 hover:text-[#1e2448] dark:hover:text-white'
          }`}
        >
          Browse Events
        </Link>

        {/* Dashboard */}
        {isAuthenticated && (
          <Link
            to={getDashboardPath()}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors flex items-center gap-2 ${
              location.pathname.startsWith('/student') ||
              location.pathname.startsWith('/organizer') ||
              location.pathname.startsWith('/admin')
                ? 'text-[#ff4d79]'
                : 'text-[#64748b] dark:text-neutral-300 hover:text-[#1e2448] dark:hover:text-white'
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
            className="ml-2 px-4 py-2.5
            text-sm font-semibold text-white
            bg-[#ff4d79]
            hover:bg-[#f43f68]
            rounded-lg
            transition-colors
            flex items-center gap-2"
          >
            <FiPlusCircle size={15} />
            Create Event
          </Link>
        )}

      </nav>

      {/* Right Actions */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">

{/* Theme Slider Toggle */}
<button
  onClick={toggleTheme}
  role="switch"
  aria-checked={isDark}
  aria-label="Toggle theme"
  className={`relative w-[72px] h-[36px] flex items-center rounded-full p-[2px] border-2 transition-colors duration-300 ease-in-out cursor-pointer ${
    isDark
      ? 'bg-[#ff9d42] border-[#e07a28]'
      : 'bg-[#e2e8f0] border-[#cbd5e1] dark:bg-[#2b2e36] dark:border-[#4b5563]'
  }`}
>
  {/* Sliding Knob */}
  <span
    className={`w-[26px] h-[26px] rounded-full flex items-center justify-center font-extrabold text-[10px] tracking-wider select-none border-2 transition-all duration-300 ease-in-out transform ${
      isDark
        ? 'translate-x-[36px] bg-[#1a1c23] text-[#ff9d42] border-[#ff9d42] shadow-[0_0_8px_rgba(255,157,66,0.6)]'
        : 'translate-x-0 bg-white text-[#64748b] border-[#94a3b8] dark:bg-[#18191c] dark:text-[#94a3b8] dark:border-[#475569]'
    }`}
  >
    {isDark ? 'L' : 'D'}
  </span>
</button>

        {/* Notifications */}
        {isAuthenticated && <NotificationDropdown />}

        {isAuthenticated ? (
          <div className="flex items-center gap-3 ml-2 pl-3 border-l border-[#e2eaf4] dark:border-[#283562]">

            {/* User Info */}
            <div className="text-right hidden xl:block">
              <p className="text-sm font-semibold text-[#1e2448] dark:text-white leading-tight">
                {user.name}
              </p>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#ff4d79]">
                {user.role}
              </span>
            </div>

            {/* Avatar */}
            <Link
              to={
                user.role === 'student'
                  ? '/student/profile'
                  : getDashboardPath()
              }
              title={user.name}
              className="w-9 h-9 rounded-full
              bg-[#28336d]
              text-white
              flex items-center justify-center
              font-semibold text-sm
              hover:bg-[#ff4d79]
              transition-colors"
            >
              {user.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <FiUser size={17} />
              )}
            </Link>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-9 h-9 flex items-center justify-center
              rounded-lg
              text-[#8a95a8]
              hover:text-[#ff4d79]
              hover:bg-[#fff0f4]
              dark:hover:bg-[#2a1d2e]
              transition-colors"
              title="Logout"
            >
              <FiLogOut size={16} />
            </button>

          </div>
        ) : (
          <div className="flex items-center gap-1 ml-2 pl-3 border-l border-[#e2eaf4] dark:border-[#283562]">

            <Link
              to="/login"
              className="px-4 py-2 text-l font-semibold
              text-white dark:text-neutral-200
              hover:bg-[#f43f68]
              hover:text-black
              transition-colors
              bg-[#ff4d79]
              font-[Seouge UI]"
            >
              LOG IN
            </Link>

            <Link
              to="/register"
              className="px-4 py-2
              text-l font-semibold text-white
              bg-[#ff4d79]
              hover:bg-[#f43f68]
              font-[Seouge UI]
              transition-colors"
            >
              SIGN UP
            </Link>

          </div>
        )}

      </div>

      {/* Mobile Actions */}
      <div className="flex sm:hidden items-center gap-2">

        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center
          rounded-lg
          text-[#64748b] dark:text-neutral-300
          hover:text-[#ff4d79]"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {isAuthenticated && <NotificationDropdown />}

        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="w-9 h-9 flex items-center justify-center
          rounded-lg
          bg-[#f4f7fb] dark:bg-[#1a2342]
          border border-[#e2eaf4] dark:border-[#283562]
          text-[#1e2448] dark:text-neutral-200"
        >
          {mobileMenuOpen ? <FiX size={19} /> : <FiMenu size={19} />}
        </button>

      </div>

    </div>
  </div>
</div>


{/* ================= MOBILE MENU ================= */}
{mobileMenuOpen && (
  <div className="sm:hidden
    border-t border-[#e2eaf5] dark:border-[#283562]
    bg-white dark:bg-[#151c36]
    px-4 py-4 space-y-4">

    {/* Mobile Search */}
    <form
      onSubmit={handleSearchSubmit}
      className="relative"
    >
      <FiSearch
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a95a8]"
        size={16}
      />

      <input
        type="text"
        placeholder="Search events..."
        value={navSearch}
        onChange={(e) => setNavSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-3
        bg-[#f8fafc] dark:bg-[#1a2342]
        border border-[#e2eaf4] dark:border-[#283562]
        rounded-lg
        text-sm text-[#1e2448] dark:text-white
        placeholder-[#8a95a8]
        focus:outline-none
        focus:border-[#ff4d79]"
      />
    </form>

    {/* Mobile Navigation */}
    <div className="space-y-1">

      <Link
        to="/events"
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center px-3 py-3 rounded-lg text-sm font-semibold ${
          isActive('/events')
            ? 'bg-[#fff0f4] text-[#ff4d79] dark:bg-[#2a1d2e]'
            : 'text-[#64748b] dark:text-neutral-300 hover:bg-[#f8fafc] dark:hover:bg-[#1a2342]'
        }`}
      >
        Browse Events
      </Link>

      {isAuthenticated && (
        <Link
          to={getDashboardPath()}
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 px-3 py-3
          rounded-lg text-sm font-semibold
          text-[#64748b] dark:text-neutral-300
          hover:bg-[#f8fafc] dark:hover:bg-[#1a2342]"
        >
          <FiGrid size={16} />
          Dashboard
        </Link>
      )}

      {user?.role === 'organizer' && (
        <Link
          to="/organizer/events/create"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 px-3 py-3
          rounded-lg text-sm font-semibold
          text-[#ff4d79]
          hover:bg-[#fff0f4]
          dark:hover:bg-[#2a1d2e]"
        >
          <FiPlusCircle size={16} />
          Create Event
        </Link>
      )}

    </div>

    {/* Mobile Account */}
    {isAuthenticated ? (
      <div className="pt-3 border-t border-[#e2eaf4] dark:border-[#283562]">

        <div className="flex items-center gap-3 px-2">

          <div className="w-10 h-10 rounded-full bg-[#28336d] text-white flex items-center justify-center font-semibold">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : <FiUser size={17} />
            }
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-[#1e2448] dark:text-white">
              {user.name}
            </p>

            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#ff4d79]">
              {user.role}
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
              setMobileMenuOpen(false);
            }}
            className="w-9 h-9 flex items-center justify-center
            rounded-lg
            text-[#8a95a8]
            hover:text-[#ff4d79]
            hover:bg-[#fff0f4]
            dark:hover:bg-[#2a1d2e]"
            title="Logout"
          >
            <FiLogOut size={17} />
          </button>

        </div>

      </div>
    ) : (
      <div className="pt-3 border-t border-[#e2eaf4] dark:border-[#283562] flex gap-2">

        <Link
          to="/login"
          onClick={() => setMobileMenuOpen(false)}
          className="flex-1 text-center py-2.5
          border border-[#e2eaf4] dark:border-[#283562]
          rounded-lg text-sm font-semibold
          text-[#1e2448] dark:text-white"
        >
          Log In
        </Link>

        <Link
          to="/register"
          onClick={() => setMobileMenuOpen(false)}
          className="flex-1 text-center py-2.5
          bg-[#ff4d79]
          rounded-lg text-sm font-semibold text-white"
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

