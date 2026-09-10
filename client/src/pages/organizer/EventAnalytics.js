import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { feedbackService } from '../../services/feedbackService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';
import toast from 'react-hot-toast';
import { FiUsers, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

const EventAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ev = await eventService.getEventById(id);
        setEvent(ev);
        const fb = await feedbackService.getEventFeedback(id);
        setFeedbackData(fb);
      } catch (err) {
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!event) return <div className="p-8 text-center text-neutral-500">Event not found</div>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/organizer/events')}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
      >
        <FiArrowLeft size={14} />
        <span>Back to My Events</span>
      </button>

      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{event.title}</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Event statistics & student feedback summary.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Registrations" value={event.registeredCount} icon={FiUsers} />
        <StatCard title="Attendance Check-Ins" value={event.checkedInCount || 0} icon={FiCheckCircle} />
        <StatCard
          title="Attendance Rate"
          value={`${event.registeredCount > 0 ? Math.round(((event.checkedInCount || 0) / event.registeredCount) * 100) : 0}%`}
        />
        <StatCard
          title="Average Rating"
          value={feedbackData?.averageRating ? `${feedbackData.averageRating} / 5` : 'N/A'}
        />
      </div>

      {feedbackData && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-3">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Feedback Score Averages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-md">
              <span className="text-neutral-500">Organization</span>
              <p className="font-bold text-neutral-900 dark:text-white text-base mt-0.5">
                {feedbackData.averageOrgRating} / 5
              </p>
            </div>
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-md">
              <span className="text-neutral-500">Content</span>
              <p className="font-bold text-neutral-900 dark:text-white text-base mt-0.5">
                {feedbackData.averageContentRating} / 5
              </p>
            </div>
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-md">
              <span className="text-neutral-500">Venue</span>
              <p className="font-bold text-neutral-900 dark:text-white text-base mt-0.5">
                {feedbackData.averageVenueRating} / 5
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAnalytics;
