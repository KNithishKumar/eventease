import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { feedbackService } from '../../services/feedbackService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiStar, FiSend, FiArrowLeft } from 'react-icons/fi';

const FeedbackForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(5);
  const [organizationRating, setOrganizationRating] = useState(5);
  const [contentRating, setContentRating] = useState(5);
  const [venueRating, setVenueRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getEventById(eventId);
        setEvent(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await feedbackService.submitFeedback(eventId, {
        rating,
        organizationRating,
        contentRating,
        venueRating,
        comment
      });
      toast.success('Thank you! Feedback submitted successfully.');
      navigate('/student/my-events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Feedback submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!event) return <div className="p-8 text-center text-s uppercase font-bold text-neutral-500 font-[Segoe UI]">Event not found</div>;

  const renderStarSelector = (value, setter, label) => (
    <div className="space-y-1">
      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setter(star)}
            className="p-1 focus:outline-none transition-transform hover:scale-110"
          >
            <FiStar
              size={22}
              className={star <= value ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'}
            />
          </button>
        ))}
        <span className="text-s font-bold text-neutral-900 font-mono ml-2">{value} / 5</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/my-events')}
        className="inline-flex items-center space-x-2 text-s font-bold uppercase tracking-wider text-neutral-600 hover:text-primary-600 transition-colors"
      >
        <FiArrowLeft size={16} />
        <span>Back to My Events</span>
      </button>

      {/* Main Container */}
      <div className="bg-white border border-neutral-200 p-8 space-y-6">
        <div>
          <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
            Student Portal
          </label>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
            {event.title}
          </h2>
          <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
            Help the organizer and campus community by sharing your post-event review.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStarSelector(rating, setRating, 'Overall Event Rating')}
          {renderStarSelector(organizationRating, setOrganizationRating, 'Organization & Management')}
          {renderStarSelector(contentRating, setContentRating, 'Event Content & Speakers')}
          {renderStarSelector(venueRating, setVenueRating, 'Venue & Facilities')}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Comments & Suggestions
            </label>
            <textarea
              rows={4}
              placeholder="What did you enjoy about the event? Any suggestions for improvement?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-xl py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold transition-colors text-sm uppercase tracking-wider flex items-center justify-center space-x-2"
          >
            <FiSend size={18} />
            <span>{submitting ? 'Submitting Feedback...' : 'Submit Official Review'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;