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
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuestionsApi, evaluateAnswerApi } from '../api';

export default function AiMockInterviewer({ resume, apiKey }) {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [category, setCategory] = useState('all');
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
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
  }, [selectedQuestionIndex]);

  // Load questions when resume changes
  useEffect(() => {
    loadQuestions();
  }, [resume, category]);

  const loadQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const res = await generateQuestionsApi(resume, category, apiKey);
      setQuestions(res.questions || []);
      setSelectedQuestionIndex(0);
      setCandidateAnswer('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const currentQuestion = questions[selectedQuestionIndex];
  const currentEvaluation = currentQuestion ? evaluations[currentQuestion.id] : null;

  // Question Speech-to-Audio (TTS)
  const handleToggleSpeakQuestion = () => {
    if (!('speechSynthesis' in window) || !currentQuestion) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(currentQuestion.question);
    utter.rate = 0.95;
    utter.pitch = 1.0;
    utter.onend = () => setIsSpeakingQuestion(false);
    utter.onerror = () => setIsSpeakingQuestion(false);
    setIsSpeakingQuestion(true);
    window.speechSynthesis.speak(utter);
  };

  // Real Microphone Speech-to-Text
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
      rec.lang = 'en-US';

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
    if (!currentQuestion || !candidateAnswer.trim()) return;
    setIsEvaluating(true);
    try {
      const res = await evaluateAnswerApi(
        currentQuestion.question,
        candidateAnswer,
        { role: resume.title, company: resume.experience?.[0]?.company },
        apiKey
      );
      const nextEvaluations = {
        ...evaluations,
        [currentQuestion.id]: res.evaluation
      };
      setEvaluations(nextEvaluations);
      try {
        localStorage.setItem(sessionKey, JSON.stringify(nextEvaluations));
      } catch (e) {
        console.warn('Failed to save interview evaluation:', e);
      }
      if (res.evaluation.score >= 8) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSimulateSpeech = () => {
    setIsSimulatingSpeech(true);
    const simulatedAnswers = [
      `At my previous company, when we experienced latency spikes up to 600ms on our primary search endpoints, I stepped in as lead to isolate the root cause. I ran profiling with pg_stat_statements and noticed sequential table scans caused by missing compound indexes on user search filters. I authored and load-tested compound indexes in staging, reducing p99 latency by 58% and saving approximately $4,000/month in database compute costs.`,
      `In a high-pressure sprint where product requirements shifted 48 hours before launch, I called an emergency sync with our design and backend stakeholders. We established a strict MVP scope, deferred non-critical analytics tracking to the next sprint, and paired up on core integration tests. We shipped on schedule with zero critical defects and 99.9% uptime on launch day.`,
      `When designing our microservice architecture, our biggest challenge was distributed state synchronization. We adopted event-driven choreography via Kafka topics, paired with Redis caching and optimistic concurrency locks. This decoupled our write path and allowed the ingestion pipeline to handle 15,000 requests per second seamlessly.`
    ];
    const chosen = simulatedAnswers[Math.floor(Math.random() * simulatedAnswers.length)];
    
    // Typewriter effect simulation
    let currentIdx = 0;
    setCandidateAnswer('');
    const interval = setInterval(() => {
      if (currentIdx < chosen.length) {
        setCandidateAnswer(chosen.slice(0, currentIdx + 4));
        currentIdx += 4;
      } else {
        clearInterval(interval);
        setIsSimulatingSpeech(false);
      }
    }, 20);
  };

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
              Resume-Anchored
            </span>
          </div>
          <p className="text-xs text-slate-400">
            AI interrogator generates targeted interview questions directly inspired by your actual experience, technologies, and projects.
          </p>
        </div>

        {/* Category switcher & Reload */}
        <div className="flex items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Question Types</option>
            <option value="Technical">Technical Deep-Dive</option>
            <option value="Behavioral">Behavioral (STAR)</option>
            <option value="Architecture">System Architecture</option>
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
        </div>
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
                      setCandidateAnswer('');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500 shadow-md shadow-indigo-600/10'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                        {q.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          q.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {q.difficulty}
                        </span>
                        {isDone && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                            Scored: {evaluations[q.id].score}/10
                          </span>
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
                
                {/* Active Question Details */}
                <div className="space-y-3 pb-4 border-b border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                        Question {selectedQuestionIndex + 1} of {questions.length}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {currentQuestion.category}
                      </span>
                    </div>
                    {currentQuestion.contextAnchor && (
                      <span className="text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        Anchor: <strong className="text-indigo-300">{currentQuestion.contextAnchor}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug flex-1">
                      {currentQuestion.question}
                    </h3>
                    <button
                      onClick={handleToggleSpeakQuestion}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                        isSpeakingQuestion
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-600/30'
                      }`}
                      title="AI speaks the question aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeakingQuestion ? 'Stop Audio' : 'Listen to AI Question'}</span>
                    </button>
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
                      Your Response (STAR Method encouraged)
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleMic}
                        className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition ${
                          isListeningMic
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                        title="Speak directly into your microphone"
                      >
                        <Mic className="w-3 h-3 text-rose-400" />
                        <span>{isListeningMic ? 'Recording (Click to Stop)...' : 'Use Microphone'}</span>
                      </button>

                      <button
                        onClick={handleSimulateSpeech}
                        disabled={isSimulatingSpeech}
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 transition hover:bg-cyan-500/20"
                        title="Insert a realistic speech audio transcription"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isSimulatingSpeech ? 'Dictating...' : 'Sample Voice'}</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={6}
                    value={candidateAnswer}
                    onChange={(e) => setCandidateAnswer(e.target.value)}
                    placeholder="Provide your answer. Walk through the Situation, Task, what specific Actions you took, and the quantifiable Result..."
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed resize-none"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      {candidateAnswer.split(/\s+/).filter(Boolean).length} words
                    </span>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={isEvaluating || !candidateAnswer.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-lg shadow-indigo-600/30 transition"
                    >
                      {isEvaluating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                          <span>AI Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit & Evaluate Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Evaluation Results Card */}
                {currentEvaluation && (
                  <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-4 animate-fade-in">
                    
                    {/* Score Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                          AI Assessment Scorecard
                        </span>
                        <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                          {currentEvaluation.verdict}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-black text-indigo-400">
                            {currentEvaluation.score}<span className="text-sm text-slate-500">/10</span>
                          </span>
                          <span className="text-[10px] text-slate-400">Overall Rating</span>
                        </div>
                      </div>
                    </div>

                    {/* Sub-Metrics Breakdown */}
                    <div className="grid grid-cols-3 gap-2 text-center py-1">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-sm font-bold text-cyan-400">{currentEvaluation.clarityScore || 8}/10</div>
                        <div className="text-[10px] text-slate-400">Clarity & Flow</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-sm font-bold text-indigo-400">{currentEvaluation.technicalDepthScore || 8}/10</div>
                        <div className="text-[10px] text-slate-400">Technical Depth</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-sm font-bold text-emerald-400">{currentEvaluation.starAdherenceScore || 8}/10</div>
                        <div className="text-[10px] text-slate-400">STAR Adherence</div>
                      </div>
                    </div>

                    {/* Feedback paragraph */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      {currentEvaluation.feedback}
                    </p>

                    {/* Strengths and Gaps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                        </span>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          {(currentEvaluation.strengths || []).map((st, sIdx) => (
                            <li key={sIdx}>• {st}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
                        <span className="font-bold text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> What to Add
                        </span>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          {(currentEvaluation.missingPoints || []).map((mp, mIdx) => (
                            <li key={mIdx}>• {mp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Model Answer Accordion / Preview */}
                    {currentEvaluation.modelAnswer && (
                      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Staff-Level Model Answer</span>
                        </div>
                        <p className="text-xs text-slate-300 italic leading-relaxed">
                          "{currentEvaluation.modelAnswer}"
                        </p>
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
