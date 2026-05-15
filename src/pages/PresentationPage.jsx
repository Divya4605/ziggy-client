import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  Cpu,
  Target,
  Code,
  ShieldCheck,
  Zap,
  Layout,
  LineChart,
  AlertCircle,
  Lightbulb,
  Rocket,
  HelpCircle,
  Brain,
  Layers,
  Globe,
  Award,
  ArrowRight,
  Bot,
  Database,
  CreditCard,
  Server,
  Settings,
  Smile,
} from "lucide-react";

const SLIDES = [
  {
    id: 1,
    type: "title",
    title: "Ziggy",
    subtitle: "A Voice-Enabled Full-Stack Food Ordering Platform",
    tagline: "Internship Focus: AI Integration & Full-Stack Web Development",
    details: [
      { label: "Student", value: "[Insert Your Name]" },
      { label: "USN", value: "[Insert USN]" },
      { label: "College", value: "[Insert College Name]" },
      { label: "Organization", value: "[Insert Company Name]" },
      { label: "Duration", value: "[Insert Duration]" },
    ],
    icon: (
      <Mic className="w-20 h-20 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
    ),
  },
  {
    id: 2,
    type: "content",
    title: "Company Overview",
    points: [
      {
        title: "Organization",
        desc: "Focused on building accessible and modern digital products using AI-first principles.",
        icon: <Layout className="text-white/40" size={28} />,
      },
      {
        title: "Domain",
        desc: "Web Development and Artificial Intelligence (LLM).",
        icon: <Cpu className="text-white/40" size={28} />,
      },
      {
        title: "Services",
        desc: "Specializing in React-based frontend experiences and robust Python/Django backend services.",
        icon: <Code className="text-white/40" size={28} />,
      },
    ],
  },
  {
    id: 3,
    type: "objective",
    title: "Internship Objective",
    problem: {
      title: "The Challenge",
      desc: "Conventional food apps require multiple clicks to filter, search, and order, creating barriers for accessibility and efficiency.",
      icon: <AlertCircle className="text-red-500/50" size={40} />,
    },
    solution: {
      title: "The Objective",
      desc: "To eliminate manual hurdles by introducing a natural language voice interface, making e-commerce frictionless for everyone.",
      icon: <Target className="text-white" size={40} />,
    },
  },
  {
    id: 4,
    type: "tech",
    title: "Technology Stack",
    categories: [
      {
        name: "Frontend",
        items: [
          { name: "React 18", icon: <Layers size={14} /> },
          { name: "Vite", icon: <Zap size={14} /> },
          { name: "Tailwind CSS", icon: <Layout size={14} /> },
          { name: "Lucide Icons", icon: <Smile size={14} /> },
        ],
      },
      {
        name: "Backend",
        items: [
          { name: "Django (Python)", icon: <Server size={14} /> },
          { name: "Django REST", icon: <Settings size={14} /> },
        ],
      },
      {
        name: "AI Engine",
        items: [
          { name: "Groq API", icon: <Brain size={14} /> },
          { name: "Llama-3.3", icon: <Bot size={14} /> },
        ],
      },
      {
        name: "Database",
        items: [{ name: "Supabase", icon: <Database size={14} /> }],
      },
      {
        name: "Integration",
        items: [
          { name: "Razorpay", icon: <CreditCard size={14} /> },
          { name: "Web Speech", icon: <Mic size={14} /> },
        ],
      },
    ],
  },
  {
    id: 5,
    type: "grid",
    title: "Project Description",
    description:
      '"Ziggy" allows users to perform the entire ordering lifecycle—from login to payment—using only their voice.',
    features: [
      {
        title: "AI Intent Extraction",
        desc: "Converts natural language into structured database commands.",
        icon: <Brain className="text-white/40" />,
      },
      {
        title: "Voice Navigation",
        desc: "Handles routing automatically via voice commands.",
        icon: <Mic className="text-white/40" />,
      },
      {
        title: "Dynamic Filtering",
        desc: "Voice-activated category selection.",
        icon: <Zap className="text-white/40" />,
      },
      {
        title: "Secure Payment",
        desc: "Seamless Razorpay integration for UPI/Card.",
        icon: <ShieldCheck className="text-white/40" />,
      },
    ],
  },
  {
    id: 6,
    type: "methodology",
    title: "Methodology / Approach",
    pipeline: [
      {
        step: "Capture",
        desc: "React Speech Recognition captures raw user audio.",
        icon: <Mic size={24} />,
      },
      {
        step: "Process",
        desc: "Django backend sends transcript to Groq LLM.",
        icon: <Cpu size={24} />,
      },
      {
        step: "Execute",
        desc: "Frontend executes structured JSON commands in real-time.",
        icon: <Zap size={24} />,
      },
    ],
    approach:
      "Followed an Agile approach, starting with UI components and then bridging them with AI-powered APIs.",
  },
  {
    id: 7,
    type: "contribution",
    title: "Work Done (My Contribution)",
    items: [
      {
        title: "Voice Assistant Engine",
        desc: "Developed useVoiceAssistant hook for synthesis and command orchestration.",
      },
      {
        title: "AI Prompt Engineering",
        desc: "Crafted system instructions for Llama-3 to ensure high-accuracy parsing.",
      },
      {
        title: "Backend API Design",
        desc: "Built Django views for orders, auth, and voice logic.",
      },
      {
        title: "State Management",
        desc: "Implemented Context API for global cart and sessions.",
      },
      {
        title: "Payment Flow",
        desc: "Integrated Razorpay's frontend and backend logic.",
      },
    ],
  },
  {
    id: 8,
    type: "results",
    title: "Results & Impact",
    metrics: [
      {
        label: "Accuracy",
        value: "98%",
        subtitle: "Recognition Rate",
        desc: "High precision for complex food items.",
      },
      {
        label: "Efficiency",
        value: "40%",
        subtitle: "Faster Ordering",
        desc: "Compared to traditional click-based navigation.",
      },
    ],
    visuals:
      'Modern "Ziggy AI" panel with wave animations and real-time voice-to-text display.',
  },
  {
    id: 9,
    type: "challenges",
    title: "Challenges Faced",
    items: [
      {
        title: "Speech Latency",
        desc: "Minimizing delay between user speech and AI action.",
        icon: <Zap className="text-white/40" />,
      },
      {
        title: "Ambiguity",
        desc: 'Handling context-less commands like "I want that".',
        icon: <HelpCircle className="text-white/40" />,
      },
      {
        title: "Browser Limits",
        desc: "Managing Web Speech API differences across platforms.",
        icon: <Globe className="text-white/40" />,
      },
    ],
  },
  {
    id: 10,
    type: "learning",
    title: "Solutions & Learning",
    solutions: [
      {
        title: "Advanced Optimization",
        desc: "Implemented 1.5s silence detection and context-aware LLM prompts.",
      },
      {
        title: "Expertise Gained",
        desc: "Mastery of Groq LLMs, Full-Stack Architecture, and Supabase.",
      },
    ],
    icon: <Lightbulb className="text-amber-500/50 w-20 h-20" />,
  },
  {
    id: 11,
    type: "impact",
    title: "Applications / Impact",
    items: [
      {
        title: "Accessibility",
        desc: "A game-changer for visually impaired users.",
        icon: <Layers size={24} className="text-white/40" />,
      },
      {
        title: "Multitasking",
        desc: "Enables ordering while driving or working.",
        icon: <Zap size={24} className="text-white/40" />,
      },
      {
        title: "User Retention",
        desc: "Unique interface that differentiates the platform.",
        icon: <Rocket size={24} className="text-white/40" />,
      },
    ],
  },
  {
    id: 12,
    type: "conclusion",
    title: "Conclusion",
    points: [
      "Successfully bridged the gap between traditional Web 2.0 and AI-driven experiences.",
      "Key takeaway: AI is the primary navigation engine, not just a chatbot.",
    ],
    icon: <Award className="w-24 h-24 text-white/20" />,
  },
  {
    id: 13,
    type: "future",
    title: "Future Horizons",
    items: [
      {
        title: "Multi-language",
        desc: "Adding Hindi/Kannada support for regional reach.",
      },
      {
        title: "Voice Biometrics",
        desc: "Replacing passwords with voice fingerprinting.",
      },
      {
        title: "Order Tracking",
        desc: "Real-time voice updates on delivery status.",
      },
    ],
  },
  {
    id: 14,
    type: "acknowledgment",
    title: "Acknowledgment",
    text: "I express my sincere gratitude to my company mentors for their guidance and the project lead for insights into AI prompt optimization. This journey has been transformative for my career as a developer.",
  },
  {
    id: 15,
    type: "conclusion",
    title: "Thank You!",
    subtitle: "Questions & Answers",
    points: ["I'm now open for any technical or architectural questions."],
    icon: <HelpCircle className="w-24 h-24 text-white/20" />,
  },
];

const PresentationPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 bg-[#080808] z-9999 flex flex-col font-sans overflow-hidden text-white selection:bg-red-500/30">
      {/* Subtle Background Blobs - Reduced Intensity */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px]" />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-10000">
        <div
          className="h-full bg-red-600 shadow-[0_0_8px_#ef4444] transition-all duration-700 ease-out"
          style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* Main Presentation Shell - 16:9 Aspect Ratio */}
      <main className="grow flex items-center justify-center p-6 md:p-12 relative z-10 overflow-hidden">
        <div
          key={currentSlide}
          className={`w-full max-w-[1400px] aspect-video flex flex-col relative transition-all duration-700 ease-out
            ${direction === 1 ? "animate-in fade-in slide-in-from-right-12" : "animate-in fade-in slide-in-from-left-12"}`}
        >
          {/* Glass Card */}
          <div className="flex-1 bg-white/2 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-2xl p-10 md:p-14 flex flex-col relative overflow-hidden">
            {/* Subtle Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "50px 50px",
              }}
            />

            {/* Slide Navigation Header */}
            {slide.type !== "title" && (
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-[1.5px] bg-red-600" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
                    Slide {slide.id} / {SLIDES.length}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-white/20 tracking-widest uppercase">
                  Ziggy AI System • V2026
                </div>
              </div>
            )}

            {/* Title Section */}
            <header
              className={`mb-10 ${slide.type === "title" ? "text-center mt-auto" : "text-left"}`}
            >
              {slide.type === "title" ? (
                <div className="flex flex-col items-center mb-10">
                  <img
                    src="/ziggy_nav_logo.png"
                    alt="Ziggy Logo"
                    className="h-20 md:h-28 object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  />
                  <div className="w-20 h-1 bg-red-600 rounded-full mt-6" />
                </div>
              ) : (
                <h1 className="font-display font-black tracking-tighter leading-none text-3xl md:text-6xl mb-4 text-white">
                  {slide.title}
                </h1>
              )}

              {slide.subtitle && (
                <p
                  className={`text-lg md:text-xl font-bold max-w-3xl ${slide.type === "title" ? "mx-auto text-red-500/80 tracking-tight" : "text-white/40"}`}
                >
                  {slide.subtitle}
                </p>
              )}
              {slide.tagline && (
                <p className="mt-6 text-[10px] md:text-xs font-black text-white/30 uppercase tracking-[0.4em]">
                  {slide.tagline}
                </p>
              )}
            </header>

            {/* Dynamic Content Area */}
            <div
              className={`grow flex flex-col justify-center ${slide.type === "title" ? "mb-auto" : ""}`}
            >
              {/* TITLE SLIDE */}
              {slide.type === "title" && (
                <div className="flex flex-col items-center mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-2xl w-full">
                    {slide.details.map((d, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border-b border-white/5 pb-2 group"
                      >
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                          {d.label}
                        </span>
                        <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">
                          {d.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INTERNSHIP OBJECTIVE REDESIGN */}
              {slide.type === "objective" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                  <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2rem] flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      {slide.problem.icon}
                    </div>
                    <span className="text-red-500/60 text-[10px] font-black uppercase tracking-[0.3em]">
                      The Challenge
                    </span>
                    <h3 className="text-3xl font-black text-white/90 leading-tight">
                      {slide.problem.title}
                    </h3>
                    <p className="text-white/40 text-lg leading-relaxed">
                      {slide.problem.desc}
                    </p>
                  </div>
                  <div className="bg-red-600/90 p-10 rounded-[2rem] flex flex-col gap-6 relative overflow-hidden group shadow-2xl shadow-red-900/20">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                      {slide.solution.icon}
                    </div>
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">
                      The Vision
                    </span>
                    <h3 className="text-3xl font-black text-white leading-tight">
                      {slide.solution.title}
                    </h3>
                    <p className="text-white/80 text-lg leading-relaxed">
                      {slide.solution.desc}
                    </p>
                  </div>
                </div>
              )}

              {/* CONTENT SLIDE (Standard 3 Columns) */}
              {slide.type === "content" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {slide.points.map((p, i) => (
                    <div
                      key={i}
                      className="bg-white/[0.01] hover:bg-white/[0.03] p-8 rounded-[2rem] border border-white/5 transition-all"
                    >
                      <div className="mb-6 p-3 bg-white/5 rounded-xl w-fit text-white/60">
                        {p.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {p.title}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TECH STACK SLIDE WITH ICONS */}
              {slide.type === "tech" && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {slide.categories.map((c, i) => (
                    <div
                      key={i}
                      className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 flex flex-col gap-5"
                    >
                      <h3 className="text-[9px] font-black text-red-500/80 uppercase tracking-widest">
                        {c.name}
                      </h3>
                      <ul className="space-y-4">
                        {c.items.map((item, j) => (
                          <li
                            key={j}
                            className="text-xs font-bold text-white/60 flex items-center gap-3"
                          >
                            <div className="p-1.5 bg-white/5 rounded-md text-white/40">
                              {item.icon}
                            </div>
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* GRID FEATURE SLIDE */}
              {slide.type === "grid" && (
                <div className="flex flex-col gap-10">
                  <p className="text-2xl text-white/40 font-medium leading-relaxed max-w-4xl border-l-4 border-red-600 pl-8 italic">
                    {slide.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {slide.features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-6 p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 hover:bg-white/[0.06] transition-all"
                      >
                        <div className="p-4 bg-white/5 rounded-2xl text-white/40">
                          {f.icon}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">
                            {f.title}
                          </h4>
                          <p className="text-sm text-white/40 leading-snug">
                            {f.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* METHODOLOGY REDESIGN */}
              {slide.type === "methodology" && (
                <div className="flex flex-col gap-10">
                  <div className="flex flex-col md:flex-row gap-4 items-stretch">
                    {slide.pipeline.map((p, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-4 relative"
                      >
                        <div className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-center group hover:border-red-500/30 transition-colors">
                          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 mx-auto mb-4 group-hover:text-red-500 transition-colors">
                            {p.icon}
                          </div>
                          <h4 className="font-bold text-white text-base mb-2">
                            {p.step}
                          </h4>
                          <p className="text-[11px] text-white/30 leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                        {i < slide.pipeline.length - 1 && (
                          <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-20">
                            <ArrowRight className="text-white/10" size={16} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-6">
                    <div className="p-2 bg-red-600/20 rounded-lg text-red-500">
                      <Zap size={20} />
                    </div>
                    <p className="text-sm font-bold text-white/60 tracking-tight italic">
                      {slide.approach}
                    </p>
                  </div>
                </div>
              )}

              {/* CONTRIBUTION SLIDE */}
              {slide.type === "contribution" && (
                <div className="grid grid-cols-1 gap-3">
                  {slide.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="text-2xl font-black text-white/10 italic">
                          0{i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">
                            {item.title}
                          </h4>
                          <p className="text-xs text-white/30">{item.desc}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={14} className="text-white/40" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RESULTS SLIDE */}
              {slide.type === "results" && (
                <div className="flex flex-col gap-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {slide.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5 relative group"
                      >
                        <span className="text-red-500/60 text-[9px] font-black uppercase tracking-widest mb-3 block">
                          {m.label}
                        </span>
                        <div className="flex items-baseline gap-2 mb-2">
                          <h3 className="text-7xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform origin-left">
                            {m.value}
                          </h3>
                          <span className="text-lg font-bold text-white/20">
                            {m.subtitle}
                          </span>
                        </div>
                        <p className="text-white/30 text-sm">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
                    <div className="p-4 bg-white/5 rounded-2xl text-white/40">
                      <LineChart size={32} />
                    </div>
                    <p className="text-xl font-bold text-white/50 italic leading-snug">
                      &ldquo;{slide.visuals}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* CHALLENGES SLIDE */}
              {slide.type === "challenges" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {slide.items.map((p, i) => (
                    <div
                      key={i}
                      className="bg-white/[0.01] p-8 rounded-[2rem] border border-white/5 flex flex-col gap-5"
                    >
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
                        {p.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {p.title}
                      </h3>
                      <p className="text-white/30 text-sm leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* IMPACT SLIDE */}
              {slide.type === "impact" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {slide.items.map((p, i) => (
                    <div
                      key={i}
                      className="flex flex-col bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 group hover:border-red-500/20 transition-all"
                    >
                      <div className="mb-6 text-white/20 group-hover:text-red-500/60 transition-colors">
                        {p.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {p.title}
                      </h3>
                      <p className="text-white/30 text-sm leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* CONCLUSION/THANK YOU SLIDE */}
              {slide.type === "conclusion" && (
                <div className="flex flex-col items-center gap-8 text-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-red-500/10 blur-[60px] rounded-full group-hover:bg-red-500/20 transition-all duration-1000" />
                    <div className="relative text-white/20 group-hover:text-red-500/40 transition-colors duration-700">
                      {slide.icon}
                    </div>
                  </div>
                  <div className="space-y-4 max-w-5xl">
                    {slide.points.map((p, i) => (
                      <div
                        key={i}
                        className="relative py-4 px-8 bg-white/[0.01] border border-white/5 rounded-3xl backdrop-blur-sm transform hover:scale-[1.02] transition-transform"
                      >
                        <p className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-tight">
                          {p}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACKNOWLEDGMENT SLIDE */}
              {slide.type === "acknowledgment" && (
                <div className="flex flex-col items-center justify-center text-center gap-8 max-w-5xl mx-auto py-4">
                  <div className="p-6 bg-white/5 rounded-full text-white/10">
                    <ShieldCheck size={60} />
                  </div>
                  <p className="text-xl md:text-3xl font-display font-medium text-white/80 leading-[1.4] tracking-tight italic bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5">
                    &ldquo;{slide.text}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Slide Footer */}
            <footer className="mt-auto flex justify-between items-center pt-6 border-t border-white/5">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setCurrentSlide(0)}
                  className="text-[8px] font-black text-white/20 hover:text-red-500 uppercase tracking-[0.4em] transition-colors"
                >
                  Stream_Home
                </button>
                <div className="h-3 w-[1px] bg-white/10" />
                <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">
                  Ziggy AI System • Phase_Final
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:bg-white/5 hover:text-white disabled:opacity-5 transition-all active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentSlide === SLIDES.length - 1}
                  className="px-8 h-12 rounded-full bg-white/5 border border-white/10 text-white/60 font-black hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-5 transition-all active:scale-90 flex items-center gap-3 text-xs tracking-widest"
                >
                  CONTINUE <ChevronRight size={16} />
                </button>
              </div>
            </footer>
          </div>
        </div>
      </main>

      {/* Futuristic Floating HUD Elements - Minimal */}
      <div className="fixed bottom-10 left-10 flex items-center gap-4 opacity-20">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[9px] font-bold text-white tracking-widest uppercase">
            Live_01
          </span>
        </div>
      </div>
    </div>
  );
};

export default PresentationPage;
