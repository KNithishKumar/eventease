import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiBookOpen, FiCheck } from 'react-icons/fi';

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

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    phone: '',
    interests: ['Coding', 'Web Development']
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
        year: formData.year,
        phone: formData.phone,
        interests: formData.interests
      });

      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center font-[Seouge UI] p-4 py-12 dark:bg-black">
    <div className="w-full max-w-xl space-y-6 font-[Seouge UI] bg-primary dark:bg-black p-6 sm:p-8 ">

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-white">
          Create Your Account
        </h2>

        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Account Role Selector */}
        <div>
          <label className="block text-l font-bold uppercase tracking-wider font-[Seouge UI] text-neutral-700 dark:text-white mb-2">
            Select Role
          </label>

          <div className="grid grid-cols-3 gap-3 font-[Seouge UI]">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`py-3 px-3 border text-sm font-bold transition-all flex items-center justify-center ${
                formData.role === 'student'
                  ? 'bg-primary-50 dark:bg-primary-950/80 border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'bg-white dark:bg-black border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-primary-500'
              }`}
            >
              <span>STUDENT</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'organizer' })}
              className={`py-3 px-3 border text-sm font-bold transition-all flex items-center justify-center ${
                formData.role === 'organizer'
                  ? 'bg-primary-50 dark:bg-teal-950/80 border-primary-500 text-secondary-600 dark:text-secondary-400'
                  : 'bg-white dark:bg-black border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-primary-500'
              }`}
            >
              <span>ORGANIZER</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'admin' })}
              className={`py-3 px-3 border text-sm font-bold transition-all flex items-center justify-center ${
                formData.role === 'admin'
                  ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'bg-white dark:bg-black border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-rose-500'
              }`}
            >
              <span>ADMIN</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Full Name */}
          <div>
            <label className="block text-l font-bold uppercase tracking-wider text-neutral-700 dark:text-white mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 text-xl font-[Seouge UI] font-bold bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-l font-bold uppercase tracking-wider text-neutral-700 dark:text-white mb-1">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 text-xl font-[Seouge UI] font-bold bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-l font-bold uppercase tracking-wider text-neutral-700 dark:text-white mb-1">
              Department
            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 text-xl font-[Seouge UI] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            <label className="block text-l font-bold uppercase tracking-wider text-neutral-700 dark:text-white mb-1">
              Academic Year
            </label>

            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-3 text-xl font-[Seouge UI] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-l font-bold uppercase tracking-wider text-neutral-700 dark:text-white mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 text-xl font-[Seouge UI] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-l font-bold uppercase tracking-wider text-neutral-700 dark:text-white mb-1">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 text-xl font-[Seouge UI] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            />
          </div>

        </div>

        {/* Interests */}
        <div>
          <label className="block text-l font-bold uppercase tracking-wider text-neutral-700 dark:text-white mb-2">
            Select Your Event Interests
          </label>

          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => {
              const selected = formData.interests.includes(interest);

              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-2 border text-l font-[Segoe UI] font-bold transition-all flex items-center space-x-1 ${
                    selected
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white dark:bg-black border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-primary-500'
                  }`}
                >
                  {selected && <FiCheck size={14} />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-lg font-bold transition-colors"
        >
          {loading ? 'Creating Account...' : 'COMPLETE REGISTRATION'}
        </button>

      </form>

      <div className="text-center text-xl text-neutral-500 dark:text-neutral-400">
        Already registered?{' '}
        <Link
          to="/login"
          className="font-bold text-l text-primary-600 dark:text-primary-400 hover:underline"
        >
          Log In Here
        </Link>
      </div>

    </div>
  </div>
);
};

export default Register;
