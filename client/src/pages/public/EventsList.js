import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../../components/events/EventCard';
import EventFilter from '../../components/events/EventFilter';
import PaymentModal from '../../components/events/PaymentModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FiStar, FiCalendar } from 'react-icons/fi';

const EventsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    department: 'All',
    eventType: 'All',
    dateFilter: 'upcoming'
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEvents(filters);
      setEvents(data);

      if (user?.role === 'student') {
        const regData = await registrationService.getMyRegistrations();
        setMyRegistrations(regData);

        // Recommended events fetch
        const recData = await eventService.getEvents({ recommended: 'true', limit: 3 });
        setRecommendedEvents(recData);
      }
    } catch (error) {
      console.error('Failed to load events', error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters, user]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      department: 'All',
      eventType: 'All',
      dateFilter: 'upcoming'
    });
  };

  const [selectedPaidEvent, setSelectedPaidEvent] = useState(null);

  const handleRegister = async (eventId) => {
    if (!user) {
      toast.error('Please log in as a Student to register for events!');
      return;
    }
    if (user.role !== 'student') {
      toast.error('Only students can register for events.');
      return;
    }

    const targetEvent = events.find((e) => e._id === eventId) || recommendedEvents.find((e) => e._id === eventId);
    if (targetEvent && (targetEvent.eventType === 'Paid' || targetEvent.registrationFee > 0) && !targetEvent.isFull) {
      setSelectedPaidEvent(targetEvent);
      return;
    }

    executeRegistration(eventId, {});
  };

  const handlePaymentSuccess = (paymentResult) => {
    setSelectedPaidEvent(null);
    if (paymentResult?.registration?.registrationId) {
      toast.success(paymentResult.message || 'Razorpay Payment Verified & Ticket Issued!');
      navigate(`/student/ticket/${paymentResult.registration.registrationId}`);
    } else {
      fetchEvents();
    }
  };

  const executeRegistration = async (eventId, paymentData = {}) => {
    setRegisteringId(eventId);
    try {
      const res = await registrationService.registerForEvent(eventId, paymentData);
      toast.success(res.message || 'Registration Successful! Digital QR Ticket Issued.');
      setSelectedPaidEvent(null);
      
      if (res.registration?.registrationId) {
        navigate(`/student/ticket/${res.registration.registrationId}`);
      } else {
        fetchEvents();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
    } finally {
      setRegisteringId(null);
    }
  };

  const getUserRegStatus = (eventId) => {
    if (!eventId || !myRegistrations || myRegistrations.length === 0) return null;
    const targetId = eventId.toString();
    const reg = myRegistrations.find((r) => {
      const regEventId = r.event?._id ? r.event._id.toString() : r.event?.toString();
      return regEventId === targetId && r.status !== 'cancelled';
    });
    return reg || null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Title */}
      <div>
        <h1 className="text-3xl font-black text-neutral-900 dark:text-white font-display">Campus Event Discovery</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Explore technical hackathons, workshops, cultural nights, and sports competitions.
        </p>
      </div>

      {/* Filter Component */}
      <EventFilter filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />

      {/* Recommended For You Section (Student only) */}
      {user?.role === 'student' && recommendedEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FiStar className="text-amber-500" size={20} />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-display">
              Recommended For You ({user.interests.join(', ') || 'General'})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedEvents.slice(0, 3).map((event) => (
              <EventCard
                key={`rec-${event._id}`}
                event={event}
                onRegister={handleRegister}
                isRegistering={registeringId === event._id}
                userRegistration={getUserRegStatus(event._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Events Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-display flex items-center space-x-2">
          <FiCalendar className="text-primary-500" size={20} />
          <span>All Events ({events.length})</span>
        </h2>

        {loading ? (
          <LoadingSpinner text="Fetching events..." />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events match your criteria"
            message="Try searching for a different keyword or reset filters to view all upcoming campus events."
            action={
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-primary-600 text-white font-bold rounded-xl text-xs hover:bg-primary-700 transition-colors"
              >
                Reset Filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRegister={handleRegister}
                isRegistering={registeringId === event._id}
                userRegistration={getUserRegStatus(event._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={!!selectedPaidEvent}
        onClose={() => setSelectedPaidEvent(null)}
        event={selectedPaidEvent}
        onPaymentSuccess={handlePaymentSuccess}
        isProcessing={!!registeringId}
      />
    </div>
  );
};

export default EventsList;
