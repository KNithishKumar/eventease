import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { notificationService } from '../../services/notificationService';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import {
  FiEdit,
  FiTrash2,
  FiUsers,
  FiCamera,
  FiVolume2,
  FiBarChart2,
  FiPlusCircle,
  FiAlertCircle
} from 'react-icons/fi';

const MyOrganizedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Announcement Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getOrganizerEvents();
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load organized events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) return;
    try {
      await eventService.deleteEvent(id);
      toast.success('Event deleted successfully.');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleBroadcastAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMessage.trim()) return;
    setSendingAnnouncement(true);
    try {
      const res = await notificationService.sendAnnouncement(selectedEvent._id, {
        title: announcementTitle,
        message: announcementMessage
      });
      toast.success(res.message || 'Announcement broadcasted successfully!');
      setSelectedEvent(null);
      setAnnouncementTitle('');
      setAnnouncementMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send announcement');
    } finally {
      setSendingAnnouncement(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white font-display">My Organized Events</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Manage event details, track attendee rosters, scan tickets, and broadcast alerts.
          </p>
        </div>
        <Link
          to="/organizer/events/create"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-xs transition-colors flex items-center space-x-1.5"
        >
          <FiPlusCircle size={16} />
          <span>Create New Event</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-300">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4">Event</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Date & Venue</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Registrations</th>
                <th className="px-4 py-4">Attendance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-xs text-neutral-400">
                    No events created yet. Click "+ Create New Event" to get started.
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">
                      <div className="flex items-center space-x-3">
                        <img
                          src={ev.image || '/uploads/default-event.jpg'}
                          alt={ev.title}
                          className="w-10 h-10 rounded-lg object-cover bg-neutral-200"
                        />
                        <span className="line-clamp-1">{ev.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="neutral">{ev.category}</Badge>
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {new Date(ev.date).toLocaleDateString()}
                      </p>
                      <p className="text-neutral-400 truncate max-w-[140px]">{ev.venue}</p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={
                          ev.status === 'approved'
                            ? 'success'
                            : ev.status === 'pending'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {ev.status === 'approved'
                          ? 'Approved'
                          : ev.status === 'pending'
                          ? 'Pending Approval'
                          : 'Rejected'}
                      </Badge>
                      {ev.rejectionReason && (
                        <p className="text-[10px] text-rose-500 mt-1 max-w-[150px] line-clamp-2">
                          Reason: {ev.rejectionReason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 font-semibold text-neutral-800 dark:text-neutral-200">
                      {ev.registeredCount} / {ev.capacity}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {ev.checkedInCount} ({ev.attendancePercentage}%)
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/organizer/events/${ev._id}/attendees`}
                          title="View Attendees Roster"
                          className="p-2 rounded-lg text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <FiUsers size={16} />
                        </Link>
                        <Link
                          to={`/organizer/events/${ev._id}/scanner`}
                          title="QR Attendance Scanner"
                          className="p-2 rounded-lg text-neutral-500 hover:text-emerald-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <FiCamera size={16} />
                        </Link>
                        <button
                          onClick={() => setSelectedEvent(ev)}
                          title="Broadcast Announcement"
                          className="p-2 rounded-lg text-neutral-500 hover:text-amber-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <FiVolume2 size={16} />
                        </button>
                        <Link
                          to={`/organizer/events/${ev._id}/edit`}
                          title="Edit Event"
                          className="p-2 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <FiEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(ev._id, ev.title)}
                          title="Delete Event"
                          className="p-2 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={`Broadcast Announcement: ${selectedEvent?.title}`}
      >
        <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              Announcement Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Venue Change / Schedule Update"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              Message to All Registered Students
            </label>
            <textarea
              rows={4}
              required
              placeholder="Enter message text..."
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={sendingAnnouncement}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm"
          >
            {sendingAnnouncement ? 'Broadcasting...' : 'Send Announcement'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MyOrganizedEvents;
