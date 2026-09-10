import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import EventCard from '../../components/events/EventCard';
import { FiCalendar, FiCreditCard, FiUserCheck, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeEvents = async () => {
      try {
        const events = await eventService.getEvents({ limit: 6 });
        setFeaturedEvents(events);
      } catch (error) {
        console.error('Failed to fetch home events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeEvents();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="py-10 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg p-6 sm:p-10 text-center sm:text-left">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            College Event Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
            Discover & Book Campus Events Easily
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            EventEase allows college students to browse upcoming workshops, hackathons, and cultural fests, book seats with instant QR digital passes, and enables event organizers to manage attendance.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/events"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors inline-flex items-center space-x-1.5"
            >
              <span>Browse All Events</span>
              <FiArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm font-medium rounded-md transition-colors"
            >
              Student Login
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Upcoming Events</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Explore events scheduled across departments</p>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center space-x-1"
          >
            <span>View All</span>
            <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className="p-6 text-center bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <p className="text-xs text-neutral-500">No approved events listed at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-2">
          <div className="w-9 h-9 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FiCalendar size={18} />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Event Registration</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Register for free or paid events with capacity limits and deadline tracking.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-2">
          <div className="w-9 h-9 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FiCreditCard size={18} />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Digital Pass & Payments</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Receive verified QR pass tickets instantly after booking or Razorpay checkout.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-2">
          <div className="w-9 h-9 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FiUserCheck size={18} />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Organizer Gate Check-In</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Event organizers can scan QR tickets at entry gates to mark attendance in real time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
