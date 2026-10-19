import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../recordLabel.css';

// SkillBridge Core Capabilities & Modules (Coherent with SkillBridge Intelligence platform)
const MODULE_DECKS = [
  {
    code: 'SB-01',
    category: 'RESUME VISUALIZATION',
    title: 'DYNAMIC CANVAS & TAXONOMY',
    format: 'Real-time Live Render / JSON / PDF',
    badge: 'CORE ENGINE',
    accent: '#E8913C',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    summary: 'High-density visual breakdown of technical competencies, work history, and verified project trajectories.',
    features: ['Taxonomy Extraction', 'Experience Density Graph', 'Verified Credentials', 'Export-Ready PDF'],
    actionTab: 'visualizer'
  },
  {
    code: 'SB-02',
    category: 'ATS & JD ANALYZER',
    title: 'ALGORITHMIC FIT & KEYWORDS',
    format: 'Heuristic Matching / Role Calibration',
    badge: 'DIAGNOSTIC',
    accent: '#2E6B72',
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    summary: 'Scans your resume against real-world job taxonomy to detect missing skill gaps, power verbs, and ATS parsing pitfalls.',
    features: ['ATS Keyword Density', 'Weak Verb Replacement', 'Gap Analysis', 'Role Weighting Score'],
    actionTab: 'analyzer'
  },
  {
    code: 'SB-03',
    category: 'MOCK INTERVIEWER',
    title: 'GEMINI AI REASONING AGENT',
    format: 'Adaptive Questions / Real-Time Evaluation',
    badge: 'INTELLIGENCE',
    accent: '#EDE7DC',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    summary: 'Generates role-tailored technical & behavioral interview prompts based on your actual resume bullets with instant grading.',
    features: ['Contextual Prompts', 'STAR-Method Scoring', 'Follow-up Inquiries', 'Voice Transcription'],
    actionTab: 'interview'
  },
  {
    code: 'SB-04',
    category: 'SKILL ROADMAP',
    title: 'TRANSITION BRIDGES & PATHWAYS',
    format: 'Structured Learning Milestones',
    badge: 'STRATEGY',
    accent: '#E8913C',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    summary: 'Synthesizes targeted curriculum milestones to transition your current skillset into desired target senior roles.',
    features: ['Step-by-step Milestones', 'Resource Linkage', 'Prerequisite Tracking', 'Role Benchmarks'],
    actionTab: 'roadmap'
  },
  {
    code: 'SB-05',
    category: 'STAR BULLET OPTIMIZER',
    title: 'IMPACT & POWER METRICS',
    format: 'Action-Context-Result Engine',
    badge: 'OPTIMIZATION',
    accent: '#2E6B72',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    summary: 'Rewrites weak, passive resume bullet points into measurable, high-impact achievements that command attention.',
    features: ['Measurable Outcomes', 'Active Verbs', 'Quantified Metrics', 'Instant Suggestions'],
    actionTab: 'bullet'
  }
];

// Architectural Pillars / Roster
const PILLARS = [
  { code: '[01]', name: 'ATS PARSING ENGINE', focus: 'HEURISTIC KEYWORD EXTRACTION & TAXONOMY', spec: '100% CLIENT-SIDE', status: 'ACTIVE' },
  { code: '[02]', name: 'GOOGLE GEMINI ADAPTER', focus: 'SEMANTIC INTERVIEW & BULLET RECONSTRUCTION', spec: 'LLM 2.5 FLASH', status: 'READY' },
  { code: '[03]', name: 'MULTI-FORMAT PARSER', focus: 'PDF-PARSE & MAMMOTH DOCX EXTRACTORS', spec: 'STREAMING BUFFER', status: 'ONLINE' },
  { code: '[04]', name: 'STAR FORMULATION MATRIX', focus: 'SITUATION-TASK-ACTION-RESULT AUDIT', spec: 'VERIFIED LOGIC', status: 'OPTIMIZED' },
  { code: '[05]', name: 'TAXONOMY DATABASE', focus: 'ROLE KEYWORDS ACROSS 12+ TECH SPECIALIZATIONS', spec: '500+ BENCHMARKS', status: 'CALIBRATED' }
];

// Intelligence Benchmarks / Specifications Table
const BENCHMARKS = [
  { category: 'ATS COMPLIANCE', target: 'PARSING FIDELITY', standard: 'Zero-drop structured text tokenization across columns', status: 'OPTIMAL' },
  { category: 'AI MOCK INTERVIEWS', target: 'GEMINI FLASH EVALUATION', standard: 'Real-time multi-dimensional scoring on relevance & clarity', standardNote: 'Under 1.2s latency', status: 'CALIBRATED' },
  { category: 'STAR OPTIMIZATION', target: 'BULLET ENHANCEMENT', standard: 'Automated weak-verb detection & impact quantification', status: 'ACCELERATED' },
  { category: 'ROADMAP GENERATION', target: 'GAP RESOLUTION', standard: 'Personalized step-by-step technical milestone pathways', status: 'VERIFIED' },
  { category: 'DATA PRIVACY', target: 'MEMORY RESIDENCY', standard: 'All uploads parsed in temporary memory buffers without storage', status: 'ENFORCED' }
];

export default function SkillBridgeLanding({ onLaunchApp, onOpenTab }) {
  // --- Portal Hero Scroll Progress State ---
  const heroRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 = closed, 1 = fully open

  // --- Card Deck State ---
  const [deck, setDeck] = useState(MODULE_DECKS);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [throwDirection, setThrowDirection] = useState(null); // 'left' | 'right' | null
  const dragStartRef = useRef({ x: 0, y: 0 });
  const deckRef = useRef(null);

  // Scroll tracking for Portal Hero (strictly driven by scroll position)
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const heroHeight = heroRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      const scrolled = -rect.top;
      const totalScrollable = heroHeight - windowHeight;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Card deck controls
  const handleThrow = useCallback((direction) => {
    setThrowDirection(direction);
    setTimeout(() => {
      setDeck(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setThrowDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 280);
  }, []);

  // Pointer drag handlers
  const onPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = (e.clientY - dragStartRef.current.y) * 0.3; // dampened Y movement
    setDragOffset({ x: dx, y: dy });
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    const threshold = 55; // roughly 1/10th deck width
    if (dragOffset.x > threshold) {
      handleThrow('right');
    } else if (dragOffset.x < -threshold) {
      handleThrow('left');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleThrow('right');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleThrow('left');
    }
  };

  // Calculate motion variables based strictly on scrollProgress [0 to 1]
  const panelTranslatePercent = scrollProgress * 105;
  const titleScale = 1 + scrollProgress * 0.22;
  const letterSpacing = -0.02 - (scrollProgress * 0.04);
  const spanTranslateX = scrollProgress * 85;
  const imageScale = 1.25 - (scrollProgress * 0.25);
  const duotoneOpacity = scrollProgress * 0.42;
  const dotOffset = scrollProgress * 180;
  const statementRotation = scrollProgress * 120;
  const statementDrift = scrollProgress * 60;

  return (
    <div className="portal-container min-h-screen text-[#EDE7DC] selection:bg-[#E8913C] selection:text-[#0A0C0E]">
      
      {/* ========================================================
          1. NAVIGATION (Fixed 58px bar, 14px backdrop blur)
         ======================================================== */}
      <nav className="fixed top-0 left-0 right-0 h-[58px] z-50 bg-[#0A0C0E]/80 backdrop-blur-[14px] border-b border-[rgba(237,231,220,0.13)] px-6 lg:px-12 flex items-center justify-between">
        
        {/* Wordmark with trailing amber period */}
        <div className="flex items-center gap-3">
          <a href="#portal" className="font-syne font-bold text-[15px] tracking-[-0.02em] text-[#EDE7DC] hover:opacity-90 flex items-center">
            <span>SKILLBRIDGE</span>
            <span className="text-[#E8913C] ml-[1px]">.</span>
          </a>
          <span className="text-[10px] tracking-[0.14em] text-[#6C7378] uppercase hidden sm:inline-block border-l border-[rgba(237,231,220,0.13)] pl-3">
            CAREER INTELLIGENCE PLATFORM
          </span>
        </div>

        {/* Center links: uppercase at 10.5px, turn amber on hover */}
        <div className="flex items-center gap-6 md:gap-9 text-[10.5px] uppercase tracking-[0.15em] font-sora font-semibold">
          <a href="#statement" className="text-[#9EA5A8] hover:text-[#E8913C] transition-colors">Manifesto</a>
          <a href="#modules" className="text-[#9EA5A8] hover:text-[#E8913C] transition-colors">Modules</a>
          <a href="#architecture" className="text-[#9EA5A8] hover:text-[#E8913C] transition-colors">Architecture</a>
          <a href="#benchmarks" className="text-[#9EA5A8] hover:text-[#E8913C] transition-colors">Benchmarks</a>
        </div>

        {/* Right pill buttons: Direct launch & Sign In */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenTab ? onOpenTab('login') : (onLaunchApp ? onLaunchApp() : null)}
            className="text-[10.5px] uppercase tracking-[0.14em] font-sora font-semibold px-3 py-1.5 text-[#EDE7DC] hover:text-[#E8913C] transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => onLaunchApp ? onLaunchApp() : (onOpenTab ? onOpenTab('visualizer') : null)}
            className="text-[10.5px] uppercase tracking-[0.14em] font-sora font-semibold px-4 py-2 rounded-full border border-[rgba(237,231,220,0.2)] text-[#EDE7DC] hover:border-[#E8913C] hover:text-[#E8913C] transition-all duration-200"
          >
            Launch Studio →
          </button>
        </div>
      </nav>

      {/* ========================================================
          2. PORTAL HERO (2.5 Viewports tall, sticky stage)
         ======================================================== */}
      <section 
        id="portal" 
        ref={heroRef} 
        className="relative h-[250vh] w-full"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden isolate bg-[#0A0C0E]">
          
          {/* Layer 1 (Back): Full-bleed image starting overscaled and settling down */}
          <div 
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{
              transform: `scale(${imageScale})`,
              transition: 'transform 0.05s linear'
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=85" 
              alt="SkillBridge Neural Architecture" 
              className="w-full h-full object-cover object-center grayscale contrast-125"
            />
          </div>

          {/* Layer 2: Duotone wash blending amber & teal at mix-blend-mode overlay */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              opacity: duotoneOpacity,
              background: 'linear-gradient(135deg, #E8913C 0%, #2E6B72 100%)'
            }}
          />

          {/* Layer 3: Radial veil darkening the edges */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 35%, rgba(10,12,14,0.7) 70%, #0A0C0E 95%)'
            }}
          />

          {/* Layer 4: TWO solid panels meeting in the middle, translating outward past their width */}
          {/* Left Panel */}
          <div 
            className="absolute top-0 bottom-0 left-0 w-[50.5vw] bg-[#0A0C0E] border-r border-[rgba(237,231,220,0.08)] z-10 will-change-transform flex items-center justify-end pr-6"
            style={{
              transform: `translateX(-${panelTranslatePercent}%)`
            }}
          >
            <div className="hidden lg:block text-right opacity-30 text-[9px] uppercase tracking-[0.2em] font-sora text-[#9EA5A8] mr-4">
              [ PORTAL 01 — SKILL ]
            </div>
          </div>

          {/* Right Panel */}
          <div 
            className="absolute top-0 bottom-0 right-0 w-[50.5vw] bg-[#0A0C0E] border-l border-[rgba(237,231,220,0.08)] z-10 will-change-transform flex items-center justify-start pl-6"
            style={{
              transform: `translateX(${panelTranslatePercent}%)`
            }}
          >
            <div className="hidden lg:block text-left opacity-30 text-[9px] uppercase tracking-[0.2em] font-sora text-[#9EA5A8] ml-4">
              [ PORTAL 02 — BRIDGE ]
            </div>
          </div>

          {/* Layer 5: Two accent dots traveling out toward opposite corners */}
          <div 
            className="absolute w-2 h-2 rounded-full pointer-events-none z-20"
            style={{
              top: '50%',
              left: '50%',
              backgroundColor: '#E8913C',
              transform: `translate(calc(-50% - ${dotOffset}px), calc(-50% - ${dotOffset * 0.7}px))`
            }}
          />
          <div 
            className="absolute w-2 h-2 rounded-full pointer-events-none z-20"
            style={{
              top: '50%',
              left: '50%',
              backgroundColor: '#2E6B72',
              transform: `translate(calc(-50% + ${dotOffset}px), calc(-50% + ${dotOffset * 0.7}px))`
            }}
          />

          {/* Layer 6: Signature Title - Wordmark splits into two spans, grows & tightens */}
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none select-none">
            <h1 
              className="font-syne font-extrabold text-[clamp(44px,10vw,140px)] uppercase text-[#EDE7DC] flex items-center leading-none"
              style={{
                transform: `scale(${titleScale})`,
                letterSpacing: `${letterSpacing}em`,
                transition: 'letter-spacing 0.05s linear, transform 0.05s linear'
              }}
            >
              <span 
                className="inline-block will-change-transform"
                style={{
                  transform: `translateX(-${spanTranslateX}px)`
                }}
              >
                SKILL
              </span>
              <span 
                className="inline-block will-change-transform"
                style={{
                  transform: `translateX(${spanTranslateX}px)`
                }}
              >
                BRIDGE
              </span>
            </h1>
          </div>

          {/* Corner metadata pinned to top and bottom edges */}
          <div className="absolute top-[72px] left-8 lg:left-12 z-30 flex items-center gap-2 text-[10.5px] uppercase tracking-[0.15em] text-[#9EA5A8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8913C]" />
            <span>EST. 2026 // CAREER INTELLIGENCE SYSTEM</span>
          </div>

          <div className="absolute top-[72px] right-8 lg:right-12 z-30 text-[10.5px] uppercase tracking-[0.15em] text-[#9EA5A8]">
            <span>ATS SCANNER // GEMINI AGENT</span>
          </div>

          <div className="absolute bottom-8 left-8 lg:left-12 z-30 text-[10.5px] uppercase tracking-[0.15em] text-[#6C7378] flex items-center gap-4">
            <span>SCROLL DISPLACEMENT: {(scrollProgress * 100).toFixed(0)}%</span>
            <span className="text-[rgba(237,231,220,0.13)]">|</span>
            <span>PORTAL APERTURE: {scrollProgress >= 0.85 ? 'OPEN' : 'ENGAGED'}</span>
          </div>

          <div className="absolute bottom-8 right-8 lg:right-12 z-30 flex items-center gap-2 text-[10.5px] uppercase tracking-[0.15em] text-[#9EA5A8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B72]" />
            <span>THROWABLE MODULE DECK</span>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. STATEMENT FOLD (Full-height section with index & drift)
         ======================================================== */}
      <section 
        id="statement" 
        className="min-h-screen relative flex items-center justify-between px-6 lg:px-20 border-b border-[rgba(237,231,220,0.13)] overflow-hidden bg-[#0A0C0E]"
      >
        <div className="max-w-4xl z-10 py-24">
          <div className="text-[10.5px] font-sora font-semibold uppercase tracking-[0.15em] text-[#9EA5A8] flex items-center gap-3 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8913C]" />
            <span>01 / STATEMENT OF PURPOSE</span>
          </div>

          <p className="font-syne font-bold text-[clamp(26px,3.8vw,52px)] leading-[1.18] tracking-[-0.025em] text-[#EDE7DC] max-w-[23ch]">
            We bridge the gap between engineering talent and algorithmic screening.{' '}
            <span className="text-[#E8913C]">No decorative fluff.</span> Pure resume parsing
            fidelity, STAR impact metrics, and AI mock evaluations.
          </p>

          <div className="mt-12 flex items-center gap-8 text-[11px] font-sora uppercase tracking-[0.14em] text-[#9EA5A8]">
            <div>
              <span className="text-[#EDE7DC] font-syne text-lg font-bold block">100%</span>
              <span>Client-Side Privacy</span>
            </div>
            <div className="w-[1px] h-8 bg-[rgba(237,231,220,0.13)]" />
            <div>
              <span className="text-[#EDE7DC] font-syne text-lg font-bold block">12+</span>
              <span>Role Taxonomies</span>
            </div>
            <div className="w-[1px] h-8 bg-[rgba(237,231,220,0.13)]" />
            <div>
              <span className="text-[#EDE7DC] font-syne text-lg font-bold block">0.8s</span>
              <span>Parsing Velocity</span>
            </div>
          </div>
        </div>

        {/* Big Outlined index numeral (-webkit-text-stroke transparent fill) */}
        <div className="absolute right-4 lg:right-16 bottom-10 select-none pointer-events-none z-0">
          <span className="font-syne font-extrabold text-[clamp(120px,22vw,320px)] leading-none text-stroke-outline block">
            01
          </span>
        </div>

        {/* Circular image floating off right edge, drifting and rotating */}
        <div 
          className="hidden md:block absolute right-[-4vw] top-[20%] w-[340px] h-[340px] rounded-full overflow-hidden border border-[rgba(237,231,220,0.13)] opacity-40 pointer-events-none"
          style={{
            transform: `translateY(${statementDrift}px) rotate(${statementRotation}deg)`,
            transition: 'transform 0.1s linear'
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80" 
            alt="SkillBridge Neural Node" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
      </section>

      {/* ========================================================
          4. RELEASES / MODULES THROWABLE DECK
         ======================================================== */}
      <section 
        id="modules" 
        className="min-h-screen py-24 px-6 lg:px-20 border-b border-[rgba(237,231,220,0.13)] bg-[#101317]"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Headline, Lede, Buttons */}
          <div className="lg:col-span-5">
            <div className="text-[10.5px] font-sora font-semibold uppercase tracking-[0.15em] text-[#9EA5A8] flex items-center gap-3 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B72]" />
              <span>02 / INTELLIGENCE MODULES</span>
            </div>

            <h2 className="font-syne font-extrabold text-[clamp(32px,4vw,56px)] leading-[1.08] tracking-[-0.03em] text-[#EDE7DC] mb-6">
              THE CAPABILITY SLEEVES.
            </h2>

            <p className="font-sora text-[14px] leading-relaxed text-[#9EA5A8] mb-8">
              A physical deck of five intelligence engines. Drag or swipe each sleeve sideways to toss it aside and uncover the next module, or launch directly into the studio.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => handleThrow('left')}
                className="text-[11px] uppercase tracking-[0.14em] font-sora font-semibold px-5 py-2.5 rounded-full border border-[rgba(237,231,220,0.2)] text-[#EDE7DC] hover:border-[#E8913C] hover:text-[#E8913C] transition-colors"
              >
                ← Toss Prev
              </button>
              <button 
                onClick={() => handleThrow('right')}
                className="text-[11px] uppercase tracking-[0.14em] font-sora font-semibold px-5 py-2.5 rounded-full border border-[rgba(237,231,220,0.2)] text-[#EDE7DC] hover:border-[#2E6B72] hover:text-[#2E6B72] transition-colors"
              >
                Toss Next →
              </button>
              <button
                onClick={() => onOpenTab ? onOpenTab(deck[0].actionTab) : (onLaunchApp && onLaunchApp())}
                className="text-[11px] uppercase tracking-[0.14em] font-sora font-semibold px-5 py-2.5 rounded-full border border-[#E8913C] text-[#E8913C] hover:bg-[#E8913C]/10 transition-colors"
              >
                Launch {deck[0].category} ↗
              </button>
            </div>

            {/* Currently focused card details */}
            <div className="mt-12 pt-6 border-t border-[rgba(237,231,220,0.13)]">
              <div className="flex items-center justify-between text-[11px] tracking-[0.12em] font-sora uppercase text-[#9EA5A8] mb-2">
                <span>MODULE CODE</span>
                <span className="text-[#EDE7DC] font-semibold">{deck[0].code}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] tracking-[0.12em] font-sora uppercase text-[#9EA5A8] mb-2">
                <span>FORMAT SPEC</span>
                <span className="text-[#EDE7DC]">{deck[0].format}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] tracking-[0.12em] font-sora uppercase text-[#9EA5A8]">
                <span>CORE DIRECTIVE</span>
                <span className="text-[#EDE7DC]">{deck[0].title}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Physical Stack / Throwable Card Deck */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            <div 
              ref={deckRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className="relative w-full max-w-[420px] aspect-square select-none outline-none focus:ring-1 focus:ring-[rgba(237,231,220,0.2)] rounded-lg touch-pan-y"
              aria-label="SkillBridge Modules Deck. Drag sleeves or use left and right arrow keys to browse."
            >
              {deck.map((item, index) => {
                const isTop = index === 0;
                const stackOffset = Math.min(index, 3);
                
                // Stack layout offsets
                const staticX = stackOffset * 10;
                const staticY = -stackOffset * 8;
                const staticScale = 1 - (stackOffset * 0.04);
                const staticRot = (index % 2 === 0 ? 1 : -1) * stackOffset * 1.6;

                // Active drag calculations
                let currentX = staticX;
                let currentY = staticY;
                let currentRot = staticRot;
                let currentScale = staticScale;
                let transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';

                if (isTop) {
                  if (throwDirection === 'right') {
                    currentX = 500;
                    currentY = -40;
                    currentRot = 24;
                    transition = 'transform 0.28s ease-out';
                  } else if (throwDirection === 'left') {
                    currentX = -500;
                    currentY = -40;
                    currentRot = -24;
                    transition = 'transform 0.28s ease-out';
                  } else if (isDragging) {
                    currentX = dragOffset.x;
                    currentY = dragOffset.y;
                    currentRot = dragOffset.x * 0.05;
                    currentScale = 1.02;
                    transition = 'none';
                  }
                }

                return (
                  <div
                    key={item.code}
                    onPointerDown={isTop ? onPointerDown : undefined}
                    onPointerMove={isTop ? onPointerMove : undefined}
                    onPointerUp={isTop ? onPointerUp : undefined}
                    onPointerCancel={isTop ? onPointerUp : undefined}
                    className="absolute inset-0 w-full h-full rounded-md border border-[rgba(237,231,220,0.18)] bg-[#0A0C0E] deck-card-shadow overflow-hidden cursor-grab active:cursor-grabbing will-change-transform"
                    style={{
                      transform: `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRot}deg) scale(${currentScale})`,
                      zIndex: 30 - index,
                      transition
                    }}
                  >
                    {/* Sleeve Artwork */}
                    <div className="relative w-full h-[68%] overflow-hidden bg-[#101317]">
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full h-full object-cover grayscale contrast-125 pointer-events-none" 
                      />
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#0A0C0E]/90 text-[9px] font-sora font-semibold uppercase tracking-[0.16em] text-[#EDE7DC]">
                        {item.code} // {item.badge}
                      </div>
                      <div className="absolute top-3 right-3 text-[9px] font-sora uppercase tracking-[0.16em] text-[#9EA5A8]">
                        INDEX {index + 1} OF 5
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] tracking-[0.14em] uppercase font-sora text-[#9EA5A8] block">{item.category}</span>
                        <span className="font-syne font-bold text-base text-[#EDE7DC]">{item.title}</span>
                      </div>
                    </div>

                    {/* Sleeve Bottom Info */}
                    <div className="p-4 bg-[#0A0C0E] h-[32%] flex flex-col justify-between border-t border-[rgba(237,231,220,0.1)]">
                      <p className="text-[11px] font-sora text-[#9EA5A8] line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[9.5px] font-sora uppercase tracking-[0.1em] text-[#6C7378]">
                        {item.features.slice(0, 2).map((feat, fi) => (
                          <div key={fi} className="truncate">• {feat}</div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-sora uppercase tracking-[0.14em] text-[#9EA5A8] pt-1 border-t border-[rgba(237,231,220,0.06)]">
                        <span>{item.format}</span>
                        <span className="text-[#E8913C]">THROW ASIDE →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hint line & progress dots beneath deck */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-[10.5px] uppercase tracking-[0.15em] text-[#6C7378] font-sora">
                DRAG SLEEVE OR USE ← / → KEYS TO THROW
              </p>
              
              <div className="flex items-center gap-2">
                {MODULE_DECKS.map((m) => (
                  <button
                    key={m.code}
                    onClick={() => {
                      const idx = deck.findIndex(item => item.code === m.code);
                      if (idx > 0) {
                        const newDeck = [...deck.slice(idx), ...deck.slice(0, idx)];
                        setDeck(newDeck);
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      deck[0].code === m.code 
                        ? 'bg-[#E8913C] w-4' 
                        : 'bg-[rgba(237,231,220,0.2)] hover:bg-[rgba(237,231,220,0.4)]'
                    }`}
                    aria-label={`Jump to ${m.code}`}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          5. ARCHITECTURAL ROSTER & BENCHMARKS TABLE
         ======================================================== */}
      <section 
        id="architecture" 
        className="py-24 px-6 lg:px-20 border-b border-[rgba(237,231,220,0.13)] bg-[#0A0C0E]"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <div className="text-[10.5px] font-sora font-semibold uppercase tracking-[0.15em] text-[#9EA5A8] flex items-center gap-3 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8913C]" />
                <span>03 / SYSTEM ARCHITECTURE</span>
              </div>
              <h2 className="font-syne font-extrabold text-[clamp(28px,3.4vw,44px)] tracking-[-0.03em] text-[#EDE7DC]">
                ENGINEERING SPECIFICATIONS
              </h2>
            </div>
            <p className="text-[11px] font-sora uppercase tracking-[0.14em] text-[#6C7378] max-w-xs">
              Every engine calibrated to modern ATS standards and recruiter scanning behaviors.
            </p>
          </div>

          {/* Hairline-ruled rows */}
          <div className="border-t border-[rgba(237,231,220,0.13)] divide-y divide-[rgba(237,231,220,0.13)]">
            {PILLARS.map((pillar) => (
              <div 
                key={pillar.name}
                className="py-6 px-2 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[#101317]/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-sora uppercase tracking-[0.15em] text-[#E8913C]">
                    {pillar.code}
                  </span>
                  <span className="font-syne font-bold text-xl md:text-2xl text-[#EDE7DC] tracking-[-0.02em]">
                    {pillar.name}
                  </span>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 text-[11px] font-sora uppercase tracking-[0.14em] text-[#9EA5A8]">
                  <span>{pillar.focus}</span>
                  <span className="text-[#6C7378] hidden lg:inline">{pillar.spec}</span>
                  <span className="text-[#EDE7DC] font-semibold">{pillar.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Benchmarks / Dates Table */}
          <div id="benchmarks" className="mt-28">
            <div className="text-[10.5px] font-sora font-semibold uppercase tracking-[0.15em] text-[#9EA5A8] flex items-center gap-3 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B72]" />
              <span>04 / PERFORMANCE & VALIDATION BENCHMARKS</span>
            </div>
            <h3 className="font-syne font-extrabold text-2xl tracking-[-0.02em] text-[#EDE7DC] mb-8">
              VERIFIED TARGETS
            </h3>

            {/* Desktop Table Headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-[rgba(237,231,220,0.13)] text-[10.5px] font-sora font-semibold uppercase tracking-[0.15em] text-[#9EA5A8]">
              <div className="col-span-3">CATEGORY</div>
              <div className="col-span-3">TARGET ENGINE</div>
              <div className="col-span-4">VERIFIED STANDARD</div>
              <div className="col-span-2 text-right">BENCHMARK</div>
            </div>

            {/* Table Rows (collapsing to two-column on narrow screens) */}
            <div className="divide-y divide-[rgba(237,231,220,0.13)]">
              {BENCHMARKS.map((item, index) => (
                <div 
                  key={index}
                  className="py-5 grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 items-center hover:bg-[#101317]/50 transition-colors"
                >
                  <div className="col-span-1 md:col-span-3 font-syne font-bold text-sm text-[#EDE7DC]">
                    {item.category}
                  </div>
                  <div className="col-span-1 md:col-span-3 text-right md:text-left text-[12px] font-sora uppercase tracking-[0.12em] text-[#EDE7DC]">
                    <span>{item.target}</span>
                  </div>
                  <div className="col-span-2 md:col-span-4 text-[12px] font-sora text-[#9EA5A8] tracking-[0.05em]">
                    {item.standard}
                  </div>
                  <div className="col-span-2 md:col-span-2 text-left md:text-right">
                    <span className="inline-block text-[10px] font-sora font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border border-[#2E6B72]/40 text-[#EDE7DC]">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          6. CLOSE (Cropped wordmark, fine-print, footer strip)
         ======================================================== */}
      <footer className="pt-24 pb-0 bg-[#0A0C0E] overflow-hidden border-t border-[rgba(237,231,220,0.13)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-16 border-b border-[rgba(237,231,220,0.13)]">
            <div>
              <div className="text-[10.5px] font-sora font-semibold uppercase tracking-[0.15em] text-[#9EA5A8] flex items-center gap-3 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8913C]" />
                <span>05 / CAREER ENGINE</span>
              </div>
              <h2 className="font-syne font-extrabold text-[clamp(28px,3.8vw,48px)] tracking-[-0.03em] text-[#EDE7DC] max-w-md">
                READY TO ENTER THE STUDIO.
              </h2>
              <p className="font-sora text-[11px] uppercase tracking-[0.14em] text-[#6C7378] mt-3">
                Load sample profiles, upload PDF resumes, and run AI evaluations in real time.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => onLaunchApp ? onLaunchApp() : (onOpenTab ? onOpenTab('visualizer') : null)}
                className="text-[11px] font-sora font-semibold uppercase tracking-[0.14em] px-6 py-3 rounded-full border border-[#E8913C] text-[#E8913C] hover:bg-[#E8913C]/10 transition-colors"
              >
                Launch Studio Workspace →
              </button>
              <a 
                href="#portal"
                className="text-[11px] font-sora font-semibold uppercase tracking-[0.14em] px-5 py-2.5 rounded-full border border-[rgba(237,231,220,0.2)] text-[#EDE7DC] hover:border-[#EDE7DC] transition-colors"
              >
                Top ↑
              </a>
            </div>
          </div>

          {/* Hairline footer strip */}
          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-sora uppercase tracking-[0.15em] text-[#6C7378]">
            <div className="flex items-center gap-4">
              <span>© 2026 SKILLBRIDGE PLATFORM</span>
              <span>•</span>
              <span>ALL INTELLIGENCE LOGIC LOCALIZED</span>
            </div>
            <div className="flex items-center gap-6">
              <span>ATS TAXONOMY: ACTIVE</span>
              <span>ENGINE: GEMINI 2.5 FLASH</span>
            </div>
          </div>
        </div>

        {/* The Cropped Wordmark full-width, translated down so the bottom edge crops it */}
        <div className="w-full overflow-hidden select-none pointer-events-none translate-y-[22%]">
          <div className="font-syne font-extrabold text-[clamp(72px,17vw,260px)] leading-none text-center text-[rgba(237,231,220,0.12)] tracking-[-0.04em] whitespace-nowrap">
            SKILLBRIDGE
          </div>
        </div>
      </footer>

    </div>
  );
}
