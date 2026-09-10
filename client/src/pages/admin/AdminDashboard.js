import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';
import {
  FiUsers,
  FiCalendar,
  FiCheckSquare,
  FiClock,
  FiUserCheck,
  FiCheck,
  FiX
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await adminService.getPlatformAnalytics();
      setAnalytics(data);
      const pending = await adminService.getPendingEvents();
      setPendingEvents(pending);
    } catch (err) {
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveEvent(id);
      toast.success('Event approved and made public!');
      fetchData();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Administrator Console
            </span>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">Platform Control Center</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Approve organizer events, manage platform users, and monitor campus engagement.
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              to="/admin/events/pending"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-md text-xs transition-colors"
            >
              Pending Approvals ({pendingEvents.length})
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Platform Users" value={analytics?.totalUsers || 0} icon={FiUsers} color="blue" />
        <StatCard title="Total Students" value={analytics?.totalStudents || 0} icon={FiUserCheck} color="green" />
        <StatCard title="Total Organizers" value={analytics?.totalOrganizers || 0} icon={FiUsers} color="purple" />
        <StatCard title="Pending Approvals" value={analytics?.pendingEvents || 0} icon={FiClock} color="amber" />
      </div>

      {/* Pending Approvals Table Preview */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
            <FiClock />
            <span>Pending Event Approvals ({pendingEvents.length})</span>
          </h3>
          <Link to="/admin/events/pending" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
            View All Pending →
          </Link>
        </div>

        {pendingEvents.length === 0 ? (
          <p className="text-xs text-neutral-400 italic">No events currently awaiting approval.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 font-bold uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Organizer</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {pendingEvents.slice(0, 5).map((ev) => (
                  <tr key={ev._id}>
                    <td className="px-4 py-3 font-bold text-neutral-900 dark:text-white">{ev.title}</td>
                    <td className="px-4 py-3">{ev.organizer?.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral">{ev.category}</Badge>
                    </td>
                    <td className="px-4 py-3">{new Date(ev.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleApprove(ev._id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
                      >
                        Approve
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

export default AdminDashboard;
