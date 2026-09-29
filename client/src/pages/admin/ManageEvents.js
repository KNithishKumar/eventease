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
      {/* Header Banner & Search Section */}
      <div className="bg-white border border-neutral-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
              Administrative Moderation
            </label>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
              Manage All Platform Events
            </h1>
            <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
              Monitor, filter, and moderate college events across all departments.
            </p>
          </div>

          {/* Search Box Matching Login Input Style */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search title, category, organizer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Events Table Container (Sharp Rectangular Box) */}
      <div className="bg-white border border-neutral-200 p-6">
        {events.length === 0 ? (
          <div className="p-8 text-center bg-neutral-50 border border-neutral-200">
            <p className="text-l font-bold uppercase tracking-wider text-neutral-900">
              No Events Found
            </p>
            <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
              No events match your search query or exist on the platform.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-[Segoe UI]">
              <thead className="bg-neutral-50 font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3.5">Title</th>
                  <th className="px-4 py-3.5">Organizer</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Registrations</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-4 font-bold uppercase tracking-wider text-neutral-900">
                      {ev.title}
                    </td>
                    <td className="px-4 py-4 text-neutral-700 font-medium">
                      {ev.organizer?.name || 'Unknown'}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="neutral">{ev.category}</Badge>
                    </td>
                    <td className="px-4 py-4 text-neutral-600">
                      {new Date(ev.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 font-bold text-neutral-900">
                      {ev.registeredCount} / {ev.capacity}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={ev.status === 'approved' ? 'success' : 'warning'}>
                        {ev.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleDelete(ev._id, ev.title)}
                        className="p-2 text-primary-600 hover:bg-neutral-100 transition-colors"
                        title="Delete Event"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;