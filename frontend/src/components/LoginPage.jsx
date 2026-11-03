import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  KeyRound,
  RotateCw,
  User,
  LogOut,
  Check
} from 'lucide-react';
import { sendOtpApi, verifyOtpApi } from '../api';

export default function LoginPage({
  currentUser,
  onAuthSuccess,
  onLogout,
  onBackToApp
}) {
  // Step 1: 'credentials' (Email & Password)
  // Step 2: 'otp' (6-digit OTP Verification)
  const [step, setStep] = useState('credentials');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [receivedOtp, setReceivedOtp] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Resend OTP countdown timer
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Step 1: Submit Email & Password to receive OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await sendOtpApi(cleanEmail, password, name.trim());
      setReceivedOtp(data.otp || '');
      setSuccessMessage(data.message || `Verification OTP sent to ${cleanEmail}.`);
      setStep('otp');
      setCountdown(45); // 45 seconds resend cooldown
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send verification code. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP and complete authentication
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setErrorMessage('Please enter the 6-digit OTP sent to your email.');
      return;
    }

    if (cleanOtp.length !== 6) {
      setErrorMessage('OTP must be exactly 6 digits.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await verifyOtpApi(email.trim(), cleanOtp, name.trim());
      setSuccessMessage('OTP verified successfully! Entering your workspace...');
      setTimeout(() => {
        onAuthSuccess({ token: data.token, user: data.user });
        if (onBackToApp) onBackToApp();
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-click Auto-Fill OTP helper
  const handleAutoFillOtp = () => {
    if (receivedOtp) {
      setOtp(receivedOtp);
      setErrorMessage('');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isLoading) return;
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      const data = await sendOtpApi(email.trim(), password);
      setReceivedOtp(data.otp || '');
      setSuccessMessage(`New verification code sent to ${email.trim()}.`);
      setCountdown(45);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated, show friendly active session state
  if (currentUser) {
    return (
      <div className="min-h-screen bg-[#020817] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
        
        {/* Navigation Bar */}
        <header className="h-16 px-6 border-b border-slate-800/80 bg-[#020817]/80 backdrop-blur-xl flex items-center justify-between">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Workspace</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Session Active</span>
          </div>
        </header>

        {/* Center Content Card */}
        <div className="max-w-md w-full mx-auto p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] mx-auto shadow-xl shadow-indigo-500/20">
              <div className="w-full h-full bg-[#020817] rounded-[15px] flex items-center justify-center">
                <User className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                {currentUser.name || 'Candidate'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {currentUser.email}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>Authentication Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified via OTP
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={onBackToApp}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>Enter Workspace Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-rose-400 hover:text-rose-300 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="p-6 text-center text-xs text-slate-500">
          SkillBridge Career Accelerator • Protected by 2FA OTP
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="h-16 px-6 border-b border-slate-800/80 bg-[#020817]/70 backdrop-blur-xl flex items-center justify-between">
        <button
          onClick={onBackToApp}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Workspace</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] font-black text-white shadow-md shadow-indigo-500/20">
            S
          </div>
          <span className="text-sm font-bold tracking-tight text-white hidden sm:inline">
            SkillBridge
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Icon & Title */}
            <div className="relative z-10 text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3 text-indigo-400 shadow-lg shadow-indigo-600/20">
                {step === 'credentials' ? (
                  <Lock className="w-6 h-6" />
                ) : (
                  <KeyRound className="w-6 h-6 text-cyan-400" />
                )}
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">
                {step === 'credentials' ? 'Sign In to SkillBridge' : 'Verify One-Time Password'}
              </h2>
              
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {step === 'credentials' ? (
                  <span>Enter your email and password to receive a secure 6-digit OTP code.</span>
                ) : (
                  <span>Enter the 6-digit verification code sent for <strong className="text-cyan-300 font-mono">{email}</strong></span>
                )}
              </p>
            </div>

            {/* Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* STEP 1: ONLY EMAIL & PASSWORD */}
            {/* ---------------------------------------------------------------- */}
            {step === 'credentials' && (
              <form onSubmit={handleSendOtp} className="space-y-4 relative z-10">
                {/* Full Name Input (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Your Full Name
                    </label>
                    <span className="text-[10px] text-slate-500">Optional</span>
                  </div>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sachin Yadav"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition font-sans"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. candidate@skillbridge.io"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition font-sans"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <span className="text-[10px] text-slate-500">Min. 6 chars</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !email.trim() || !password.trim()}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                      <span>Sending Secure OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue & Send OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Security Tag */}
                <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Two-factor protected: Email + Password + 6-Digit OTP</span>
                </div>
              </form>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
            {/* ---------------------------------------------------------------- */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 relative z-10">
                
                {/* Instant Verification Code Helper Banner */}
                {receivedOtp && (
                  <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-3 animate-in fade-in">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                        Verification Code
                      </div>
                      <div className="text-base font-black text-white font-mono tracking-widest mt-0.5">
                        {receivedOtp}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg transition flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Auto-Fill</span>
                    </button>
                  </div>
                )}

                {/* OTP Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-center font-mono font-bold text-lg tracking-[0.5em] placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                {/* Submit Verify CTA */}
                <button
                  type="submit"
                  disabled={isLoading || otp.trim().length !== 6}
                  className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent animate-spin rounded-full" />
                      <span>Verifying OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify OTP & Enter Workspace</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick Navigation: Resend & Go Back */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('credentials');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="hover:text-white transition flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Change Credentials</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isLoading}
                    className="text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 disabled:cursor-not-allowed font-semibold transition"
                  >
                    {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>

              </form>
            )}

          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="h-14 px-6 border-t border-slate-800/80 bg-[#020817]/60 flex items-center justify-center text-[11px] text-slate-500">
        <span>SkillBridge © 2026 • AI Resume Visualizer, Analyzer & Career Accelerator</span>
      </footer>

    </div>
  );
}
