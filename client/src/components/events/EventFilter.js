import React from 'react';
import { FiSearch, FiFilter, FiRotateCcw } from 'react-icons/fi';

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
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg mb-6 space-y-4 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 -tranneutral-y-1/2 text-neutral-400" size={16} />
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-900 dark:text-white"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
          {/* Category */}
          <select
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-200"
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
            className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-200"
          >
            <option value="All">Fee: All</option>
            <option value="Free">Free Only</option>
            <option value="Paid">Paid Only</option>
          </select>

          {/* Date Filter */}
          <select
            value={filters.dateFilter || 'upcoming'}
            onChange={(e) => onFilterChange('dateFilter', e.target.value)}
            className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-200"
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
            className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-200"
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
            className="px-3 py-2 rounded-md text-neutral-600 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center space-x-1.5 text-xs font-medium"
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
