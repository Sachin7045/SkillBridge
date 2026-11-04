/**
 * SkillBridge Multilingual AI Interview Configuration & Translations
 * Supports 11+ Languages with Native Voice Synthesis & Speech Recognition Codes
 */

export const SUPPORTED_INTERVIEW_LANGUAGES = [
  {
    id: 'en-US',
    name: 'English (US / Global)',
    shortName: 'English',
    nativeName: 'English',
    flag: '🌐',
    speechCode: 'en-US',
    greeting: "Hello! Here is your interview question:"
  },
  {
    id: 'hi-IN',
    name: 'Hindi (हिन्दी)',
    shortName: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    speechCode: 'hi-IN',
    greeting: "नमस्ते! आपका इंटरव्यू सवाल यह है:"
  },
  {
    id: 'hinglish',
    name: 'Hinglish (Hindi + English)',
    shortName: 'Hinglish',
    nativeName: 'Hinglish',
    flag: '🇮🇳',
    speechCode: 'hi-IN',
    fallbackSpeechCode: 'en-IN',
    greeting: "Hello candidate! Aapka agla interview question ye raha:"
  },
  {
    id: 'es-ES',
    name: 'Spanish (Español)',
    shortName: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    speechCode: 'es-ES',
    greeting: "¡Hola! Aquí está su pregunta de entrevista:"
  },
  {
    id: 'fr-FR',
    name: 'French (Français)',
    shortName: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechCode: 'fr-FR',
    greeting: "Bonjour ! Voici votre question d'entretien :"
  },
  {
    id: 'de-DE',
    name: 'German (Deutsch)',
    shortName: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechCode: 'de-DE',
    greeting: "Hallo! Hier ist Ihre Interviewfrage:"
  },
  {
    id: 'ja-JP',
    name: 'Japanese (日本語)',
    shortName: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    speechCode: 'ja-JP',
    greeting: "こんにちは！面接の質問はこちらです："
  },
  {
    id: 'zh-CN',
    name: 'Chinese (中文)',
    shortName: 'Chinese',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    speechCode: 'zh-CN',
    greeting: "你好！这是您的面试问题："
  },
  {
    id: 'ar-SA',
    name: 'Arabic (العربية)',
    shortName: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    speechCode: 'ar-SA',
    greeting: "مرحباً! هذا هو سؤال المقابلة الخاص بك:"
  },
  {
    id: 'ru-RU',
    name: 'Russian (Русский)',
    shortName: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    speechCode: 'ru-RU',
    greeting: "Здравствуйте! Вот ваш вопрос для собеседования:"
  },
  {
    id: 'pt-BR',
    name: 'Portuguese (Português)',
    shortName: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    speechCode: 'pt-BR',
    greeting: "Olá! Aqui está a sua pergunta da entrevista:"
  }
];

export const UI_TRANSLATIONS = {
  'en-US': {
    aiInterviewerTitle: "Voice Interviewer",
    listenQuestion: "Listen to Question",
    stopSpeaking: "Stop Speaking",
    autoAsk: "Auto-Ask on Question Change",
    speakingStatus: "Interviewer is speaking...",
    useMic: "Use Microphone",
    recording: "Recording (Click to Stop)...",
    sampleVoice: "Sample Voice Answer",
    submitAnswer: "Submit for Evaluation",
    evaluating: "Evaluating Answer...",
    selectLang: "Interview Language:",
    speed: "Speech Speed",
    originalEnglish: "View Original English"
  },
  'hi-IN': {
    aiInterviewerTitle: "वॉइस इंटरव्यूअर",
    listenQuestion: "सवाल सुनें (Play)",
    stopSpeaking: "बोलना बंद करो",
    autoAsk: "सवाल बदलते ही खुद पूछे",
    speakingStatus: "इंटरव्यूअर सवाल पूछ रहा है...",
    useMic: "माइक से बोलें",
    recording: "रिकॉर्डिंग चालू है (रोकने के लिए क्लिक करें)...",
    sampleVoice: "सैंपल वॉइस उत्तर",
    submitAnswer: "मूल्यांकन के लिए भेजें",
    evaluating: "मूल्यांकन हो रहा है...",
    selectLang: "इंटरव्यू भाषा:",
    speed: "आवाज़ की गति",
    originalEnglish: "अंग्रेज़ी ओरिजिनल देखें"
  },
  'hinglish': {
    aiInterviewerTitle: "Voice Interviewer",
    listenQuestion: "Sawaal Suno (Play)",
    stopSpeaking: "Stop Speaking",
    autoAsk: "Auto-Ask Question on Switch",
    speakingStatus: "Interviewer sawaal pooch raha hai...",
    useMic: "Mic se Bolo",
    recording: "Recording chalu hai (Stop karne ke liye click karein)...",
    sampleVoice: "Sample Voice Answer",
    submitAnswer: "Submit for Evaluation",
    evaluating: "Evaluation chal raha hai...",
    selectLang: "Interview Language:",
    speed: "Voice Speed",
    originalEnglish: "View Original English"
  },
  'es-ES': {
    aiInterviewerTitle: "Entrevistador de Voz",
    listenQuestion: "Escuchar la Pregunta",
    stopSpeaking: "Detener Voz",
    autoAsk: "Preguntar Automáticamente",
    speakingStatus: "El entrevistador está hablando...",
    useMic: "Usar Micrófono",
    recording: "Grabando (Clic para detener)...",
    sampleVoice: "Respuesta de Muestra",
    submitAnswer: "Enviar para Evaluación",
    evaluating: "Evaluando respuesta...",
    selectLang: "Idioma de la Entrevista:",
    speed: "Velocidad de Voz",
    originalEnglish: "Ver Inglés Original"
  },
  'fr-FR': {
    aiInterviewerTitle: "Interviewer Vocal",
    listenQuestion: "Écouter la Question",
    stopSpeaking: "Arrêter la Voix",
    autoAsk: "Poser Automatiquement",
    speakingStatus: "L'interviewer parle...",
    useMic: "Utiliser le Microphone",
    recording: "Enregistrement (Cliquer pour arrêter)...",
    sampleVoice: "Exemple de Réponse",
    submitAnswer: "Soumettre pour Évaluation",
    evaluating: "Évaluation en cours...",
    selectLang: "Langue de l'Entretien :",
    speed: "Vitesse Vocale",
    originalEnglish: "Voir l'Anglais d'Origine"
  },
  'de-DE': {
    aiInterviewerTitle: "Stimmen-Interviewer",
    listenQuestion: "Frage Anhören",
    stopSpeaking: "Sprechen Beenden",
    autoAsk: "Automatisch Fragen",
    speakingStatus: "KI-Interviewer spricht gerade...",
    useMic: "Mikrofon Verwenden",
    recording: "Aufnahme läuft (Klick zum Stoppen)...",
    sampleVoice: "Beispielantwort",
    submitAnswer: "Zur Bewertung Einreichen",
    evaluating: "KI bewertet Antwort...",
    selectLang: "Interview-Sprache:",
    speed: "Sprechtempo",
    originalEnglish: "Englisches Original Anzeigen"
  },
  'ja-JP': {
    aiInterviewerTitle: "音声面接官",
    listenQuestion: "AIが質問を読み上げる",
    stopSpeaking: "音声を停止",
    autoAsk: "質問切り替え時に自動発声",
    speakingStatus: "AI面接官が質問中...",
    useMic: "マイクで回答する",
    recording: "録音中（クリックで停止）...",
    sampleVoice: "模範回答サンプル",
    submitAnswer: "評価のために送信",
    evaluating: "AIが採点中...",
    selectLang: "面接言語：",
    speed: "音声速度",
    originalEnglish: "英語原文を表示"
  },
  'zh-CN': {
    aiInterviewerTitle: "语音面试官",
    listenQuestion: "AI 提问播放",
    stopSpeaking: "停止播放",
    autoAsk: "切换问题时自动提问",
    speakingStatus: "AI 面试官正在提问...",
    useMic: "使用麦克风回答",
    recording: "录音中（点击停止）...",
    sampleVoice: "示例语音回答",
    submitAnswer: "提交 AI 评估",
    evaluating: "AI 正在评分...",
    selectLang: "面试语言：",
    speed: "语音语速",
    originalEnglish: "查看英文原文"
  },
  'ar-SA': {
    aiInterviewerTitle: "المحاور الصوتي",
    listenQuestion: "استمع لسؤال الذكاء الاصطناعي",
    stopSpeaking: "إيقاف الصوت",
    autoAsk: "سؤال تلقائي عند التغيير",
    speakingStatus: "المحاور يتحدث الآن...",
    useMic: "استخدم الميكروفون",
    recording: "جاري التسجيل (انقر للإيقاف)...",
    sampleVoice: "إجابة صوتية نموذجية",
    submitAnswer: "إرسال للتقييم",
    evaluating: "الذكاء الاصطناعي يقيّم...",
    selectLang: "لغة المقابلة:",
    speed: "سرعة الصوت",
    originalEnglish: "عرض النص الإنجليزي الأصلي"
  },
  'ru-RU': {
    aiInterviewerTitle: "Голосовой интервьюер",
    listenQuestion: "ИИ Задает Вопрос",
    stopSpeaking: "Остановить Голос",
    autoAsk: "Авто-вопрос при переключении",
    speakingStatus: "ИИ-интервьюер говорит...",
    useMic: "Использовать Микрофон",
    recording: "Идет запись (Нажмите для остановки)...",
    sampleVoice: "Пример Ответа",
    submitAnswer: "Отправить на Оценку",
    evaluating: "ИИ оценивает ответ...",
    selectLang: "Язык Собеседования:",
    speed: "Скорость Речи",
    originalEnglish: "Показать Английский Оригинал"
  },
  'pt-BR': {
    aiInterviewerTitle: "Entrevistador de Voz",
    listenQuestion: "A IA Faz a Pergunta",
    stopSpeaking: "Parar de Falar",
    autoAsk: "Perguntar Automaticamente",
    speakingStatus: "O entrevistador IA está falando...",
    useMic: "Usar Microfone",
    recording: "Gravando (Clique para parar)...",
    sampleVoice: "Resposta de Exemplo",
    submitAnswer: "Enviar para Avaliação",
    evaluating: "IA Avaliando...",
    selectLang: "Idioma da Entrevista:",
    speed: "Velocidade da Voz",
    originalEnglish: "Ver Inglês Original"
  }
};

/**
 * Intelligent Multilingual Question Translator
 * Translates questions into candidate's chosen language with technical accuracy.
 */
export function getTranslatedQuestion(questionText, langId) {
  if (!questionText || langId === 'en-US') return questionText;

  const qLower = questionText.toLowerCase();
  const quoteMatch = questionText.match(/"([^"]+)"/);
  const quoteText = quoteMatch ? quoteMatch[1] : '';

  if (langId === 'hi-IN') {
    // 1. Frontend
    if (qLower.includes('virtual dom') || qLower.includes('fiber') || qLower.includes('reconciliation') || qLower.includes('react')) {
      return `रिएक्ट (React) के reconciliation एल्गोरिदम और Fiber आर्किटेक्चर के कार्यप्रणाली को समझाइए। Diffing चरण के दौरान रिएक्ट DOM नोड्स का चयन कैसे करता है, element keys की क्या भूमिका है, और बड़े कंपोनेंट ट्री में अनावश्यक re-renders को आप कैसे रोकते हैं?`;
    }
    if (qLower.includes('core web vitals') || qLower.includes('lcp') || qLower.includes('next.js') || qLower.includes('ssr')) {
      return `कोर वेब वाइटल्स (LCP, CLS, INP) की जांच और ऑप्टिमाइज़ेशन आप कैसे करते हैं? Next.js में Client-Side Rendering (CSR), Server-Side Rendering (SSR), और Static Site Generation (SSG) के बीच क्या तकनीकी ट्रेड-ऑफ्स हैं?`;
    }
    // 2. Backend & APIs
    if (qLower.includes('saga') || qLower.includes('monolith') || (qLower.includes('microservice') && qLower.includes('consistency'))) {
      return `मोनोलिथ से माइक्रोसर्विसेज में माइग्रेट करते समय बिना Two-Phase Commit (2PC) के डेटा स्थिरता कैसे बनाए रखते हैं? ऑर्डर और पेमेंट फ्लो के लिए एक आइडम्पोटेंट सागा पैटर्न (Orchestration बनाम Choreography) को समझाइए।`;
    }
    if (qLower.includes('rate limiting') || qLower.includes('circuit breaker') || qLower.includes('resilience')) {
      return `50,000 रिक्वेस्ट/सेकंड संभालने वाले हाई-थ्रूपुट API को आप कैसे डिजाइन करेंगे? रेडिस (Redis) के साथ डिस्ट्रीब्यूटेड रेट लिमिटिंग, API Idempotency keys, और सर्किट ब्रेकर्स (Circuit Breakers) के कार्यान्वयन को विस्तार से समझाइए।`;
    }
    // 3. Database
    if (qLower.includes('explain') || qLower.includes('b-tree') || (qLower.includes('index') && qLower.includes('database'))) {
      return `डेटाबेस में जब कोई क्रिटिकल क्वेरी धीमी हो जाती है, तो आप EXPLAIN (ANALYZE, BUFFERS) प्लान की जांच कैसे करते हैं? B-Tree इंडेक्स कैसे काम करते हैं, और आप कंपोजिट या पार्शियल इंडेक्स कब चुनते हैं?`;
    }
    if (qLower.includes('hotspot') || qLower.includes('locking') || qLower.includes('concurrency')) {
      return `उच्च समवर्ती लेखन (High Concurrent Writes) के दौरान डेटाबेस हॉटस्पॉट पंक्तियों को आप कैसे संभालते हैं? Optimistic Concurrency Control बनाम Pessimistic Locking की तुलना करें और PgBouncer कनेक्शन पूलिंग की भूमिका बताएं।`;
    }
    // 4. System Design
    if (qLower.includes('100m') || qLower.includes('feed') || qLower.includes('sharding') || qLower.includes('notification system')) {
      return `100 मिलियन से अधिक दैनिक सक्रिय उपयोगकर्ताओं (DAU) के लिए 100ms से कम लेटेंसी वाला रियल-टाइम फीड सिस्टम कैसे डिजाइन करेंगे? कंसिस्टेंट हैशिंग शार्डिंग, मल्टी-टियर रेडिस कैशिंग, और थंडरिंग हर्ड समस्या से कैसे निपटेंगे?`;
    }
    if (qLower.includes('99.999%') || qLower.includes('cap theorem') || qLower.includes('disaster recovery')) {
      return `मल्टी-रीजन क्लाउड डिप्लॉयमेंट में 99.999% उच्च उपलब्धता (High Availability) के लिए स्टोरेज लेयर कैसे बनाएंगे? CAP/PACELC ट्रेड-ऑफ्स, कंसेंसस (Raft/Paxos) और एक्टिव-एक्टिव डिजास्टर रिकवरी को समझाइए।`;
    }
    // 5. DevOps & Cloud
    if (qLower.includes('kubernetes') || qLower.includes('canary') || qLower.includes('blue-green') || qLower.includes('hpa')) {
      return `कुबरनेट्स (Kubernetes) क्लस्टर में माइक्रोसर्विसेज के लिए ज़ीरो-डाउनटाइम डिप्लॉयमेंट (Canary बनाम Blue-Green) कैसे तैयार करते हैं? Liveness/Readiness प्रोब्स और HPA ऑटो-स्केलिंग की कार्यप्रणाली समझाइए।`;
    }
    if (qLower.includes('ci/cd') || qLower.includes('terraform') || qLower.includes('vault') || qLower.includes('trivy')) {
      return `गिट पुश से लेकर प्रोडक्शन तक एक एंटरप्राइज CI/CD पाइपलाइन कैसे बनाएंगे? ऑटोमेटेड टेस्टिंग, सुरक्षा स्कैनिंग (Trivy), सीक्रेट्स मैनेजमेंट, और टेराफॉर्म (Terraform) इन्फ्रास्ट्रक्चर-ऐज़-कोड को समझाइए।`;
    }
    // 6. Data Engineering
    if (qLower.includes('spark') || qLower.includes('kafka') || qLower.includes('watermark') || qLower.includes('streaming')) {
      return `अपाचे काफ्का और अपाचे स्पार्क/फ्लिंक के साथ 100,000 इवेंट्स/सेकंड की रियल-टाइम स्ट्रीमिंग पाइपलाइन कैसे बनाएंगे? वॉटरमार्क्स, लेट डेटा हैंडलिंग, और Exactly-Once प्रोसेसिंग को समझाइए।`;
    }
    if (qLower.includes('lakehouse') || qLower.includes('medallion') || qLower.includes('bigquery') || qLower.includes('iceberg')) {
      return `पारंपरिक डेटा वेयरहाउस और आधुनिक डेटा लेकहाउस (Apache Iceberg) में क्या अंतर है? मेडलियन आर्किटेक्चर (Bronze, Silver, Gold), BigQuery पार्टीशनिंग और स्कीमा इवोल्यूशन को समझाइए।`;
    }
    // 7. AI & Machine Learning
    if (qLower.includes('rag') || qLower.includes('vector') || qLower.includes('embedding') || qLower.includes('hallucination')) {
      return `लाखों आंतरिक दस्तावेजों के लिए एंटरप्राइज-ग्रेड RAG (Retrieval-Augmented Generation) सिस्टम कैसे बनाएंगे? वेक्टर्स, Milvus/Pinecone/pgvector, हाइब्रिड सर्च (Vector + BM25) और मॉडल हॉलुसिनेशन रोकने के उपाय बताएं।`;
    }
    if (qLower.includes('llm') || qLower.includes('inference') || qLower.includes('quantization') || qLower.includes('vllm')) {
      return `हजारों समवर्ती उपयोगकर्ताओं के लिए LLM मॉडल प्रोडक्शन में डिप्लॉय करते समय लेटेंसी कैसे घटाते हैं? Continuous Batching (vLLM), KV Caching, मॉडल क्वांटाइजेशन (INT4/FP16) और प्रॉम्प्ट इंजेक्शन सुरक्षा को समझाइए।`;
    }
    // 8. Cybersecurity
    if (qLower.includes('owasp') || qLower.includes('injection') || qLower.includes('xss') || qLower.includes('csrf') || qLower.includes('ssrf')) {
      return `OWASP Top 10 की मुख्य कमजोरियों के बारे में बताएं। आधुनिक क्लाउड ऍप्लिकेशन्स को SQL Injection, XSS, CSRF, और SSRF हमलों से कैसे सुरक्षित किया जाता है?`;
    }
    if (qLower.includes('pkce') || qLower.includes('httponly') || qLower.includes('jwt') || qLower.includes('token')) {
      return `ऑथेंटिकेशन टोकन स्टोर करने के लिए localStorage बनाम HttpOnly SameSite कुकीज की तुलना करें। एक्सेस + रिफ्रेश टोकन रोटेशन और SPA/मोबाइल क्लाइंट्स के लिए OAuth 2.0 PKCE फ्लो क्यों अनिवार्य है?`;
    }
    // 9. Mobile
    if (qLower.includes('offline-first') || qLower.includes('watermelondb') || (qLower.includes('mobile') && qLower.includes('sync'))) {
      return `रिएक्ट नेटिव या फ्लटर में ऑफलाइन-फर्स्ट मोबाइल एप्लिकेशन कैसे डिजाइन करेंगे? लोकल SQLite/WatermelonDB आर्किटेक्चर, बैकग्राउंड सिंक कतार, और कन्फ्लिक्ट रेजोल्यूशन (CRDTs) को समझाइए।`;
    }
    if (qLower.includes('memory leak') || qLower.includes('turbomodules') || (qLower.includes('mobile') && qLower.includes('bridge'))) {
      return `मोबाइल ऍप्लिकेशन्स में परफॉरमेंस समस्याओं और मेमोरी लीक्स की पहचान कैसे करते हैं? रिएक्ट नेटिव के पुराने ब्रिज बनाम नए TurboModules/Fabric (JSI) आर्किटेक्चर के अंतर को समझाइए।`;
    }
    // 10. Testing & SRE
    if (qLower.includes('testcontainers') || qLower.includes('pyramid') || qLower.includes('contract testing') || qLower.includes('pact')) {
      return `माइक्रोसर्विसेज में टेस्टिंग पिरामिड (Unit, Testcontainers, E2E) कैसे लागू करते हैं? प्रोडक्शन में ब्रेकिंग API बदलावों को रोकने के लिए Consumer-Driven Contract Testing (Pact) की भूमिका समझाइए।`;
    }
    if (qLower.includes('opentelemetry') || qLower.includes('slo') || qLower.includes('tracing') || qLower.includes('error budget')) {
      return `जब p99 लेटेंसी 80ms से बढ़कर 2400ms हो जाए, तो OpenTelemetry डिस्ट्रीब्यूटेड ट्रेसिंग और लॉग्स से घटना की जांच कैसे करेंगे? SLI, SLO और एरर बजट के नियमों को समझाइए।`;
    }
    // 11. Behavioral
    if (qLower.includes('disagree') || qLower.includes('conflict') || qLower.includes('argument')) {
      return `जब आपका किसी सीनियर इंजीनियर या टेक लीड के साथ आर्किटेक्चरल निर्णय पर कड़ा मतभेद हुआ हो, तो उस स्थिति का वर्णन करें। आपने अपने तर्क कैसे पेश किए और अंतिम समाधान क्या रहा?`;
    }
    if (qLower.includes('outage') || qLower.includes('incident') || qLower.includes('post-mortem') || qLower.includes('pressure')) {
      return `अपने अनुभव के सबसे गंभीर प्रोडक्शन आउटेज या घटना का वर्णन करें। दबाव में आपने ट्राइएज कैसे किया, स्टेकहोल्डर्स से कैसे संवाद किया, और पुनरावृत्ति रोकने के लिए ब्लेमलेस पोस्ट-मॉर्टम का नेतृत्व कैसे किया?`;
    }
    return `आपके रिज़्यूमे में उल्लेख है: ${quoteText ? `"${quoteText}"` : 'आपके प्रोजेक्ट्स'}। इस निर्णय के पीछे के तकनीकी कारणों को समझाइए — आपने क्या विकल्प सोचे और सफलता को कैसे मापा?`;
  }

  if (langId === 'hinglish') {
    // 1. Frontend
    if (qLower.includes('virtual dom') || qLower.includes('fiber') || qLower.includes('reconciliation') || qLower.includes('react')) {
      return `React ka reconciliation algorithm aur Fiber architecture rendering kaise manage karta hai? Diffing phase me React DOM mutations kaise decide karta hai aur unnecessary re-renders ko prevent karne ke liye aap kya use karte hain?`;
    }
    if (qLower.includes('core web vitals') || qLower.includes('lcp') || qLower.includes('next.js') || qLower.includes('ssr')) {
      return `Core Web Vitals (LCP, CLS, INP) ko diagnose aur optimize kaise karte hain? Next.js me Client-Side Rendering (CSR), Server-Side Rendering (SSR), aur Static Site Generation (SSG) ke architectural trade-offs explain kijiye.`;
    }
    // 2. Backend & APIs
    if (qLower.includes('saga') || qLower.includes('monolith') || (qLower.includes('microservice') && qLower.includes('consistency'))) {
      return `Monolith se microservices migrate karte waqt bina 2PC ke data consistency kaise maintain karte hain? Order aur payment workflow ke liye idempotent Saga pattern (orchestrated vs choreographed) walk through kijiye.`;
    }
    if (qLower.includes('rate limiting') || qLower.includes('circuit breaker') || qLower.includes('resilience')) {
      return `50,000 requests/sec handle karne wale high-throughput API ko kaise design karenge? Redis sliding-window distributed rate limiting, idempotency keys, aur circuit breakers ka implementation explain kijiye.`;
    }
    // 3. Database
    if (qLower.includes('explain') || qLower.includes('b-tree') || (qLower.includes('index') && qLower.includes('database'))) {
      return `Database me slow query optimize karne ke liye EXPLAIN (ANALYZE, BUFFERS) plan kaise inspect karte hain? B-Tree indexes internals aur composite vs partial indexes ke selection criteria walk through kijiye.`;
    }
    if (qLower.includes('hotspot') || qLower.includes('locking') || qLower.includes('concurrency')) {
      return `High concurrent write traffic me database hotspot rows ko kaise handle karte hain? Optimistic Concurrency Control vs Pessimistic Locking aur PgBouncer connection pooling ke benefits explain kijiye.`;
    }
    // 4. System Design
    if (qLower.includes('100m') || qLower.includes('feed') || qLower.includes('sharding') || qLower.includes('notification system')) {
      return `100M+ daily active users ke liye sub-100ms real-time notification ya feed system kaise design karenge? Consistent hashing sharding, Redis multi-tier caching aur celebrity fanout problem ko kaise handle karenge?`;
    }
    if (qLower.includes('99.999%') || qLower.includes('cap theorem') || qLower.includes('disaster recovery')) {
      return `Multi-region cloud me 99.999% high availability ke liye distributed storage layer kaise architect karenge? CAP/PACELC trade-offs, consensus (Raft/Paxos) aur active-active disaster recovery explain kijiye.`;
    }
    // 5. DevOps & Cloud
    if (qLower.includes('kubernetes') || qLower.includes('canary') || qLower.includes('blue-green') || qLower.includes('hpa')) {
      return `Kubernetes cluster me microservices ke liye zero-downtime deployment (Canary vs Blue-Green) kaise set karte hain? Liveness/readiness probes aur custom metrics HPA autoscaling detail kijiye.`;
    }
    if (qLower.includes('ci/cd') || qLower.includes('terraform') || qLower.includes('vault') || qLower.includes('trivy')) {
      return `Git push se production tak enterprise CI/CD pipeline kaise construct karenge? Automated testing, container vulnerability scanning (Trivy), secret management aur Terraform IaC explain kijiye.`;
    }
    // 6. Data Engineering
    if (qLower.includes('spark') || qLower.includes('kafka') || qLower.includes('watermark') || qLower.includes('streaming')) {
      return `Apache Kafka aur Spark Streaming ke sath 100,000 events/sec streaming pipeline kaise architect karenge? Watermarks, late data handling aur exactly-once semantics explain kijiye.`;
    }
    if (qLower.includes('lakehouse') || qLower.includes('medallion') || qLower.includes('bigquery') || qLower.includes('iceberg')) {
      return `Traditional Data Warehouse vs modern Data Lakehouse (Apache Iceberg) me kya differences hain? Medallion architecture (Bronze, Silver, Gold), BigQuery partitioning aur schema evolution explain kijiye.`;
    }
    // 7. AI & Machine Learning
    if (qLower.includes('rag') || qLower.includes('vector') || qLower.includes('embedding') || qLower.includes('hallucination')) {
      return `Enterprise RAG system kaise design karenge? Document chunking, dense embeddings, Milvus/Pinecone vector databases, hybrid search (Vector + BM25) aur LLM hallucination reduction explain kijiye.`;
    }
    if (qLower.includes('llm') || qLower.includes('inference') || qLower.includes('quantization') || qLower.includes('vllm')) {
      return `Production me LLMs serve karte waqt latency kaise reduce karte hain? Continuous batching (vLLM), KV caching, model quantization (INT4/FP16) aur prompt injection defense explain kijiye.`;
    }
    // 8. Cybersecurity
    if (qLower.includes('owasp') || qLower.includes('injection') || qLower.includes('xss') || qLower.includes('csrf') || qLower.includes('ssrf')) {
      return `OWASP Top 10 vulnerabilities me SQLi, XSS, CSRF aur SSRF ko modern cloud web apps me kaise prevent karte hain? Defense-in-depth architecture explain kijiye.`;
    }
    if (qLower.includes('pkce') || qLower.includes('httponly') || qLower.includes('jwt') || qLower.includes('token')) {
      return `LocalStorage vs HttpOnly SameSite cookies token storage me kya differences hain? Access + Refresh token rotation aur OAuth 2.0 PKCE flow SPA aur mobile clients ke liye kyun mandatory hai?`;
    }
    // 9. Mobile
    if (qLower.includes('offline-first') || qLower.includes('watermelondb') || (qLower.includes('mobile') && qLower.includes('sync'))) {
      return `Offline-first mobile app (React Native/Flutter) kaise build karenge? Local SQLite/WatermelonDB storage, background sync queue, conflict resolution (CRDTs) aur battery efficiency explain kijiye.`;
    }
    if (qLower.includes('memory leak') || qLower.includes('turbomodules') || (qLower.includes('mobile') && qLower.includes('bridge'))) {
      return `Mobile applications me memory leaks aur performance bottlenecks kaise fix karte hain? React Native ke legacy bridge vs modern TurboModules/Fabric (JSI) ke differences walk through kijiye.`;
    }
    // 10. Testing & SRE
    if (qLower.includes('testcontainers') || qLower.includes('pyramid') || qLower.includes('contract testing') || qLower.includes('pact')) {
      return `Microservices ecosystem me complete testing pyramid (Unit, Testcontainers, E2E) kaise apply karte hain? Breaking API changes prevent karne ke liye Contract Testing (Pact) explain kijiye.`;
    }
    if (qLower.includes('opentelemetry') || qLower.includes('slo') || qLower.includes('tracing') || qLower.includes('error budget')) {
      return `Jab checkout endpoint pe p99 latency 80ms se 2,400ms spike kare, tab OpenTelemetry distributed tracing se issue kaise triage karte hain? SLI, SLO aur Error Budget governance explain kijiye.`;
    }
    // 11. Behavioral
    if (qLower.includes('disagree') || qLower.includes('conflict') || qLower.includes('argument')) {
      return `Kisi senior engineer ya tech lead ke sath architectural decision pe major disagreement ka example dijiye. Aapne collaborative arguments kaise present kiye aur final alignment kaise reach hua?`;
    }
    if (qLower.includes('outage') || qLower.includes('incident') || qLower.includes('post-mortem') || qLower.includes('pressure')) {
      return `Apne experience ka sabse critical production outage walk through kijiye. Incident triage, non-technical stakeholder communication aur blameless post-mortem leadership kaise handle kiya?`;
    }
    return `Aapke resume me mention hai: ${quoteText ? `"${quoteText}"` : 'your technical project'}। Iske piche ke specific architectural decisions walk through kijiye — kya alternatives consider kiye the aur outcome kaise measure kiya?`;
  }

  if (langId === 'es-ES') {
    if (qLower.includes('trade-off') || qLower.includes('conflict')) {
      return `Cuénteme sobre una situación de alta presión donde tuvo que hacer concesiones (trade-offs) técnicas difíciles. ¿Cómo gestionó a los interesados y cuál fue el resultado final? ${quoteText ? `(Referencia: "${quoteText}")` : ''}`;
    }
    if (qLower.includes('architecture') || qLower.includes('system') || qLower.includes('scale')) {
      return `Al diseñar esta arquitectura distribuida, ¿qué decisiones técnicas clave tomó para manejar la escala, la latencia y la tolerancia a fallos? ${quoteText ? `(Referencia: "${quoteText}")` : ''}`;
    }
    return `Su currículum menciona: ${quoteText ? `"${quoteText}"` : 'sus logros técnicos'}. Explíqueme las decisiones técnicas detrás de esto: ¿qué alternativas consideró y cómo midió el éxito?`;
  }

  if (langId === 'fr-FR') {
    return `Votre CV mentionne : ${quoteText ? `"${quoteText}"` : 'votre expérience technique'}. Expliquez-moi les décisions d'architecture prises, les compromis acceptés et comment vous avez mesuré le succès.`;
  }

  if (langId === 'de-DE') {
    return `In Ihrem Lebenslauf wird erwähnt: ${quoteText ? `"${quoteText}"` : 'Ihre Erfahrung'}. Führen Sie mich durch die technischen Entscheidungen dahinter — welche Alternativen wurden geprüft und wie wurde der Erfolg gemessen?`;
  }

  if (langId === 'ja-JP') {
    return `職務経歴書に記載されている「${quoteText ? quoteText : '主な実績'}」についてお伺いします。この実装における技術的な意思決定、検討した代替案、および測定された成果について詳しく説明してください。`;
  }

  if (langId === 'zh-CN') {
    return `您的简历中提到了：${quoteText ? `"${quoteText}"` : '您的技术项目'}。请详细说明背后的核心技术决策——您权衡了哪些方案，以及如何衡量最终的成功指标？`;
  }

  if (langId === 'ar-SA') {
    return `تذكر سيرتك الذاتية: ${quoteText ? `"${quoteText}"` : 'مشروعك التقني'}. اشرح لي القرارات الهندسية المتبعة، وما هي البدائل التي تم بحثها، وكيف تم قياس النجاح؟`;
  }

  if (langId === 'ru-RU') {
    return `В вашем резюме указано: ${quoteText ? `"${quoteText}"` : 'ваш опыт'}. Расскажите о принятых архитектурных решениях, рассмотренных альтернативах и достигнутых метриках успеха.`;
  }

  if (langId === 'pt-BR') {
    return `Seu currículo menciona: ${quoteText ? `"${quoteText}"` : 'sua experiência técnica'}. Explique as decisões de arquitetura por trás disso: quais alternativas foram avaliadas e como mediu os resultados?`;
  }

  return questionText;
}

/**
 * Returns rich simulated speech answers tailored to the selected language
 */
export function getSimulatedVoiceAnswer(category, topic, questionText, langId) {
  const cat = String(category || '').toLowerCase();
  const top = String(topic || '').toLowerCase();
  const qText = String(questionText || '').toLowerCase();

  const isBehavioral = cat.includes('behavioral') || cat.includes('star') || top.includes('conflict') || top.includes('outage');
  const isFrontend = cat.includes('frontend') || top.includes('dom') || top.includes('react') || top.includes('vitals');
  const isDatabase = cat.includes('database') || top.includes('sql') || top.includes('index') || top.includes('explain') || top.includes('lock');
  const isDevOps = cat.includes('devops') || top.includes('kubernetes') || top.includes('ci/cd') || top.includes('terraform');
  const isDataEng = cat.includes('data engineering') || top.includes('kafka') || top.includes('spark') || top.includes('lakehouse');
  const isAI = cat.includes('ai') || cat.includes('machine learning') || top.includes('rag') || top.includes('vector') || top.includes('llm');
  const isSecurity = cat.includes('security') || cat.includes('cybersecurity') || top.includes('owasp') || top.includes('pkce') || top.includes('oauth');
  const isMobile = cat.includes('mobile') || top.includes('offline') || top.includes('react native') || top.includes('bridge');
  const isSRE = cat.includes('testing') || cat.includes('sre') || top.includes('tracing') || top.includes('slo') || top.includes('pyramid');

  if (langId === 'hi-IN') {
    if (isBehavioral) {
      return `मेरी पिछली कंपनी में जब रिलीज़ से 48 घंटे पहले रिक्वायरमेंट्स अचानक बदल गईं, तो मैंने तुरंत टीम और स्टेकहोल्डर्स के साथ आपातकालीन सिंक बुलाई। सिचुएशन यह थी कि मुख्य भुगतान गेटवे का SLA खतरे में था। टास्क यह था कि रिलीज़ बिना किसी डिफेक्ट के समय पर पूरी हो। एक्शन के तौर पर, हमने एक सख्त MVP दायरा तय किया, क्रिटिकल इंटीग्रेशन टेस्ट्स को ऑटोमेट किया, और टीम के साथ मिलकर ब्लॉक्स हटाए। रिजल्ट यह रहा कि हमने बिना किसी बग के समय पर लॉन्च किया और पहले ही दिन 99.98% अपटाइम हासिल किया।`;
    }
    if (isFrontend) {
      return `रिएक्ट में वर्चुअल डॉम (Virtual DOM) एक इन-मेमोरी ट्री रिप्रेजेंटेशन है। जब स्टेट या प्रॉप्स बदलते हैं, तो रिएक्ट नया वर्चुअल डॉम ट्री बनाता है और O(n) डिफिंग एल्गोरिदम से पुराने ट्री से तुलना करता है। केवल आवश्यक वास्तविक DOM नोड्स को बैच में कमिट किया जाता है, जिससे लेआउट रिफ्लो और रीपेंट कम होते हैं और 60fps परफॉर्मेंस बनी रहती है।`;
    }
    if (isAI) {
      return `एंटरप्राइज RAG सिस्टम के लिए हमने डाक्यूमेंट्स को 500-टोकन चंक्स में विभाजित किया और pgvector में डेंस एम्बेडिंग्स स्टोर किए। हमने हाइब्रिड सर्च लागू किया जो डेंस वेक्टर्स और BM25 कीवर्ड सर्च को कंबाइन करता है। क्रॉस-एंकोडर रीरैंकिंग और सोर्स उद्धरणों की मदद से हमने मॉडल के हॉलुसिनेशन (Hallucination) को 85% तक कम किया।`;
    }
    if (isDatabase) {
      return `डेटाबेस ऑप्टिमाइज़ेशन के लिए हम EXPLAIN ANALYZE प्लान का उपयोग करते हैं और सीक्वेंशियल स्कैन की जगह B-Tree इंडेक्स और कंपोजिट इंडेक्स जोड़ते हैं। भारी कॉनकरेंट राइट्स के लिए हम PgBouncer कनेक्शन पूलिंग और रो-लेवल ऑप्टिमिस्टिक लॉकिंग का उपयोग करते हैं, जिससे डेटाबेस का लॉक कंटेंशन खत्म हो गया।`;
    }
    if (isDevOps) {
      return `हमने कुबरनेट्स में जीरो-डाउनटाइम कैनरी डिप्लॉयमेंट लागू किया। हम इनग्रेस कंट्रोलर के जरिए 5% से 100% तक ट्रैफिक शिफ्ट करते हैं। प्रोमेथियस और ओपनटेलीमेट्री से p99 लेटेंसी और एरर रेट मॉनिटर करते हैं; अगर कोई गड़बड़ी होती है, तो ऑटोमेटेड रोलबैक ट्रिगर हो जाता है।`;
    }
    if (isDataEng) {
      return `हमने अपाचे काफ्का और स्पार्क स्ट्रीमिंग का उपयोग करके 100k इवेंट्स/सेकंड की पाइपलाइन बनाई। हमने 10 मिनट के वॉटरमार्क्स के साथ लेट-अराइविंग डेटा को संभाला और मेडलियन आर्किटेक्चर (Bronze, Silver, Gold) में बिगक्वेरी पर पार्टीशनिंग लागू की, जिससे क्वेरी लागत 60% घट गई।`;
    }
    if (isSecurity) {
      return `सुरक्षा के लिए हमने SQL इंजेक्शन से बचाव हेतु प्रिपियर्ड स्टेटमेंट्स लागू किए। हमने ऑथेंटिकेशन टोकन्स को localStorage की जगह HttpOnly SameSite=Strict कुकीज में स्टोर किया, जिससे XSS से टोकन चोरी का खतरा पूरी तरह समाप्त हो गया।`;
    }
    if (isMobile) {
      return `ऑफलाइन-फर्स्ट मोबाइल ऐप के लिए हमने WatermelonDB और लोकल SQLite डेटाबेस का इस्तेमाल किया। यूजर एक्शन्स को पहले लोकल डेटाबेस में लिखा जाता है और इंटरनेट आने पर बैकग्राउंड सिंक कतार से सर्वर को भेजा जाता है, जिससे ऐप बिना नेटवर्क के भी तुरंत काम करता है।`;
    }
    if (isSRE) {
      return `हमने टेस्टकंटेनर्स के साथ इंटीग्रेशन टेस्ट और पैक्ट (Pact) कॉन्ट्रैक्ट टेस्टिंग लागू की। हमने 99.9% का SLO और 30-दिन का एरर बजट तय किया। प्रोडक्शन में लेटेंसी स्पाइक आने पर ओपनटेलीमेट्री ट्रेसिंग से हमने सीधे डेटाबेस के धीमे लॉक को 10 मिनट में पहचान लिया।`;
    }
    return `इस आर्किटेक्चर को स्केल करने के लिए, हमने काफ्का (Kafka) मैसेज क्यू और रेडिस (Redis) डिस्ट्रीब्यूटेड कैशिंग को लागू किया। हमने पोस्टग्रेएसक्यूएल में रीड-रेप्लिका अलग किए। इससे हमारा सिस्टम प्रति सेकंड 25,000 रिक्वेस्ट संभालने में सक्षम हुआ और p99 लेटेंसी 45ms से भी नीचे आ गई।`;
  }

  if (langId === 'hinglish') {
    if (isBehavioral) {
      return `Meri previous company me jab release se 48 hours pehle product requirements change hui, tab maine situation ki complete ownership li. Task tha enterprise client ka SLA protect karna aur zero-downtime release deliver karna. Action ke roop me, maine core MVP scope prioritize kiya, payment integration tests automated kiye aur daily standups arrange kiye. Result ye raha ki humne on-time launch kiya with zero production bugs and 99.9% uptime.`;
    }
    if (isFrontend) {
      return `React me Virtual DOM ek lightweight in-memory JavaScript representation hota hai. State change hone par React Fiber diffing algorithm execute karta hai O(n) heuristic complexity ke sath. Changes ko batch karke real DOM pe commit kiya jata hai, jisse browser reflow aur repaint eliminate ho jate hain aur 60fps performance maintain hoti hai.`;
    }
    if (isAI) {
      return `Enterprise RAG pipeline me humne documents ko recursive chunking se 500-token blocks me split kiya aur pgvector me dense embeddings store kiye. Hybrid search implement kiya using dense vectors plus BM25 keyword search via Reciprocal Rank Fusion. Cross-encoder reranker aur grounded system prompts ke sath model hallucinations 85% drop ho gayi.`;
    }
    if (isDatabase) {
      return `Database query optimization ke liye humne EXPLAIN (ANALYZE, BUFFERS) run karke sequential scans ko B-Tree covering composite indexes se replace kiya. Write-heavy traffic me PgBouncer connection pooling aur optimistic locking use ki, jisse p99 latency 4.2 seconds se reduce hoke 45ms ho gayi.`;
    }
    if (isDevOps) {
      return `Kubernetes cluster me zero-downtime Canary deployments implement kiye using Istio service mesh. Traffic ko 5% se 100% gradually shift kiya gaya with automated Prometheus error checks. Liveness aur readiness probes misrouted traffic prevent karte hain aur SLA breach hone par instant automated rollback hota hai.`;
    }
    if (isDataEng) {
      return `Real-time data streaming ke liye humne Apache Kafka aur Spark Streaming use kiya jo 100,000 events per second process karta hai. Watermarks ke sath late-arriving data handle kiya aur Medallion Lakehouse architecture (Bronze, Silver, Gold) me BigQuery partitioning apply ki, jisse scan cost 65% reduce hui.`;
    }
    if (isSecurity) {
      return `Application security me humne parameterized SQL queries enforce kiye aur JWT access tokens ko localStorage ki jagah HttpOnly, Secure, SameSite=Strict cookies me store kiya. Single Page App aur mobile clients ke liye OAuth 2.0 PKCE flow integrate kiya with SHA-256 code challenge verification.`;
    }
    if (isMobile) {
      return `Offline-first mobile app me humne reactive WatermelonDB SQLite layer banayi. Actions instantly local DB me persist hote hain aur background queue exponential retries ke sath server pe sync karti hai. React Native New Architecture ke TurboModules JSI bridge se UI fluid 60fps pe run hota hai.`;
    }
    if (isSRE) {
      return `Humne testing pyramid implement kiya with Testcontainers and Consumer-Driven Contract testing using Pact. Production observability ke liye OpenTelemetry distributed tracing aur Prometheus metrics configure kiye. 99.9% SLO error budgets ke sath regressions instantly detect ho jate hain.`;
    }
    return `Is distributed system ko scale karne ke liye humne Kafka message streams aur Redis distributed caching implement ki. PostgreSQL me optimistic concurrency lock use kiya aur database read-replicas configure kiye. Isse ingestion layer 25,000 requests per second handle karne lagi aur p99 latency sub-50ms ho gayi.`;
  }

  if (langId === 'es-ES') {
    if (isBehavioral) {
      return `En mi empresa anterior, cuando los requisitos del producto cambiaron 48 horas antes del lanzamiento, tomé la iniciativa. Situación: El SLA con nuestro cliente principal estaba en riesgo. Tarea: Mantener la estabilidad sin retrasar la entrega. Acción: Definí un alcance MVP estricto, automaticé las pruebas de regresión y coordiné con los desarrolladores frontend. Resultado: Lanzamos a tiempo sin incidentes críticos y con un 99.98% de disponibilidad.`;
    }
    return `Para escalar esta arquitectura distribuida, implementamos colas de mensajes con Kafka y almacenamiento en caché distribuido con Redis. Con esto logramos procesar 25,000 solicitudes por segundo con una latencia p99 inferior a 45 ms.`;
  }

  if (langId === 'fr-FR') {
    return `Dans mon entreprise précédente, nous avons découplé nos microservices en intégrant Kafka et un cache distribué Redis. Cela nous a permis de traiter plus de 20 000 requêtes par seconde avec une latence p99 inférieure à 50ms tout en garantissant une haute disponibilité de 99.98%.`;
  }

  if (langId === 'de-DE') {
    return `In meinem vorherigen Unternehmen haben wir die Microservice-Architektur durch den Einsatz von Kafka-Event-Streams und Redis-Caching optimiert. Dadurch konnten wir 25.000 Anfragen pro Sekunde bei einer p99-Latenz von unter 45ms zuverlässig bewältigen.`;
  }

  if (langId === 'ja-JP') {
    return `前職において、マイクロサービスのボトルネックを解消するために、KafkaメッセージキューとRedis分散キャッシュを導入しました。これにより、1秒あたり25,000リクエストを処理し、p99レイテンシを45ミリ秒未満に削減することに成功しました。`;
  }

  if (langId === 'zh-CN') {
    return `在我之前的项目中，针对高并发场景，我们通过引入 Kafka 消息队列和 Redis 分布式缓存来解耦系统。同时对数据库进行了索引优化与读写分离，系统成功承载了每秒 25,000 次请求，p99 延迟降至 45ms 以内。`;
  }

  if (langId === 'ar-SA') {
    return `في عملي السابق، قمنا بتحسين بنية الخدمات المصغرة من خلال دمج تدفقات كافكا والتخزين المؤقت مع ريديس، مما مكن النظام من التعامل مع 25,000 طلب في الثانية مع الحفاظ على وقت استجابة أقل من 45 مللي ثانية.`;
  }

  if (langId === 'ru-RU') {
    return `В моем предыдущем проекте для масштабирования архитектуры мы внедрили очереди Kafka и распределенный кэш Redis. Это позволило обрабатывать свыше 25 000 запросов в секунду с задержкой p99 менее 45 мс.`;
  }

  if (langId === 'pt-BR') {
    return `Em minha experiência anterior, desacoplamos nossos microsserviços integrando mensageria com Kafka e cache distribuído com Redis. Isso permitiu suportar picos de 25.000 requisições por segundo com latência p99 abaixo de 45ms.`;
  }

  // Default English
  if (isBehavioral) {
    return `In a critical release at my previous company where requirements shifted 48 hours before launch, I took proactive ownership. Situation: A scope change risked missing our key enterprise client SLA. Task: Protect release stability without introducing regressions. Action: I immediately negotiated a core MVP scope with product managers, wrote automated integration tests for critical payment paths, and held twice-daily syncs to clear blockers. Result: We shipped on schedule with zero critical bugs and achieved 99.98% uptime on launch day.`;
  }
  return `To design this resilient architecture, we decoupled synchronous API bottlenecks by introducing Kafka message streams and Redis distributed caching. We implemented optimistic concurrency controls with PostgreSQL, isolated database read-replicas, and configured automated circuit breakers. This allowed our ingestion layer to seamlessly handle traffic spikes of 25,000 requests per second with p99 response times below 45ms.`;
}

