import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Component imports
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import OverviewDashboard from './components/OverviewDashboard';
import ResumeVisualizer from './components/ResumeVisualizer';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import JobMatcher from './components/JobMatcher';
import AiMockInterviewer from './components/AiMockInterviewer';
import SkillBridgeRoadmap from './components/SkillBridgeRoadmap';
import BulletOptimizer from './components/BulletOptimizer';
import ResumeVersionComparison from './components/ResumeVersionComparison';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import SkillBridgeLanding from './components/SkillBridgeLanding';
import LoginPage from './components/LoginPage';

// Modals & Feedback
import UploadModal from './components/UploadModal';
import SampleModal from './components/SampleModal';
import ApiKeyModal from './components/ApiKeyModal';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';

// API
import { 
  fetchSamples, 
  fetchRoles, 
  analyzeResumeApi, 
  uploadResumeFile, 
  fetchCurrentUser,
  saveResumeToCloud,
  fetchUserResumes,
  deleteUserResume
} from './api';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Theme state: 'dark' | 'light' with persistent localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('skillbridge_theme') || 'dark');

  // Application Data States
  const [samples, setSamples] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [rolesList, setRolesList] = useState([]);
  const [savedResumes, setSavedResumes] = useState([]);
  
  // API key stored in localStorage
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('skillbridge_gemini_key') || '');
  
  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSamplesOpen, setIsSamplesOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Authentication state
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('skillbridge_auth_token') || '');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skillbridge_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Toast notifications queue
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = 'info', title = '', message = '' }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('skillbridge_theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    addToast({
      type: 'info',
      title: 'Theme Updated',
      message: newTheme === 'dark' ? 'Deep Obsidian dark theme active.' : 'Clean SaaS light theme active.'
    });
  };

  // Apply saved theme on mount
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Initialize data
  useEffect(() => {
    async function initApp() {
      try {
        const [sampleData, rolesData] = await Promise.all([
          fetchSamples(),
          fetchRoles()
        ]);
        
        setSamples(sampleData);
        setRolesList(rolesData.roles || []);
        
        // Initialize default sample profile
        if (sampleData && sampleData.length > 0) {
          const defaultResume = sampleData.find((sample) => sample.id === 'sachin-yadav') || sampleData[0];
          // If no user is logged in yet, sanitize demo template name so it doesn't display personal demo name
          const initialResume = { ...defaultResume, name: "Candidate Profile" };
          setCurrentResume(initialResume);
          const initialAnalysis = await analyzeResumeApi(initialResume, initialResume.targetRole || "Full Stack Developer");
          setAnalysis(initialAnalysis.analysis);
        }
        // Verify active user session if token exists
        const token = localStorage.getItem('skillbridge_auth_token');
        if (token) {
          try {
            const userData = await fetchCurrentUser(token);
            if (userData?.user) {
              setCurrentUser(userData.user);
              // Fetch user's saved resumes
              try {
                const cloudRes = await fetchUserResumes(token);
                if (cloudRes?.resumes && cloudRes.resumes.length > 0) {
                  setSavedResumes(cloudRes.resumes);
                  const latest = cloudRes.resumes[0];
                  setCurrentResume(latest);
                  const res = await analyzeResumeApi(latest, latest.targetRole || "Full Stack Developer");
                  setAnalysis(res.analysis);
                } else if (userData.user?.name) {
                  setCurrentResume(prev => prev ? ({ ...prev, name: userData.user.name, email: userData.user.email }) : prev);
                }
              } catch (e) {
                console.warn('Could not fetch saved resumes:', e);
              }
            }
          } catch {
            localStorage.removeItem('skillbridge_auth_token');
            localStorage.removeItem('skillbridge_user');
            setCurrentUser(null);
            setAuthToken('');
          }
        }
      } catch (err) {
        console.error("Failed to load initial data:", err);
        addToast({
          type: 'error',
          title: 'Connection Notice',
          message: 'Running in offline localized mode.'
        });
      } finally {
        setIsLoadingInitial(false);
      }
    }
    initApp();
  }, []);

  const handleAuthSuccess = async ({ token, user }) => {
    setAuthToken(token);
    setCurrentUser(user);
    if (token) localStorage.setItem('skillbridge_auth_token', token);
    if (user) localStorage.setItem('skillbridge_user', JSON.stringify(user));
    addToast({
      type: 'success',
      title: 'Welcome Back',
      message: `Signed in as ${user.name || user.email}.`
    });

    if (token) {
      try {
        const cloudRes = await fetchUserResumes(token);
        if (cloudRes?.resumes && cloudRes.resumes.length > 0) {
          setSavedResumes(cloudRes.resumes);
          const latest = cloudRes.resumes[0];
          setCurrentResume(latest);
          const res = await analyzeResumeApi(latest, latest.targetRole || "Full Stack Developer");
          setAnalysis(res.analysis);
        } else if (user?.name) {
          // Sync active resume name to logged-in candidate
          setCurrentResume(prev => prev ? ({ ...prev, name: user.name, email: user.email }) : prev);
        }
      } catch (e) {
        console.warn('Could not fetch saved resumes:', e);
      }
    }
  };

  const handleLogout = () => {
    setAuthToken('');
    setCurrentUser(null);
    setSavedResumes([]);
    localStorage.removeItem('skillbridge_auth_token');
    localStorage.removeItem('skillbridge_user');
    setCurrentResume(prev => prev ? ({ ...prev, name: "Candidate Profile" }) : prev);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have logged out of your session.'
    });
  };

  const handleDeleteSavedResume = async (resumeId) => {
    const token = authToken || localStorage.getItem('skillbridge_auth_token');
    if (!token) return;
    try {
      await deleteUserResume(resumeId, token);
      setSavedResumes(prev => prev.filter(r => r.id !== resumeId));
      addToast({
        type: 'info',
        title: 'Resume Deleted',
        message: 'Saved resume removed from your profile.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete resume.'
      });
    }
  };

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    if (newKey) {
      localStorage.setItem('skillbridge_gemini_key', newKey);
      addToast({
        type: 'success',
        title: 'Gemini Key Configured',
        message: 'Google Gemini 1.5 Flash reasoning engine activated.'
      });
    } else {
      localStorage.removeItem('skillbridge_gemini_key');
      addToast({
        type: 'info',
        title: 'Offline Mode Active',
        message: 'Reverted to local intelligent heuristic analyzer.'
      });
    }
  };

  const handleSelectSample = async (sample) => {
    setCurrentResume(sample);
    try {
      const res = await analyzeResumeApi(sample, sample.targetRole || "Full Stack Developer");
      setAnalysis(res.analysis);
      addToast({
        type: 'success',
        title: 'Profile Loaded',
        message: `Loaded ${sample.name}'s verified career history.`
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResumeUploaded = (newResume, newAnalysis) => {
    setCurrentResume(newResume);
    setAnalysis(newAnalysis);
    setActiveTab('overview');
    addToast({
      type: 'success',
      title: 'Resume Processed',
      message: 'Extracted contact, experiences, and technical taxonomy.'
    });
  };

  const handleVisualizerUpload = async (file) => {
    try {
      const data = await uploadResumeFile(file);
      setCurrentResume(data.resume);
      setAnalysis(data.analysis);
      addToast({
        type: 'success',
        title: 'Upload Successful',
        message: `Parsed ${file.name} successfully.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Could not parse resume file.'
      });
    }
  };

  const handleUpdateResume = async (updated) => {
    setCurrentResume(updated);
    try {
      const res = await analyzeResumeApi(updated, updated.targetRole || "Full Stack Developer");
      setAnalysis(res.analysis);
      addToast({
        type: 'success',
        title: 'Changes Saved',
        message: 'ATS score and taxonomy updated.'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveResumeCloud = async (resumeToSave) => {
    const token = authToken || localStorage.getItem('skillbridge_auth_token');
    if (!token) {
      addToast({
        type: 'info',
        title: 'Authentication Required',
        message: 'Please sign in to save resumes permanently to your cloud account.'
      });
      setActiveTab('login');
      return;
    }

    try {
      const result = await saveResumeToCloud(resumeToSave, token);
      if (result?.resume) {
        setSavedResumes(prev => [result.resume, ...prev.filter(r => r.id !== result.resume.id)]);
      }
      addToast({
        type: 'success',
        title: 'Cloud Persistence Active',
        message: result.message || 'Resume safely saved to your secure profile.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save resume to cloud database.'
      });
      throw err;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoadingInitial) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <p className="text-xs font-semibold text-slate-300 mt-4 tracking-wider uppercase">
          Initializing SkillBridge SaaS Platform...
        </p>
      </div>
    );
  }

  // Full-bleed Portal Hero showcase view
  if (activeTab === 'landing') {
    return (
      <SkillBridgeLanding 
        onLaunchApp={() => setActiveTab('overview')} 
        onOpenTab={(tabId) => setActiveTab(tabId)} 
      />
    );
  }

  // Full-bleed Dedicated Login & Registration Page
  if (activeTab === 'login') {
    return (
      <LoginPage 
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
        onLogout={handleLogout}
        onBackToApp={() => setActiveTab('overview')}
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex selection:bg-indigo-500 selection:text-white transition-colors duration-200`}>
      
      {/* Toast Feedback Manager */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Desktop Collapsible Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        atsScore={analysis?.atsScore || 78}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main SaaS Layout Wrapper */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-[68px]' : 'md:ml-64'
      }`}>
        
        {/* Top Navbar */}
        <TopNavbar
          activeTab={activeTab}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenSamples={() => setIsSamplesOpen(true)}
          onOpenApiKey={() => setIsApiKeyOpen(true)}
          hasApiKey={Boolean(apiKey)}
          currentResumeName={currentUser?.name || (currentResume?.id !== 'sachin-yadav' && currentResume?.id !== 'sample-1' ? currentResume?.name : '')}
          onPrint={handlePrint}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isMobileSidebarOpen={isMobileSidebarOpen}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuth={() => setActiveTab('login')}
        />

        {/* Content Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <AnimatePresence mode="wait">
            
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <OverviewDashboard
                  resume={currentResume}
                  analysis={analysis}
                  currentUser={currentUser}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenUpload={() => setIsUploadOpen(true)}
                  onOpenSamples={() => setIsSamplesOpen(true)}
                />
              </motion.div>
            )}

            {activeTab === 'visualizer' && currentResume && (
              <motion.div key="visualizer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResumeVisualizer
                  resume={currentResume}
                  onUpdateResume={handleUpdateResume}
                  onResumeUpload={handleVisualizerUpload}
                  currentUser={currentUser}
                  onSaveToCloud={handleSaveResumeCloud}
                />
              </motion.div>
            )}

            {activeTab === 'analyzer' && currentResume && analysis && (
              <motion.div key="analyzer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResumeAnalyzer
                  analysis={analysis}
                  resume={currentResume}
                  rolesList={rolesList}
                  onAnalysisUpdated={setAnalysis}
                  onNavigateToRoadmap={() => setActiveTab('roadmap')}
                  onNavigateToOptimizer={() => setActiveTab('bullet')}
                />
              </motion.div>
            )}

            {activeTab === 'matcher' && currentResume && (
              <motion.div key="matcher" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <JobMatcher
                  resume={currentResume}
                  rolesList={rolesList}
                  analysis={analysis}
                  onAnalysisUpdated={setAnalysis}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              </motion.div>
            )}

            {activeTab === 'interview' && currentResume && (
              <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AiMockInterviewer
                  resume={currentResume}
                  apiKey={apiKey}
                />
              </motion.div>
            )}

            {activeTab === 'roadmap' && currentResume && (
              <motion.div key="roadmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SkillBridgeRoadmap
                  resume={currentResume}
                  rolesList={rolesList}
                  apiKey={apiKey}
                />
              </motion.div>
            )}

            {activeTab === 'bullet' && (
              <motion.div key="bullet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <BulletOptimizer
                  apiKey={apiKey}
                  currentResume={currentResume}
                  onApplyToResume={(optimizedBullet) => {
                    if (!currentResume) return;
                    const expList = [...(currentResume.experience || [])];
                    if (expList.length > 0) {
                      const topExp = { ...expList[0] };
                      const bullets = [optimizedBullet, ...(topExp.bullets || []).slice(1)];
                      topExp.bullets = bullets;
                      expList[0] = topExp;
                    } else {
                      expList.push({
                        role: currentResume.title || 'Software Engineer',
                        company: 'Core Engineering',
                        period: '2024 - Present',
                        bullets: [optimizedBullet]
                      });
                    }
                    const updated = { ...currentResume, experience: expList };
                    handleUpdateResume(updated);
                    addToast({
                      type: 'success',
                      title: 'Accomplishment Applied',
                      message: 'Optimized STAR achievement merged into active resume and ATS recalibrated.'
                    });
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'compare' && currentResume && (
              <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResumeVersionComparison
                  currentResume={currentResume}
                  analysis={analysis}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              </motion.div>
            )}

            {activeTab === 'analytics' && currentResume && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AnalyticsView
                  resume={currentResume}
                  analysis={analysis}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              </motion.div>
            )}

            {activeTab === 'github' && currentResume && (
              <motion.div key="github" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="rounded-3xl p-6 bg-[#07152B] border border-[#0B1933] shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#16D9F5]" />
                        <span>GitHub Repository & Codebase Intelligence</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">Deep analysis of open-source contributions, commit velocity, and language taxonomy.</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#19D3A2]/15 text-[#19D3A2] text-xs font-semibold border border-[#19D3A2]/20">Active Analysis</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-[#0B1933] border border-white/5">
                      <div className="text-xs text-slate-400">Total Commits (Last 12M)</div>
                      <div className="text-2xl font-black text-white mt-1">428</div>
                      <div className="text-[11px] text-[#19D3A2] mt-1 font-semibold">Top 15% in Full Stack</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0B1933] border border-white/5">
                      <div className="text-xs text-slate-400">Primary Codebase Stack</div>
                      <div className="text-base font-bold text-white mt-1">TypeScript • React • Node</div>
                      <div className="text-[11px] text-[#258BFF] mt-1 font-semibold">14 Repositories verified</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0B1933] border border-white/5">
                      <div className="text-xs text-slate-400">STAR Achievement Alignment</div>
                      <div className="text-2xl font-black text-white mt-1">92%</div>
                      <div className="text-[11px] text-[#16D9F5] mt-1 font-semibold">Code matches resume claims</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'applications' && currentResume && (
              <motion.div key="applications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="rounded-3xl p-6 bg-[#07152B] border border-[#0B1933] shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#258BFF]" />
                        <span>Job Application Pipeline Tracker</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">Real-time status of matched roles, technical submissions, and interview loops.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('matcher')}
                      className="px-4 py-2 rounded-xl bg-[#258BFF] hover:bg-[#1b74de] text-white text-xs font-bold transition shadow-md"
                    >
                      Find New Matched Jobs
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-[#0B1933] border border-white/5">
                      <div className="text-xs text-slate-400 font-medium">Applied Positions</div>
                      <div className="text-3xl font-black text-white mt-1">5</div>
                      <div className="text-[11px] text-slate-400 mt-1">TCS, Infosys, Wipro, Cognizant</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0B1933] border border-white/5">
                      <div className="text-xs text-slate-400 font-medium">Active Interview Loops</div>
                      <div className="text-3xl font-black text-[#258BFF] mt-1">2</div>
                      <div className="text-[11px] text-[#258BFF] mt-1">Zoho (Round 2), TechM</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#0B1933] border border-white/5">
                      <div className="text-xs text-slate-400 font-medium">Offers Received</div>
                      <div className="text-3xl font-black text-[#19D3A2] mt-1">1</div>
                      <div className="text-[11px] text-[#19D3A2] mt-1">Full Stack Developer Offer</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SettingsView
                  apiKey={apiKey}
                  onSaveApiKey={handleSaveApiKey}
                  theme={theme}
                  onToggleTheme={handleToggleTheme}
                  onShowToast={addToast}
                />
              </motion.div>
            )}

            {activeTab === 'coverletter' && currentResume && (
              <motion.div key="coverletter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CoverLetterGenerator
                  resume={currentResume}
                  rolesList={rolesList}
                  apiKey={apiKey}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="no-print border-t border-slate-900/80 bg-slate-950/60 py-5 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">SkillBridge</span>
              <span>•</span>
              <span>AI Career Intelligence & Resume Studio</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic ATS Parsing + Gemini Flash Reasoning</span>
              </span>
            </div>
          </div>
        </footer>

      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onResumeLoaded={handleResumeUploaded}
      />

      <SampleModal
        isOpen={isSamplesOpen}
        onClose={() => setIsSamplesOpen(false)}
        samples={samples}
        currentId={currentResume?.id}
        onSelectSample={handleSelectSample}
        savedResumes={savedResumes}
        onDeleteSavedResume={handleDeleteSavedResume}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
