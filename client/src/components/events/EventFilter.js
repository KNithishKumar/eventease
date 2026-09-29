import React from 'react';
import { FiSearch, FiRotateCcw } from 'react-icons/fi';

const categories = [
  'All',
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Hackathon',
  'Competition',
  'Club Event',
  'Other'
];

const departments = [
  'All',
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology'
];

const EventFilter = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white border border-neutral-200 p-4 mb-6 space-y-4 font-[Segoe UI]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
          {/* Category */}
          <select
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="px-3 py-3 bg-neutral-50 border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Fee / Event Type */}
          <select
            value={filters.eventType || 'All'}
            onChange={(e) => onFilterChange('eventType', e.target.value)}
            className="px-3 py-3 bg-neutral-50 border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
          >
            <option value="All">Fee: All</option>
            <option value="Free">Free Only</option>
            <option value="Paid">Paid Only</option>
          </select>

          {/* Date Filter */}
          <select
            value={filters.dateFilter || 'upcoming'}
            onChange={(e) => onFilterChange('dateFilter', e.target.value)}
            className="px-3 py-3 bg-neutral-50 border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
          >
            <option value="upcoming">Date: Upcoming</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
          </select>

          {/* Department */}
          <select
            value={filters.department || 'All'}
            onChange={(e) => onFilterChange('department', e.target.value)}
            className="px-3 py-3 bg-neutral-50 border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                Dept: {d}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 transition-colors flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider"
            title="Reset Filters"
          >
            <FiRotateCcw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EventFilter;