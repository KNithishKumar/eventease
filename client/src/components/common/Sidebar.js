import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiCalendar,
  FiPlusCircle,
  FiCheckSquare,
  FiUsers,
  FiBarChart2,
  FiBell,
  FiUser
} from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: FiGrid },
    { name: 'My Events', path: '/student/my-events', icon: FiCalendar },
    { name: 'Notifications', path: '/student/notifications', icon: FiBell },
    { name: 'Profile & Interests', path: '/student/profile', icon: FiUser }
  ];

  const organizerLinks = [
    { name: 'Dashboard', path: '/organizer/dashboard', icon: FiGrid },
    { name: 'My Organized Events', path: '/organizer/events', icon: FiCalendar },
    { name: 'Create Event', path: '/organizer/events/create', icon: FiPlusCircle },
    { name: 'Notifications', path: '/organizer/notifications', icon: FiBell }
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { name: 'Pending Approvals', path: '/admin/events/pending', icon: FiCheckSquare },
    { name: 'Manage Events', path: '/admin/events', icon: FiCalendar },
    { name: 'Manage Users', path: '/admin/users', icon: FiUsers },
    { name: 'Platform Summary', path: '/admin/analytics', icon: FiBarChart2 }
  ];

  const getLinks = () => {
    if (user.role === 'student') return studentLinks;
    if (user.role === 'organizer') return organizerLinks;
    if (user.role === 'admin') return adminLinks;
    return [];
  };

  return (
    <aside className="w-56 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-3.75rem)] p-3 hidden md:block">
      <div className="mb-4 px-3 py-2 bg-neutral-50 dark:bg-neutral-800/60 rounded-md border border-neutral-200/60 dark:border-neutral-700/60">
        <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">Portal</span>
        <h4 className="text-xs font-bold text-neutral-900 dark:text-white capitalize">
          {user.role} Account
        </h4>
      </div>

      <nav className="space-y-1">
        {getLinks().map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
