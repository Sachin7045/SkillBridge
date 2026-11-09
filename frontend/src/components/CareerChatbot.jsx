import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Mic, 
  MicOff, 
  Copy, 
  Check, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  Target,
  Briefcase,
  Zap,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { chatCareerApi } from '../api';

const DEFAULT_PROMPT_PILLS = [
  "How do I optimize my resume for ATS filters?",
  "What technical questions will top companies ask for React and Node.js?",
  "How do I negotiate salary between ₹25 LPA and ₹35 LPA?",
  "What are my biggest skill gaps and how should I close them?",
  "Review my resume experience and suggest STAR improvements."
];

export default function CareerChatbot({ resume, apiKey = '', currentUser = null }) {
  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `### Welcome to your SkillBridge AI Career Advisory Session! 👋

I'm your dedicated Career Advisor & Technical Mentor. I can assist you with:
- **ATS Resume Diagnostics**: Improving keyword density, quantifiable impact, and formatting.
- **Technical Interview Prep**: System design patterns, concurrency, algorithms, and live behavioral practice.
- **Compensation & Negotiation**: Benchmarking salary bands, offer evaluations, and equity discussion strategies.
- **Skill Gap Roadmap**: Mapping missing technologies required for Senior engineering levels.

Ask me anything or select a topic below to begin!`,
        suggestions: DEFAULT_PROMPT_PILLS.slice(0, 3)
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopiedId, setIsCopiedId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Web Speech API Voice Dictation Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  const handleToggleMic = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const resumeContext = {
        name: currentUser?.name || resume?.name || 'Candidate',
        targetRole: resume?.targetRole || 'Full Stack Developer',
        skills: resume?.skills || {},
        experience: resume?.experience || [],
        atsScore: 86
      };

      const res = await chatCareerApi(newMessages, resumeContext, apiKey);
      
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        suggestions: res.suggestions || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `I ran into an issue connecting to the advisory engine. Please try again or rephrase your question.`,
          suggestions: DEFAULT_PROMPT_PILLS.slice(0, 3)
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setIsCopiedId(id);
    setTimeout(() => setIsCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        role: 'assistant',
        content: `### Chat History Cleared.

How can I assist your career progression or resume optimization today?`,
        suggestions: DEFAULT_PROMPT_PILLS.slice(0, 3)
      }
    ]);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#007C83] flex items-center justify-center shrink-0 shadow-sm">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">AI Career Chatbot & Executive Advisor</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#14B8A6]/20 text-[#0F766E] border border-[#14B8A6]/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalized guidance on ATS resumes, system design interviews, and compensation negotiation for <span className="font-semibold text-slate-700">{resume?.targetRole || 'Full Stack Developer'}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleClearChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-teal-100 shadow-sm flex flex-col h-[640px] overflow-hidden">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div 
                key={m.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`rounded-2xl px-5 py-3.5 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#0F766E] text-white shadow-sm rounded-tr-none'
                        : 'bg-teal-50/50 border border-teal-100 text-slate-800 shadow-sm rounded-tl-none'
                    }`}
                  >
                    {/* Render message lines with basic markdown styling */}
                    <div className="space-y-2 whitespace-pre-wrap">
                      {m.content}
                    </div>

                    {!isUser && (
                      <div className="mt-3 pt-2 border-t border-teal-100/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Career Advisory AI</span>
                        <button
                          onClick={() => handleCopyText(m.id, m.content)}
                          className="flex items-center gap-1 text-slate-500 hover:text-[#0F766E] transition"
                          title="Copy Answer"
                        >
                          {isCopiedId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {!isUser && m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {m.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sug)}
                          className="px-3 py-1 rounded-full bg-white hover:bg-teal-50 border border-teal-200 text-[#0F766E] text-[11px] font-semibold transition hover:scale-[1.01] text-left shadow-2xs"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#003B49] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm mt-1">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3.5 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100 text-xs text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#007C83] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-500 font-medium ml-1">Formulating strategic career response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Area */}
        <div className="p-4 sm:p-5 bg-white border-t border-teal-100">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {speechSupported && (
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-3 rounded-2xl border transition ${
                  isListening 
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' 
                    : 'bg-slate-50 hover:bg-teal-50 border-slate-200 text-slate-600 hover:text-[#0F766E]'
                }`}
                title={isListening ? "Listening... click to stop" : "Voice dictation"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about resume keywords, interview scenarios, compensation, or roadmaps..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50/70 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#0F766E] transition shadow-inner"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-[#0F766E] hover:bg-[#0D9488] disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#0F766E]" />
              <span>Calibrated with your verified candidate context and target role</span>
            </span>
            <span>SkillBridge AI Studio</span>
          </div>
        </div>

      </div>
    </div>
  );
}
