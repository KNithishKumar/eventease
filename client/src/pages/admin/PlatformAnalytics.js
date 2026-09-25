import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiUsers, FiCalendar, FiCheckCircle } from 'react-icons/fi';

const PlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminService.getPlatformAnalytics();
        setAnalytics(data);
      } catch (err) {
        toast.error('Failed to load platform analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Platform Summary</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Overview of total event registrations and attendance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Registrations" value={analytics?.totalRegistrations || 0} icon={FiUsers} />
        <StatCard title="Gate Scans" value={analytics?.totalCheckedIn || 0} icon={FiCheckCircle} />
        <StatCard title="Attendance Rate" value={`${analytics?.attendanceRate || 0}%`} />
        <StatCard title="Total Events" value={analytics?.totalEvents || 0} icon={FiCalendar} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown Table */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Events by Category</h3>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {(analytics?.categoryStats || []).map((item) => (
              <div key={item.name} className="py-2 flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{item.name}</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown Table */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Users by Department</h3>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {(analytics?.departmentStats || []).map((item) => (
              <div key={item.name} className="py-2 flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{item.name}</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
