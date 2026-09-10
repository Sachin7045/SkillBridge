import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ResumeVisualizer from './components/ResumeVisualizer';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import AiMockInterviewer from './components/AiMockInterviewer';
import SkillBridgeRoadmap from './components/SkillBridgeRoadmap';
import BulletOptimizer from './components/BulletOptimizer';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import UploadModal from './components/UploadModal';
import SampleModal from './components/SampleModal';
import ApiKeyModal from './components/ApiKeyModal';
import { fetchSamples, fetchRoles, analyzeResumeApi } from './api';
import { Sparkles, Terminal, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [samples, setSamples] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [rolesList, setRolesList] = useState([]);
  
  // API key stored in localStorage
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('skillbridge_gemini_key') || '');
  
  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSamplesOpen, setIsSamplesOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

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
        
        // Pick first sample as default
        if (sampleData && sampleData.length > 0) {
          const defaultResume = sampleData[0];
          setCurrentResume(defaultResume);
          const initialAnalysis = await analyzeResumeApi(defaultResume, defaultResume.targetRole || "Full Stack Developer");
          setAnalysis(initialAnalysis.analysis);
        }
      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        setIsLoadingInitial(false);
      }
    }
    initApp();
  }, []);

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    if (newKey) {
      localStorage.setItem('skillbridge_gemini_key', newKey);
    } else {
      localStorage.removeItem('skillbridge_gemini_key');
    }
  };

  const handleSelectSample = async (sample) => {
    setCurrentResume(sample);
    try {
      const res = await analyzeResumeApi(sample, sample.targetRole || "Full Stack Developer");
      setAnalysis(res.analysis);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResumeUploaded = (newResume, newAnalysis) => {
    setCurrentResume(newResume);
    setAnalysis(newAnalysis);
    setActiveTab('interview'); // Go straight to AI interview questions
  };


  const handleUpdateResume = async (updated) => {
    setCurrentResume(updated);
    try {
      const res = await analyzeResumeApi(updated, updated.targetRole || "Full Stack Developer");
      setAnalysis(res.analysis);
    } catch (err) {
      console.error(err);
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
        <p className="text-sm font-semibold text-slate-300 mt-4 tracking-wide">
          Booting SkillBridge Career Intelligence Platform...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSamples={() => setIsSamplesOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        hasApiKey={Boolean(apiKey)}
        currentResumeName={currentResume?.name}
        onPrint={handlePrint}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'visualizer' && currentResume && (
          <ResumeVisualizer
            resume={currentResume}
            onUpdateResume={handleUpdateResume}
          />
        )}

        {activeTab === 'analyzer' && currentResume && analysis && (
          <ResumeAnalyzer
            analysis={analysis}
            resume={currentResume}
            rolesList={rolesList}
            onAnalysisUpdated={setAnalysis}
            onNavigateToRoadmap={() => setActiveTab('roadmap')}
            onNavigateToOptimizer={() => setActiveTab('bullet')}
          />
        )}

        {activeTab === 'interview' && currentResume && (
          <AiMockInterviewer
            resume={currentResume}
            apiKey={apiKey}
          />
        )}

        {activeTab === 'roadmap' && currentResume && (
          <SkillBridgeRoadmap
            resume={currentResume}
            rolesList={rolesList}
            apiKey={apiKey}
          />
        )}

        {activeTab === 'bullet' && (
          <BulletOptimizer
            apiKey={apiKey}
          />
        )}

        {activeTab === 'coverletter' && currentResume && (
          <CoverLetterGenerator
            resume={currentResume}
            rolesList={rolesList}
            apiKey={apiKey}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">SkillBridge</span>
            <span>•</span>
            <span>AI-Powered Career & Resume Intelligence</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ATS Heuristics & Google Gemini Engine</span>
            </span>
          </div>
        </div>
      </footer>

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
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

    </div>
  );
}
