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
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Organizer Workspace
            </span>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              Event Management Hub
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Create events, track live QR gate attendance, and manage event details.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/organizer/events/create"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-xs flex items-center space-x-1.5 transition-colors"
            >
              <FiPlusCircle size={16} />
              <span>Create Event</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Events Created" value={events.length} icon={FiCalendar} color="blue" />
        <StatCard title="Approved & Public" value={approvedEvents.length} icon={FiCheckSquare} color="green" />
        <StatCard title="Pending Review" value={pendingEvents.length} icon={FiClock} color="amber" />
        <StatCard title="Total Registrations" value={totalRegistrations} icon={FiUsers} color="purple" />
      </div>

      {/* Event Performance & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Table */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Event Registrations & Attendance
            </h3>
            <Link to="/organizer/events" className="text-xs font-medium text-indigo-600 hover:underline">
              View All →
            </Link>
          </div>

          {events.length === 0 ? (
            <p className="text-xs text-neutral-400 py-4">No events created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
                <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Event Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Registrations</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {events.slice(0, 5).map((e) => (
                    <tr key={e._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="p-3 font-semibold text-neutral-900 dark:text-white line-clamp-1">{e.title}</td>
                      <td className="p-3">{e.category}</td>
                      <td className="p-3">{e.registeredCount} / {e.capacity}</td>
                      <td className="p-3">{e.checkedInCount || 0}</td>
                      <td className="p-3">
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

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">Category Distribution</h3>
          {Object.keys(categoryDataMap).length === 0 ? (
            <p className="text-xs text-neutral-400 py-4">No category data</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoryDataMap).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between p-3 rounded-md bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 text-xs">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">{cat}</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{count} events</span>
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
