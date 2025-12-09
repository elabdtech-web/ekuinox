import React, { useState, useRef } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../config/axiosInstance';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const submitButtonRef = useRef(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from) || '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  // Debug function to test token and API
  const testTokenAndAPI = async () => {
    console.log('🧪 TESTING TOKEN AND API...');
    const token = localStorage.getItem('token');
    console.log('🧪 Token in localStorage:', token);
    
    if (!token) {
      console.error('❌ No token found. Please login first.');
      alert('No token found. Please login first.');
      return;
    }
    
    try {
      console.log('🧪 Testing API call with token...');
      const response = await axiosInstance.get('/city/getCities');
      console.log('✅ API call successful:', response.data);
      alert('✅ API call successful! Token is working.');
    } catch (err) {
      console.error('❌ API call failed:', err);
      alert('❌ API call failed: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent rapid submissions (rate limiting)
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttempt;
    const minInterval = attemptCount > 2 ? 5000 : 1000; // 5 seconds after 3 attempts, 1 second otherwise
    
    if (timeSinceLastAttempt < minInterval) {
      const waitTime = Math.ceil((minInterval - timeSinceLastAttempt) / 1000);
      setError(`Please wait ${waitTime} seconds before trying again.`);
      return;
    }
    
    // Disable submit button to prevent double clicks
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
    }
    setLoading(true);
    setError('');
    setLastAttempt(now);
    setAttemptCount(prev => prev + 1);

    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      setLoading(false);
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
      }
      return;
    }

    try {
      const result = await login(credentials.email, credentials.password);
      if (result.success) {
        // Reset attempt count on successful login
        setAttemptCount(0);
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Login submission error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070B13] to-[#23375a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">EKUINOX</h1>
          <p className="text-white/60">Welcome back</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Sign In</h2>

          {error && (
            <div className={`border px-4 py-3 rounded-lg mb-6 ${
              error.includes('wait') || error.includes('Too many') 
                ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200' 
                : 'bg-red-500/20 border-red-500/30 text-red-200'
            }`}>
              {error}
            </div>
          )}

          {attemptCount > 2 && (
            <div className="bg-blue-500/20 border border-blue-500/30 text-blue-200 px-4 py-3 rounded-lg mb-6 text-sm">
              ⚡ Frequent login attempts detected. Please wait between attempts to avoid rate limiting.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-white/80 text-sm font-medium">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-[#7fb2ff] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pr-12 px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-black p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={18} color="#000" /> : <FiEye size={18} color="#000" />}
                </button>
              </div>
            </div>

            <button
              ref={submitButtonRef}
              type="submit"
              disabled={loading}
              className="w-full bg-[#5695F5] hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* DEBUG TEST BUTTON */}
          <button
            onClick={testTokenAndAPI}
            className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm"
          >
            🧪 Test Token & API (Debug Only)
          </button>

          <div className="mt-6 text-center text-white/70 text-sm">
            Don&apos;t have an account?{' '}
            <Link className="text-[#7fb2ff] hover:underline" to="/register">Sign up</Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white transition text-sm">
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;