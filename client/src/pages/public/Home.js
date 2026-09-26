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
      <section className="py-10 border-b border-neutral-200 dark:border-neutral-800 dark:bg-black rounded-lg p-6 sm:p-10 text-center sm:text-left">
        <div className="max-w-3xl space-y-4">
  
          <span className="text-4xl font-[] font-bold text-neutral-900 dark:text-white">
            Discover & Book College Events Easily
          </span>
      

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/events"
              className="px-5 py-2.5 font-[Seouge UI] bg-primary-500 hover:bg-primary-700 text-white text-xl transition-colors inline-flex items-center space-x-1.5"
          >
              <span>Browse All Events</span>
              <FiArrowRight size={25} />
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 bg-primary-500 font-[Seouge UI] hover:bg-primary-700 text-white text-xl font-medium transition-colors"
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
            <h2 className="text-5xl font-[Seouge UI] font-bold text-neutral-900 dark:text-white">Upcoming Events</h2>
      </div>
          <Link
            to="/events"
            className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center space-x-1"
          >
            <span>View All</span>
            <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
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
    </div>
  );
};

export default Home;
