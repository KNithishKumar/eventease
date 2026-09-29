import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FiCheck, FiX } from 'react-icons/fi';

const PendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject Modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const fetchPending = async () => {
    try {
      const data = await adminService.getPendingEvents();
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load pending events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveEvent(id);
      toast.success('Event approved successfully! Published live to student discovery.');
      fetchPending();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;
    setRejecting(true);
    try {
      await adminService.rejectEvent(selectedEvent._id, rejectionReason);
      toast.success('Event rejected with feedback provided to organizer.');
      setSelectedEvent(null);
      setRejectionReason('');
      fetchPending();
    } catch (err) {
      toast.error('Rejection failed');
    } finally {
      setRejecting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header Banner Container */}
      <div className="bg-white border border-neutral-200 p-6">
        <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
          Administrative Moderation
        </label>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
          Pending Event Approvals
        </h1>
        <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
          Review organizer event submissions before making them public to campus students.
        </p>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="All Caught Up!"
          message="There are currently no organizer events awaiting admin review."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="bg-white border border-neutral-200 p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="warning">Pending Approval</Badge>
                  <Badge variant="purple">{ev.category}</Badge>
                </div>

                <h3 className="text-xl font-bold uppercase tracking-wider text-neutral-900">
                  {ev.title}
                </h3>
                <p className="text-s text-neutral-600 font-[Segoe UI] line-clamp-3">
                  {ev.description}
                </p>

                <div className="space-y-1 text-s text-neutral-500 font-[Segoe UI]">
                  <p>
                    <strong className="text-neutral-900">Organizer:</strong> {ev.organizer?.name} ({ev.organizer?.email})
                  </p>
                  <p>
                    <strong className="text-neutral-900">Date & Venue:</strong> {new Date(ev.date).toLocaleDateString()} @ {ev.venue}
                  </p>
                  <p>
                    <strong className="text-neutral-900">Capacity:</strong> {ev.capacity} seats
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setSelectedEvent(ev)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1"
                >
                  <FiX size={14} />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => handleApprove(ev._id)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1"
                >
                  <FiCheck size={14} />
                  <span>Approve & Publish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={`Reject Event: ${selectedEvent?.title}`}
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Provide Rejection Reason for Organizer *
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Venue overlap / Incomplete guidelines / Needs approval from department head..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={rejecting}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider transition-colors"
          >
            {rejecting ? 'Submitting Rejection...' : 'Confirm Event Rejection'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PendingEvents;