import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registrationService } from '../../services/registrationService';
import StatCard from '../../components/common/StatCard';
import EventCard from '../../components/events/EventCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { FiCalendar, FiCheckCircle, FiClock, FiAward, FiArrowRight } from 'react-icons/fi';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data = await registrationService.getMyRegistrations();
        setRegistrations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const activeRegistrations = registrations.filter((r) => r.status === 'registered');
  const waitlisted = registrations.filter((r) => r.status === 'waitlisted');
  const attendedCount = registrations.filter((r) => r.checkedIn).length;
  const upcomingEvents = activeRegistrations.filter(
    (r) => r.event && new Date(r.event.date) >= new Date()
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Student Portal</span>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {user.department} ({user.year}) • {user.interests.join(', ') || 'General Student'}
            </p>
          </div>
          <Link
            to="/events"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-xs transition-colors"
          >
            Explore Events →
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered"
          value={activeRegistrations.length}
          icon={FiCalendar}
          color="blue"
          description="Confirmed event passes"
        />
        <StatCard
          title="Events Attended"
          value={attendedCount}
          icon={FiCheckCircle}
          color="green"
          description="Verified via QR scan"
        />
        <StatCard
          title="Waitlisted Events"
          value={waitlisted.length}
          icon={FiClock}
          color="amber"
          description="In queue for open seats"
        />
        <StatCard
          title="Certificates & Badges"
          value={attendedCount > 0 ? `${attendedCount} Earned` : '0 Earned'}
          icon={FiAward}
          color="purple"
          description="Participation milestones"
        />
      </div>

      {/* Upcoming Registered Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-display">
            Your Upcoming Registered Events ({upcomingEvents.length})
          </h2>
          <Link to="/student/my-events" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
            View All My Events →
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <EmptyState
            title="No upcoming event registrations"
            message="You have not registered for any upcoming events yet. Discover hackathons and workshops now!"
            action={
              <Link to="/events" className="px-4 py-2 bg-primary-600 text-white font-bold rounded-xl text-xs">
                Browse Events
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 3).map((reg) => (
              <EventCard key={reg._id} event={reg.event} userRegistration={reg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
