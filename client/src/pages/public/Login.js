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
    <div className="flex items-center justify-center p-4 dark:bg-black">
      <div className="w-full max-w-md space-y-6 dark:bg-black">

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-l font-bold uppercase tracking-wider text-black-500 dark:text-white-400 mb-1">
              Email Address
            </label>
            <div className="relative">

              <input
                type="email"
                required
          
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-4 py-3 text-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
           <label className="block text-l font-bold uppercase tracking-wider text-black-500 dark:text-white-400 mb-1">
              Password
            </label>
            <div className="relative">
              
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-4 py-3 text-xl bg-neutral-50 border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white dark:bg-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-xl py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold transition-colors text-sm"
          >
            {loading ? 'Authenticating...' : 'LOG IN'}
          </button>
        </form>

        <div className="text-center text-s text-neutral-500 font-[Seouge UI] dark:text-neutral-400">
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
