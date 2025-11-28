import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { FaArrowLeft, FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        toast.success('OTP sent to your email! Please check your inbox.');
        setStep(2);
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOtp(email, otp);
      
      if (response.success && response.token) {
        toast.success('OTP verified successfully!');
        setResetToken(response.token);
        setStep(3);
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      toast.error('Password must contain at least one lowercase letter, one uppercase letter, and one number');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword({
        token: resetToken,
        newPassword
      });
      
      if (response.success) {
        toast.success('Password reset successful! You can now login with your new password.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070B13] to-[#23375a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">EKUINOX</h1>
          <p className="text-white/60">Reset your password</p>
        </div>

        {/* Password Reset Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          
          {/* Step 1: Enter Email */}
          {step === 1 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#5695F5]/20 flex items-center justify-center">
                  <FaEnvelope className="text-[#5695F5] text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Forgot Password</h2>
                  <p className="text-white/60 text-sm">Enter your email to receive OTP</p>
                </div>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5695F5] hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <FaEnvelope />
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#5695F5]/20 flex items-center justify-center">
                  <FaShieldAlt className="text-[#5695F5] text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Enter OTP</h2>
                  <p className="text-white/60 text-sm">Check your email for the code</p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-blue-200 text-sm">
                  We've sent a 6-digit verification code to <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-white/80 text-sm font-medium mb-2">
                    6-Digit OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white text-center text-2xl tracking-widest placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-[#5695F5] hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <FaShieldAlt />
                      Verify OTP
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-white/70 hover:text-white text-sm flex items-center justify-center gap-2 py-2"
                >
                  <FaArrowLeft />
                  Back to email
                </button>
              </form>
            </>
          )}

          {/* Step 3: Set New Password */}
          {step === 3 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#5695F5]/20 flex items-center justify-center">
                  <FaLock className="text-[#5695F5] text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Set New Password</h2>
                  <p className="text-white/60 text-sm">Create a strong password</p>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-white/80 text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                    placeholder="Enter new password"
                    required
                  />
                  <p className="text-white/50 text-xs mt-2">
                    Must be 6+ characters with uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-white/80 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5695F5] hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <FaLock />
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center text-white/70 text-sm">
            Remember your password?{' '}
            <Link className="text-[#7fb2ff] hover:underline" to="/login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
