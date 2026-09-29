import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FiBell, FiVolume2 } from 'react-icons/fi';

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
      {/* Header Container */}
      <div className="bg-white border border-neutral-200 p-6">
        <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
          Activity Center
        </label>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
          Notifications & Alerts
        </h1>
        <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
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
              className={`p-5 border transition-all flex items-start justify-between space-x-4 ${
                n.isRead
                  ? 'bg-white border-neutral-200'
                  : 'bg-primary-50 border-primary-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-white border border-neutral-200 text-primary-600 shrink-0 mt-0.5">
                  {n.type === 'announcement' ? <FiVolume2 size={20} /> : <FiBell size={20} />}
                </div>
                <div>
                  <h3 className="text-s font-bold uppercase tracking-wider text-neutral-900">
                    {n.title}
                  </h3>
                  <p className="text-s text-neutral-600 font-[Segoe UI] mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mt-2 block">
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n._id)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
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