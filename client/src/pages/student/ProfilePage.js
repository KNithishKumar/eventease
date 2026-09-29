import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { FiCheck, FiSave } from 'react-icons/fi';

const interestOptions = [
  'Coding',
  'AI/ML',
  'Web Development',
  'Cybersecurity',
  'Robotics',
  'Entrepreneurship',
  'Cultural',
  'Sports',
  'Workshops'
];

const ProfilePage = () => {
  const { user, updateProfileState } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || 'Computer Science',
    year: user?.year || '3rd Year',
    phone: user?.phone || '',
    interests: user?.interests || []
  });

  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await authService.updateProfile(formData);
      updateProfileState(updated);
      toast.success('Profile and interest preferences updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Container */}
      <div className="bg-white border border-neutral-200 p-6">
        <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
          Student Portal
        </label>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
          Student Profile & Preferences
        </h1>
        <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
          Manage your account information and event interest preferences.
        </p>
      </div>

      {/* Main Profile Form Container */}
      <div className="bg-white border border-neutral-200 p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
              />
            </div>

            {/* Email Address (Disabled) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 text-sm bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed font-[Segoe UI]"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Academic Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Phone Number */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
              />
            </div>
          </div>

          {/* Interest Preference Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Interest Categories (Powers Recommendation Engine)
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => {
                const selected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 font-[Segoe UI] ${
                      selected
                        ? 'bg-primary-600 text-white border border-primary-600'
                        : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                    }`}
                  >
                    {selected && <FiCheck size={14} />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold transition-colors text-sm uppercase tracking-wider flex items-center justify-center space-x-2"
          >
            <FiSave size={18} />
            <span>{loading ? 'Saving Preferences...' : 'Save Profile & Preferences'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;