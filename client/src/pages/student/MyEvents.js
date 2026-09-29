import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../../services/registrationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';
import { FiStar, FiCamera } from 'react-icons/fi';

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
      {/* Header Container */}
      <div className="bg-white border border-neutral-200 p-6">
        <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
          Student Portal
        </label>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
          My Registered Events
        </h1>
        <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
          Access your digital QR tickets, waitlist status, and post-event feedback forms.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border border-neutral-200 bg-white">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'completed'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Completed ({completed.length})
        </button>
        <button
          onClick={() => setActiveTab('waitlisted')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'waitlisted'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
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
            <Link
              to="/events"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-block"
            >
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
              <div
                key={reg._id}
                className="bg-white border border-neutral-200 p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={reg.status === 'registered' ? 'success' : 'warning'}>
                      {reg.status === 'registered' ? 'Registered' : `Waitlist Position #${reg.waitlistPosition}`}
                    </Badge>
                    {reg.checkedIn && (
                      <Badge variant="success">
                        Checked In
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-neutral-900">
                    {ev.title}
                  </h3>
                  <p className="text-s text-neutral-500 font-[Segoe UI]">
                    {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {ev.venue}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                    ID: {reg.registrationId}
                  </span>

                  <div className="flex items-center space-x-2">
                    {reg.status === 'registered' && (
                      <Link
                        to={`/student/ticket/${reg.registrationId}`}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1"
                      >
                        <FiCamera size={14} />
                        <span>Ticket</span>
                      </Link>
                    )}

                    {activeTab === 'completed' && (
                      <Link
                        to={`/student/feedback/${ev._id}`}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1"
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