import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiAlertCircle } from 'react-icons/fi';

const categories = [
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

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getEventById(id);
        const eventDate = new Date(data.date);
        if (eventDate < new Date()) {
          setIsPassed(true);
        }

        const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : '';
        const formattedDeadline = data.registrationDeadline ? new Date(data.registrationDeadline).toISOString().split('T')[0] : '';

        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Technical',
          venue: data.venue || '',
          date: formattedDate,
          startTime: data.startTime || '',
          endTime: data.endTime || '',
          registrationDeadline: formattedDeadline,
          capacity: data.capacity || 50,
          eventType: data.eventType || 'Free',
          registrationFee: data.registrationFee || 0,
          eligibility: data.eligibility || '',
          department: data.department || 'All Departments',
          rules: data.rules || '',
          contact: data.contact || '',
          upiId: data.upiId || '',
          bankName: data.bankName || '',
          bankAccountNumber: data.bankAccountNumber || '',
          bankIfsc: data.bankIfsc || '',
          accountHolderName: data.accountHolderName || ''
        });
      } catch (err) {
        toast.error('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPassed) {
      toast.error('Cannot edit an event that has already started or completed.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await eventService.updateEvent(id, data);
      toast.success('Event updated successfully!');
      navigate('/organizer/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!formData) return <div className="p-8 text-center text-s uppercase font-bold text-neutral-500">Event not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/organizer/events')}
        className="inline-flex items-center space-x-2 text-s font-bold uppercase tracking-wider text-neutral-600 hover:text-primary-600 transition-colors"
      >
        <FiArrowLeft size={16} />
        <span>Back to My Organized Events</span>
      </button>

      {/* Event Passed Notice Banner */}
      {isPassed && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center space-x-2">
          <FiAlertCircle size={18} />
          <span>This event has already taken place. Business rules forbid modifying past events.</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white border border-neutral-200 p-8 space-y-6">
        <div>
          <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
            Organizer Portal
          </label>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
            Edit Event Details
          </h1>
          <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
            Updating an event resets its status to Pending Approval for Admin safety check.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                required
                disabled={isPassed}
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI] disabled:opacity-50"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Category
              </label>
              <select
                name="category"
                disabled={isPassed}
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI] disabled:opacity-50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                required
                disabled={isPassed}
                value={formData.venue}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI] disabled:opacity-50"
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Event Date
              </label>
              <input
                type="date"
                name="date"
                required
                disabled={isPassed}
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI] disabled:opacity-50"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                required
                disabled={isPassed}
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI] disabled:opacity-50"
              />
            </div>

            {/* Fee Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Fee Type
              </label>
              <select
                name="eventType"
                disabled={isPassed}
                value={formData.eventType}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI] disabled:opacity-50"
              >
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {formData.eventType === 'Paid' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Registration Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="registrationFee"
                    min="1"
                    disabled={isPassed}
                    value={formData.registrationFee}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI] disabled:opacity-50"
                  />
                </div>

                <div className="sm:col-span-2 p-4 bg-emerald-50 border border-emerald-200 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Organizer Payout & UPI Details
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Organizer UPI ID
                      </label>
                      <input
                        type="text"
                        name="upiId"
                        disabled={isPassed}
                        placeholder="e.g. 9876543210@ybl"
                        value={formData.upiId}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 text-xs text-neutral-900 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        name="accountHolderName"
                        disabled={isPassed}
                        placeholder="e.g. CSE Club"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 text-xs text-neutral-900 font-[Segoe UI] focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        disabled={isPassed}
                        placeholder="e.g. HDFC Bank"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 text-xs text-neutral-900 font-[Segoe UI] focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="bankAccountNumber"
                        disabled={isPassed}
                        placeholder="e.g. 5010023491823"
                        value={formData.bankAccountNumber}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 text-xs text-neutral-900 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        name="bankIfsc"
                        disabled={isPassed}
                        placeholder="e.g. HDFC0001234"
                        value={formData.bankIfsc}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 text-xs text-neutral-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                required
                disabled={isPassed}
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI] disabled:opacity-50"
              ></textarea>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={submitting || isPassed}
            className="w-full text-xl py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold transition-colors text-sm uppercase tracking-wider flex items-center justify-center space-x-2"
          >
            <FiSave size={18} />
            <span>{submitting ? 'Saving Changes...' : 'Save Updated Event Details'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;