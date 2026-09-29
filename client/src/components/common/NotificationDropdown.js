import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiInfo } from 'react-icons/fi';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2.5 text-neutral-700 hover:bg-neutral-100 transition-colors focus:outline-none"
        title="Notifications"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
            <h4 className="text-l font-bold uppercase tracking-wider text-neutral-900 font-display">
              Notifications
            </h4>
            <span className="text-s text-neutral-500 font-[Segoe UI]">
              {unreadCount} unread
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-200">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-s text-neutral-500 font-[Segoe UI]">
                <FiInfo size={24} className="mx-auto mb-2 text-primary-600" />
                No notifications yet.
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div
                  key={n._id}
                  onClick={() => {
                    setIsOpen(false);
                    if (user.role === 'student') navigate('/student/notifications');
                  }}
                  className={`p-4 transition-colors cursor-pointer flex items-start space-x-3 ${
                    n.isRead
                      ? 'bg-white hover:bg-neutral-50'
                      : 'bg-primary-50/50 hover:bg-primary-50'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-s font-bold uppercase tracking-wider text-neutral-900">
                      {n.title}
                    </p>
                    <p className="text-s text-neutral-600 font-[Segoe UI] mt-1 line-clamp-2">
                      {n.message}
                    </p>
                    <span className="text-xs text-neutral-400 font-[Segoe UI] mt-1 block">
                      {new Date(n.createdAt).toLocaleDateString()} at{' '}
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(n._id, e)}
                      title="Mark as read"
                      className="p-1 text-primary-600 hover:bg-primary-100 transition-colors"
                    >
                      <FiCheck size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-neutral-200 text-center bg-neutral-50">
            <button
              onClick={() => {
                setIsOpen(false);
                if (user.role === 'student') navigate('/student/notifications');
                else if (user.role === 'organizer') navigate('/organizer/notifications');
              }}
              className="text-s font-bold text-primary-600 hover:underline uppercase tracking-wider"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;