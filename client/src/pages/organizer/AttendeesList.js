import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrationService } from '../../services/registrationService';
import { eventService } from '../../services/eventService';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiSearch, FiDownload, FiArrowLeft, FiCheckCircle, FiClock, FiUsers } from 'react-icons/fi';

const AttendeesList = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [year, setYear] = useState('All');
  const [checkedInFilter, setCheckedInFilter] = useState('');

  const fetchRoster = async () => {
    try {
      const ev = await eventService.getEventById(id);
      setEvent(ev);

      const params = {};
      if (search) params.search = search;
      if (department !== 'All') params.department = department;
      if (year !== 'All') params.year = year;
      if (checkedInFilter !== '') params.checkedIn = checkedInFilter;

      const regs = await registrationService.getEventRegistrations(id, params);
      setRegistrations(regs);
    } catch (err) {
      toast.error('Failed to load attendee roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, [id, search, department, year, checkedInFilter]);

  const exportCSV = () => {
    if (registrations.length === 0) return;
    const headers = ['Registration ID,Student Name,Email,Department,Year,Status,Checked In,Checked In Time'];
    const rows = registrations.map((r) => {
      const u = r.user || {};
      const checkedInStr = r.checkedIn ? 'YES' : 'NO';
      const checkInTime = r.checkedInAt ? new Date(r.checkedInAt).toLocaleString() : 'N/A';
      return `"${r.registrationId}","${u.name}","${u.email}","${u.department}","${u.year}","${r.status}","${checkedInStr}","${checkInTime}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendee_Roster_${event?.title || 'Event'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/organizer/events')}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
      >
        <FiArrowLeft size={16} />
        <span>Back to My Organized Events</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600">Event Roster</span>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white font-display mt-1">
            {event?.title} - Registered Attendees
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Total Registrations: {registrations.length} • Capacity: {event?.capacity}
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={registrations.length === 0}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 transition-colors self-start sm:self-auto"
        >
          <FiDownload size={16} />
          <span>Export Roster CSV</span>
        </button>
      </div>

      {/* Roster Filter Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-4 gap-3 shadow-sm">
        <div className="relative sm:col-span-2">
          <FiSearch className="absolute left-3.5 top-1/2 -tranneutral-y-1/2 text-neutral-400" size={16} />
          <input
            type="text"
            placeholder="Search by student name, email, registration ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white"
        >
          <option value="All">Dept: All</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
        </select>

        <select
          value={checkedInFilter}
          onChange={(e) => setCheckedInFilter(e.target.value)}
          className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs text-neutral-900 dark:text-white"
        >
          <option value="">Attendance: All</option>
          <option value="true">Checked In Only</option>
          <option value="false">Pending Check-In</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-3.5">Registration ID</th>
                <th className="px-4 py-3.5">Student Name</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Department & Year</th>
                <th className="px-4 py-3.5">Registration Status</th>
                <th className="px-4 py-3.5">Gate Check-In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-xs text-neutral-400">
                    No attendee records found matching criteria.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                    <td className="px-6 py-3.5 font-mono font-bold text-neutral-900 dark:text-white">
                      {reg.registrationId}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-neutral-900 dark:text-white">
                      {reg.user?.name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3.5 text-neutral-500">{reg.user?.email}</td>
                    <td className="px-4 py-3.5">
                      {reg.user?.department} ({reg.user?.year})
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={reg.status === 'registered' ? 'success' : 'warning'}>
                        {reg.status === 'registered' ? 'Registered' : `Waitlist #${reg.waitlistPosition}`}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      {reg.checkedIn ? (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                          <FiCheckCircle size={14} />
                          <span>Checked In ({new Date(reg.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                        </span>
                      ) : (
                        <span className="text-neutral-400 font-medium">Pending Gate Scan</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendeesList;
