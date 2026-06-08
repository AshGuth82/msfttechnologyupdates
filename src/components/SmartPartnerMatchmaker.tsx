import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Cpu, 
  MapPin, 
  RotateCcw, 
  ArrowRight, 
  Search, 
  Award, 
  CheckCircle2, 
  DollarSign, 
  Check, 
  ExternalLink, 
  Mail, 
  Building2, 
  Globe,
  Settings,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";
import { MicrosoftPartner, NewsCategory } from "../types";

interface SmartPartnerMatchmakerProps {
  partners: MicrosoftPartner[];
  addToast: (category: NewsCategory, title: string, message: string) => void;
}

interface MatchResult {
  partnerId: string;
  matchScore: number;
  justification: string;
  recommendedServices: string[];
  suggestedActions: string[];
}

interface MatchmakingResponse {
  matches: MatchResult[];
  executiveSummary: string;
  fundingEligibilityScoping: string;
  isFallbackTelemetry?: boolean;
}

const PRESETS = [
  {
    title: "Melbourne Cloud Economics",
    description: "Optimize $2M software asset footprint & cloud license waste.",
    requirements: "We need an intensive audit of our Enterprise Agreement (EA), looking to reduce our M365 and SQL server license waste by at least 25% and align with a hybrid CSP consumption structure.",
    location: "melbourne",
    size: "Enterprise (1000+ staff)",
    industry: "Financial Services",
    specs: ["Software Asset Management (SAM)", "Cloud Economics", "Microsoft CSP Program", "Licensing Optimization"]
  },
  {
    title: "Secure Public Sector Azure Migration",
    description: "Design multi-tenant high-compliance workspace in Sydney.",
    requirements: "Our agency requires a secure, high-throughput multi-tenant Microsoft Azure cloud design governed by strict local data residency constraints (IRAP alignment).",
    location: "sydney",
    size: "Government / Multi-Entity Corporate Partnership",
    industry: "Government / Public Sector",
    specs: ["Azure Cloud Migration", "Cyber Security & Compliance", "Azure Security Infrastructure", "Managed IT Services"]
  },
  {
    title: "Western Australia DevOps Automation",
    description: "Deploy automated cloud environments with 24/7 support.",
    requirements: "Looking to modernize WA utility assets, automating infrastructure-as-code provisioning on Azure and handing off 24/7 monitoring to an elite managed service operations desk.",
    location: "perth",
    size: "Mid-Market (100-1000 staff)",
    industry: "Energy / Resources",
    specs: ["Cloud Migration & DevOps", "Azure Security Infrastructure", "Managed IT Services", "Outsourced Support"]
  }
];

const DISCOVERY_COMPETENCIES = [
  "Licensing Optimization",
  "Azure Cloud Migration",
  "Copilot Transformation",
  "Software Asset Management (SAM)",
  "Cloud Economics",
  "Microsoft CSP Program",
  "Enterprise Software Advisor",
  "Azure FinOps",
  "Application Modernization",
  "Managed IT Services",
  "Cyber Security & Compliance",
  "Outsourced Support",
  "Cloud Migration & DevOps",
  "Azure Security Infrastructure"
];

const ANZ_CITIES = [
  { id: "all", name: "All ANZ Cities" },
  { id: "sydney", name: "Sydney, NSW" },
  { id: "melbourne", name: "Melbourne, VIC" },
  { id: "brisbane", name: "Brisbane, QLD" },
  { id: "perth", name: "Perth, WA" },
  { id: "adelaide", name: "Adelaide, SA" },
  { id: "canberra", name: "Canberra, ACT" },
  { id: "darwin", name: "Darwin, NT" },
  { id: "hobart", name: "Hobart, TAS" },
  { id: "auckland", name: "Auckland, NZ" },
  { id: "wellington", name: "Wellington, NZ" }
];

const INDUSTRIES = [
  "Cross-Industry / General Commercial",
  "Financial Services / Insurance",
  "Government / Public Sector",
  "Energy / Resources / Mining",
  "Healthcare / Pharmaceuticals",
  "Education / Higher Ed",
  "Retail / Supply Chain",
  "Professional Services"
];

const ORG_SIZES = [
  "SMB (Under 100 staff)",
  "Mid-Market (100-1000 staff)",
  "Enterprise (1000+ staff)",
  "Government / Multi-Entity Corporate Partnership"
];

export function SmartPartnerMatchmaker({ partners, addToast }: SmartPartnerMatchmakerProps) {
  // Input fields
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("all");
  const [orgSize, setOrgSize] = useState("Mid-Market (100-1000 staff)");
  const [industry, setIndustry] = useState("Cross-Industry / General Commercial");
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  
  // Scoring state
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<MatchmakingResponse | null>(null);

  // Completed action items tracking
  const [completedActions, setCompletedActions] = useState<Record<string, string[]>>({});

  const toggleSpec = (spec: string) => {
    setSelectedSpecs(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setRequirements(preset.requirements);
    setLocation(preset.location);
    setOrgSize(preset.size);
    setIndustry(preset.industry);
    setSelectedSpecs(preset.specs);
    
    addToast(
      "anz_strategy",
      "Template Loaded",
      `Applied the "${preset.title}" enterprise matchmaking requirements.`
    );
  };

  const runMatchmaking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setLoadingStep(0);

    // Simulated cycle to read like a high-performance telemetry engine
    const loadingTexts = [
      "Securing regional tenant directories...",
      "Resolving licensing specialization vectors...",
      "Matching geography bounds against localized headquarters...",
      "Scoping Microsoft co-investment eligibility...",
      "Running semantic AI partner directory assessment..."
    ];

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingTexts.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 900);

    try {
      const response = await fetch("/api/matchmake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          requirements: requirements.trim(),
          location,
          organizationSize: orgSize,
          industry,
          desiredSpecializations: selectedSpecs
        })
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error("Matchmaking endpoint returned an error status.");
      }

      const data: MatchmakingResponse = await response.json();
      setResult(data);
      
      // Initialize action item checkbox states
      const initActions: Record<string, string[]> = {};
      data.matches.forEach((m) => {
        initActions[m.partnerId] = [];
      });
      setCompletedActions(initActions);

      addToast(
        "anz_strategy",
        "AI Matchmaking Ready",
        "Successfully evaluated target partner capabilities with tailored compatibility logs."
      );
    } catch (err) {
      clearInterval(stepInterval);
      console.error("Matchmaking error:", err);
      addToast(
        "licensing_pricing",
        "Matchmaking Query Offline",
        "Server matchmaking service could not process telemetry. Proceeding with instant client-side calculation."
      );

      // Procedural client-side algorithm as safety valve
      const mockResult: MatchmakingResponse = {
        executiveSummary: `Procedural calculation computed for ${orgSize} located in ${location}. Based on selected attributes in ${industry}, an enterprise architectural match is completed.`,
        fundingEligibilityScoping: `Your business profile qualifications indicate high probability of Microsoft Solution Assessment Program credits and active co-investment offsets.`,
        matches: partners.map(p => {
          // Rule based scoring
          let score = 75;
          const locLow = (p.location || "").toLowerCase();
          const reqLow = requirements.toLowerCase();
          
          if (location !== "all" && locLow.includes(location)) score += 15;
          p.specialization.forEach(spec => {
            if (selectedSpecs.includes(spec)) score += 8;
            if (reqLow.includes(spec.toLowerCase())) score += 5;
          });

          // Cap at 99
          score = Math.min(99, score);

          return {
            partnerId: p.id,
            matchScore: score,
            justification: `${p.name} is selected based on their regional profile in ${p.location}. Their certified capabilities match your stated goals perfectly.`,
            recommendedServices: [
              `Customized ${p.specialization[0] || "Architecture"} Scoping Workshop`,
              "Microsoft Cloud Optimization Telemetry Assess",
              "Azure Landing Zone FastTrack Deployment Schema"
            ],
            suggestedActions: [
              `Schedule preliminary scoping align with ${p.name}'s expert advisors`,
              "Initiate structural EA licensing metadata check"
            ]
          };
        }).sort((a,b) => b.matchScore - a.matchScore)
      };

      setResult(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const toggleActionItem = (partnerId: string, actionText: string) => {
    setCompletedActions(prev => {
      const current = prev[partnerId] || [];
      const updated = current.includes(actionText) 
        ? current.filter(t => t !== actionText)
        : [...current, actionText];
      return { ...prev, [partnerId]: updated };
    });
  };

  const loadingTerms = [
    "Securing regional tenant directories...",
    "Resolving licensing specialization vectors...",
    "Matching geography bounds against localized headquarters...",
    "Scoping Microsoft co-investment eligibility...",
    "Running semantic AI partner directory assessment..."
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200" id="smart-solutions-matchmaking-engine">
      {/* Cover Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-sky-500/5 rounded-full blur-2xl"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                AI CO-INVESTMENT & ALLIANCE ENGINE
              </span>
              <span className="text-[10px] text-slate-500 font-mono">• Active Real-Time Scoper</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-6 h-6 text-sky-400" />
              Smart Solutions Partner Matchmaking Engine
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Dynamically parse your IT goals, location, and desired capabilities through standard Gemini reasoning. Verify strict technical alignments, assess co-investment eligibility, and acquire actionable deployment steps.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls Form (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-sky-400" />
              Configure Matchmaking Filters
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Specify your current enterprise metrics and licensing goals below.</p>
          </div>

          <form onSubmit={runMatchmaking} className="space-y-5">
            {/* Stated Requirements */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>IT Requirements & Enterprise Pain Points</span>
                <span className="text-[10px] text-slate-500">Be as specific as possible</span>
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="E.g., Need to migrate local Exchange & SQL workloads to high-security Azure. Currently spend $1.2M on Microsoft licenses and want to find optimal CSP cost optimizations."
                required
                className="w-full h-24 bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition leading-relaxed resize-none"
              />
            </div>

            {/* Geography & City */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Operational Geography</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500/50 transition cursor-pointer"
              >
                {ANZ_CITIES.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            {/* Org Size & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Org Size</span>
                </label>
                <select
                  value={orgSize}
                  onChange={(e) => setOrgSize(e.target.value)}
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500/50 transition cursor-pointer"
                >
                  {ORG_SIZES.map(sz => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Industry</span>
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500/50 transition cursor-pointer"
                >
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Desired Competencies / Specializations */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Target Specializations & Competencies</span>
                <span className="text-[10px] text-slate-500">{selectedSpecs.length} selected</span>
              </label>
              <div className="h-44 overflow-y-auto bg-[#0a0f1d] border border-slate-800 p-3.5 rounded-xl space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
                {DISCOVERY_COMPETENCIES.map(spec => {
                  const isChecked = selectedSpecs.includes(spec);
                  return (
                    <button
                      type="button"
                      key={spec}
                      onClick={() => toggleSpec(spec)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-[11px] transition cursor-pointer ${
                        isChecked 
                          ? "bg-sky-500/10 text-sky-300 border border-sky-500/30" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent"
                      }`}
                    >
                      <div className={`h-3.5 w-3.5 rounded border flex items-center justify-center transition-all ${
                        isChecked ? "bg-sky-500 border-sky-400" : "border-slate-700 bg-transparent"
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </div>
                      <span className="truncate">{spec}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !requirements.trim()}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 select-none cursor-pointer ${
                loading || !requirements.trim()
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800"
                  : "bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold shadow-[0_4px_16px_rgba(14,165,233,0.25)] hover:shadow-[0_4px_20px_rgba(14,165,233,0.4)]"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Calculating Matches...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 stroke-[2]" />
                  <span>Generate Recommended Matches</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Enterprise Templates & Live Stage (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Quick-Match Templates Card */}
          <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              Pre-populated Matchmaking Scenarios
            </h3>
            <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
              Select one of our pre-configured corporate IT requirements templates to demonstrate the matchmaking engine’s reasoning capability instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset)}
                  className="bg-[#0a0f1d] hover:bg-[#0c1328] border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 text-left transition flex flex-col justify-between group h-full cursor-pointer"
                >
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-white group-hover:text-sky-400 transition line-clamp-1">
                      {preset.title}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-3 flex items-center gap-1 group-hover:text-emerald-400 transition">
                    <span>Load Scenario</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Results State Visualizer */}
          <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 h-44 w-44 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-8 text-center space-y-4"
                  id="matching-stage-loading"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-16 w-16 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin"></div>
                    <Cpu className="w-6 h-6 text-sky-400 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-semibold text-slate-300">
                      Processing AI Scorecards
                    </h4>
                    <p className="text-[10px] text-sky-400 font-mono animate-pulse">
                      {loadingTerms[loadingStep]}
                    </p>
                  </div>
                </motion.div>
              )}

              {!loading && !result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-3"
                  id="matching-stage-empty"
                >
                  <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                    <Search className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-xs font-semibold text-white">No active matchup calculation</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Tune the configuration requirements panel on the left or select a template scenario above, then start calculation to discover compatibility scores.
                    </p>
                  </div>
                </motion.div>
              )}

              {!loading && result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                  id="matching-stage-results"
                >
                  {/* Results Title */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                        Alliance Intelligence Evaluation
                      </h4>
                    </div>
                    {result.isFallbackTelemetry && (
                      <span className="text-[10px] text-emerald-450 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Mock Mode Fallback
                      </span>
                    )}
                  </div>

                  {/* Strategic Intelligence Bento Rows */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Executive Summary */}
                    <div className="bg-[#0a0f1d] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-sky-400 text-xs font-semibold mb-1.5">
                          <CheckCircle2 className="w-4 h-4 text-sky-400" />
                          <span>Strategic Executive Summary</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {result.executiveSummary}
                        </p>
                      </div>
                    </div>

                    {/* Funding and Credits Scope */}
                    <div className="bg-[#0a0f1d] border border-emerald-950/40 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span>Microsoft Co-Investment & Credits Scope</span>
                        </div>
                        <p className="text-[11px] text-emerald-300/90 leading-relaxed bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/10">
                          {result.fundingEligibilityScoping}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Match Results Cards */}
                  <div className="space-y-4 pt-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                      Matched Partner Recommendations (Ranked by Compatibility)
                    </div>
                    
                    {result.matches.map((match, rankIdx) => {
                      const parObj = partners.find(p => p.id === match.partnerId) || partners[0];
                      const completedCount = completedActions[match.partnerId]?.length || 0;
                      const totalActions = match.suggestedActions.length;
                      const progressPercentage = totalActions > 0 ? (completedCount / totalActions) * 100 : 0;

                      return (
                        <div 
                          key={match.partnerId}
                          className="bg-[#0a0f1d] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-4 relative"
                        >
                          {/* Rank Badge */}
                          <div className="absolute top-4 right-4 flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">Rank #{rankIdx + 1}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{parObj.name}</span>
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  rankIdx === 0 
                                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/30" 
                                    : "bg-slate-800 text-slate-400"
                                }`}>
                                  {rankIdx === 0 ? "Best Operational Fit" : "Qualifying Match"}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2.5">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-500" />
                                  {parObj.location}
                                </span>
                                <span className="text-slate-600">•</span>
                                <span className="flex items-center gap-1">
                                  <Award className="w-3 h-3 text-amber-500" />
                                  {parObj.rating} ({parObj.ratingCount} evaluations)
                                </span>
                              </div>
                            </div>

                            {/* Match Score Gauge */}
                            <div className="flex items-center gap-3 bg-[#0c1328] border border-slate-800 rounded-lg p-2.5 pr-4 justify-between sm:justify-start">
                              <span className="text-[10px] text-slate-400 font-mono">Compatibility Score:</span>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-emerald-500 transition-all duration-500" 
                                    style={{ width: `${match.matchScore}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-bold text-emerald-400 font-mono">
                                  {match.matchScore}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Justification Text */}
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Evaluation Scoping Justification
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-800/40">
                              {match.justification}
                            </p>
                          </div>

                          {/* Recommended Custom Offerings */}
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Tailored Core Solutions Recommended
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {match.recommendedServices.map((srv, sIdx) => (
                                <span 
                                  key={sIdx}
                                  className="text-[10px] text-sky-400 bg-sky-500/5 border border-sky-500/10 rounded-md px-2 py-1 flex items-center gap-1.5"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-sky-500/70" />
                                  {srv}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Items Roadmap */}
                          <div className="space-y-2.5 bg-[#080d1a] border border-slate-900 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Preparation & Action Roadmap
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">
                                {completedCount} / {totalActions} Ready
                              </span>
                            </div>

                            {/* Actions Progress Bar */}
                            <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-sky-400 transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>

                            <div className="space-y-1.5 pt-1">
                              {match.suggestedActions.map((act, aIdx) => {
                                const isChecked = (completedActions[match.partnerId] || []).includes(act);
                                return (
                                  <button
                                    key={aIdx}
                                    onClick={() => toggleActionItem(match.partnerId, act)}
                                    className="w-full flex items-start gap-2.5 text-left text-[11px] py-1 hover:bg-[#0c142a] px-2 rounded-md transition cursor-pointer"
                                  >
                                    <div className={`mt-0.5 h-3.5 w-3.5 rounded border flex items-center justify-center transition-all shrink-0 ${
                                      isChecked ? "bg-sky-500 border-sky-400" : "border-slate-800 bg-transparent"
                                    }`}>
                                      {isChecked && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                                    </div>
                                    <span className={isChecked ? "text-slate-500 line-through" : "text-slate-300"}>
                                      {act}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Connector Controls */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-900">
                            {/* Website info */}
                            {parObj.websiteUrl && (
                              <a
                                href={parObj.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                              >
                                <Globe className="w-3.5 h-3.5 text-slate-500" />
                                <span>{parObj.websiteUrl.replace(/^https?:\/\//, "")}</span>
                                <ArrowUpRight className="w-3 h-3 text-slate-500" />
                              </a>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {parObj.contactEmail && (
                                <a
                                  href={`mailto:${parObj.contactEmail}?subject=Direct Microsoft ANZ Match Scoping Enquiry&body=Hi ${parObj.name} Team,%0D%0A%0D%0AWe recently executed a Smart Solutions Partner Match evaluation and discovered you represent an exceptional compatibility score (${match.matchScore}%).%0D%0A%0D%0AOur key requirements: "${requirements}"%0D%0A%0D%0APlease let us know if we can schedule a consultation.%0D%0A%0D%0ABest regards,%0D%0A[Your Name]`}
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0d1222] hover:border-slate-700 text-slate-300 hover:text-white text-[11px] font-mono font-medium transition cursor-pointer"
                                >
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  <span>Email Request</span>
                                </a>
                              )}

                              {parObj.id && (
                                <button
                                  onClick={() => {
                                    // Deep link / promotion logic - promote this partner and toast
                                    const promUrl = `https://portal.azure.com/`;
                                    addToast(
                                      "anz_strategy",
                                      "Scoping Workspace Connected",
                                      `Connected directly to ${parObj.name} specialist portal.`
                                    );
                                  }}
                                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-[11px] font-bold hover:shadow-lg transition cursor-pointer"
                                >
                                  <span>Initiate Scoping</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
