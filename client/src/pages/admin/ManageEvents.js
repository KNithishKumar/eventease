import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiTrash2, FiSearch } from 'react-icons/fi';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAllEvents = async () => {
    try {
      const data = await eventService.getEvents({ search });
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, [search]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Admin Action: Permanently delete event "${title}"?`)) return;
    try {
      await eventService.deleteEvent(id);
      toast.success('Event deleted');
      fetchAllEvents();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Manage All Platform Events</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Monitor all college events created across departments.
        </p>
      </div>

      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -tranneutral-y-1/2 text-neutral-400" size={16} />
        <input
          type="text"
          placeholder="Search by title, category, organizer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 font-bold uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-4 py-4">Organizer</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Registrations</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {events.map((ev) => (
                <tr key={ev._id}>
                  <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">{ev.title}</td>
                  <td className="px-4 py-4">{ev.organizer?.name}</td>
                  <td className="px-4 py-4">
                    <Badge variant="neutral">{ev.category}</Badge>
                  </td>
                  <td className="px-4 py-4">{new Date(ev.date).toLocaleDateString()}</td>
                  <td className="px-4 py-4 font-semibold">
                    {ev.registeredCount} / {ev.capacity}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={ev.status === 'approved' ? 'success' : 'warning'}>{ev.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(ev._id, ev.title)}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete Event"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
