import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import toast from 'react-hot-toast';
import { FiCalendar, FiUploadCloud, FiArrowLeft, FiPlusCircle } from 'react-icons/fi';

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

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    venue: '',
    date: '',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    registrationDeadline: '',
    capacity: 50,
    eventType: 'Free',
    registrationFee: 0,
    eligibility: 'All College Students',
    department: 'Computer Science',
    rules: 'Standard college guidelines apply.',
    contact: '',
    upiId: '',
    bankName: '',
    bankAccountNumber: '',
    bankIfsc: '',
    accountHolderName: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      await eventService.createEvent(data);
      toast.success('Event submitted successfully! Awaiting Admin approval.');
      navigate('/organizer/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
      >
        <FiArrowLeft size={16} />
        <span>Back to Events</span>
      </button>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-lg space-y-6 shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Organizer Portal
          </span>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">Create New Campus Event</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Fill out all details. Submitted events will enter Pending Approval status for Admin review.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              Event Poster / Banner Image
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-48 h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FiUploadCloud size={32} className="text-neutral-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. CodeSprint 2026 Hackathon"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Target Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              >
                <option value="All Departments">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            {/* Venue */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Venue Location *
              </label>
              <input
                type="text"
                name="venue"
                required
                placeholder="e.g. CEG Campus Auditorium"
                value={formData.venue}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              />
            </div>

            {/* Registration Deadline */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Registration Deadline *
              </label>
              <input
                type="date"
                name="registrationDeadline"
                required
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Start Time *
              </label>
              <input
                type="text"
                name="startTime"
                placeholder="09:00 AM"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                End Time *
              </label>
              <input
                type="text"
                name="endTime"
                placeholder="05:00 PM"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              />
            </div>

            {/* Max Capacity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Maximum Seats (Capacity) *
              </label>
              <input
                type="number"
                name="capacity"
                min="1"
                required
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              />
            </div>

            {/* Event Type (Free / Paid) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Fee Type
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              >
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {formData.eventType === 'Paid' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                    Registration Fee (₹) *
                  </label>
                  <input
                    type="number"
                    name="registrationFee"
                    min="1"
                    required
                    value={formData.registrationFee}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Organizer Real Payment & Collection Account
                    </h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Students will pay directly to these details via UPI or Net Banking to complete registration.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Organizer UPI ID *
                      </label>
                      <input
                        type="text"
                        name="upiId"
                        placeholder="e.g. 9876543210@ybl or organizer@okaxis"
                        required={formData.eventType === 'Paid'}
                        value={formData.upiId}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        name="accountHolderName"
                        placeholder="e.g. CSE Association / John Doe"
                        required={formData.eventType === 'Paid'}
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        placeholder="e.g. State Bank of India"
                        required={formData.eventType === 'Paid'}
                        value={formData.bankName}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Bank Account Number *
                      </label>
                      <input
                        type="text"
                        name="bankAccountNumber"
                        placeholder="e.g. 39281048591"
                        required={formData.eventType === 'Paid'}
                        value={formData.bankAccountNumber}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        name="bankIfsc"
                        placeholder="e.g. SBIN0001234"
                        required={formData.eventType === 'Paid'}
                        value={formData.bankIfsc}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Eligibility */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Eligibility Criteria
              </label>
              <input
                type="text"
                name="eligibility"
                placeholder="e.g. Open to all 3rd and 4th year CSE students"
                value={formData.eligibility}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              />
            </div>

            {/* Contact Info */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Organizer Contact Info *
              </label>
              <input
                type="text"
                name="contact"
                required
                placeholder="organizer@eventease.edu | +91 98765 43211"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Event Description *
              </label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Provide a detailed overview of the event, agenda, prizes..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-colors text-sm flex items-center justify-center space-x-2"
          >
            <FiPlusCircle size={18} />
            <span>{submitting ? 'Submitting Event...' : 'Submit Event for Admin Approval'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
