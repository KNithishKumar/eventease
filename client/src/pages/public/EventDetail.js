import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { feedbackService } from '../../services/feedbackService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PaymentModal from '../../components/events/PaymentModal';
import toast from 'react-hot-toast';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiUser,
  FiPhone,
  FiFileText,
  FiCheckCircle,
  FiStar,
  FiArrowLeft,
  FiShare2
} from 'react-icons/fi';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [userRegistration, setUserRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const fetchEventData = async () => {
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);

      const fb = await feedbackService.getEventFeedback(id);
      setFeedbackData(fb);

      if (user?.role === 'student') {
        const myRegs = await registrationService.getMyRegistrations();
        const targetId = id?.toString();
        const found = myRegs.find((r) => {
          const regEventId = r.event?._id ? r.event._id.toString() : r.event?.toString();
          return regEventId === targetId && r.status !== 'cancelled';
        });
        setUserRegistration(found || null);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id, user]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please log in as a Student to register!');
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      toast.error('Only students can register for events.');
      return;
    }

    // Check if event is paid
    if ((event.eventType === 'Paid' || event.registrationFee > 0) && !event.isFull) {
      setIsPaymentModalOpen(true);
      return;
    }

    executeRegistration({});
  };

  const handlePaymentSuccess = (paymentResult) => {
    setIsPaymentModalOpen(false);
    if (paymentResult?.registration?.registrationId) {
      toast.success(paymentResult.message || 'Razorpay Payment Verified & Ticket Issued!');
      navigate(`/student/ticket/${paymentResult.registration.registrationId}`);
    } else {
      fetchEventData();
    }
  };

  const executeRegistration = async (paymentData = {}) => {
    setRegistering(true);
    try {
      const res = await registrationService.registerForEvent(id, paymentData);
      toast.success(res.message || 'Registration Successful! Digital QR Ticket Issued.');
      setIsPaymentModalOpen(false);
      
      if (res.registration?.registrationId) {
        navigate(`/student/ticket/${res.registration.registrationId}`);
      } else {
        fetchEventData();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!event) return <div className="p-8 text-center text-neutral-500">Event not found.</div>;

  const isEventPassed = new Date(event.date) < new Date();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <FiArrowLeft size={16} />
        <span>Back to Events</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Image & Main Info) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-80 w-full bg-neutral-100 dark:bg-neutral-800">
              <img
                src={event.image || '/uploads/default-event.jpg'}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute top-4 left-4 flex space-x-2">
                <Badge variant="purple">{event.category}</Badge>
                <Badge variant={event.eventType === 'Free' ? 'success' : 'info'}>
                  {event.eventType === 'Free' ? 'Free Event' : `Fee: ₹${event.registrationFee}`}
                </Badge>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{event.title}</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 flex items-center space-x-2">
                  <FiUser size={16} />
                  <span>Organized by <strong className="text-neutral-800 dark:text-neutral-200">{event.organizer?.name}</strong> ({event.organizer?.department})</span>
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white font-display">About the Event</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Eligibility & Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Eligibility</h4>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 font-semibold">{event.eligibility}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Department</h4>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 font-semibold">{event.department}</p>
                </div>
              </div>

              {/* Guidelines */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center space-x-1.5">
                  <FiFileText size={14} />
                  <span>Event Guidelines & Rules</span>
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">{event.rules}</p>
              </div>
            </div>
          </div>

          {/* Feedback & Reviews Section */}
          {feedbackData && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                  <FiStar className="text-amber-500" size={18} />
                  <span>Student Feedback & Ratings</span>
                </h3>
                <span className="text-sm font-bold text-amber-500">
                  {feedbackData.averageRating} / 5 ({feedbackData.totalReviews} reviews)
                </span>
              </div>

              {feedbackData.totalReviews === 0 ? (
                <p className="text-xs text-neutral-400 italic">No feedback submitted yet for this event.</p>
              ) : (
                <div className="space-y-3">
                  {feedbackData.feedbacks.map((fb) => (
                    <div key={fb._id} className="p-3.5 rounded-md bg-neutral-50 dark:bg-neutral-800/40 space-y-1 border border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">{fb.user?.name || 'Student'}</span>
                        <span className="text-amber-500 font-semibold">★ {fb.rating}/5</span>
                      </div>
                      {fb.comment && <p className="text-xs text-neutral-600 dark:text-neutral-300">{fb.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (Sidebar Sticky Ticket Action Box) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6 sticky top-24 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Event Details</h3>

            <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="flex items-start space-x-3">
                <FiCalendar className="mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-xs text-neutral-400 font-semibold">Date</p>
                  <p className="font-bold text-neutral-900 dark:text-white">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FiClock className="mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-xs text-neutral-400 font-semibold">Time</p>
                  <p className="font-bold text-neutral-900 dark:text-white">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FiMapPin className="mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-xs text-neutral-400 font-semibold">Venue</p>
                  <p className="font-bold text-neutral-900 dark:text-white">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FiUsers className="mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-xs text-neutral-400 font-semibold">Capacity & Seats</p>
                  <p className="font-bold text-neutral-900 dark:text-white">
                    {event.registeredCount} / {event.capacity} Registered ({event.availableSeats} Available)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FiPhone className="mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-xs text-neutral-400 font-semibold">Organizer Contact</p>
                  <p className="font-bold text-neutral-900 dark:text-white">{event.contact}</p>
                </div>
              </div>
            </div>

            {/* Registration Action Box */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
              {userRegistration ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center">
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center space-x-1.5">
                      <FiCheckCircle size={16} />
                      <span>You are registered for this event!</span>
                    </p>
                  </div>
                  <Link
                    to={`/student/ticket/${userRegistration.registrationId}`}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-center block text-sm shadow-md"
                  >
                    View Digital QR Ticket
                  </Link>
                </div>
              ) : isEventPassed ? (
                <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center text-xs font-bold text-neutral-500">
                  Event Completed
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className={`w-full py-3.5 font-bold text-white rounded-xl text-sm shadow-lg transition-all ${
                    event.isFull ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {registering ? 'Processing...' : event.isFull ? 'Join Waitlist' : 'Register Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        event={event}
        onPaymentSuccess={handlePaymentSuccess}
        isProcessing={registering}
      />
    </div>
  );
};

export default EventDetail;
