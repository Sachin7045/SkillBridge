import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowLeft,
  Briefcase,
  Zap,
  Target,
  FileText,
  LogOut,
  ChevronRight,
  KeyRound
} from 'lucide-react';
import { registerUser, loginUser } from '../api';

export default function LoginPage({
  currentUser,
  onAuthSuccess,
  onLogout,
  onBackToApp
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!name.trim()) {
        setErrorMessage('Please provide your full name.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'register') {
        const data = await registerUser(email.trim(), password, name.trim());
        setSuccessMessage('Account created successfully! Entering workspace...');
        setTimeout(() => {
          onAuthSuccess({ token: data.token, user: data.user });
          if (onBackToApp) onBackToApp();
        }, 600);
      } else {
        const data = await loginUser(email.trim(), password, name.trim());
        setSuccessMessage(`Welcome back${data.user?.name ? ', ' + data.user.name : ''}! Redirecting to workspace...`);
        setTimeout(() => {
          onAuthSuccess({ token: data.token, user: data.user });
          if (onBackToApp) onBackToApp();
        }, 500);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-Click Instant Demo Login
  const handleQuickDemoLogin = async (demoEmail, demoPass, demoName = '') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    if (demoName) setName(demoName);
    setMode('login');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const data = await loginUser(demoEmail, demoPass, demoName);
      setSuccessMessage(`Signed in as ${data.user.name || demoEmail}! Loading workspace...`);
      setTimeout(() => {
        onAuthSuccess({ token: data.token, user: data.user });
        if (onBackToApp) onBackToApp();
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || 'Quick demo login failed.');
      setIsLoading(false);
    }
  };

  // If already authenticated, show friendly Account state
  if (currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
        
        {/* Navigation Bar */}
        <header className="h-16 px-6 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Session Active</span>
          </div>
        </header>

        {/* Center Content Card */}
        <div className="max-w-xl w-full mx-auto p-6 sm:p-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] mx-auto shadow-xl shadow-indigo-500/20 mb-4">
                <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                  <User className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Candidate Account</span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight">
                {currentUser.name || 'Candidate Member'}
              </h2>
              <p className="text-sm text-slate-400 mt-1 font-mono">
                {currentUser.email}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6 text-left">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Account ID</div>
                  <div className="text-xs font-mono text-slate-300 mt-1 truncate">{currentUser.id || 'usr_verified'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Storage Scope</div>
                  <div className="text-xs font-bold text-cyan-400 mt-1">Cloud Isolated Sync</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
                <button
                  onClick={onBackToApp}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onLogout}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700/80 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-slate-600">
          SkillBridge AI Career Intelligence Platform • End-to-End Secure JWT
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ambience Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="h-16 px-6 sm:px-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl flex items-center justify-between relative z-20">
        <div 
          onClick={onBackToApp}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-syne font-bold text-base text-white tracking-tight">
            Skill<span className="text-cyan-400">Bridge</span>
          </span>
          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            Auth
          </span>
        </div>

        <button
          onClick={onBackToApp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Explore Workspace as Guest</span>
        </button>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full max-w-5xl">
          
          {/* Left Hero Column: Platform Value Showcase */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Intelligence Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Unlock algorithmic ATS readiness & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">AI career intelligence</span>.
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed">
              Create an account or sign in to save your verified resumes, calibrate algorithmic keyword densities, practice Gemini-anchored mock interviews, and optimize achievements in real time.
            </p>

            {/* Feature Highlights List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">8-Rule ATS Audit Engine</h4>
                  <p className="text-[11px] text-slate-400">Deterministic scoring across structure, metrics, taxonomy & verbs.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI STAR Bullet Rewriter</h4>
                  <p className="text-[11px] text-slate-400">Transform weak duties into quantified business impact statements.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Multi-Phase Role Roadmap</h4>
                  <p className="text-[11px] text-slate-400">Target role competency maps closing candidate technical skill gaps.</p>
                </div>
              </div>
            </div>

            {/* Quick Demo Fill Pills */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant 1-Click Demo Accounts</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('candidate@skillbridge.io', 'candidatePass123')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-xs font-medium text-slate-300 hover:text-white transition flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>Sachin Yadav (Full Stack)</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('demo@skillbridge.io', 'demo123456')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-xs font-medium text-slate-300 hover:text-white transition flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Demo Candidate</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Form Column: Interactive Sign In / Register Card */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative"
            >
              
              {/* Card Header & Tab Switcher */}
              <div className="mb-6">
                <div className="flex border-b border-slate-800 bg-slate-950/60 p-1 rounded-2xl mb-5">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      mode === 'login'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      mode === 'register'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <h2 className="text-lg font-bold text-white tracking-tight">
                  {mode === 'login' ? 'Sign in to your Workspace' : 'Create your Candidate Profile'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === 'login' 
                    ? 'Enter your registered credentials or select a demo account.' 
                    : 'Get started in seconds with deterministic ATS analytics.'}
                </p>
              </div>

              {/* Status Notifications */}
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

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name Input (Used for personalized greeting on dashboard) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Full Name {mode === 'login' ? <span className="text-[10px] text-slate-400 font-normal">(for Dashboard greeting)</span> : ''}
                    </label>
                    {mode === 'login' && (
                      <span className="text-[10px] text-indigo-400 font-medium">Dashboard Profile Name</span>
                    )}
                  </div>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required={mode === 'register'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
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
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
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
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
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

                {/* Confirm Password (Registration only) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                )}

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>Authenticating with Server...</span>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create & Access Platform'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch mode link */}
                <div className="text-center pt-2">
                  <span className="text-xs text-slate-400">
                    {mode === 'login' ? "Don't have an account yet? " : "Already have an account? "}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
                  >
                    {mode === 'login' ? 'Create one now' : 'Sign In instead'}
                  </button>
                </div>

                {/* Bottom Trust Badge */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Stateless JWT with bcrypt password hashing</span>
                </div>

              </form>

            </motion.div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-600">
        SkillBridge • AI Resume Visualizer, ATS Analyzer & Career Accelerator
      </footer>

    </div>
  );
}
