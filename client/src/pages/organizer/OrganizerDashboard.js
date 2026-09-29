import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import {
  FiCalendar,
  FiCheckSquare,
  FiClock,
  FiUsers,
  FiPlusCircle
} from 'react-icons/fi';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getOrganizerEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const approvedEvents = events.filter((e) => e.status === 'approved');
  const pendingEvents = events.filter((e) => e.status === 'pending');
  const totalRegistrations = events.reduce((acc, e) => acc + (e.registeredCount || 0), 0);

  const categoryDataMap = {};
  events.forEach((e) => {
    categoryDataMap[e.category] = (categoryDataMap[e.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-neutral-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
              Organizer Workspace
            </label>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
              Event Management Hub
            </h1>
            <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
              Create events, track live QR gate attendance, and manage event details.
            </p>
          </div>
          <div>
            <Link
              to="/organizer/events/create"
              className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <FiPlusCircle size={16} />
              <span>Create Event</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Events Created" value={events.length} icon={FiCalendar} />
        <StatCard title="Approved & Public" value={approvedEvents.length} icon={FiCheckSquare} />
        <StatCard title="Pending Review" value={pendingEvents.length} icon={FiClock} />
        <StatCard title="Total Registrations" value={totalRegistrations} icon={FiUsers} />
      </div>

      {/* Event Performance & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Table Container */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <h3 className="text-l font-bold uppercase tracking-wider text-neutral-900 font-display">
              Event Registrations & Attendance
            </h3>
            <Link
              to="/organizer/events"
              className="text-s font-bold text-primary-600 hover:underline uppercase tracking-wider"
            >
              View All →
            </Link>
          </div>

          {events.length === 0 ? (
            <p className="text-s text-neutral-500 font-[Segoe UI] italic py-4">
              No events created yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-[Segoe UI]">
                <thead className="bg-neutral-50 font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3.5">Event Title</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Registrations</th>
                    <th className="px-4 py-3.5">Attendance</th>
                    <th className="px-4 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {events.slice(0, 5).map((e) => (
                    <tr key={e._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-4 font-bold uppercase tracking-wider text-neutral-900">
                        {e.title}
                      </td>
                      <td className="px-4 py-4 text-neutral-700 font-medium">{e.category}</td>
                      <td className="px-4 py-4 font-bold text-neutral-900">
                        {e.registeredCount} / {e.capacity}
                      </td>
                      <td className="px-4 py-4 font-bold text-neutral-900">
                        {e.checkedInCount || 0}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={e.status === 'approved' ? 'success' : 'warning'}>
                          {e.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Breakdown Container */}
        <div className="bg-white border border-neutral-200 p-6 space-y-4">
          <h3 className="text-l font-bold uppercase tracking-wider text-neutral-900 font-display border-b border-neutral-200 pb-4">
            Category Distribution
          </h3>
          {Object.keys(categoryDataMap).length === 0 ? (
            <p className="text-s text-neutral-500 font-[Segoe UI] italic py-4">
              No category data available.
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoryDataMap).map(([cat, count]) => (
                <div
                  key={cat}
                  className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 text-s font-[Segoe UI]"
                >
                  <span className="font-bold text-neutral-800 uppercase tracking-wider">
                    {cat}
                  </span>
                  <span className="font-bold text-primary-600 font-mono text-base">
                    {count} {count === 1 ? 'event' : 'events'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;