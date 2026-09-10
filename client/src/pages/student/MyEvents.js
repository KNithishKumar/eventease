import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../../services/registrationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiCheckCircle, FiStar, FiCamera } from 'react-icons/fi';

const MyEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'waitlisted'

  const fetchRegistrations = async () => {
    try {
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load my events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const now = new Date();
  const upcoming = registrations.filter(
    (r) => r.status === 'registered' && r.event && new Date(r.event.date) >= now
  );
  const completed = registrations.filter(
    (r) => r.status === 'registered' && r.event && new Date(r.event.date) < now
  );
  const waitlisted = registrations.filter((r) => r.status === 'waitlisted');

  const getActiveList = () => {
    if (activeTab === 'upcoming') return upcoming;
    if (activeTab === 'completed') return completed;
    if (activeTab === 'waitlisted') return waitlisted;
    return [];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">My Registered Events</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Access your digital QR tickets, waitlist status, and post-event feedback forms.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-4">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'upcoming'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'completed'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Completed ({completed.length})
        </button>
        <button
          onClick={() => setActiveTab('waitlisted')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'waitlisted'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Waitlisted ({waitlisted.length})
        </button>
      </div>

      {/* Content List */}
      {getActiveList().length === 0 ? (
        <EmptyState
          title={`No ${activeTab} events`}
          message={`You currently have no ${activeTab} event registrations.`}
          action={
            <Link to="/events" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md text-xs hover:bg-indigo-700 transition-colors">
              Explore Events
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getActiveList().map((reg) => {
            const ev = reg.event;
            if (!ev) return null;
            return (
              <div key={reg._id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant={reg.status === 'registered' ? 'success' : 'warning'}>
                      {reg.status === 'registered' ? 'Registered' : `Waitlist Position #${reg.waitlistPosition}`}
                    </Badge>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-2">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {ev.venue}
                    </p>
                  </div>
                  {reg.checkedIn && (
                    <Badge variant="success" className="shrink-0">
                      Checked In
                    </Badge>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">ID: {reg.registrationId}</span>

                  <div className="flex items-center space-x-2">
                    {reg.status === 'registered' && (
                      <Link
                        to={`/student/ticket/${reg.registrationId}`}
                        className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1"
                      >
                        <FiCamera size={14} />
                        <span>Ticket</span>
                      </Link>
                    )}

                    {activeTab === 'completed' && (
                      <Link
                        to={`/student/feedback/${ev._id}`}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1"
                      >
                        <FiStar size={14} />
                        <span>Feedback</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
