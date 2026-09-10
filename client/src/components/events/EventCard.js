import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUser, FiUsers, FiTag, FiClock } from 'react-icons/fi';
import Badge from '../common/Badge';

const EventCard = ({ event, onRegister, isRegistering = false, userRegistration = null }) => {
  const {
    _id,
    title,
    image,
    category,
    venue,
    date,
    startTime,
    organizer,
    capacity,
    registeredCount = 0,
    availableSeats = 0,
    isFull = false,
    eventType = 'Free',
    registrationFee = 0,
    status
  } = event;

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Hackathon':
        return 'purple';
      case 'Workshop':
        return 'info';
      case 'Cultural':
        return 'warning';
      case 'Sports':
        return 'success';
      case 'Technical':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
      {/* Image / Poster Header */}
      <div className="relative h-48 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <img
          src={image ? (image.startsWith('http') ? image : image) : '/uploads/default-event.jpg'}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60';
          }}
        />
        <div className="absolute top-3 left-3 flex space-x-2">
          <Badge variant={getCategoryColor(category)}>{category}</Badge>
          <Badge variant={eventType === 'Free' ? 'success' : 'purple'}>
            {eventType === 'Free' ? 'Free' : `₹${registrationFee}`}
          </Badge>
        </div>
        {status === 'pending' && (
          <div className="absolute top-3 right-3">
            <Badge variant="warning">Pending Approval</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white line-clamp-1 hover:text-indigo-600 transition-colors">
            {title}
          </h3>

          <div className="mt-3 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center space-x-2">
              <FiCalendar className="shrink-0" size={14} />
              <span>{formatDate(date)} ({startTime})</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiMapPin className="shrink-0" size={14} />
              <span className="line-clamp-1">{venue}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiUser className="shrink-0" size={14} />
              <span>{organizer?.name || 'Organizer'}</span>
            </div>
          </div>
        </div>

        {/* Foot Stats & Actions */}
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <FiUsers size={14} className="text-neutral-400" />
            <span>
              {registeredCount}/{capacity} registered
            </span>
            {isFull && <span className="text-rose-500 font-bold text-[10px] ml-1">(Waitlist Open)</span>}
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/events/${_id}`}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Details
            </Link>

            {userRegistration ? (
              <Badge variant={userRegistration.status === 'registered' ? 'success' : 'warning'}>
                {userRegistration.status === 'registered' ? 'Registered' : `Waitlist #${userRegistration.waitlistPosition}`}
              </Badge>
            ) : onRegister ? (
              <button
                onClick={() => onRegister(_id)}
                disabled={isRegistering}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors text-white shadow-sm ${
                  isFull ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isFull ? 'Join Waitlist' : 'Register'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
