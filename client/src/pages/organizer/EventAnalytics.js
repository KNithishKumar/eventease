import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { feedbackService } from '../../services/feedbackService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';
import toast from 'react-hot-toast';
import { FiUsers, FiCheckCircle, FiArrowLeft, FiStar, FiPieChart } from 'react-icons/fi';

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
  if (!event) return <div className="p-8 text-center text-s uppercase font-bold text-neutral-500">Event not found</div>;

  const attendanceRate = event.registeredCount > 0 
    ? Math.round(((event.checkedInCount || 0) / event.registeredCount) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/organizer/events')}
        className="inline-flex items-center space-x-2 text-s font-bold uppercase tracking-wider text-neutral-600 hover:text-primary-600 transition-colors"
      >
        <FiArrowLeft size={16} />
        <span>Back to My Events</span>
      </button>

      {/* Header Container */}
      <div className="bg-white border border-neutral-200 p-6">
        <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
          Event Analytics
        </label>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
          {event.title}
        </h1>
        <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
          Detailed event statistics & student feedback breakdown.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Registrations" value={event.registeredCount} icon={FiUsers} />
        <StatCard title="Attendance Check-Ins" value={event.checkedInCount || 0} icon={FiCheckCircle} />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={FiPieChart}
        />
        <StatCard
          title="Average Rating"
          value={feedbackData?.averageRating ? `${feedbackData.averageRating} / 5` : 'N/A'}
          icon={FiStar}
        />
      </div>

      {/* Feedback Score Breakdown Container */}
      {feedbackData && (
        <div className="bg-white border border-neutral-200 p-6 space-y-4">
          <h3 className="text-l font-bold uppercase tracking-wider text-neutral-900 font-display border-b border-neutral-200 pb-4">
            Feedback Score Averages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 border border-neutral-200">
              <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Organization
              </span>
              <p className="text-2xl font-bold text-neutral-900 font-display">
                {feedbackData.averageOrgRating}{' '}
                <span className="text-s font-normal text-neutral-500 font-[Segoe UI]">/ 5</span>
              </p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200">
              <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Content
              </span>
              <p className="text-2xl font-bold text-neutral-900 font-display">
                {feedbackData.averageContentRating}{' '}
                <span className="text-s font-normal text-neutral-500 font-[Segoe UI]">/ 5</span>
              </p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200">
              <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Venue
              </span>
              <p className="text-2xl font-bold text-neutral-900 font-display">
                {feedbackData.averageVenueRating}{' '}
                <span className="text-s font-normal text-neutral-500 font-[Segoe UI]">/ 5</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAnalytics;