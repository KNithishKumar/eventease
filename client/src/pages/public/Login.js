import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiUserCheck, FiZap } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email, password });
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (user.role === 'student') navigate('/student/dashboard');
        else if (user.role === 'organizer') navigate('/organizer/dashboard');
        else if (user.role === 'admin') navigate('/admin/dashboard');
        else navigate('/');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    try {
      const user = await login({ email: demoEmail, password: demoPassword });
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'organizer') navigate('/organizer/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-lg shadow-sm">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-md bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <FiLogIn size={20} />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Sign in to access your digital tickets, registrations, or dashboard
          </p>
        </div>

        {/* Demo Quick Logins */}
        <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center justify-center space-x-1">
            <FiZap className="text-amber-500" />
            <span>One-Click Demo Logins</span>
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleDemoLogin('student1@eventease.com', 'password123')}
              className="py-1.5 px-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl font-bold text-primary-600 dark:text-primary-400 hover:border-primary-500 transition-colors"
            >
              Student
            </button>
            <button
              onClick={() => handleDemoLogin('organizer@eventease.com', 'password123')}
              className="py-1.5 px-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl font-bold text-secondary-500 hover:border-secondary-500 transition-colors"
            >
              Organizer
            </button>
            <button
              onClick={() => handleDemoLogin('admin@eventease.com', 'password123')}
              className="py-1.5 px-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl font-bold text-rose-500 hover:border-rose-500 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -tranneutral-y-1/2 text-neutral-400" size={18} />
              <input
                type="email"
                required
                placeholder="student@eventease.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -tranneutral-y-1/2 text-neutral-400" size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-colors text-sm"
          >
            {loading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
