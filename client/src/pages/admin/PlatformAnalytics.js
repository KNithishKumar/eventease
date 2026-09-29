import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiUsers, FiCalendar, FiCheckCircle, FiPieChart } from 'react-icons/fi';

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
      {/* Header Banner Container */}
      <div className="bg-white border border-neutral-200 p-6">
        <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
          Analytics & Insights
        </label>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
          Platform Summary
        </h1>
        <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
          Overview of total event registrations, gate scans, and department engagement metrics.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registrations"
          value={analytics?.totalRegistrations || 0}
          icon={FiUsers}
          description="Confirmed student passes"
        />
        <StatCard
          title="Gate Scans"
          value={analytics?.totalCheckedIn || 0}
          icon={FiCheckCircle}
          description="Verified QR check-ins"
        />
        <StatCard
          title="Attendance Rate"
          value={`${analytics?.attendanceRate || 0}%`}
          icon={FiPieChart}
          description="Turnout ratio"
        />
        <StatCard
          title="Total Events"
          value={analytics?.totalEvents || 0}
          icon={FiCalendar}
          description="Approved & published"
        />
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown Table */}
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-l font-bold uppercase tracking-wider text-neutral-900 mb-4 font-display">
            Events by Category
          </h3>
          <div className="divide-y divide-neutral-200">
            {(analytics?.categoryStats || []).map((item) => (
              <div key={item.name} className="py-3 flex items-center justify-between text-s font-[Segoe UI]">
                <span className="font-bold text-neutral-800 uppercase tracking-wider">
                  {item.name}
                </span>
                <span className="font-bold text-primary-600 font-mono text-base">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown Table */}
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-l font-bold uppercase tracking-wider text-neutral-900 mb-4 font-display">
            Users by Department
          </h3>
          <div className="divide-y divide-neutral-200">
            {(analytics?.departmentStats || []).map((item) => (
              <div key={item.name} className="py-3 flex items-center justify-between text-s font-[Segoe UI]">
                <span className="font-bold text-neutral-800 uppercase tracking-wider">
                  {item.name}
                </span>
                <span className="font-bold text-primary-600 font-mono text-base">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;