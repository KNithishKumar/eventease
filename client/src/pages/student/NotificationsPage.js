import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FiBell, FiCheckCircle, FiInfo, FiClock, FiVolume2 } from 'react-icons/fi';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Failed to mark read');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 dark:text-white font-display">Notifications & Alerts</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Event reminders, waitlist updates, and organizer announcements.
        </p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="No Notifications" message="You have no notifications or alerts at this moment." />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between space-x-4 ${
                n.isRead
                  ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 opacity-80'
                  : 'bg-primary-50/50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/60 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5">
                  {n.type === 'announcement' ? <FiVolume2 size={20} /> : <FiBell size={20} />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{n.title}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] font-semibold text-neutral-400 mt-2 block">
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n._id)}
                  className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-bold shrink-0 hover:bg-primary-700 transition-colors"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
