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
  FiClock,
  FiUserCheck,
  FiCheck
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-neutral-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
              Administrator Console
            </label>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
              Platform Control Center
            </h1>
            <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
              Approve organizer events, manage platform users, and monitor campus engagement.
            </p>
          </div>
          <div>
            <Link
              to="/admin/events/pending"
              className="inline-block px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Pending Approvals ({pendingEvents.length})
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Platform Users" value={analytics?.totalUsers || 0} icon={FiUsers} />
        <StatCard title="Total Students" value={analytics?.totalStudents || 0} icon={FiUserCheck} />
        <StatCard title="Total Organizers" value={analytics?.totalOrganizers || 0} icon={FiUsers} />
        <StatCard title="Pending Approvals" value={analytics?.pendingEvents || 0} icon={FiClock} />
      </div>

      {/* Pending Approvals Table Container */}
      <div className="bg-white border border-neutral-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <h3 className="text-l font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-2">
            <FiClock className="text-primary-600" />
            <span>Pending Event Approvals ({pendingEvents.length})</span>
          </h3>
          <Link
            to="/admin/events/pending"
            className="text-s font-bold text-primary-600 hover:underline uppercase tracking-wider"
          >
            View All Pending →
          </Link>
        </div>

        {pendingEvents.length === 0 ? (
          <p className="text-s text-neutral-500 font-[Segoe UI] italic py-4">
            No events currently awaiting approval.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-[Segoe UI]">
              <thead className="bg-neutral-50 font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3.5">Event Title</th>
                  <th className="px-4 py-3.5">Organizer</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {pendingEvents.slice(0, 5).map((ev) => (
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
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleApprove(ev._id)}
                        className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center space-x-1"
                      >
                        <FiCheck size={14} />
                        <span>Approve</span>
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