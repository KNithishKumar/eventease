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
  FiPlusCircle
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
      {/* Header Container */}
      <div className="bg-white border border-neutral-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
              Organizer Portal
            </label>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
              My Organized Events
            </h1>
            <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
              Manage event details, track attendee rosters, scan tickets, and broadcast alerts.
            </p>
          </div>
          <div>
            <Link
              to="/organizer/events/create"
              className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <FiPlusCircle size={16} />
              <span>Create New Event</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-white border border-neutral-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-[Segoe UI]">
            <thead className="bg-neutral-50 font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3.5">Event</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Date & Venue</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Registrations</th>
                <th className="px-4 py-3.5">Attendance</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-s text-neutral-500 font-[Segoe UI] italic">
                    No events created yet. Click "+ Create New Event" to get started.
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-4 font-bold uppercase tracking-wider text-neutral-900">
                      <div className="flex items-center space-x-3">
                        <img
                          src={ev.image || '/uploads/default-event.jpg'}
                          alt={ev.title}
                          className="w-10 h-10 object-cover bg-neutral-200 border border-neutral-200"
                        />
                        <span className="line-clamp-1">{ev.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-neutral-700 font-medium">
                      <Badge variant="neutral">{ev.category}</Badge>
                    </td>
                    <td className="px-4 py-4 text-neutral-600">
                      <p className="font-bold text-neutral-900">
                        {new Date(ev.date).toLocaleDateString()}
                      </p>
                      <p className="text-neutral-500 truncate max-w-[140px]">{ev.venue}</p>
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
                        <p className="text-xs text-primary-600 mt-1 max-w-[150px] line-clamp-2">
                          Reason: {ev.rejectionReason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 font-bold text-neutral-900">
                      {ev.registeredCount} / {ev.capacity}
                    </td>
                    <td className="px-4 py-4 font-bold text-primary-600">
                      {ev.checkedInCount} ({ev.attendancePercentage}%)
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          to={`/organizer/events/${ev._id}/attendees`}
                          title="View Attendees Roster"
                          className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                        >
                          <FiUsers size={16} />
                        </Link>
                        <Link
                          to={`/organizer/events/${ev._id}/scanner`}
                          title="QR Attendance Scanner"
                          className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                        >
                          <FiCamera size={16} />
                        </Link>
                        <button
                          onClick={() => setSelectedEvent(ev)}
                          title="Broadcast Announcement"
                          className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                        >
                          <FiVolume2 size={16} />
                        </button>
                        <Link
                          to={`/organizer/events/${ev._id}/edit`}
                          title="Edit Event"
                          className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                        >
                          <FiEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(ev._id, ev.title)}
                          title="Delete Event"
                          className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
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
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Announcement Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Venue Change / Schedule Update"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Message to All Registered Students
            </label>
            <textarea
              rows={4}
              required
              placeholder="Enter message text..."
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              className="w-full p-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={sendingAnnouncement}
            className="w-full text-xl py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold transition-colors text-sm uppercase tracking-wider"
          >
            {sendingAnnouncement ? 'Broadcasting...' : 'Send Announcement'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MyOrganizedEvents;