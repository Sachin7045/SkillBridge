import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Component imports
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import OverviewDashboard from './components/OverviewDashboard';
import ResumeVisualizer from './components/ResumeVisualizer';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import ResumeHighlights from './components/ResumeHighlights';
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
import JobApplications from './components/JobApplications';
import CareerChatbot from './components/CareerChatbot';

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
  deleteUserResume,
  fetchUserApplications,
  saveApplicationToCloud,
  deleteApplicationFromCloud,
  updateUserProfileApi
} from './api';
import { Sparkles, ShieldCheck, FileText, GitBranch } from 'lucide-react';

const DEFAULT_APPLICATIONS = [
  {
    id: 'app-1',
    company: 'Razorpay',
    title: 'Senior Full Stack Engineer',
    source: 'LinkedIn',
    location: 'Bengaluru (Hybrid)',
    salary: '₹24 - ₹36 LPA',
    status: 'interview',
    appliedDate: '2026-10-24',
    nextInterview: '06 Nov (Round 2 System Design)',
    url: 'https://www.linkedin.com/jobs/search/?keywords=Razorpay+Full+Stack',
    notes: 'Covered React Virtual DOM in Round 1. Next round is high-scale payment ledger and Redis caching.',
    contact: 'Rohit Sharma (Tech Recruiting Lead)'
  },
  {
    id: 'app-2',
    company: 'Zoho Corporation',
    title: 'Full Stack Developer',
    source: 'Naukri.com',
    location: 'Chennai / Remote',
    salary: '₹20 - ₹26 LPA',
    status: 'final',
    appliedDate: '2026-10-18',
    nextInterview: '04 Nov (Director Fit & Offer Review)',
    url: 'https://www.naukri.com/zoho-jobs',
    notes: 'Cleared technical assignment with 100% score. Discussing role leveling and compensation band.',
    contact: 'Ananya S (HR Business Partner)'
  },
  {
    id: 'app-3',
    company: 'Swiggy',
    title: 'Frontend Engineer (React / Next.js)',
    source: 'LinkedIn',
    location: 'Bengaluru (Hybrid)',
    salary: '₹22 - ₹30 LPA',
    status: 'screening',
    appliedDate: '2026-10-28',
    nextInterview: '05 Nov (Technical Screen with Lead)',
    url: 'https://www.linkedin.com/jobs/search/?keywords=Swiggy+Frontend',
    notes: 'Recruiter reached out via LinkedIn InMail. Discussing Core Web Vitals and microfrontends.',
    contact: 'Karan Verma (Senior Recruiter)'
  },
  {
    id: 'app-4',
    company: 'Tata Consultancy Services (TCS Digital)',
    title: 'Full Stack Lead',
    source: 'Naukri.com',
    location: 'Pune (Hybrid)',
    salary: '₹18 - ₹24 LPA',
    status: 'offer',
    appliedDate: '2026-10-12',
    nextInterview: null,
    url: 'https://www.naukri.com/tcs-jobs',
    notes: 'Received official offer letter. Decision deadline by 15 November.',
    contact: 'Deepak Patel (Recruitment Operations)'
  },
  {
    id: 'app-5',
    company: 'CRED',
    title: 'Backend Systems Engineer',
    source: 'Company Careers Site',
    location: 'Bengaluru (Onsite)',
    salary: '₹30 - ₹42 LPA',
    status: 'applied',
    appliedDate: '2026-10-31',
    nextInterview: null,
    url: 'https://careers.cred.club',
    notes: 'Applied with tailored ATS resume emphasizing distributed event systems and Kafka.',
    contact: 'careers@cred.club'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Theme state: 'light' | 'dark' with persistent localStorage (Emerald-Teal light theme default)
  const [theme, setTheme] = useState(() => localStorage.getItem('skillbridge_theme') || 'light');

  // Application Data States
  const [samples, setSamples] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [rolesList, setRolesList] = useState([]);
  const [savedResumes, setSavedResumes] = useState([]);
  // Keyword highlights shared between Highlights panel and Resume Visualizer
  const [highlightKeywords, setHighlightKeywords] = useState([]);
  
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

  // Active target role/company context from Job Applications or Matcher
  const [activeTargetJob, setActiveTargetJob] = useState(null);

  // Persistent Job Applications Pipeline State
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('skillbridge_user_job_applications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved applications:', e);
    }
    return DEFAULT_APPLICATIONS;
  });

  const handleAddApplication = async (newApp) => {
    setApplications(prev => {
      const updated = [newApp, ...prev.filter(a => a.id !== newApp.id)];
      try { localStorage.setItem('skillbridge_user_job_applications', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    addToast({ type: 'success', title: 'Application Tracked', message: `Added ${newApp.company} (${newApp.title}) to your Pipeline.` });
    
    // Cloud sync if authenticated
    const token = localStorage.getItem('skillbridge_auth_token');
    if (token) {
      try {
        await saveApplicationToCloud(newApp, token);
      } catch (err) {
        console.warn('Cloud sync failed for application:', err);
      }
    }
  };

  const handleUpdateApplication = async (updatedApp) => {
    setApplications(prev => {
      const updated = prev.map(a => a.id === updatedApp.id ? updatedApp : a);
      try { localStorage.setItem('skillbridge_user_job_applications', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    addToast({ type: 'info', title: 'Pipeline Updated', message: `Updated status for ${updatedApp.company}.` });

    // Cloud sync if authenticated
    const token = localStorage.getItem('skillbridge_auth_token');
    if (token) {
      try {
        await saveApplicationToCloud(updatedApp, token);
      } catch (err) {
        console.warn('Cloud sync failed for application update:', err);
      }
    }
  };

  const handleDeleteApplication = async (appId) => {
    setApplications(prev => {
      const updated = prev.filter(a => a.id !== appId);
      try { localStorage.setItem('skillbridge_user_job_applications', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    addToast({ type: 'default', title: 'Application Removed', message: 'Job removed from pipeline.' });

    // Cloud sync if authenticated
    const token = localStorage.getItem('skillbridge_auth_token');
    if (token) {
      try {
        await deleteApplicationFromCloud(appId, token);
      } catch (err) {
        console.warn('Cloud sync failed for application deletion:', err);
      }
    }
  };

  const handleTrackJobFromMatcher = (job) => {
    const existing = applications.find(a => 
      a.company.toLowerCase() === job.company.toLowerCase() && 
      a.title.toLowerCase() === job.title.toLowerCase()
    );
    if (existing) {
      addToast({ type: 'info', title: 'Already Tracked', message: `${job.company} is already in your application pipeline.` });
      return;
    }
    const newApp = {
      id: `app_${Date.now()}`,
      company: job.company,
      title: job.title,
      source: job.portal === 'LinkedIn' ? 'LinkedIn' : job.portal === 'Naukri' ? 'Naukri.com' : 'Company Site',
      location: job.location || 'Remote',
      salary: job.salary || 'Competitive',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      nextInterview: null,
      url: job.applyUrl || null,
      notes: `Target role: ${job.targetRole || 'Engineering'}. Required skills: ${(job.requiredSkills || []).slice(0, 5).join(', ')}`,
      contact: 'Talent Acquisition'
    };
    handleAddApplication(newApp);
  };

  const handleUpdateUserName = async (newName) => {
    if (!newName || !newName.trim()) return;
    const cleanName = newName.trim();

    setCurrentUser(prev => {
      const updated = prev ? { ...prev, name: cleanName } : { name: cleanName, email: '' };
      try { localStorage.setItem('skillbridge_user', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    setCurrentResume(prev => prev ? ({ ...prev, name: cleanName }) : prev);

    const token = localStorage.getItem('skillbridge_auth_token');
    if (token) {
      try {
        await updateUserProfileApi(cleanName, token);
      } catch (err) {
        console.warn('Profile name sync to backend failed:', err);
      }
    }

    addToast({
      type: 'success',
      title: 'Profile Name Updated',
      message: `Your name is now set to ${cleanName}.`
    });
  };

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

              // Fetch user's tracked job applications
              try {
                const cloudApps = await fetchUserApplications(token);
                if (cloudApps && cloudApps.length > 0) {
                  setApplications(cloudApps);
                  localStorage.setItem('skillbridge_user_job_applications', JSON.stringify(cloudApps));
                }
              } catch (e) {
                console.warn('Could not fetch saved applications:', e);
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

      try {
        const cloudApps = await fetchUserApplications(token);
        if (cloudApps && cloudApps.length > 0) {
          setApplications(cloudApps);
          localStorage.setItem('skillbridge_user_job_applications', JSON.stringify(cloudApps));
        }
      } catch (e) {
        console.warn('Could not fetch saved applications:', e);
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#031B35] text-slate-100' : 'bg-[#EFF8FF] text-[#102A43]'} flex selection:bg-[#006B83] selection:text-white transition-colors duration-200`}>
      
      {/* Toast Feedback Manager */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Desktop Collapsible Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'history') {
            setIsSamplesOpen(true);
          } else {
            setActiveTab(tab);
          }
          setIsMobileSidebarOpen(false);
        }}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        atsScore={analysis?.atsScore || 78}
        currentUser={currentUser}
        currentResume={currentResume}
        onLogout={handleLogout}
        onOpenHistory={() => setIsSamplesOpen(true)}
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
          currentResume={currentResume}
          onPrint={handlePrint}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isMobileSidebarOpen={isMobileSidebarOpen}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuth={() => setActiveTab('login')}
          onUpdateUserName={handleUpdateUserName}
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
                  applications={applications}
                  savedResumes={savedResumes}
                  onNavigateTab={(tab) => {
                    if (tab === 'history') {
                      setIsSamplesOpen(true);
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                  onOpenUpload={() => setIsUploadOpen(true)}
                  onOpenSamples={() => setIsSamplesOpen(true)}
                  onDeleteSavedResume={handleDeleteSavedResume}
                  onUpdateUserName={handleUpdateUserName}
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
                  highlightKeywords={highlightKeywords}
                />
              </motion.div>
            )}

            {activeTab === 'highlights' && currentResume && (
              <motion.div key="highlights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResumeHighlights
                  resume={currentResume}
                  analysis={analysis}
                  highlightKeywords={highlightKeywords}
                  onKeywordsChange={setHighlightKeywords}
                />
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CareerChatbot
                  resume={currentResume}
                  apiKey={apiKey}
                  currentUser={currentUser}
                />
              </motion.div>
            )}

            {(activeTab === 'analyzer' || activeTab === 'ats') && currentResume && (
              <motion.div key="analyzer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResumeAnalyzer
                  analysis={analysis}
                  resume={currentResume}
                  rolesList={rolesList}
                  onAnalysisUpdated={setAnalysis}
                  onNavigateToRoadmap={() => setActiveTab('roadmap')}
                  onNavigateToOptimizer={() => setActiveTab('bullet')}
                  onNavigateToMatcher={() => setActiveTab('matcher')}
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
                  onTrackJob={handleTrackJobFromMatcher}
                  trackedJobIds={applications.map(a => `${a.company.toLowerCase()}_${a.title.toLowerCase()}`)}
                />
              </motion.div>
            )}

            {activeTab === 'interview' && currentResume && (
              <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AiMockInterviewer
                  resume={currentResume}
                  apiKey={apiKey}
                  targetJob={activeTargetJob}
                  onClearTargetJob={() => setActiveTargetJob(null)}
                />
              </motion.div>
            )}

            {(activeTab === 'roadmap' || activeTab === 'skillgap') && currentResume && (
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
                <div className="rounded-3xl p-6 bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-blue-400" />
                        <span>GitHub Repository & Codebase Analysis</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">Analysis of open-source contributions, commit velocity, and language taxonomy.</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/20">Active Analysis</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-400">Total Commits (Last 12M)</div>
                      <div className="text-2xl font-black text-white mt-1">428</div>
                      <div className="text-[11px] text-emerald-400 mt-1 font-semibold">Top 15% in Full Stack</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-400">Primary Codebase Stack</div>
                      <div className="text-base font-bold text-white mt-1">TypeScript • React • Node</div>
                      <div className="text-[11px] text-blue-400 mt-1 font-semibold">14 Repositories verified</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-400">STAR Achievement Alignment</div>
                      <div className="text-2xl font-black text-white mt-1">92%</div>
                      <div className="text-[11px] text-sky-400 mt-1 font-semibold">Code matches resume claims</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div key="applications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <JobApplications
                  applications={applications}
                  onAddApplication={handleAddApplication}
                  onUpdateApplication={handleUpdateApplication}
                  onDeleteApplication={handleDeleteApplication}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onPrepareInterview={(app) => {
                    setActiveTargetJob(app);
                    setActiveTab('interview');
                    addToast({
                      type: 'info',
                      title: 'Interview Loop Loaded',
                      message: `Loaded mock interview prep for ${app.title} at ${app.company}.`
                    });
                  }}
                  onGenerateCoverLetter={(app) => {
                    setActiveTargetJob(app);
                    setActiveTab('coverletter');
                    addToast({
                      type: 'info',
                      title: 'Role Context Loaded',
                      message: `Generating tailored application letter for ${app.company}.`
                    });
                  }}
                />
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
                  initialCompany={activeTargetJob?.company}
                  initialRole={activeTargetJob?.title}
                  initialJobDescription={activeTargetJob?.notes}
                />
              </motion.div>
            )}

            {!currentResume && ['visualizer', 'highlights', 'analyzer', 'matcher', 'interview', 'roadmap', 'compare', 'analytics', 'coverletter'].includes(activeTab) && (
              <motion.div key="no-resume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4 my-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No Active Resume Loaded</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Upload your resume PDF/DOCX or select a pre-calibrated candidate profile to explore this feature.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
                  >
                    Upload Resume
                  </button>
                  <button
                    onClick={() => setIsSamplesOpen(true)}
                    className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold rounded-xl transition"
                  >
                    Load Sample Profile
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="no-print border-t border-teal-100/80 bg-white/80 py-5 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#007C83]">SkillBridge</span>
              <span>•</span>
              <span className="text-slate-600 font-medium">Professional Career Platform & Resume Studio</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Deterministic ATS Diagnostics + Calibrated Evaluation Framework</span>
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
