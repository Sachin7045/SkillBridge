import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Sparkles, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  BookOpen, 
  RefreshCw, 
  ChevronRight,
  MessageSquare,
  Volume2,
  Lightbulb,
  Zap,
  Target,
  ShieldCheck,
  XCircle,
  Download,
  RotateCcw,
  Copy,
  Check,
  Globe,
  Bot,
  Play,
  Square,
  Eye,
  EyeOff,
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuestionsApi, evaluateAnswerApi } from '../api';
import { 
  SUPPORTED_INTERVIEW_LANGUAGES, 
  UI_TRANSLATIONS, 
  getTranslatedQuestion, 
  getSimulatedVoiceAnswer 
} from '../data/interviewLanguages';

export const SOFTWARE_FIELDS = [
  { id: 'all', label: 'All Software Fields (Comprehensive)', icon: '🌐', short: 'All Fields' },
  { id: 'Frontend', label: 'Frontend Engineering (React, Fiber, Web Vitals, SSR)', icon: '💻', short: 'Frontend' },
  { id: 'Backend', label: 'Backend & APIs (Microservices, Saga, Rate Limiting)', icon: '⚙️', short: 'Backend & APIs' },
  { id: 'Database', label: 'Database Engineering (B-Trees, EXPLAIN, Locking)', icon: '🗄️', short: 'Database' },
  { id: 'System Design', label: 'System Design & Scale (100M+ Users, CAP, Caching)', icon: '🏗️', short: 'System Design' },
  { id: 'DevOps', label: 'DevOps & Cloud (Kubernetes, CI/CD, Canary, IaC)', icon: '🚀', short: 'DevOps & Cloud' },
  { id: 'Data Engineering', label: 'Data Engineering (Kafka, Spark, Lakehouse)', icon: '📊', short: 'Data Eng' },
  { id: 'AI & Machine Learning', label: 'AI & Machine Learning (RAG, Vector DB, LLMOps)', icon: '🤖', short: 'AI & ML' },
  { id: 'Cybersecurity', label: 'Cybersecurity & AppSec (OWASP, OAuth, JWT, PKCE)', icon: '🛡️', short: 'Cybersecurity' },
  { id: 'Mobile', label: 'Mobile App Engineering (Offline-First, Bridge, SQLite)', icon: '📱', short: 'Mobile' },
  { id: 'Testing & SRE', label: 'Testing, QA & SRE (Pyramid, OpenTelemetry, SLOs)', icon: '🧪', short: 'Testing & SRE' },
  { id: 'Behavioral', label: 'Behavioral Leadership (STAR Method, Outages)', icon: '🤝', short: 'Behavioral' },
  { id: 'Resume Deep-Dive', label: 'Resume-Anchored Project Deep-Dive', icon: '📄', short: 'Resume Projects' },
];

export function getCategoryBadge(category) {
  const c = String(category || '').toLowerCase();
  if (c.includes('frontend')) return { label: 'Frontend', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', icon: '💻' };
  if (c.includes('backend') || c.includes('api')) return { label: 'Backend & APIs', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: '⚙️' };
  if (c.includes('database')) return { label: 'Database', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: '🗄️' };
  if (c.includes('system') || c.includes('architecture')) return { label: 'System Design', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: '🏗️' };
  if (c.includes('devops') || c.includes('cloud')) return { label: 'DevOps & Cloud', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30', icon: '🚀' };
  if (c.includes('data engineering')) return { label: 'Data Engineering', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30', icon: '📊' };
  if (c.includes('ai') || c.includes('machine learning')) return { label: 'AI & Machine Learning', color: 'bg-violet-500/10 text-violet-400 border-violet-500/30', icon: '🤖' };
  if (c.includes('cyber') || c.includes('security')) return { label: 'Cybersecurity', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: '🛡️' };
  if (c.includes('mobile')) return { label: 'Mobile Engineering', color: 'bg-pink-500/10 text-pink-400 border-pink-500/30', icon: '📱' };
  if (c.includes('testing') || c.includes('sre')) return { label: 'Testing & SRE', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30', icon: '🧪' };
  if (c.includes('behavioral') || c.includes('star')) return { label: 'Behavioral (STAR)', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: '🤝' };
  return { label: category || 'Resume Deep-Dive', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: '📄' };
}

export default function AiMockInterviewer({ resume, apiKey }) {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [category, setCategory] = useState('all');
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError] = useState(null);

  // Multilingual & Speech State
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      return localStorage.getItem('skillbridge_interview_lang') || 'en-US';
    } catch {
      return 'en-US';
    }
  });
  const [isAutoAskEnabled, setIsAutoAskEnabled] = useState(() => {
    try {
      return localStorage.getItem('skillbridge_auto_ask') === 'true';
    } catch {
      return false;
    }
  });
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [showOriginalEnglish, setShowOriginalEnglish] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  
  // Persistent session evaluation store
  const sessionKey = `skillbridge_interview_session_${resume?.id || 'default'}`;
  const [evaluations, setEvaluations] = useState(() => {
    try {
      const saved = localStorage.getItem(sessionKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isSimulatingSpeech, setIsSimulatingSpeech] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const recognitionRef = React.useRef(null);

  // Initialize Speech Synthesis Voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices() || [];
      setAvailableVoices(v);
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  // Stop any speech when changing question or unmounting
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
    }
    if (recognitionRef.current && isListeningMic) {
      recognitionRef.current.stop();
      setIsListeningMic(false);
    }
    setEvalError(null);
  }, [selectedQuestionIndex, selectedLang]);

  // Load questions when resume changes
  useEffect(() => {
    loadQuestions();
  }, [resume, category]);

  const loadQuestions = async () => {
    setIsLoadingQuestions(true);
    setEvalError(null);
    try {
      const res = await generateQuestionsApi(resume, category, apiKey);
      setQuestions(res.questions || []);
      setSelectedQuestionIndex(0);
      setCandidateAnswer('');
    } catch (err) {
      console.error(err);
      setEvalError('Failed to generate interview questions. Please try again.');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const currentQuestion = questions[selectedQuestionIndex];
  const currentEvaluation = currentQuestion ? evaluations[currentQuestion.id] : null;

  const activeLangConfig = SUPPORTED_INTERVIEW_LANGUAGES.find(l => l.id === selectedLang) || SUPPORTED_INTERVIEW_LANGUAGES[0];
  const uiText = UI_TRANSLATIONS[selectedLang] || UI_TRANSLATIONS['en-US'];
  const displayedQuestionText = currentQuestion ? getTranslatedQuestion(currentQuestion.question, selectedLang) : '';
  const isNonEnglish = selectedLang !== 'en-US';

  const handleSelectLanguage = (langId) => {
    setSelectedLang(langId);
    try {
      localStorage.setItem('skillbridge_interview_lang', langId);
    } catch (e) {}
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
    }
  };

  const handleToggleAutoAsk = () => {
    setIsAutoAskEnabled(prev => {
      const next = !prev;
      try { localStorage.setItem('skillbridge_auto_ask', String(next)); } catch (e) {}
      return next;
    });
  };

  // Question Speech-to-Audio (TTS) in chosen language ("AI Question Puche")
  const handleToggleSpeakQuestion = (customText = null) => {
    if (!('speechSynthesis' in window) || !currentQuestion) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }

    const textToSpeak = customText || getTranslatedQuestion(currentQuestion.question, selectedLang);
    const fullSpeechText = `${activeLangConfig.greeting} ${textToSpeak}`;
    const utter = new SpeechSynthesisUtterance(fullSpeechText);
    utter.rate = speechSpeed;
    utter.pitch = 1.0;
    utter.lang = activeLangConfig.speechCode;

    // Pick matching voice if available in browser
    if (availableVoices.length > 0) {
      const langPrefix = activeLangConfig.speechCode.split('-')[0].toLowerCase();
      const matchingVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
        (activeLangConfig.fallbackSpeechCode ? availableVoices.find(v => v.lang.toLowerCase().startsWith(activeLangConfig.fallbackSpeechCode.split('-')[0])) : null);
      if (matchingVoice) utter.voice = matchingVoice;
    }

    utter.onend = () => setIsSpeakingQuestion(false);
    utter.onerror = () => setIsSpeakingQuestion(false);
    setIsSpeakingQuestion(true);
    window.speechSynthesis.speak(utter);
  };

  // Auto-Ask Question when selected question changes and Auto-Ask is enabled
  useEffect(() => {
    if (isAutoAskEnabled && currentQuestion && !isLoadingQuestions) {
      const timer = setTimeout(() => {
        handleToggleSpeakQuestion();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [selectedQuestionIndex, selectedLang, isAutoAskEnabled]);

  // Real Microphone Speech-to-Text with selected language
  const handleToggleMic = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      handleSimulateSpeech();
      return;
    }

    if (isListeningMic) {
      recognitionRef.current?.stop();
      setIsListeningMic(false);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = activeLangConfig.speechCode;

      rec.onstart = () => setIsListeningMic(true);
      rec.onresult = (e) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          transcript += e.results[i][0].transcript;
        }
        setCandidateAnswer(prev => {
          const separator = prev.trim().length > 0 ? ' ' : '';
          return prev + separator + transcript;
        });
      };
      rec.onerror = () => setIsListeningMic(false);
      rec.onend = () => setIsListeningMic(false);

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn("Speech recognition unavailable, using simulated voice:", err);
      handleSimulateSpeech();
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;
    const trimmedAnswer = candidateAnswer.trim();
    if (!trimmedAnswer) {
      setEvalError('Please provide an answer before submitting for evaluation.');
      return;
    }
    if (isEvaluating) return; // Prevent duplicate submissions

    setIsEvaluating(true);
    setEvalError(null);

    try {
      const res = await evaluateAnswerApi(
        currentQuestion.question,
        trimmedAnswer,
        { 
          role: resume?.title, 
          company: resume?.experience?.[0]?.company,
          category: currentQuestion.category,
          topic: currentQuestion.topic
        },
        apiKey
      );

      if (!res || !res.evaluation) {
        throw new Error('Evaluation service returned an empty or invalid response.');
      }

      // Store evaluation anchored to the specific submitted answer
      const nextEvaluations = {
        ...evaluations,
        [currentQuestion.id]: {
          ...res.evaluation,
          submittedAnswer: trimmedAnswer
        }
      };
      setEvaluations(nextEvaluations);

      try {
        localStorage.setItem(sessionKey, JSON.stringify(nextEvaluations));
      } catch (e) {
        console.warn('Failed to save interview evaluation:', e);
      }

      if (res.evaluation.score && res.evaluation.score >= 8 && res.evaluation.isValid !== false) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error('Answer evaluation failed:', err);
      setEvalError(err.message || 'Failed to evaluate answer. Please verify your connection or AI key.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSimulateSpeech = () => {
    setIsSimulatingSpeech(true);
    const answerText = getSimulatedVoiceAnswer(
      currentQuestion?.category,
      currentQuestion?.topic,
      currentQuestion?.question,
      selectedLang
    );
    
    // Typewriter effect simulation
    let currentIdx = 0;
    setCandidateAnswer('');
    const interval = setInterval(() => {
      if (currentIdx < answerText.length) {
        setCandidateAnswer(answerText.slice(0, currentIdx + 4));
        currentIdx += 4;
      } else {
        clearInterval(interval);
        setIsSimulatingSpeech(false);
      }
    }, 20);
  };

  const handleResetSession = () => {
    if (window.confirm('Reset all saved mock interview evaluations for this session?')) {
      setEvaluations({});
      try { localStorage.removeItem(sessionKey); } catch (e) {}
    }
  };

  const handleExportInterviewSession = () => {
    const answeredCount = Object.keys(evaluations).length;
    if (answeredCount === 0) {
      alert('Answer at least one question to export an interview evaluation report.');
      return;
    }
    const report = `# SkillBridge AI Mock Interview Report
Candidate: ${resume?.name || 'Engineer'}
Role: ${resume?.title || 'Software Engineer'}
Date: ${new Date().toLocaleDateString()}
Language: ${activeLangConfig.name} (${activeLangConfig.nativeName})
Evaluations Completed: ${answeredCount}/${questions.length}

${questions.map((q, idx) => {
  const ev = evaluations[q.id];
  const translatedQ = getTranslatedQuestion(q.question, selectedLang);
  if (!ev) return `### Question ${idx + 1}: ${translatedQ}\nStatus: Not Attempted\n`;
  return `### Question ${idx + 1} (${q.category} - ${q.topic}):
**Question (${activeLangConfig.shortName}):** ${translatedQ}
${isNonEnglish ? `**Original English:** ${q.question}\n` : ''}**Candidate Answer:** ${ev.submittedAnswer || 'N/A'}
**Score:** ${ev.score !== null ? `${ev.score}/10` : 'Invalid / Gibberish'}
**Verdict:** ${ev.verdict || 'Evaluated'}
**Validity:** ${ev.validity?.status || 'VALID'} (Confidence: ${ev.evaluationConfidence?.percentage || 95}%)

**Key Strengths:**
${(ev.strengths || []).map(s => `- ${s}`).join('\n')}

**Improvement Areas:**
${(ev.weaknesses || []).map(w => `- ${w}`).join('\n')}

**Model Answer:**
${ev.modelAnswer || ev.idealAnswer || 'N/A'}
`;
}).join('\n---\n\n')}`;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillBridge-Mock-Interview-Report-${(resume?.name || 'Candidate').replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const answeredQuestionsCount = Object.keys(evaluations).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Mic className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">AI Mock Interviewer</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
              Multilingual Voice Interrogator
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Interactive voice interviewer asks challenging interview questions across 11+ languages with real-time speech evaluation.
          </p>
        </div>

        {/* Category switcher, Multilingual selector & Session Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5" title="Interview & Speech Language">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={selectedLang}
              onChange={(e) => handleSelectLanguage(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              {SUPPORTED_INTERVIEW_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id} className="bg-slate-900 text-white py-1">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSelectedQuestionIndex(0);
              setCandidateAnswer('');
            }}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-medium"
            title="Filter by Software Engineering Field"
          >
            {SOFTWARE_FIELDS.map(f => (
              <option key={f.id} value={f.id} className="bg-slate-900 text-slate-200">
                {f.icon} {f.label}
              </option>
            ))}
          </select>

          <button
            onClick={loadQuestions}
            disabled={isLoadingQuestions}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-xs text-slate-300 transition"
            title="Generate fresh questions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQuestions ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {answeredQuestionsCount > 0 && (
            <>
              <button
                onClick={handleExportInterviewSession}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 rounded-xl text-xs text-indigo-200 hover:text-white transition"
                title="Download full evaluation report as Markdown"
              >
                <Download className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Export Report</span>
              </button>

              <button
                onClick={handleResetSession}
                className="flex items-center gap-1 px-2.5 py-2 bg-slate-900 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 rounded-xl text-xs transition"
                title="Reset session evaluations"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Software Field Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        {SOFTWARE_FIELDS.map((field) => {
          const isActive = category === field.id || (field.id !== 'all' && category.toLowerCase().includes(field.id.toLowerCase()));
          return (
            <button
              key={field.id}
              onClick={() => {
                setCategory(field.id);
                setSelectedQuestionIndex(0);
                setCandidateAnswer('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-500/50'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900'
              }`}
              title={field.label}
            >
              <span className="text-sm">{field.icon}</span>
              <span>{field.short}</span>
            </button>
          );
        })}
      </div>

      {isLoadingQuestions ? (
        <div className="p-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-300">
            Synthesizing challenging interview questions from your resume...
          </p>
        </div>
      ) : questions.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 text-slate-400">
          No questions generated yet. Click refresh to trigger question generation.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Questions List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Interview Questions ({questions.length})
            </h3>
            
            <div className="space-y-2">
              {questions.map((q, idx) => {
                const isSelected = idx === selectedQuestionIndex;
                const isDone = Boolean(evaluations[q.id]);
                return (
                  <div
                    key={q.id || idx}
                    onClick={() => {
                      setSelectedQuestionIndex(idx);
                      setCandidateAnswer(evaluations[q.id]?.submittedAnswer || '');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500 shadow-md shadow-indigo-600/10'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {(() => {
                        const badge = getCategoryBadge(q.category);
                        return (
                          <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.color}`}>
                            <span>{badge.icon}</span>
                            <span className="truncate max-w-[130px]">{badge.label}</span>
                          </span>
                        );
                      })()}
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          q.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {q.difficulty}
                        </span>
                        {isDone && (
                          evaluations[q.id].validity?.status === 'INVALID' || evaluations[q.id].score === null ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Invalid Response
                            </span>
                          ) : evaluations[q.id].validity?.status === 'INSUFFICIENT' ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Insufficient
                            </span>
                          ) : (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              evaluations[q.id].score >= 7.5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              evaluations[q.id].score >= 4.5 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              Score: {evaluations[q.id].score}/10
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-200 line-clamp-2">
                      {q.question}
                    </p>
                    {q.contextAnchor && (
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Target className="w-2.5 h-2.5 text-cyan-400" />
                        <span className="truncate">From: {q.contextAnchor}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Question, Answer Box & Evaluation */}
          <div className="lg:col-span-8 space-y-6">
            
            {currentQuestion && (
              <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-5">
                
                {/* AI Voice Interviewer Speech Hub ("AI Question Puche") */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  isSpeakingQuestion 
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-600/10 ring-1 ring-indigo-500/30' 
                    : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    
                    {/* Left: AI Avatar & Equalizer Soundwaves */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition ${
                        isSpeakingQuestion
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/40'
                          : 'bg-slate-900 text-indigo-400 border-slate-700'
                      }`}>
                        <Bot className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {uiText.aiInterviewerTitle}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-semibold border border-slate-700">
                            {activeLangConfig.flag} {activeLangConfig.shortName}
                          </span>
                        </div>

                        {/* Animated Soundwave Visualizer */}
                        <div className="flex items-center gap-1.5 mt-1">
                          {isSpeakingQuestion ? (
                            <>
                              <div className="flex items-center gap-0.5 h-3.5">
                                <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-3" />
                                <span className="w-1 bg-indigo-400 rounded-full animate-bounce h-4" />
                                <span className="w-1 bg-cyan-300 rounded-full animate-pulse h-2.5" />
                                <span className="w-1 bg-indigo-300 rounded-full animate-bounce h-3.5" />
                                <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-2" />
                              </div>
                              <span className="text-[11px] font-medium text-cyan-400">
                                {uiText.speakingStatus}
                              </span>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              AI Voice Ready • Click button to hear question in {activeLangConfig.nativeName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Controls (Play/Stop, Speed, Auto-Ask) */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Play / Stop Speaking Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleSpeakQuestion()}
                        className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shadow-sm ${
                          isSpeakingQuestion
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
                        }`}
                        title="AI speaks the question aloud"
                      >
                        {isSpeakingQuestion ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>{uiText.stopSpeaking}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{uiText.listenQuestion}</span>
                          </>
                        )}
                      </button>

                      {/* Speed selector */}
                      <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-[11px]">
                        {[0.8, 1.0, 1.2].map(speed => (
                          <button
                            key={speed}
                            type="button"
                            onClick={() => setSpeechSpeed(speed)}
                            className={`px-2 py-1 rounded-lg font-medium transition ${
                              speechSpeed === speed
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>

                      {/* Auto-Ask Checkbox Toggle */}
                      <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 cursor-pointer select-none hover:border-slate-700">
                        <input
                          type="checkbox"
                          checked={isAutoAskEnabled}
                          onChange={handleToggleAutoAsk}
                          className="w-3 h-3 text-indigo-600 rounded bg-slate-950 border-slate-700 focus:ring-0 cursor-pointer"
                        />
                        <span>{uiText.autoAsk}</span>
                      </label>
                    </div>

                  </div>
                </div>

                {/* Active Question Details */}
                <div className="space-y-3 pb-4 border-b border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                        Question {selectedQuestionIndex + 1} of {questions.length}
                      </span>
                      {(() => {
                        const activeBadge = getCategoryBadge(currentQuestion.category);
                        return (
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1.5 ${activeBadge.color}`}>
                            <span>{activeBadge.icon}</span>
                            <span>{activeBadge.label}</span>
                          </span>
                        );
                      })()}
                    </div>
                    {currentQuestion.contextAnchor && (
                      <span className="text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        Anchor: <strong className="text-indigo-300">{currentQuestion.contextAnchor}</strong>
                      </span>
                    )}
                  </div>

                  {/* Question Prompt (in Selected Language) */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug flex-1">
                        {displayedQuestionText}
                      </h3>

                      {isNonEnglish && (
                        <button
                          type="button"
                          onClick={() => setShowOriginalEnglish(prev => !prev)}
                          className="shrink-0 text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700 transition"
                          title="Toggle Original English Question"
                        >
                          {showOriginalEnglish ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showOriginalEnglish ? 'Hide English' : 'Show English'}</span>
                        </button>
                      )}
                    </div>

                    {/* Original English Preview Card (when non-English language is active) */}
                    {isNonEnglish && showOriginalEnglish && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2 animate-fade-in">
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0 mt-0.5">
                          EN
                        </span>
                        <span className="italic leading-relaxed">{currentQuestion.question}</span>
                      </div>
                    )}
                  </div>

                  {currentQuestion.tips && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                        <Lightbulb className="w-3.5 h-3.5" /> Tips:
                      </span>
                      {currentQuestion.tips.map((tip, idx) => (
                        <span key={idx} className="bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                          {tip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Candidate Answer Box */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Your Response</span>
                      <span className="text-[10px] text-cyan-400 font-normal">
                        ({activeLangConfig.shortName} speech active)
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleMic}
                        className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition ${
                          isListeningMic
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                        title={`Speak into microphone in ${activeLangConfig.name}`}
                      >
                        <Mic className="w-3 h-3 text-rose-400" />
                        <span>{isListeningMic ? uiText.recording : uiText.useMic}</span>
                      </button>

                      <button
                        onClick={handleSimulateSpeech}
                        disabled={isSimulatingSpeech}
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 transition hover:bg-cyan-500/20"
                        title={`Insert a realistic ${activeLangConfig.name} speech audio transcription`}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isSimulatingSpeech ? 'Dictating...' : uiText.sampleVoice}</span>
                      </button>
                    </div>
                  </div>

                  {/* Candidate Input Error Banner */}
                  {evalError && (
                    <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-3 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{evalError}</span>
                      </div>
                      <button
                        onClick={() => setEvalError(null)}
                        className="text-rose-400 hover:text-white px-2 py-0.5 rounded hover:bg-rose-500/20 text-xs font-semibold transition"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  <textarea
                    rows={6}
                    value={candidateAnswer}
                    onChange={(e) => {
                      setCandidateAnswer(e.target.value);
                      if (evalError) setEvalError(null);
                    }}
                    placeholder={
                      isNonEnglish
                        ? `[${activeLangConfig.nativeName} (${activeLangConfig.shortName}) Active] Type or speak your response using the microphone above in ${activeLangConfig.nativeName} or English...`
                        : "Provide your answer. Walk through the Situation, Task, what specific Actions you took, and the quantifiable Result..."
                    }
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed resize-none"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500">
                        {candidateAnswer.split(/\s+/).filter(Boolean).length} words
                      </span>
                      {currentEvaluation && candidateAnswer.trim() && candidateAnswer.trim() !== (currentEvaluation.submittedAnswer || '').trim() && (
                        <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          Answer modified — submit to re-evaluate
                        </span>
                      )}
                    </div>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={isEvaluating || !candidateAnswer.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-indigo-600/30 transition"
                    >
                      {isEvaluating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                          <span>{uiText.evaluating}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{uiText.submitAnswer}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Evaluation Results Card */}
                {currentEvaluation && (
                  (() => {
                    const isInvalidResponse = currentEvaluation.validity?.status === 'INVALID' || currentEvaluation.score === null || currentEvaluation.isScoreApplicable === false;
                    
                    if (isInvalidResponse) {
                      return (
                        <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-rose-500/30 space-y-4 animate-fade-in">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                                  AI Assessment Scorecard
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold flex items-center gap-1">
                                  <XCircle className="w-3 h-3" /> Status: INVALID
                                </span>
                                {currentEvaluation.evaluationConfidence && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold flex items-center gap-1" title={currentEvaluation.evaluationConfidence.reason}>
                                    <ShieldCheck className="w-3 h-3" /> {currentEvaluation.evaluationConfidence.percentage}% Confidence
                                  </span>
                                )}
                              </div>
                              <h4 className="text-base font-extrabold text-rose-400 flex items-center gap-2 mt-1">
                                {currentEvaluation.verdict || 'Invalid Response'}
                              </h4>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex flex-col items-end">
                                <span className="text-2xl font-black text-rose-400/90">
                                  N/A
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">No Score Applicable</span>
                              </div>
                            </div>
                          </div>

                          {/* Why this answer cannot be evaluated */}
                          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                              <AlertCircle className="w-4 h-4 text-rose-400" />
                              <span>Why this answer cannot be evaluated</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                              {currentEvaluation.validity?.reason || currentEvaluation.feedback}
                            </p>
                          </div>

                          {/* Expected Concepts & How to Formulate */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5" /> Expected Question Concepts
                              </span>
                              <ul className="space-y-1 text-slate-300 text-[11px]">
                                {((currentEvaluation.missingConcepts || currentEvaluation.missingPoints) && (currentEvaluation.missingConcepts || currentEvaluation.missingPoints).length > 0) ? (
                                  (currentEvaluation.missingConcepts || currentEvaluation.missingPoints).map((mc, mIdx) => (
                                    <li key={mIdx} className="flex items-start gap-1.5">
                                      <span className="text-amber-400 shrink-0">•</span>
                                      <span>{mc}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-slate-400">Core engineering concepts relevant to this question.</li>
                                )}
                              </ul>
                            </div>

                            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
                              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5" /> How to Formulate a Valid Response
                              </span>
                              <ul className="space-y-1 text-slate-300 text-[11px]">
                                {(currentEvaluation.suggestions && currentEvaluation.suggestions.length > 0) ? (
                                  currentEvaluation.suggestions.map((sg, gIdx) => (
                                    <li key={gIdx} className="flex items-start gap-1.5">
                                      <span className="text-cyan-400 shrink-0">•</span>
                                      <span>{sg}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-slate-400">Provide complete sentences addressing the technical question with concrete tools and mechanisms.</li>
                                )}
                              </ul>
                            </div>
                          </div>

                          {/* Ideal Sample Answer preview */}
                          {currentEvaluation.modelAnswer && (
                            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Ideal Sample Answer (Staff-Level Model Answer)</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-lg border border-indigo-500/10 italic">
                                "{currentEvaluation.modelAnswer}"
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-4 animate-fade-in">
                        {/* Score Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                                AI Assessment Scorecard
                              </span>
                              {/* Concept 1: Answer Validity */}
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                                currentEvaluation.validity?.status === 'INSUFFICIENT'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {currentEvaluation.validity?.status === 'INSUFFICIENT' ? (
                                  <AlertCircle className="w-3 h-3" />
                                ) : (
                                  <CheckCircle2 className="w-3 h-3" />
                                )}
                                Validity: {currentEvaluation.validity?.label || (currentEvaluation.validity?.status === 'INSUFFICIENT' ? 'Insufficient' : 'Valid')}
                              </span>
                              {/* Concept 3: Evaluation Confidence */}
                              {currentEvaluation.evaluationConfidence && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold flex items-center gap-1" title={currentEvaluation.evaluationConfidence.reason}>
                                  <ShieldCheck className="w-3 h-3" /> Confidence: {currentEvaluation.evaluationConfidence.percentage}% ({currentEvaluation.evaluationConfidence.level})
                                </span>
                              )}
                            </div>
                            <h4 className={`text-base font-extrabold flex items-center gap-2 mt-1 ${
                              (Number(currentEvaluation.score) || 0) >= 7.5 ? 'text-emerald-400' :
                              (Number(currentEvaluation.score) || 0) >= 4.5 ? 'text-amber-400' :
                              'text-rose-400'
                            }`}>
                              {currentEvaluation.verdict}
                            </h4>
                          </div>

                          {/* Concept 2: Answer Quality Score (Strictly Labeled Answer Quality Score, NEVER "Accuracy") */}
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                              <span className={`text-2xl font-black ${
                                (Number(currentEvaluation.score) || 0) >= 7.5 ? 'text-emerald-400' :
                                (Number(currentEvaluation.score) || 0) >= 4.5 ? 'text-indigo-400' :
                                'text-rose-400'
                              }`}>
                                {currentEvaluation.score}<span className="text-sm text-slate-500">/10</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">Answer Quality Score</span>
                            </div>
                          </div>
                        </div>

                        {/* Sub-Metrics Breakdown (5 Weighted Criteria) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-center py-1">
                          {/* 1. Relevance 25% */}
                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                            <div className="text-sm font-black text-cyan-400">
                              {currentEvaluation.relevanceScore ?? 0}/10
                            </div>
                            <div className="text-[10px] font-semibold text-slate-300">Relevance (25%)</div>
                            <div className="text-[9px] text-slate-500">Topic Alignment</div>
                          </div>

                          {/* 2. Technical Accuracy 30% - Factual Correctness */}
                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                            <div className="text-sm font-black text-indigo-400">
                              {currentEvaluation.technicalAccuracyScore ?? 0}/10
                            </div>
                            <div className="text-[10px] font-semibold text-slate-300">Technical Accuracy (30%)</div>
                            <div className="text-[9px] text-slate-500">Factual Correctness</div>
                          </div>

                          {/* 3. Clarity & Communication 15% */}
                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                            <div className="text-sm font-black text-blue-400">
                              {currentEvaluation.clarityScore ?? 0}/10
                            </div>
                            <div className="text-[10px] font-semibold text-slate-300">Clarity (15%)</div>
                            <div className="text-[9px] text-slate-500">Flow & Coherence</div>
                          </div>

                          {/* 4. Technical Depth 20% */}
                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                            <div className="text-sm font-black text-purple-400">
                              {currentEvaluation.technicalDepthScore ?? 0}/10
                            </div>
                            <div className="text-[10px] font-semibold text-slate-300">Depth (20%)</div>
                            <div className="text-[9px] text-slate-500">Mechanics & Trade-offs</div>
                          </div>

                          {/* 5. Structure Score 10% */}
                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5 col-span-2 sm:col-span-1">
                            <div className="text-sm font-black text-emerald-400">
                              {currentEvaluation.structureScore ?? currentEvaluation.starAdherenceScore ?? 0}/10
                            </div>
                            <div className="text-[10px] font-semibold text-slate-300 truncate" title={currentEvaluation.structureType || 'Structure'}>
                              {currentEvaluation.structureType || 'Structure'} (10%)
                            </div>
                            <div className="text-[9px] text-slate-500">Methodology</div>
                          </div>
                        </div>

                        {/* Feedback paragraph */}
                        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                            AI Evaluation Feedback
                          </span>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                            {currentEvaluation.feedback}
                          </p>
                        </div>

                        {/* Strengths and Weaknesses */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                            </span>
                            <ul className="space-y-1 text-slate-300 text-[11px]">
                              {(currentEvaluation.strengths && currentEvaluation.strengths.length > 0) ? (
                                currentEvaluation.strengths.map((st, sIdx) => (
                                  <li key={sIdx} className="flex items-start gap-1.5">
                                    <span className="text-emerald-400 shrink-0">•</span>
                                    <span>{st}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-slate-500 italic">No specific strengths demonstrated in this response.</li>
                              )}
                            </ul>
                          </div>

                          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                            <span className="font-bold text-rose-400 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" /> Weaknesses
                            </span>
                            <ul className="space-y-1 text-slate-300 text-[11px]">
                              {(currentEvaluation.weaknesses && currentEvaluation.weaknesses.length > 0) ? (
                                currentEvaluation.weaknesses.map((wk, wIdx) => (
                                  <li key={wIdx} className="flex items-start gap-1.5">
                                    <span className="text-rose-400 shrink-0">•</span>
                                    <span>{wk}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-slate-500 italic">No significant technical weaknesses identified.</li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Missing Concepts and Detailed Improvement Suggestions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                            <span className="font-bold text-amber-400 flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5" /> Missing Concepts
                            </span>
                            <ul className="space-y-1 text-slate-300 text-[11px]">
                              {((currentEvaluation.missingConcepts || currentEvaluation.missingPoints) && (currentEvaluation.missingConcepts || currentEvaluation.missingPoints).length > 0) ? (
                                (currentEvaluation.missingConcepts || currentEvaluation.missingPoints).map((mc, mIdx) => (
                                  <li key={mIdx} className="flex items-start gap-1.5">
                                    <span className="text-amber-400 shrink-0">•</span>
                                    <span>{mc}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-slate-500 italic">All core concepts were addressed.</li>
                              )}
                            </ul>
                          </div>

                          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
                            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5" /> Detailed Improvement Suggestions
                            </span>
                            <ul className="space-y-1 text-slate-300 text-[11px]">
                              {(currentEvaluation.suggestions && currentEvaluation.suggestions.length > 0) ? (
                                currentEvaluation.suggestions.map((sg, gIdx) => (
                                  <li key={gIdx} className="flex items-start gap-1.5">
                                    <span className="text-cyan-400 shrink-0">•</span>
                                    <span>{sg}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-slate-500 italic">Continue practicing full-length responses with quantifiable metrics.</li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Ideal Sample Answer Accordion / Preview */}
                        {currentEvaluation.modelAnswer && (
                          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Ideal Sample Answer (Staff-Level Model Answer)</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-lg border border-indigo-500/10 italic">
                              "{currentEvaluation.modelAnswer}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
