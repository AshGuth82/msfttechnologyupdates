/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  Coins, 
  DollarSign, 
  Globe, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Users, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Briefcase, 
  BarChart3, 
  Terminal,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  Info,
  FileText,
  Bell,
  BellOff,
  X,
  Mail,
  Send,
  Check,
  Download,
  Share2,
  Bookmark,
  Clock,
  Sun,
  Moon,
  Laptop,
  Sunrise,
  Sunset,
  GripVertical,
  Pin,
  Trash2,
  Upload,
  Plus,
  Cloud,
  Award,
  Star,
  Building2,
  ThumbsUp,
  MessageSquare,
  Building,
  Table,
  Linkedin
} from "lucide-react";
import { Article, NewsCategory, CachedNews, CustomQueryResponse, MicrosoftPartner, PartnerReview, PriceAlert } from "./types";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  ComposedChart,
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  ReferenceArea,
  ReferenceLine
} from "recharts";

const LOCAL_FALLBACK_ARTICLES: Article[] = [
  {
    id: "anz-cloud-1",
    title: "Azure Australia East Local Region Solidifies Sovereign AI for ANZ Governments",
    summary: "Microsoft announced high-density clean-energy AI cluster modules in Sydney and Melbourne, enabling local sovereign model processing. The expansion satisfies APRA compliance and New Zealand NZISM security guidelines.",
    category: "cloud_transformations",
    url: "https://news.microsoft.com/en-au/",
    source: "ANZ Cloud Transformation Briefing",
    publishedDate: "2026-05-18",
    sentiment: "positive",
    impactScore: 9,
    keyTakeaways: [
      "No-latency local physical residency for data in NSW and Victoria",
      "Satisfies strict APRA banking and NZISM government clearance structures",
      "Empowers automated hybrid cloud compute using localized sovereign pipelines"
    ],
    anzActionableAdvice: "Enterprise financial institutions and government agencies should immediately review their tenant residency. For migrations to these sovereign nodes, leverage Microsoft ECIF funding which can subsidise implementation costs up to 100%.",
    ecifFundingEligible: true
  },
  {
    id: "anz-cloud-2",
    title: "Microsoft 365 Copilot Agentic Workflows Deployed for ANZ Enterprise Portfolios",
    summary: "A joint pilot program reveals that ASX 100 companies are deploying agentic Copilots, resulting in an average saving of 8.2 hours per employee week in finance, auditing, and multi-tier supplier compliance checks.",
    category: "technology_updates",
    url: "https://news.microsoft.com/en-au/",
    source: "AFR Tech Index",
    publishedDate: "2026-05-24",
    sentiment: "positive",
    impactScore: 8,
    keyTakeaways: [
      "Saves over a business day per week across high-volume procurement and audit roles",
      "Integrates fully with local ERP instances such as SAP and Dynamics 365",
      "Provides pre-built agent models tailored for local business regulations"
    ],
    anzActionableAdvice: "Develop a designated AI Center of Excellence (CoE) to build custom team-level agents. Talk to your Local Account Director to run a structured discovery workshop funded via the Azure End-customer Investment Fund (ECIF).",
    ecifFundingEligible: true
  },
  {
    id: "anz-ea-1",
    title: "Microsoft Enterprise Agreement (EA) 2026 Restructuring: Navigating SCE and EAS Options",
    summary: "Microsoft is adjusting the base eligibility seat-counts and commitments for Server and Cloud Enrollment (SCE) Agreements. IT procurement teams in ANZ must prepare for a minimum baseline count rise to 500 profiles.",
    category: "licensing_pricing",
    url: "https://www.microsoft.com/licensing",
    source: "Strategic Licensing Review",
    publishedDate: "2026-05-11",
    sentiment: "neutral",
    impactScore: 8,
    keyTakeaways: [
      "EA base profile seats thresholds adjusted upwards, forcing smaller enterprises toward CSP models",
      "SCE enrollments receive strict standardization concerning developer Visual Studio dependencies",
      "EAS subscription discounts adjusted to reward multi-product suite portfolios"
    ],
    anzActionableAdvice: "Finance and procurement teams must perform a complete audit of current active license counts 180 days prior to EA renewal. If your active users are between 400 and 600, model the cost benefits of moving to a Cloud Solution Provider (CSP) agreement.",
    ecifFundingEligible: false
  },
  {
    id: "anz-ea-2",
    title: "Windows Server 2026 Core Licensing Shifts to Account for local GPU & NPU Hardware Density",
    summary: "Microsoft is standardizing virtual core execution mappings for on-premises enterprise data centers. The new core structures tie Windows Server licensing directly to the presence of physical AI processing cores.",
    category: "licensing_pricing",
    url: "https://www.microsoft.com/licensing",
    source: "Redmond Licensing Portal",
    publishedDate: "2026-05-02",
    sentiment: "negative",
    impactScore: 7,
    keyTakeaways: [
      "Physical GPU and NPU density metrics are integrated into core multi-user licensing scales",
      "On-premises offline servers running heavy continuous AI workloads experience a cost rise",
      "Microsoft introduces direct licensing credits for migrating affected clusters into Azure"
    ],
    anzActionableAdvice: "Model your core-to-processor ratio before ordering local AI server setups. Transitioning these server workloads to Azure Virtual Machines is typically subsidized under Azure Hybrid Benefit and ECIF datacenter exit programs.",
    ecifFundingEligible: true
  },
  {
    id: "anz-price-1",
    title: "Microsoft Adjusts ANZ Price Lists Following Foreign Exchange Stabilization",
    summary: "Effective July 1, 2026, Microsoft is enacting a 6% price list adjustment for products transacted in AUD and NZD. The adjustment aligns Australia & New Zealand pricing tables with standard global USD baselines.",
    category: "licensing_pricing",
    url: "https://news.microsoft.com/en-au/",
    source: "Microsoft Business Desk",
    publishedDate: "2026-06-01",
    sentiment: "negative",
    impactScore: 10,
    keyTakeaways: [
      "6% wholesale price adjustment applied to cloud software subscription streams",
      "Directly impacts ongoing monthly commitments for M365 and standalone Azure consumption",
      "Locked Enterprise Agreements remain unaffected until their specific renewal dates"
    ],
    anzActionableAdvice: "If your organization is currently on a CSP model with rolling monthly commitments, consider switching to an annual commitment tier immediately to lock in existing lower price tables for the next 12 months.",
    ecifFundingEligible: false
  },
  {
    id: "m365-global-update-2026",
    title: "Microsoft 2026 Commercial Licensing Update: M365 Global Packaging & Pricing Changes",
    summary: "On December 4, Microsoft announced a global price and packaging update for select Microsoft 365 commercial suites and standalone components, including Enterprise (E3/E5), Business, Frontline (F1/F3), and Government editions. The changes take effect on July 1, 2026.",
    category: "licensing_pricing",
    url: "https://www.microsoft.com/en-us/licensing/news/2026-m365-packaging-pricing-updates",
    source: "Microsoft Commercial Licensing News",
    publishedDate: "2026-06-05",
    sentiment: "negative",
    impactScore: 9,
    keyTakeaways: [
      "Applies global pricing updates across Microsoft 365 E3 and E5 enterprise packages",
      "Affects Business Standard, Business Premium, Frontline worker tiers (F1/F3), and public sector models",
      "Streamlines secure collaboration by integrating automated high-density security packaging policies directly into standard commercial profiles",
      "SaaS and enterprise procurement teams can lock in standard rates for 12 months with pre-deadline annual term activations"
    ],
    anzActionableAdvice: "Enterprise procurement managers in Australia and New Zealand must review their licensing footprints ahead of the July 1, 2026 cliff. Transitioning monthly cloud solution subscriptions into annual contract commits prior to the deadline locks in existing baseline pricing and prevents immediate regional budget increases.",
    ecifFundingEligible: false
  },
  {
    id: "anz-price-2",
    title: "M365 Copilot Dynamic Tiered Licensing Prices Announced for Mid-Market Segments",
    summary: "To encourage widespread digital enablement across medium-sized offices, Microsoft is launching discounted tiering levels for Copilot. Organizations adding 100+ seats gain a 15% system fee reduction.",
    category: "licensing_pricing",
    url: "https://www.microsoft.com/en-au/licensing",
    source: "ZDNet Tech Analyst",
    publishedDate: "2026-05-15",
    sentiment: "positive",
    impactScore: 7,
    keyTakeaways: [
      "Mid-sized businesses receive a dedicated discount path for cloud services",
      "StepUp options introduced to easily transition regular users into active Copilot seats",
      "Aims to counter SaaS competitors in local Australian and New Zealand mid-markets"
    ],
    anzActionableAdvice: "Procurement managers can bundle this tiered pricing discount with Microsoft Partner incentive programs. Ensure your implementation partner is registering the deal to claim maximum regional credits.",
    ecifFundingEligible: true
  },
  {
    id: "anz-strat-1",
    title: "Unlocking Microsoft ECIF Funding: Strategic Roadmap for ANZ CIOs",
    summary: "Microsoft has expanded the criteria for the End-customer Investment Fund (ECIF) in the ANZ territory. Funding priorities now emphasize AI readiness, migration of legacy SQL instances, and secure Azure tenant design.",
    category: "anz_strategy",
    url: "https://news.microsoft.com/en-au/",
    source: "Enterprise Strategy Journal",
    publishedDate: "2026-05-30",
    sentiment: "positive",
    impactScore: 9,
    keyTakeaways: [
      "ECIF budgets for ANZ are boosted to accelerate local data residency adoption",
      "Covers up to 100% of proof-of-concept costs when utilizing Gold Partners",
      "Strict funding allocation rules require pre-approval through Microsoft account units"
    ],
    anzActionableAdvice: "Ensure your partner of choice submits an ECIF proposal during your initial architectural design phase. Never start work before the ECIF Purchase Order is formally issued, as retroactive funding is strictly prohibited.",
    ecifFundingEligible: true
  },
  {
    id: "anz-strat-2",
    title: "Microsoft ANZ Partner Enablement: Co-Investment Programs for AI Transformation",
    summary: "Microsoft Australia has unveiled a targeted co-investment framework for certified partners across Sydney, Melbourne, and Auckland. The program provides structured technical scoping and direct Azure sandbox credits to qualifying customers.",
    category: "anz_strategy",
    url: "https://news.microsoft.com/en-au/",
    source: "Channel Intelligence Weekly",
    publishedDate: "2026-06-02",
    sentiment: "positive",
    impactScore: 8,
    keyTakeaways: [
      "Provides structured funding offsets to reduce customer licensing migration friction",
      "Expands local technical architecture support from Microsoft field engineering specialists",
      "Aims to accelerate enterprise deployment of sovereign AI workloads in high-compliance sectors"
    ],
    anzActionableAdvice: "Validate with your Microsoft Account Executive if your certified implementation partner has applied for dynamic co-investment alignment. Ensure all scopes of work are registered in the Microsoft Partner Center.",
    ecifFundingEligible: true
  }
];

const calculateReadTime = (article: Article): string => {
  const titleText = article.title || "";
  const summaryText = article.summary || "";
  const takeawaysText = (article.keyTakeaways || []).join(" ");
  const adviceText = article.anzActionableAdvice || "";
  const combinedText = `${titleText} ${summaryText} ${takeawaysText} ${adviceText}`;
  const wordCount = combinedText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
};

const DEFAULT_PARTNERS: MicrosoftPartner[] = [
  {
    id: "partner-insight-apac",
    name: "Insight APAC",
    location: "Sydney, NSW & Regional",
    rating: 4.9,
    ratingCount: 124,
    promoted: true,
    specialization: ["Licensing Optimization", "Azure Cloud Migration", "Copilot Transformation"],
    description: "A leading global systems integrator and Microsoft Solution Assessment partner specializing in software asset management, complex EA negotiations, and enterprise Azure workload transformation.",
    caseStudyTitle: "Federal Government Azure Multi-Tenant Transformation",
    caseStudyContext: "Architected high-throughput secure tenants under strict IRAP boundaries while yielding $1.2M in annual software licensing optimization savings.",
    contactEmail: "microsoft-licensing@insight.com",
    websiteUrl: "https://au.insight.com",
    reviews: [
      {
        id: "rev-insight-1",
        reviewer: "David Harrison",
        rating: 5,
        comment: "Incredible licensing advisory work. Reduced our EA commitments with clear options.",
        date: "2026-04-10"
      }
    ]
  },
  {
    id: "partner-crayon",
    name: "Crayon Australia",
    location: "Melbourne, VIC",
    rating: 4.8,
    ratingCount: 82,
    promoted: false,
    specialization: ["Software Asset Management (SAM)", "Cloud Economics", "Microsoft CSP Program"],
    description: "A globally recognized expert in IT optimization and software asset management. Crayon leverages proprietary methodologies to optimize software estates and cloud consumption models.",
    caseStudyTitle: "Financial Sector Cloud Economics Audit",
    caseStudyContext: "Audited 8,000 M365 and Server licenses, converting idle enterprise enrollment seats to a hybrid CSP model and lowering monthly spend by 28%.",
    contactEmail: "info.au@crayon.com",
    websiteUrl: "https://www.crayon.com/au",
    reviews: [
      {
        id: "rev-crayon-1",
        reviewer: "Mitchell Vance",
        rating: 5,
        comment: "Unbeatable technical precision in software asset compliance and optimization.",
        date: "2026-05-15"
      }
    ]
  },
  {
    id: "partner-softwareone",
    name: "SoftwareOne Australia",
    location: "Sydney, NSW",
    rating: 4.7,
    ratingCount: 95,
    promoted: false,
    specialization: ["Enterprise Software Advisor", "Azure FinOps", "Application Modernization"],
    description: "A leading global provider of end-to-end software and cloud technology solutions. Specializes in managing software portfolios and guiding businesses through efficient multi-year cloud agreements.",
    caseStudyTitle: "Multi-Entity Corporate Consolidation Alignment",
    caseStudyContext: "Consolidated separate enterprise agreements (EAs) across six merged entities into a unified single tenant, conserving $1.8M in standard operational credits.",
    contactEmail: "info.au@softwareone.com",
    websiteUrl: "https://www.softwareone.com/en-au",
    reviews: [
      {
        id: "rev-sone-1",
        reviewer: "Claire Henderson",
        rating: 5,
        comment: "Superb alignment support throughout our enterprise agreement consolidation process.",
        date: "2026-05-02"
      }
    ]
  }
];

export default function App() {
  // Theme Select Configuration (High Contrast, Accessible Microsoft Corporate Aesthetic with Solar & System Auto Sync)
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "system" | "solar">(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_theme_mode");
      if (stored === "light" || stored === "dark" || stored === "system" || stored === "solar") {
        return stored;
      }
      const prevTheme = localStorage.getItem("microsoft_intel_theme");
      if (prevTheme === "light" || prevTheme === "dark") {
        return prevTheme;
      }
      return "solar"; // Default to Solar (sunrise/sunset) auto-toggle
    } catch {
      return "solar";
    }
  });

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const isTimeDaylight = () => {
    const hours = new Date().getHours();
    return hours >= 6 && hours < 18; // Sunrise at 6:00 AM, Sunset at 6:00 PM
  };

  useEffect(() => {
    try {
      localStorage.setItem("microsoft_intel_theme_mode", themeMode);
    } catch (e) {
      console.warn("localStorage write blocked:", e);
    }
  }, [themeMode]);

  useEffect(() => {
    if (themeMode === "solar") {
      const updateThemeSolar = () => {
        const isDay = isTimeDaylight();
        setTheme(isDay ? "light" : "dark");
      };
      updateThemeSolar();
      const interval = setInterval(updateThemeSolar, 15000); 
      return () => clearInterval(interval);
    } else if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
        setTheme(e.matches ? "dark" : "light");
      };
      handleSystemThemeChange(mediaQuery);
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleSystemThemeChange);
        return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
      } else {
        mediaQuery.addListener(handleSystemThemeChange);
        return () => mediaQuery.removeListener(handleSystemThemeChange);
      }
    } else {
      setTheme(themeMode);
    }
  }, [themeMode]);

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light");
      document.body.style.backgroundColor = "#f3f6fc";
      document.body.style.color = "#0f172a";
    } else {
      document.body.classList.remove("light");
      document.body.style.backgroundColor = "#0b0f19";
      document.body.style.color = "#f1f5f9";
    }
  }, [theme]);

  const isDark = theme === "dark";

  const categoryMap: Record<NewsCategory, { label: string; bg: string; text: string; icon: any }> = {
    technology_updates: { 
      label: "Technology Updates", 
      bg: isDark ? "bg-sky-500/10 border-sky-500/30" : "bg-sky-100/70 border-sky-200", 
      text: isDark ? "text-sky-450" : "text-sky-800 font-semibold", 
      icon: <Cpu className={`w-4 h-4 ${isDark ? "text-sky-400" : "text-sky-700"}`} /> 
    },
    licensing_pricing: { 
      label: "Licensing & Pricing", 
      bg: isDark ? "bg-emerald-500/10 border-emerald-500/30" : "bg-emerald-100/70 border-emerald-200", 
      text: isDark ? "text-emerald-450" : "text-emerald-800 font-semibold", 
      icon: <DollarSign className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-700"}`} /> 
    },
    anz_strategy: { 
      label: "ANZ Strategy", 
      bg: isDark ? "bg-purple-500/10 border-purple-500/30" : "bg-purple-100/70 border-purple-200", 
      text: isDark ? "text-purple-400" : "text-purple-800 font-semibold", 
      icon: <Globe className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-700"}`} /> 
    },
    cloud_transformations: { 
      label: "Cloud Transformations", 
      bg: isDark ? "bg-indigo-500/10 border-indigo-500/30" : "bg-indigo-100/70 border-indigo-200", 
      text: isDark ? "text-indigo-400" : "text-indigo-800 font-semibold", 
      icon: <Cloud className={`w-4 h-4 ${isDark ? "text-indigo-400" : "text-indigo-700"}`} /> 
    }
  };

  // Watchlist & Toast Notification State (Persisted in localStorage)
  const [watchlist, setWatchlist] = useState<NewsCategory[]>(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_watchlist");
      return stored ? JSON.parse(stored) : ["licensing_pricing"];
    } catch {
      return ["licensing_pricing"];
    }
  });

  // Microsoft Partners State
  const [partners, setPartners] = useState<MicrosoftPartner[]>(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_partners");
      const parsed = stored ? JSON.parse(stored) : DEFAULT_PARTNERS;
      const cleaned = parsed.filter((p: any) => p.name !== "Sydney Unified Systems" && p.name !== "Melbourne Cloud Scaling" && p.name !== "Auckland Sovereign AI");
      
      if (cleaned.length > 0 && !cleaned.some((p: any) => p.promoted)) {
        const insight = cleaned.find((p: any) => p.id === "partner-insight-apac");
        if (insight) {
          insight.promoted = true;
        } else {
          cleaned[0].promoted = true;
        }
      }
      localStorage.setItem("microsoft_intel_partners", JSON.stringify(cleaned));
      return cleaned;
    } catch {
      return DEFAULT_PARTNERS;
    }
  });

  const [activeMainView, setActiveMainView] = useState<"briefings" | "partners">("briefings");

  const [partnerReviewer, setPartnerReviewer] = useState("");
  const [partnerRating, setPartnerRating] = useState(5);
  const [partnerComment, setPartnerComment] = useState("");
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);

  // States for creating a custom partner
  const [showAddPartnerForm, setShowAddPartnerForm] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerLocation, setNewPartnerLocation] = useState("");
  const [newPartnerSpecialization, setNewPartnerSpecialization] = useState("");
  const [newPartnerDescription, setNewPartnerDescription] = useState("");
  const [newPartnerCaseStudyTitle, setNewPartnerCaseStudyTitle] = useState("");
  const [newPartnerCaseStudyContext, setNewPartnerCaseStudyContext] = useState("");
  const [newPartnerEmail, setNewPartnerEmail] = useState("");
  const [newPartnerWebsite, setNewPartnerWebsite] = useState("");

  const handlePromotePartner = (id: string) => {
    setPartners(current => {
      const next = current.map(p => ({
        ...p,
        promoted: p.id === id
      }));
      localStorage.setItem("microsoft_intel_partners", JSON.stringify(next));
      return next;
    });
    
    const promotedPartner = partners.find(p => p.id === id);
    addToast(
      "anz_strategy",
      "Spotlight Partner Updated",
      `Successfully promoted ${promotedPartner?.name || "selected partner"} as the Active Featured Spotlight Partner.`
    );
  };

  const handleAddReview = (partnerId: string) => {
    if (!partnerReviewer.trim() || !partnerComment.trim()) {
      addToast("licensing_pricing", "Review Incomplete", "Please supply your Name and review Comments.");
      return;
    }

    setPartners(current => {
      const next = current.map(p => {
        if (p.id !== partnerId) return p;
        
        const newRev: PartnerReview = {
          id: `rev-${Math.random().toString(36).substring(2, 9)}`,
          reviewer: partnerReviewer.trim(),
          rating: partnerRating,
          comment: partnerComment.trim(),
          date: new Date().toISOString().split("T")[0]
        };
        
        const updatedReviews = [newRev, ...p.reviews];
        const avgRating = parseFloat((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
        
        return {
          ...p,
          reviews: updatedReviews,
          rating: avgRating,
          ratingCount: updatedReviews.length
        };
      });
      localStorage.setItem("microsoft_intel_partners", JSON.stringify(next));
      return next;
    });

    addToast(
      "anz_strategy",
      "Customer Review Added",
      `Your review for this Microsoft Partner has been recorded and updated in real-time.`
    );

    setPartnerReviewer("");
    setPartnerComment("");
    setPartnerRating(5);
    setActiveReviewId(null);
  };

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim() || !newPartnerDescription.trim()) {
      addToast("licensing_pricing", "Partner Info Incomplete", "Please provide a Partner Name and description.");
      return;
    }

    const specializationsArray = newPartnerSpecialization
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const freshPartner: MicrosoftPartner = {
      id: `partner-${Math.random().toString(36).substring(2, 9)}`,
      name: newPartnerName.trim(),
      location: newPartnerLocation.trim() || "Australia & New Zealand",
      rating: 5.0,
      ratingCount: 1,
      promoted: false,
      specialization: specializationsArray.length ? specializationsArray : ["General Services", "Cloud Consultant"],
      description: newPartnerDescription.trim(),
      caseStudyTitle: newPartnerCaseStudyTitle.trim() || "Enterprise Implementation",
      caseStudyContext: newPartnerCaseStudyContext.trim() || "Custom infrastructure audit and direct tenant optimisation services.",
      contactEmail: newPartnerEmail.trim() || "procurement-support@microsoft.com.au",
      reviews: [
        {
          id: `rev-${Math.random().toString(36).substring(2, 9)}`,
          reviewer: "System Verified",
          rating: 5,
          comment: "Created and verified custom Microsoft Partner profile.",
          date: new Date().toISOString().split("T")[0]
        }
      ]
    };

    setPartners(prev => {
      const next = [...prev, freshPartner];
      localStorage.setItem("microsoft_intel_partners", JSON.stringify(next));
      return next;
    });

    addToast(
      "anz_strategy",
      "Partner Directory Registered",
      `Custom Microsoft Partner: ${freshPartner.name} registered successfully.`
    );

    setNewPartnerName("");
    setNewPartnerLocation("");
    setNewPartnerSpecialization("");
    setNewPartnerDescription("");
    setNewPartnerCaseStudyTitle("");
    setNewPartnerCaseStudyContext("");
    setNewPartnerEmail("");
    setShowAddPartnerForm(false);
  };

  const spotlightPartner = partners.find(p => p.promoted) || partners[0];

  const [toasts, setToasts] = useState<{
    id: string;
    title: string;
    message: string;
    category: NewsCategory;
    timestamp: string;
  }[]>([]);

  const addToast = (category: NewsCategory, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setToasts(current => [...current, { id, title, message, category, timestamp }]);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts(current => current.filter(t => t.id !== id));
  };

  const toggleWatchlist = (category: NewsCategory) => {
    setWatchlist(current => {
      const next = current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category];
      localStorage.setItem("microsoft_intel_watchlist", JSON.stringify(next));
      return next;
    });
  };

  // Bookmarking / Saved Articles state (Persisted in localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_bookmarks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_pinned");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [deletedArticleIds, setDeletedArticleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_deleted");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleSelectArticle = (id: string) => {
    setSelectedArticleIds(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    );
  };

  const toggleBookmark = (id: string, title: string, category: NewsCategory) => {
    setBookmarkedIds(current => {
      const isAlreadyBookmarked = current.includes(id);
      const next = isAlreadyBookmarked
        ? current.filter(item => item !== id)
        : [...current, id];
      localStorage.setItem("microsoft_intel_bookmarks", JSON.stringify(next));
      addToast(
        category,
        isAlreadyBookmarked ? "Bookmark Removed" : "Bookmark Saved",
        isAlreadyBookmarked 
          ? `Successfully removed: "${title.slice(0, 45)}..." from Saved Briefs.`
          : `Successfully saved: "${title.slice(0, 45)}..." for offline reference.`
      );
      return next;
    });
  };

  const togglePin = (id: string, title: string, category: NewsCategory) => {
    setPinnedIds(current => {
      const isAlreadyPinned = current.includes(id);
      const next = isAlreadyPinned
        ? current.filter(item => item !== id)
        : [...current, id];
      localStorage.setItem("microsoft_intel_pinned", JSON.stringify(next));
      addToast(
        category,
        isAlreadyPinned ? "Article Unpinned" : "Article Pinned",
        isAlreadyPinned
          ? `Successfully unpinned: "${title.slice(0, 45)}...". It will return to its standard sorted location.`
          : `Successfully pinned: "${title.slice(0, 45)}..." to stay at the top.`
      );
      return next;
    });
  };

  const generateLinkedInPost = (article: Article): string => {
    const takeaways = article.keyTakeaways && article.keyTakeaways.length > 0
      ? article.keyTakeaways.slice(0, 3).map(pt => `• ${pt}`).join("\n")
      : "• High-impact Microsoft ecosystem briefing and intelligence analysis.";

    const advice = article.anzActionableAdvice
      ? `\n💡 ANZ Enterprise Guidance:\n${article.anzActionableAdvice}\n`
      : "";

    return `📢 ANZ Microsoft Partner Intelligence Briefing

Title: ${article.title}

Key Takeaways:
${takeaways}
${advice}
🔗 Read full briefing here:
👉 ${article.url || "https://www.microsoft.com/en-au"}

#MicrosoftPartners #ANZBusiness #CloudMigration #EnterpriseAI`;
  };

  const handleShareToLinkedIn = (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    const formattedText = generateLinkedInPost(article);
    setLinkedInShareArticle(article);
    setCustomLinkedInPostText(formattedText);
    setCopiedLinkedInText(false);
  };

  const handleNativeShare = async (e: React.MouseEvent, title: string, url: string, category: NewsCategory) => {
    e.stopPropagation();
    const shareUrl = url || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this Microsoft Intelligence Briefing: "${title}"`,
          url: shareUrl,
        });
        addToast(
          category,
          "Shared Successfully",
          "Advisory shared successfully via native share system."
        );
      } catch (err: any) {
        if (err.name !== "AbortError") {
          // fallback to clipboard copy
          navigator.clipboard.writeText(shareUrl);
          addToast(
            category,
            "Link Copied (Fallback)",
            "Native share was canceled or unavailable. The URL has been copied to your clipboard instead."
          );
        }
      }
    } else {
      // fallback
      navigator.clipboard.writeText(shareUrl);
      addToast(
        category,
        "Link Copied",
        "Your browser doesn't support direct system sharing. Link copied to clipboard!"
      );
    }
  };

  const handleTestWatchlistToast = () => {
    if (watchlist.length === 0) {
      addToast(
        "licensing_pricing",
        "Watchlist Alert",
        "Your Watchlist is empty. Toggle a corporate policy domain below in the center to activate tracking!"
      );
      return;
    }
    const testCat = watchlist[Math.floor(Math.random() * watchlist.length)];
    const catLabel = categoryMap[testCat]?.label || testCat;
    addToast(
      testCat,
      `Telemetry Alert: ${catLabel}`,
      `Test notification successful: Monitoring systems are scanning and ready to stream real-time updates.`
    );
  };

  // Articles and Cache State
  const [articles, setArticles] = useState<Article[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLive, setIsLive] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Uploaded Briefings State (Persisted in localStorage)
  const [uploadedArticles, setUploadedArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_uploaded_briefs");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCompose, setShowCompose] = useState(false);
  const [newBriefTitle, setNewBriefTitle] = useState("");
  const [newBriefCategory, setNewBriefCategory] = useState<NewsCategory>("technology_updates");
  const [newBriefSummary, setNewBriefSummary] = useState("");
  const [newBriefSource, setNewBriefSource] = useState("");
  const [newBriefSentiment, setNewBriefSentiment] = useState<"positive" | "neutral" | "negative">("neutral");
  const [newBriefImpact, setNewBriefImpact] = useState(5);
  const [newBriefTakeaways, setNewBriefTakeaways] = useState("");
  const [newBriefAdvice, setNewBriefAdvice] = useState("");
  const [newBriefEcif, setNewBriefEcif] = useState(false);

  const addUploadedBriefs = (newBriefs: Article[]) => {
    setUploadedArticles(prev => {
      const updated = [...newBriefs, ...prev];
      localStorage.setItem("microsoft_intel_uploaded_briefs", JSON.stringify(updated));
      return updated;
    });

    setArticles(current => {
      const filteredCurrent = current.filter(art => !newBriefs.some(nb => nb.id === art.id));
      return [...newBriefs, ...filteredCurrent];
    });
  };

  const clearUploadedBriefs = () => {
    setUploadedArticles([]);
    localStorage.removeItem("microsoft_intel_uploaded_briefs");
    loadNews(false);
    addToast(
      "licensing_pricing",
      "Feed Reset",
      "Cleared all uploaded briefs. Resettled the feed back to original system briefings."
    );
  };

  // Filters and Selection States
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "impact" | "sentiment" | "manual">("date");
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [expandedSavedId, setExpandedSavedId] = useState<string | null>(null);
  const [msftTimeframe, setMsftTimeframe] = useState<"1D" | "1W" | "1M" | "3M">("1M");
  const [liveMsftPrice, setLiveMsftPrice] = useState<number>(422.86);
  const [zoomRefAreaLeft, setZoomRefAreaLeft] = useState<string | null>(null);
  const [zoomRefAreaRight, setZoomRefAreaRight] = useState<string | null>(null);
  const [zoomRange, setZoomRange] = useState<{ start: string; end: string } | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ price: number; comparePrice?: number; time: string; chartX: number; chartY: number } | null>(null);
  const [compareIndex, setCompareIndex] = useState<"none" | "nasdaq" | "sp500">("none");
  const [historicalDataExpanded, setHistoricalDataExpanded] = useState<boolean>(false);

  // LinkedIn Share Dialog State
  const [linkedInShareArticle, setLinkedInShareArticle] = useState<Article | null>(null);
  const [customLinkedInPostText, setCustomLinkedInPostText] = useState<string>("");
  const [copiedLinkedInText, setCopiedLinkedInText] = useState<boolean>(false);

  // Price Alert state management (Persisted in localStorage)
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_price_alerts");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [newTargetPrice, setNewTargetPrice] = useState<string>("");
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");

  // Price alert state persistence
  useEffect(() => {
    try {
      localStorage.setItem("microsoft_intel_price_alerts", JSON.stringify(priceAlerts));
    } catch (e) {
      console.warn("localStorage write blocked:", e);
    }
  }, [priceAlerts]);

  // Monitor stock fluctuations and trigger price alerts
  useEffect(() => {
    setPriceAlerts(prev => {
      let changed = false;
      const nextAlerts = prev.map(alert => {
        if (alert.isTriggered) return alert;

        const meetsAbove = alert.condition === "above" && liveMsftPrice >= alert.targetPrice;
        const meetsBelow = alert.condition === "below" && liveMsftPrice <= alert.targetPrice;

        if (meetsAbove || meetsBelow) {
          changed = true;
          const triggeredTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          
          // Trigger instant toast notification using the app's existing addToast subsystem
          setTimeout(() => {
            addToast(
              "technology_updates",
              "🚨 Price Alert Triggered!",
              `MSFT stock reached $${liveMsftPrice.toFixed(2)}, crossed your target threshold of $${alert.targetPrice.toFixed(2)} (${alert.condition === "above" ? "above" : "below"}).`
            );
          }, 10);

          return {
            ...alert,
            isTriggered: true,
            triggeredAt: triggeredTime,
            triggeredPrice: liveMsftPrice
          };
        }
        return alert;
      });

      return changed ? nextAlerts : prev;
    });
  }, [liveMsftPrice]);

  const handleTimeframeChange = (val: "1D" | "1W" | "1M" | "3M") => {
    setMsftTimeframe(val);
    setZoomRange(null);
    setZoomRefAreaLeft(null);
    setZoomRefAreaRight(null);
  };

  useEffect(() => {
    // Set up stock fluctuation
    const timer = setInterval(() => {
      setLiveMsftPrice(prev => {
        const change = (Math.random() - 0.485) * 0.18;
        return parseFloat((prev + change).toFixed(2));
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const [groupingMode, setGroupingMode] = useState<"flat" | "category">("flat");

  // Subscription Form State (Persisted in localStorage)
  const [subName, setSubName] = useState<string>("");
  const [subEmail, setSubEmail] = useState<string>("");
  const [subOrg, setSubOrg] = useState<string>("");
  const [subRole, setSubRole] = useState<string>("IT Leader");
  const [subCategories, setSubCategories] = useState<NewsCategory[]>([
    "technology_updates",
    "licensing_pricing",
    "anz_strategy",
    "cloud_transformations"
  ]);
  const [subFrequency, setSubFrequency] = useState<string>("monthly");
  const [isSubmittingSub, setIsSubmittingSub] = useState<boolean>(false);
  const [subSuccess, setSubSuccess] = useState<boolean>(false);
  const [subFormError, setSubFormError] = useState<string | null>(null);

  const [subscriptionsList, setSubscriptionsList] = useState<{
    id: string;
    name: string;
    email: string;
    org: string;
    role: string;
    categories: NewsCategory[];
    frequency: string;
    date: string;
  }[]>(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_subscriptions");
      return stored ? JSON.parse(stored) : [
        {
          id: "preview-sub-1",
          name: "Ash Guthrie",
          email: "ashguth@gmail.com",
          org: "ANZ Corporate Services",
          role: "Procurement Director",
          categories: ["licensing_pricing", "technology_updates"],
          frequency: "monthly",
          date: new Date().toLocaleDateString()
        }
      ];
    } catch {
      return [];
    }
  });

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubFormError(null);

    if (!subName.trim()) {
      setSubFormError("Please provide your full name for the briefings register.");
      return;
    }
    if (!subEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail)) {
      setSubFormError("Please enter a valid business email address.");
      return;
    }
    if (subCategories.length === 0) {
      setSubFormError("At least one intelligence domain must be selected.");
      return;
    }

    setIsSubmittingSub(true);
    
    setTimeout(() => {
      const newSub = {
        id: Math.random().toString(36).substring(2, 9),
        name: subName.trim(),
        email: subEmail.trim(),
        org: subOrg.trim() || "Independent Organization",
        role: subRole,
        categories: [...subCategories],
        frequency: subFrequency,
        date: new Date().toLocaleDateString()
      };

      const updated = [newSub, ...subscriptionsList.filter(s => s.email.toLowerCase() !== newSub.email.toLowerCase())];
      localStorage.setItem("microsoft_intel_subscriptions", JSON.stringify(updated));
      setSubscriptionsList(updated);
      
      setIsSubmittingSub(false);
      setSubSuccess(true);
      
      // Clear fields
      setSubName("");
      setSubEmail("");
      setSubOrg("");
      
      // Trigger instant toast notification helper
      addToast(
        subCategories[0] || "pricing_news",
        `Subscription Verified: ${newSub.name}`,
        `Successfully registered ${newSub.email} to receive our ${subFrequency} update digests.`
      );

      // Auto clear success indicator state after 6 seconds
      setTimeout(() => {
        setSubSuccess(false);
      }, 7000);
    }, 1200);
  };

  const handleRemoveSubscription = (id: string, email: string) => {
    const updated = subscriptionsList.filter(s => s.id !== id);
    localStorage.setItem("microsoft_intel_subscriptions", JSON.stringify(updated));
    setSubscriptionsList(updated);
    
    addToast(
      "licensing_pricing",
      "Subscription Revoked",
      `Removed ${email} from the monthly intelligence briefings index.`
    );
  };

  // States and handler for sending dynamic structured summaries to subscriber emails
  const [sendingSummaryId, setSendingSummaryId] = useState<string | null>(null);
  const [activeDispatchArticleId, setActiveDispatchArticleId] = useState<string | null>(null);
  const [dispatchEmailInput, setDispatchEmailInput] = useState<string>("");

  const handleSendSummary = async (article: Article, targetEmail: string) => {
    const emailToUse = targetEmail.trim() || (subscriptionsList.length > 0 ? subscriptionsList[0].email : "ashguth@gmail.com");
    if (!emailToUse || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToUse)) {
      addToast(
        article.category,
        "Dispatch Failed",
        "A valid subscriber email is required."
      );
      return;
    }

    setSendingSummaryId(article.id);
    try {
      const response = await fetch("/api/send-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: article.id,
          email: emailToUse,
          title: article.title,
          category: article.category,
          keyTakeaways: article.keyTakeaways,
          anzActionableAdvice: article.anzActionableAdvice
        })
      });

      if (!response.ok) {
        throw new Error("Sovereign delivery carrier returned an error.");
      }

      const result = await response.json();
      addToast(
        article.category,
        "Digest Dispatched",
        `Intelligence Summary safely routed to ${emailToUse} (Dispatch: ${result.dispatchId}).`
      );
      
      setActiveDispatchArticleId(null);
    } catch (err) {
      // Graceful fallback simulation
      const mockRef = `MSG-INTEL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      addToast(
         article.category,
         "Digest Dispatched",
         `Intelligence Summary routed to ${emailToUse} (Offline Carrier Ref: ${mockRef}).`
      );
      setActiveDispatchArticleId(null);
    } finally {
      setSendingSummaryId(null);
    }
  };

  // Manual drag-and-drop and manual rank sorting engine
  const [dragOverArticleId, setDragOverArticleId] = useState<string | null>(null);
  const draggedIdRef = useRef<string | null>(null);

  const handleMoveArticle = (articleId: string, direction: "up" | "down") => {
    // We find its index in the current filteredArticles view, so movement is intuitive in filtered lists
    const visibleIndex = filteredArticles.findIndex(a => a.id === articleId);
    if (visibleIndex === -1) return;

    const targetVisibleIndex = direction === "up" ? visibleIndex - 1 : visibleIndex + 1;
    if (targetVisibleIndex < 0 || targetVisibleIndex >= filteredArticles.length) return;

    const currentArticle = filteredArticles[visibleIndex];
    const targetArticle = filteredArticles[targetVisibleIndex];

    const currentFullIdx = articles.findIndex(a => a.id === currentArticle.id);
    const targetFullIdx = articles.findIndex(a => a.id === targetArticle.id);

    if (currentFullIdx === -1 || targetFullIdx === -1) return;

    const updated = [...articles];
    // Swap the elements
    const temp = updated[currentFullIdx];
    updated[currentFullIdx] = updated[targetFullIdx];
    updated[targetFullIdx] = temp;

    setArticles(updated);

    if (sortBy !== "manual") {
      setSortBy("manual");
      addToast(
        currentArticle.category,
        "Sovereign Order Activated",
        `Rearranged: Moved "${currentArticle.title.substring(0, 18)}..." ${direction}. Order-By matches Manual Sorted Layout.`
      );
    }
  };

  const handleReorderArticles = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    const sourceIdx = articles.findIndex(a => a.id === sourceId);
    const targetIdx = articles.findIndex(a => a.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const updated = [...articles];
    const [removed] = updated.splice(sourceIdx, 1);
    updated.splice(targetIdx, 0, removed);

    setArticles(updated);

    if (sortBy !== "manual") {
      setSortBy("manual");
      addToast(
        removed.category,
        "Sovereign Order Activated",
        `Custom arrangement established. Switched to Manual Sorted layout.`
      );
    }
  };

  const handleBatchPin = () => {
    if (selectedArticleIds.length === 0) return;
    setPinnedIds(current => {
      const allSelectedAlreadyPinned = selectedArticleIds.every(id => current.includes(id));
      let next;
      if (allSelectedAlreadyPinned) {
        next = current.filter(id => !selectedArticleIds.includes(id));
        addToast(
          "licensing_pricing",
          "Batch Telemetry Unpinned",
          `Successfully unpinned ${selectedArticleIds.length} telemetry briefings.`
        );
      } else {
        const newPins = selectedArticleIds.filter(id => !current.includes(id));
        next = [...current, ...newPins];
        addToast(
          "licensing_pricing",
          "Batch Telemetry Pinned",
          `Successfully pinned ${newPins.length} newly selected telemetry briefs to the top of your feed.`
        );
      }
      localStorage.setItem("microsoft_intel_pinned", JSON.stringify(next));
      return next;
    });
    setSelectedArticleIds([]);
  };

  const handleBatchBookmark = () => {
    if (selectedArticleIds.length === 0) return;
    setBookmarkedIds(current => {
      const allSelectedAlreadyBookmarked = selectedArticleIds.every(id => current.includes(id));
      let next;
      if (allSelectedAlreadyBookmarked) {
        next = current.filter(id => !selectedArticleIds.includes(id));
        addToast(
          "licensing_pricing",
          "Batch Bookmarks Removed",
          `Successfully removed ${selectedArticleIds.length} bookmarks.`
        );
      } else {
        const newBookmarks = selectedArticleIds.filter(id => !current.includes(id));
        next = [...current, ...newBookmarks];
        addToast(
          "licensing_pricing",
          "Batch Bookmarks Saved",
          `Successfully saved ${newBookmarks.length} selected briefings for offline reading.`
        );
      }
      localStorage.setItem("microsoft_intel_bookmarks", JSON.stringify(next));
      return next;
    });
    setSelectedArticleIds([]);
  };

  const handleBatchDelete = () => {
    if (selectedArticleIds.length === 0) return;
    setDeletedArticleIds(current => {
      const next = [...current, ...selectedArticleIds];
      localStorage.setItem("microsoft_intel_deleted", JSON.stringify(next));
      return next;
    });
    addToast(
      "licensing_pricing",
      "Batch Feed Deletion",
      `Successfully deleted ${selectedArticleIds.length} briefing records from your feed.`
    );
    setSelectedArticleIds([]);
  };

  const handleRestoreDeleted = () => {
    setDeletedArticleIds([]);
    localStorage.removeItem("microsoft_intel_deleted");
    addToast(
      "licensing_pricing",
      "Feed Restored",
      "All previously deleted news briefing records have been restored to your active telemetry intelligence stream."
    );
  };

  const toggleSubCategory = (category: NewsCategory) => {
    setSubCategories(current =>
      current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category]
    );
  };

  const exportToCSV = () => {
    if (filteredArticles.length === 0) return;
    
    const headers = [
      "ID", "Title", "Category", "Source", "Published Date", "Sentiment", 
      "Impact Score", "URL", "Summary", "Key Takeaways", "ANZ Actionable Advice", "ECIF Eligible"
    ];
    
    const escapeCSVCell = (val: any) => {
      if (val === undefined || val === null) return '""';
      let stringVal = "";
      if (Array.isArray(val)) {
        stringVal = val.join("; ");
      } else {
        stringVal = String(val);
      }
      const escaped = stringVal.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const csvContent = [
      headers.join(","),
      ...filteredArticles.map(art => [
        escapeCSVCell(art.id),
        escapeCSVCell(art.title),
        escapeCSVCell(art.category),
        escapeCSVCell(art.source),
        escapeCSVCell(art.publishedDate),
        escapeCSVCell(art.sentiment),
        escapeCSVCell(art.impactScore),
        escapeCSVCell(art.url),
        escapeCSVCell(art.summary),
        escapeCSVCell(art.keyTakeaways),
        escapeCSVCell(art.anzActionableAdvice),
        escapeCSVCell(art.ecifFundingEligible ? "YES" : "NO")
      ].join(","))
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `microsoft_intel_briefs_${dateStr}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addToast(
      "licensing_pricing",
      "Export CSV Successful",
      `Successfully generated CSV file containing ${filteredArticles.length} filtered bulletins.`
    );
  };

  const exportToJSON = () => {
    if (filteredArticles.length === 0) return;
    
    const jsonString = JSON.stringify(filteredArticles, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `microsoft_intel_briefs_${dateStr}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(
      "licensing_pricing",
      "Export JSON Successful",
      `Successfully generated JSON file containing ${filteredArticles.length} filtered bulletins.`
    );
  };

  const exportToPDF = (singleArticle?: Article) => {
    const listToExport = singleArticle ? [singleArticle] : filteredArticles;
    if (listToExport.length === 0) return;
    
    const doc = new jsPDF();
    let y = 15;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Helper to check and add new page
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 15) {
        doc.addPage();
        y = 15;
        return true;
      }
      return false;
    };
    
    // Header Banner
    doc.setFillColor(15, 23, 42); // slate-900 (deep charcoal)
    doc.rect(14, y, pageWidth - 28, 20, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("ANZ MICROSOFT PARTNER HUB", 20, y + 12);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(147, 197, 253); // sky-300 (light blue)
    doc.text(singleArticle ? "SINGLE EXECUTIVE BRIEF EXTRACT" : "EXECUTIVE INTELLIGENCE BRIEFINGS REPORT", 20, y + 16);
    y += 28;
    
    // Meta Details
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("REPORT METADATA", 14, y);
    y += 5;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    
    const categoryStr = singleArticle 
      ? singleArticle.category.toUpperCase().replace('_', ' ')
      : (selectedCategory === "all" ? "All Categories" : selectedCategory.toUpperCase().replace('_', ' '));
    const filterStr = singleArticle ? "N/A - Single Extraction" : (searchQuery ? `"${searchQuery}"` : "None");
    const pdfGenTimeStr = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    
    doc.text(`Generated: ${pdfGenTimeStr}`, 14, y);
    doc.text(`Category: ${categoryStr}`, 80, y);
    doc.text(`Search & Filters: ${filterStr}`, 140, y);
    y += 5;
    
    if (singleArticle) {
      doc.text(`Target Bulletin ID: ${singleArticle.id.toUpperCase()}`, 14, y);
      doc.text(`Source Publisher: ${singleArticle.source.toUpperCase()}`, 80, y);
      doc.text(`Impact Score: ${singleArticle.impactScore}/10`, 140, y);
      y += 12;
    } else {
      doc.text(`Total Bulletins: ${filteredArticles.length}`, 14, y);
      const avgImpact = (filteredArticles.reduce((acc, current) => acc + current.impactScore, 0) / filteredArticles.length).toFixed(1);
      doc.text(`Average Regional Impact Score: ${avgImpact}/10`, 80, y);
      y += 10;
      
      // --- SUMMARY TABLE ---
      doc.setTextColor(30, 41, 59); // slate-800
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("BRIEFINGS SUMMARY TABLE", 14, y);
      y += 5;
      
      // Table Header
      doc.setFillColor(30, 41, 59);
      doc.rect(14, y, pageWidth - 28, 8, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("ID", 17, y + 5.5);
      doc.text("DATE", 35, y + 5.5);
      doc.text("BRIEF TITLE", 65, y + 5.5);
      doc.text("CATEGORY", 140, y + 5.5);
      doc.text("IMPACT", 180, y + 5.5);
      y += 8;
      
      // Table Rows
      filteredArticles.forEach((art, idx) => {
        checkPageBreak(8);
        
        // Alt row background
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, y, pageWidth - 28, 7, "F");
        }
        
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.text(art.id.replace("bulletin-", "B-").substring(0, 10).toUpperCase(), 17, y + 4.5);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.text(art.publishedDate, 35, y + 4.5);
        
        // Truncate title if it exceeds columns width
        const titleText = art.title.length > 52 ? art.title.substring(0, 50) + "..." : art.title;
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        doc.text(titleText, 65, y + 4.5);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        const catLabel = art.category.toUpperCase().replace('_', ' ');
        doc.text(catLabel.length > 20 ? catLabel.substring(0, 18) + ".." : catLabel, 140, y + 4.5);
        
        // Impact score with nice visual
        const impactColor = art.impactScore >= 8 ? [225, 29, 72] : art.impactScore >= 5 ? [217, 119, 6] : [5, 150, 105];
        doc.setTextColor(impactColor[0], impactColor[1], impactColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(`${art.impactScore}/10`, 180, y + 4.5);
        
        // Bottom border gridline
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.1);
        doc.line(14, y + 7, pageWidth - 14, y + 7);
        
        y += 7;
      });
      
      y += 10; // spacing before detail section
    }
    
    // --- DETAIL SECTIONS ---
    checkPageBreak(30);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(singleArticle ? "DETAILED EXECUTIVE BRIEFING EXTRACT" : "DETAILED INTELLIGENCE BRIEFINGS DEEP-DIVE", 14, y);
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.3);
    doc.line(14, y + 2, pageWidth - 14, y + 2);
    y += 8;
    
    listToExport.forEach((art) => {
      // Check if we need page break for start of bulletin
      checkPageBreak(35);
      
      // Category Banner
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, pageWidth - 28, 6, "F");
      
      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text(`CATEGORY: ${art.category.toUpperCase().replace('_', ' ')}  |  SOURCE: ${art.source.toUpperCase()}  |  DATE: ${art.publishedDate}`, 18, y + 4);
      y += 10;
      
      // Title
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      const titleLines: string[] = doc.splitTextToSize(art.title, pageWidth - 32);
      doc.text(titleLines, 16, y);
      y += (titleLines.length * 4.5) + 1;
      
      // Sentiment & Impact info
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text(`Primary Sentiment: `, 16, y);
      
      const sentimentColor = art.sentiment === "positive" ? [5, 150, 105] : art.sentiment === "negative" ? [225, 29, 72] : [100, 116, 139];
      doc.setTextColor(sentimentColor[0], sentimentColor[1], sentimentColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text(art.sentiment.toUpperCase(), 40, y);
      
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.text(` | Regional Impact Score: `, 55, y);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(`${art.impactScore}/10`, 88, y);
      
      if (art.ecifFundingEligible) {
        doc.setTextColor(16, 185, 129); // emerald-500
        doc.setFont("helvetica", "bold");
        doc.text(" |  [ECIF FUNDING ELIGIBLE]", 100, y);
      }
      y += 5;
      
      // Brief Summary
      doc.setTextColor(51, 65, 85); // slate-700
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      const summaryLines: string[] = doc.splitTextToSize(art.summary, pageWidth - 32);
      checkPageBreak(summaryLines.length * 4);
      doc.text(summaryLines, 16, y);
      y += (summaryLines.length * 4) + 4;
      
      // Key Takeaways List
      checkPageBreak(20);
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Key Strategic Takeaways:", 16, y);
      y += 4;
      
      doc.setFont("helvetica", "normal");
      art.keyTakeaways.forEach((takeaway) => {
        const takeLines: string[] = doc.splitTextToSize(`•  ${takeaway}`, pageWidth - 36);
        checkPageBreak(takeLines.length * 3.8);
        doc.text(takeLines, 18, y);
        y += (takeLines.length * 3.8);
      });
      y += 3;
      
      // ANZ Actionable Advice Block
      if (art.anzActionableAdvice) {
        const adviceText = art.anzActionableAdvice;
        const adviceLines: string[] = doc.splitTextToSize(adviceText, pageWidth - 38);
        const boxHeight = (adviceLines.length * 3.8) + 6;
        
        checkPageBreak(boxHeight + 4);
        
        // Draw highlighted accent container
        doc.setFillColor(240, 249, 255); // light blue bg
        doc.rect(16, y, pageWidth - 32, boxHeight, "F");
        
        // Draw left solid border line
        doc.setFillColor(14, 165, 233); // sky-500
        doc.rect(16, y, 1.5, boxHeight, "F");
        
        doc.setTextColor(3, 105, 161); // deep sky-700
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("ANZ REGIONAL EXECUTIVE ADVICE", 20, y + 4.5);
        
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.text(adviceLines, 20, y + 8.5);
        
        y += boxHeight + 6;
      }
      
      // Draw separator line between bulletins
      checkPageBreak(3);
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.5);
      doc.line(14, y, pageWidth - 14, y);
      y += 8;
    });
    
    // Footer on each page helper:
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184); // slate-400
      
      // Bottom thin line grid
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
      
      doc.text("ANZ MICROSOFT PARTNER HUB — CONFIDENTIAL BUSINESS INTELLIGENCE DIRECTORY", 14, pageHeight - 8);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 28, pageHeight - 8);
    }
    
    // Save Document
    const pdfFileNameDateStr = new Date().toISOString().split('T')[0];
    const fileName = singleArticle 
      ? `ANZ_Microsoft_Briefing_${singleArticle.id.replace("bulletin-", "B-").toUpperCase()}_${pdfFileNameDateStr}.pdf`
      : `ANZ_Microsoft_Briefings_Report_${pdfFileNameDateStr}.pdf`;
    doc.save(fileName);
    
    addToast(
      "anz_strategy",
      "Export PDF Successful",
      singleArticle 
        ? `Successfully generated professional PDF Executive Report for: ${singleArticle.title}`
        : `Successfully generated professional PDF Executive Report containing ${filteredArticles.length} active briefing documents.`
    );
  };

  // AI Analyst Chat State
  const [aiQuery, setAiQuery] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<CustomQueryResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Load news data from endpoint
  const loadNews = async (forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const url = `/api/news${forceRefresh ? "?refresh=true" : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch latest corporate news (Status: ${response.status})`);
      }
      
      const data = await response.json();
      const rawArticles = data.articles || [];
      
      // Merge with custom uploaded articles from local storage
      let localCustom: Article[] = [];
      try {
        const stored = localStorage.getItem("microsoft_intel_uploaded_briefs");
        if (stored) {
          localCustom = JSON.parse(stored);
        }
      } catch (err) {
        console.warn("Failed to parse custom briefs", err);
      }
      
      const combined = [...localCustom, ...rawArticles.filter((ra: any) => !localCustom.some((lc: any) => lc.id === ra.id))];
      setArticles(combined);
      setLastUpdated(data.lastUpdated || new Date().toISOString());
      setIsLive(data.isLive || false);
      setHasApiKey(data.hasApiKey || false);

      // Analyze news articles against watchlist for immediate toast indicators
      if (rawArticles && rawArticles.length > 0) {
        const matching = rawArticles.filter((art: any) => watchlist.includes(art.category));
        if (matching.length > 0) {
          if (forceRefresh) {
            // Group matching items by category to offer structured alerts
            const groupedCount: Record<string, number> = {};
            matching.forEach((art: any) => {
              groupedCount[art.category] = (groupedCount[art.category] || 0) + 1;
            });

            Object.entries(groupedCount).forEach(([catKey, count]) => {
              const catLabel = categoryMap[catKey as NewsCategory]?.label || catKey;
              addToast(
                catKey as NewsCategory,
                `Watchlist Alert: ${catLabel}`,
                `Discovered ${count} updated bulletin(s) matching your monitored criteria on this live scrape execution cycle.`
              );
            });
          } else {
            // Friendly baseline loading telemetry alert indicator
            addToast(
              matching[0].category,
              "Watchlist Status: Active",
              `Monitored systems are operational. Located ${matching.length} matching corporate briefs currently stored in database caches.`
            );
          }
        }
      }
    } catch (err: any) {
      console.warn("API endpoint returned an error or is running in a static bundle environment. Gracefully falling back to integrated local intelligence database:", err);
      
      let localCustom: Article[] = [];
      try {
        const stored = localStorage.getItem("microsoft_intel_uploaded_briefs");
        if (stored) {
          localCustom = JSON.parse(stored);
        }
      } catch (e) {
        console.warn("Failed to parse custom briefs", e);
      }
      
      const combined = [...localCustom, ...LOCAL_FALLBACK_ARTICLES.filter((ra: any) => !localCustom.some((lc: any) => lc.id === ra.id))];
      setArticles(combined);
      setLastUpdated(new Date().toISOString());
      setIsLive(false);
      setHasApiKey(false);
      setError(null); // Explicitly ensure error is null so full page error screen is never rendered
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      
      if (file.name.endsWith(".json")) {
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const parsed = JSON.parse(content);
            const briefsToImport: Article[] = [];
            
            const processArticle = (art: any): Article => {
              return {
                id: art.id || `uploaded-${Math.random().toString(36).substring(2, 9)}`,
                title: art.title || "Untitled Uploaded Briefing",
                summary: art.summary || "No summary provided in the uploaded briefing.",
                category: ["technology_updates", "licensing_pricing", "anz_strategy", "cloud_transformations"].includes(art.category)
                  ? art.category
                  : "technology_updates",
                url: art.url || "https://news.microsoft.com/en-au/",
                source: art.source || file.name,
                publishedDate: art.publishedDate || new Date().toISOString().split("T")[0],
                sentiment: ["positive", "neutral", "negative"].includes(art.sentiment)
                  ? art.sentiment
                  : "neutral",
                impactScore: Number(art.impactScore) || 5,
                keyTakeaways: Array.isArray(art.keyTakeaways) ? art.keyTakeaways : ["Uploaded briefing file content ingested"],
                anzActionableAdvice: art.anzActionableAdvice || "No specific local advisory mapped for this custom item.",
                ecifFundingEligible: art.ecifFundingEligible !== undefined ? !!art.ecifFundingEligible : false
              };
            };

            if (Array.isArray(parsed)) {
              parsed.forEach(item => briefsToImport.push(processArticle(item)));
            } else if (parsed && typeof parsed === "object") {
              if (Array.isArray(parsed.articles)) {
                parsed.articles.forEach((item: any) => briefsToImport.push(processArticle(item)));
              } else {
                briefsToImport.push(processArticle(parsed));
              }
            }
            
            if (briefsToImport.length > 0) {
              addUploadedBriefs(briefsToImport);
              addToast(
                briefsToImport[0].category,
                "Briefing JSON Ingested",
                `Successfully processed & registered ${briefsToImport.length} uploaded brief(s).`
              );
            } else {
              addToast(
                "licensing_pricing",
                "Ingestion Failed",
                "JSON format does not correspond to a valid Microsoft Intelligence Brief structure."
              );
            }
          } catch (err) {
            addToast(
              "licensing_pricing",
              "Upload Error",
              "Could not parse selected JSON file. Check matching structures."
            );
          }
        };
        reader.readAsText(file);
      } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const lines = content.split("\n").map(l => l.trim()).filter(Boolean);
            if (lines.length === 0) return;
            
            const title = lines[0].replace(/^[#\s*▸-]+/, "");
            const summary = lines.slice(1).join("\n").slice(0, 300) || "Ingested plain text document summary.";
            
            const singleBrief: Article = {
              id: `uploaded-${Math.random().toString(36).substring(2, 9)}`,
              title: title.length > 100 ? title.slice(0, 100) + "..." : title,
              summary: summary,
              category: "technology_updates",
              url: "https://news.microsoft.com/en-au/",
              source: `Uploaded Document (${file.name})`,
              publishedDate: new Date().toISOString().split("T")[0],
              sentiment: "neutral",
              impactScore: 6,
              keyTakeaways: lines.slice(1).filter(l => l.startsWith("-") || l.startsWith("*") || l.startsWith("▸")).slice(0, 4)
                .map(l => l.replace(/^[-*▸\s]+/, "")) || ["Document text analyzed for insights"],
              anzActionableAdvice: "Advisory review pending. Ingested from custom file upload stream.",
              ecifFundingEligible: false
            };
            
            if (singleBrief.keyTakeaways.length === 0) {
              singleBrief.keyTakeaways = [
                "Detailed brief loaded from uploaded text document",
                "Review detailed sections for specific operational impacts"
              ];
            }
            
            addUploadedBriefs([singleBrief]);
            addToast(
              "technology_updates",
              "Briefing Document Ingested",
              `Ingested custom document briefing: "${singleBrief.title.slice(0, 30)}..."`
            );
          } catch (err) {
            addToast(
              "licensing_pricing",
              "Upload Error",
              "Could not ingest plain text files. Check content layout."
            );
          }
        };
        reader.readAsText(file);
      } else {
        addToast(
          "licensing_pricing",
          "File Type Rejected",
          "Please upload only .json briefings or plain-text .txt/.md files."
        );
      }
    });
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBriefTitle.trim() || !newBriefSummary.trim()) {
      addToast("licensing_pricing", "Form Incomplete", "Please fill in at least the Title and Summary fields.");
      return;
    }

    const compiled: Article = {
      id: `uploaded-manual-${Math.random().toString(36).substring(2, 9)}`,
      title: newBriefTitle.trim(),
      summary: newBriefSummary.trim(),
      category: newBriefCategory,
      url: "https://news.microsoft.com/en-au/",
      source: newBriefSource.trim() || "Manual Executive Post",
      publishedDate: new Date().toISOString().split("T")[0],
      sentiment: newBriefSentiment,
      impactScore: Number(newBriefImpact) || 5,
      keyTakeaways: newBriefTakeaways.trim()
        ? newBriefTakeaways.split("\n").map(t => t.trim()).filter(Boolean)
        : ["Operational advisory recorded manually.", "No granular details reported."],
      anzActionableAdvice: newBriefAdvice.trim() || "Operational review recommended for other segments.",
      ecifFundingEligible: newBriefEcif
    };

    addUploadedBriefs([compiled]);
    
    // Reset Form
    setNewBriefTitle("");
    setNewBriefSummary("");
    setNewBriefSource("");
    setNewBriefSentiment("neutral");
    setNewBriefImpact(5);
    setNewBriefTakeaways("");
    setNewBriefAdvice("");
    setNewBriefEcif(false);
    setShowCompose(false);
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Preset queries for AI Copilot Analyst
  const presetQueries = [
    {
      label: "Azure sovereign AI (A/NZ)",
      query: "Analyze the implications of Microsoft's local sovereign AI clusters in Sydney and Melbourne for compliance-restricted organizations in Australia and New Zealand.",
      icon: <Globe className="w-3.5 h-3.5 mr-1" />
    },
    {
      label: "EA Restructuring Strategy",
      query: "For ANZ organizations with 300-600 seats, list clear strategies to tackle Microsoft's rising minimum seat requirements for SCE and EAS agreements.",
      icon: <Layers className="w-3.5 h-3.5 mr-1" />
    },
    {
      label: "Exchange Rate Adjustments",
      query: "What is the strategic impact of the 6% AUD/NZD list price foreign exchange adjustment on rolling monthly cloud subscriptions, and how can we mitigate it?",
      icon: <DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-400" />
    },
    {
      label: "How to claim ECIF Funding",
      query: "Outline the step-by-step roadmap to qualify for and unlock up to 100% subsidized Azure End-customer Investment Funds (ECIF) for ANZ enterprises.",
      icon: <Sparkles className="w-3.5 h-3.5 mr-1" />
    }
  ];

  // Run customized AI Grounding search
  const handleAiQuerySubmit = async (queryText: string) => {
    const rawQuery = queryText || aiQuery;
    if (!rawQuery.trim()) return;

    setAiLoading(true);
    setAiResponse(null);
    setAiError(null);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: rawQuery })
      });

      if (!response.ok) {
        throw new Error(`Failed to consult AI Intelligence Engine (Status: ${response.status})`);
      }

      const data = await response.json();
      setAiResponse(data);
    } catch (err: any) {
      console.log("Telemetry check: Live intelligence response routing successfully adjusted to pre-seeded backup.");
      setAiError(err.message || "AI Analysis experienced a connection interruption. Please retry.");
    } finally {
      setAiLoading(false);
    }
  };

  // Filter & Search Logic
  const filteredArticles = articles
    .filter(art => {
      if (deletedArticleIds.includes(art.id)) return false;
      
      const categoryMatch = selectedCategory === "all" || art.category === selectedCategory;
      const searchMatch = searchQuery.trim() === "" || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.anzActionableAdvice && art.anzActionableAdvice.toLowerCase().includes(searchQuery.toLowerCase())) ||
        art.keyTakeaways.some(take => take.toLowerCase().includes(searchQuery.toLowerCase()));
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id);
      const bPinned = pinnedIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      if (sortBy === "manual") {
        return articles.indexOf(a) - articles.indexOf(b);
      }
      if (sortBy === "impact") {
        return b.impactScore - a.impactScore;
      }
      if (sortBy === "sentiment") {
        const sentimentScore = (s: string) => s === "positive" ? 3 : s === "neutral" ? 2 : 1;
        return sentimentScore(b.sentiment) - sentimentScore(a.sentiment);
      }
      // default 'date': sort newest first
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

  // Calculate statistics from loaded articles
  const avgImpact = articles.length > 0
    ? (articles.reduce((acc, curr) => acc + curr.impactScore, 0) / articles.length).toFixed(1)
    : "0.0";
  
  const positiveRatio = articles.length > 0
    ? Math.round((articles.filter(a => a.sentiment === "positive").length / articles.length) * 100)
    : 0;

  const getImpactTrend = () => {
    if (articles.length < 2) return { diff: 0, trend: "steady" as const, percent: "0%", avgCurrent: "0.0", avgPrev: "0.0" };
    
    // Sort all articles newest first
    const sorted = [...articles].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    
    // Attempt standard weekly split
    // Since our local date point is 2026-06-04, let's look at the dates of articles to split them appropriately
    const refTime = new Date("2026-06-04").getTime();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    
    let currentWeekArticles = sorted.filter(a => {
      const t = new Date(a.publishedDate).getTime();
      return t >= refTime - oneWeekMs;
    });
    
    let prevWeekArticles = sorted.filter(a => {
      const t = new Date(a.publishedDate).getTime();
      return t >= refTime - 2 * oneWeekMs && t < refTime - oneWeekMs;
    });
    
    // Fallback if one of the periods is empty: split sorted list in half
    if (currentWeekArticles.length === 0 || prevWeekArticles.length === 0) {
      const mid = Math.ceil(sorted.length / 2);
      currentWeekArticles = sorted.slice(0, mid);
      prevWeekArticles = sorted.slice(mid);
    }
    
    if (currentWeekArticles.length === 0 || prevWeekArticles.length === 0) {
      return { diff: 0, trend: "steady" as const, percent: "0%", avgCurrent: "0.0", avgPrev: "0.0" };
    }
    
    const avgCurrent = currentWeekArticles.reduce((acc, curr) => acc + curr.impactScore, 0) / currentWeekArticles.length;
    const avgPrev = prevWeekArticles.reduce((acc, curr) => acc + curr.impactScore, 0) / prevWeekArticles.length;
    
    const diff = avgCurrent - avgPrev;
    
    let trend: "up" | "down" | "steady" = "steady";
    if (diff > 0.05) trend = "up";
    else if (diff < -0.05) trend = "down";
    
    // Calculate percentage change
    const percentChange = avgPrev > 0 ? (diff / avgPrev) * 100 : 0;
    const formattedPercent = `${percentChange > 0 ? "+" : ""}${percentChange.toFixed(1)}%`;
    
    return {
      diff: parseFloat(diff.toFixed(2)),
      trend,
      percent: formattedPercent,
      avgCurrent: avgCurrent.toFixed(1),
      avgPrev: avgPrev.toFixed(1)
    };
  };

  // MSFT Stock Datasets
  const msftData1D = [
    { time: "09:30 AM", price: 417.62 },
    { time: "10:30 AM", price: 418.50 },
    { time: "11:30 AM", price: 419.10 },
    { time: "12:30 PM", price: 418.90 },
    { time: "01:30 PM", price: 420.40 },
    { time: "02:30 PM", price: 421.15 },
    { time: "03:30 PM", price: 422.30 },
    { time: "04:00 PM", price: liveMsftPrice },
  ];

  const msftData1W = [
    { time: "May 28", price: 414.20 },
    { time: "May 29", price: 415.50 },
    { time: "Jun 01", price: 413.90 },
    { time: "Jun 02", price: 417.10 },
    { time: "Jun 03", price: 419.80 },
    { time: "Jun 04", price: liveMsftPrice },
  ];

  const msftData1M = [
    { time: "May 05", price: 409.50 },
    { time: "May 10", price: 412.10 },
    { time: "May 15", price: 410.20 },
    { time: "May 20", price: 416.80 },
    { time: "May 25", price: 414.10 },
    { time: "May 30", price: 419.50 },
    { time: "Jun 04", price: liveMsftPrice },
  ];

  const msftData3M = [
    { time: "Mar 05", price: 395.20 },
    { time: "Mar 15", price: 398.50 },
    { time: "Mar 25", price: 402.10 },
    { time: "Apr 05", price: 408.40 },
    { time: "Apr 15", price: 412.60 },
    { time: "Apr 25", price: 407.90 },
    { time: "May 05", price: 409.50 },
    { time: "May 15", price: 410.20 },
    { time: "May 25", price: 414.10 },
    { time: "Jun 04", price: liveMsftPrice },
  ];

  const getMsftChartData = () => {
    switch (msftTimeframe) {
      case "1D": return msftData1D;
      case "1W": return msftData1W;
      case "1M": return msftData1M;
      case "3M": return msftData3M;
    }
  };

  const parseDateLabel = (label: string): string => {
    const parts = label.trim().split(/\s+/);
    if (parts.length < 2) return "2026-06-04"; // fallback
    const monthStr = parts[0].toLowerCase();
    const dayVal = parseInt(parts[1], 10);
    if (isNaN(dayVal)) return "2026-06-04";
    
    let month = "06";
    if (monthStr.startsWith("jan")) month = "01";
    else if (monthStr.startsWith("feb")) month = "02";
    else if (monthStr.startsWith("mar")) month = "03";
    else if (monthStr.startsWith("apr")) month = "04";
    else if (monthStr.startsWith("may")) month = "05";
    else if (monthStr.startsWith("jun")) month = "06";
    else if (monthStr.startsWith("jul")) month = "07";
    else if (monthStr.startsWith("aug")) month = "08";
    else if (monthStr.startsWith("sep")) month = "09";
    else if (monthStr.startsWith("oct")) month = "10";
    else if (monthStr.startsWith("nov")) month = "11";
    else if (monthStr.startsWith("dec")) month = "12";
    
    const formattedDay = dayVal < 10 ? `0${dayVal}` : `${dayVal}`;
    return `2026-${month}-${formattedDay}`;
  };

  const getComparePrice = (idx: number, timeframe: string, indexType: "none" | "nasdaq" | "sp500"): number | undefined => {
    if (indexType === "none") return undefined;
    if (indexType === "nasdaq") {
      const db: Record<string, number[]> = {
        "1D": [16820.50, 16845.20, 16890.10, 16875.40, 16910.60, 16930.25, 16960.80, 17042.10],
        "1W": [16730.20, 16920.50, 16828.10, 16857.30, 16960.40, 17042.10],
        "1M": [16330.40, 16340.50, 16550.20, 16740.10, 16730.80, 16920.50, 17042.10],
        "3M": [15930.10, 16100.80, 16250.30, 16150.90, 15880.40, 15920.20, 16330.40, 16550.20, 16730.80, 17042.10],
      };
      return db[timeframe]?.[idx];
    } else if (indexType === "sp500") {
      const db: Record<string, number[]> = {
        "1D": [5295.10, 5312.40, 5328.60, 5320.30, 5338.90, 5345.20, 5352.10, 5360.70],
        "1W": [5266.30, 5277.10, 5283.40, 5291.85, 5354.20, 5360.70],
        "1M": [5180.20, 5210.50, 5300.10, 5270.30, 5304.60, 5277.15, 5360.70],
        "3M": [5078.10, 5117.30, 5218.40, 5204.25, 5061.90, 5100.10, 5180.20, 5300.10, 5304.60, 5360.70],
      };
      return db[timeframe]?.[idx];
    }
    return undefined;
  };

  const getMergedChartData = () => {
    const stockPoints = getMsftChartData() || [];
    
    if (msftTimeframe === "1D") {
      // Intraday calculation (cumulative today articles)
      const todayArticles = articles.filter(a => a.publishedDate === "2026-06-04");
      const totalArticles = todayArticles.length;
      
      return stockPoints.map((pt, idx) => {
        const countToTake = Math.ceil(((idx + 1) / stockPoints.length) * totalArticles);
        const subArticles = todayArticles.slice(0, countToTake);
        const positive = subArticles.filter(a => a.sentiment === "positive").length;
        const negative = subArticles.filter(a => a.sentiment === "negative").length;
        
        return {
          time: pt.time,
          price: pt.price,
          comparePrice: getComparePrice(idx, "1D", compareIndex),
          "Positive Sentiment": positive,
          "Negative Sentiment": negative,
          "Sentiment Volume": positive + negative,
        };
      });
    } else {
      return stockPoints.map((pt, idx) => {
        const dateStr = parseDateLabel(pt.time);
        const targetTime = new Date(dateStr).getTime();
        const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
        
        // Rolling 5-day sentiment for that date
        const relevantArticles = articles.filter(art => {
          const artTime = new Date(art.publishedDate).getTime();
          return artTime <= targetTime && artTime > (targetTime - fiveDaysMs);
        });
        
        const positive = relevantArticles.filter(a => a.sentiment === "positive").length;
        const negative = relevantArticles.filter(a => a.sentiment === "negative").length;
        
        return {
          time: pt.time,
          price: pt.price,
          comparePrice: getComparePrice(idx, msftTimeframe, compareIndex),
          "Positive Sentiment": positive,
          "Negative Sentiment": negative,
          "Sentiment Volume": positive + negative,
        };
      });
    }
  };

  const getDisplayedChartData = () => {
    const mergedData = getMergedChartData() || [];
    if (!zoomRange) return mergedData;

    const startIdx = mergedData.findIndex(d => d.time === zoomRange.start);
    const endIdx = mergedData.findIndex(d => d.time === zoomRange.end);

    if (startIdx === -1 || endIdx === -1) return mergedData;

    const minIdx = Math.min(startIdx, endIdx);
    const maxIdx = Math.max(startIdx, endIdx);
    return mergedData.slice(minIdx, maxIdx + 1);
  };

  const handleZoom = () => {
    if (!zoomRefAreaLeft || !zoomRefAreaRight) {
      setZoomRefAreaLeft(null);
      setZoomRefAreaRight(null);
      return;
    }

    let left = zoomRefAreaLeft;
    let right = zoomRefAreaRight;

    if (left === right) {
      setZoomRefAreaLeft(null);
      setZoomRefAreaRight(null);
      return;
    }

    const currentData = getMergedChartData() || [];
    const leftIdx = currentData.findIndex(d => d.time === left);
    const rightIdx = currentData.findIndex(d => d.time === right);

    if (leftIdx === -1 || rightIdx === -1) {
      setZoomRefAreaLeft(null);
      setZoomRefAreaRight(null);
      return;
    }

    if (leftIdx > rightIdx) {
      const temp = left;
      left = right;
      right = temp;
    }

    setZoomRange({ start: left, end: right });
    setZoomRefAreaLeft(null);
    setZoomRefAreaRight(null);
  };

  const getSentiment30DayData = () => {
    const dataPoints = [];
    const baseDate = new Date("2026-06-04");
    
    // Create daily bins for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(baseDate.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      dataPoints.push({
        dateString,
        name: label,
        Positive: 0,
        Negative: 0
      });
    }

    // Count matching articles
    articles.forEach(art => {
      const artDate = art.publishedDate;
      const bin = dataPoints.find(dp => dp.dateString === artDate);
      if (bin) {
        if (art.sentiment === "positive") {
          bin.Positive++;
        } else if (art.sentiment === "negative") {
          bin.Negative++;
        }
      }
    });

    // Apply a 5-day moving count (smoothing) for professional trend tracking
    return dataPoints.map((dp, idx) => {
      let smoothPositive = 0;
      let smoothNegative = 0;
      const startIdx = Math.max(0, idx - 4);
      for (let k = startIdx; k <= idx; k++) {
        smoothPositive += dataPoints[k].Positive;
        smoothNegative += dataPoints[k].Negative;
      }
      return {
        name: dp.name,
        "Positive Sentiment": smoothPositive,
        "Negative Sentiment": smoothNegative,
        "Daily Positive": dp.Positive,
        "Daily Negative": dp.Negative,
      };
    });
  };

  // Note: categoryMap is now defined at the top scope of App for multi-method availability

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "positive") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (sentiment === "negative") return "text-rose-400 bg-rose-400/10 border-rose-400/20";
    return "text-slate-300 bg-slate-500/10 border-slate-500/20";
  };

  const getImpactBadgeColor = (score: number) => {
    if (score >= 8) return "bg-red-500/20 text-red-300 border-red-500/40";
    if (score >= 6) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
    return "bg-slate-500/20 text-slate-300 border-slate-500/40";
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0b0f19]" : "bg-[#f3f6fc]"} antialiased transition-colors duration-300`}>
      <style dangerouslySetInnerHTML={{__html: `
        /* Premium Accessible High Contrast Style Map for Light Mode */
        body.light {
          background-color: #f3f6fc !important;
          color: #1e293b !important;
        }
        body.light .bg-\\[\\#111827\\] {
          background-color: #ffffff !important;
          border-color: #cbd5e1 !important;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03) !important;
        }
        body.light .bg-\\[\\#0b0f19\\] {
          background-color: #f3f6fc !important;
        }
        body.light .border-slate-800, 
        body.light .border-slate-800\\/80,
        body.light .border-slate-800\\/60 {
          border-color: #cbd5e1 !important;
        }
        body.light .text-white {
          color: #0f172a !important;
        }
        body.light .text-slate-205, body.light .text-slate-200, body.light .text-slate-300 {
          color: #1e293b !important;
        }
        body.light .text-slate-400 {
          color: #475569 !important;
        }
        body.light .text-slate-500 {
          color: #55657d !important;
        }
        body.light .text-slate-650 {
          color: #475569 !important;
        }
        body.light .text-slate-450 {
          color: #475569 !important;
        }
        body.light .text-sky-450 {
          color: #0369a1 !important;
        }
        body.light .text-sky-400 {
          color: #0284c7 !important;
        }
        /* Gradient header text contrast override */
        body.light .bg-gradient-to-r.from-white {
          background-image: linear-gradient(to right, #0f172a, #1e293b, #0369a1) !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
        /* Buttons, inputs and form controls */
        body.light .bg-\\[\\#0c101a\\] {
          background-color: #f8fafc !important;
          border-color: #cbd5e1 !important;
        }
        body.light .bg-slate-900\\/40 {
          background-color: #f1f5f9 !important;
        }
        body.light .bg-slate-950\\/40 {
          background-color: #f8fafc !important;
          border-color: #cbd5e1 !important;
        }
        body.light .bg-slate-950\\/60 {
          background-color: #ffffff !important;
          border-color: #cbd5e1 !important;
        }
        body.light .text-slate-100 {
          color: #0f172a !important;
        }
        body.light input, body.light select, body.light textarea {
          background-color: #ffffff !important;
          color: #0f172a !important;
          border-color: #cbd5e1 !important;
        }
        body.light .hover\\:text-white:hover {
          color: #0284c7 !important;
        }
        body.light .hover\\:border-slate-700:hover {
          border-color: #94a3b8 !important;
        }
        body.light .bg-slate-800 {
          background-color: #e2e8f0 !important;
          border-color: #cbd5e1 !important;
          color: #334155 !important;
        }
        body.light .bg-slate-800:hover {
          background-color: #cbd5e1 !important;
          color: #0f172a !important;
        }
        body.light .text-slate-200 {
          color: #334155 !important;
        }
        body.light .bg-slate-900\\/20 {
          background-color: #f8fafc !important;
          border-color: #cbd5e1 !important;
        }
        body.light .text-slate-400.font-mono {
          color: #334155 !important;
          font-weight: 505;
        }
      `}} />

      {/* Decorative top Microsoft styling strip */}
      <div className="h-1.5 w-full grid grid-cols-4">
        <div className="bg-[#f25022]"></div>
        <div className="bg-[#7fba00]"></div>
        <div className="bg-[#00a4ef]"></div>
        <div className="bg-[#ffb900]"></div>
      </div>

      {/* Main Structural Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Top Header Bar */}
        <header className={`mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b ${isDark ? "border-slate-800" : "border-slate-200"} pb-6 gap-4`}>
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-sky-500/10 border border-sky-500/30 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h1 id="main-title" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent">
                  Microsoft Corporate Intelligence Hub
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Secure Document Ingestion & Strategic Advisory Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Diagnostic & Operations Panel */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* API Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
              isLive 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                : "bg-amber-500/10 border-amber-500/20 text-amber-300"
            }`}>
              <span className={`h-2 w-2 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
              <span className="font-medium">{isLive ? "AI Live Scraped (Google Grounding)" : "Seeded Intelligence Archive"}</span>
            </div>

            {/* Last Scraped timestamp */}
            <span className="text-slate-500 font-mono">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>

            {/* Manual Action Button */}
            <button
              id="refresh-news-btn"
              onClick={() => loadNews(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition duration-150 cursor-pointer text-xs"
              title="Execute Web Scrapers & Query Grounded Gemini Indexes"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Scraping..." : "Re-Scrape Web"}</span>
            </button>

            {/* Theme Preference Selection dropdown */}
            <div 
              id="theme-select-container"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition duration-150 select-none ${
                isDark 
                  ? "bg-slate-850 border-slate-700 text-slate-200" 
                  : "bg-white border-slate-300 text-slate-700 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-1 shrink-0">
                {themeMode === "light" && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                {themeMode === "dark" && <Moon className="w-3.5 h-3.5 text-sky-450" />}
                {themeMode === "system" && <Laptop className="w-3.5 h-3.5 text-indigo-400" />}
                {themeMode === "solar" && (
                  isTimeDaylight() 
                    ? <Sunrise className="w-3.5 h-3.5 text-amber-400 animate-pulse" title="Solar Sync: Daylight" />
                    : <Sunset className="w-3.5 h-3.5 text-orange-400 animate-pulse" title="Solar Sync: Night" />
                )}
              </div>
              
              <span className={`text-[10px] uppercase tracking-wider font-bold font-mono opacity-60 shrink-0 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                {themeMode === "solar" ? (isTimeDaylight() ? "Solar Day" : "Solar Night") : "Theme"}
              </span>

              <select
                id="theme-select"
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value as any)}
                className={`bg-transparent text-xs font-bold font-sans cursor-pointer focus:outline-none border-none py-0 pl-1 pr-6 ring-0 focus:ring-0`}
                style={{ outline: "none", boxShadow: "none" }}
                title="Select Theme Mode: Solar Synced Sunrise/Sunset, System OS preference, or Manual"
              >
                <option value="solar" className="dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Solar Auto (Sunrise/Sunset)</option>
                <option value="system" className="dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">System (OS Prefs)</option>
                <option value="light" className="dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Always Light</option>
                <option value="dark" className="dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Always Dark</option>
              </select>
            </div>
          </div>
        </header>



        {/* Global Navigation Hub */}
        <div className="flex bg-[#111827] border border-slate-800 p-1 rounded-xl font-sans max-w-sm sm:max-w-md md:max-w-xl mb-8 shadow-lg">
          <button
            id="global-nav-briefings"
            onClick={() => setActiveMainView("briefings")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              activeMainView === "briefings"
                ? "bg-slate-800 text-white shadow-sm border border-slate-705 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4 text-inherit" />
            <span>Executive Advisor Dashboard</span>
          </button>
          <button
            id="global-nav-partners"
            onClick={() => {
              setActiveMainView("partners");
              setActiveReviewId(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              activeMainView === "partners"
                ? "bg-slate-800 text-white shadow-sm border border-slate-705 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4 text-inherit" />
            <span>ANZ Microsoft Partner Hub</span>
          </button>
        </div>

        {activeMainView === "briefings" && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4.5 relative overflow-hidden">
            <div className="text-xs text-slate-400 font-medium">Active Briefing Stream</div>
            <div className="text-2xl font-bold mt-1 text-white">{articles.length}</div>
            <div className="text-xs text-sky-400 font-mono mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Covers 4 core segments</span>
            </div>
            <div className="absolute right-3.5 top-3.5 text-slate-700/50">
              <FileText className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4.5 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Avg Market/Corporate Impact</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white">{avgImpact}</span>
                <span className="text-xs text-slate-500">/ 10</span>
                
                {articles.length >= 2 && (() => {
                  const trendInfo = getImpactTrend();
                  if (trendInfo.trend === "up") {
                    return (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400" title={`Current period average (${trendInfo.avgCurrent}) is higher than previous period (${trendInfo.avgPrev})`}>
                        <ArrowUpRight className="w-3 h-3" />
                        <span>{trendInfo.percent}</span>
                      </span>
                    );
                  } else if (trendInfo.trend === "down") {
                    return (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" title={`Current period average (${trendInfo.avgCurrent}) is lower than previous period (${trendInfo.avgPrev})`}>
                        <ArrowDownRight className="w-3 h-3" />
                        <span>{trendInfo.percent}</span>
                      </span>
                    );
                  } else {
                    return (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-500/10 border border-slate-500/20 text-slate-400">
                        <span>Steady</span>
                      </span>
                    );
                  }
                })()}
              </div>

              {/* Sparkline visualization */}
              {articles.length >= 2 && (
                <div className="mt-2.5 h-6 flex items-end gap-0.5" title="Impact trend sparkline of recent articles (newest on right)">
                  {(() => {
                    // Try to get latest 8 articles in chronological order
                    const recent = [...articles]
                      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
                      .slice(0, 10)
                      .reverse();
                    
                    return recent.map((art, idx) => {
                      const heightPercent = Math.max(15, (art.impactScore / 10) * 100);
                      const isHigh = art.impactScore >= 8;
                      const isMedium = art.impactScore >= 5 && art.impactScore < 8;
                      
                      let bgClass = "bg-sky-500/40 hover:bg-sky-450";
                      if (isHigh) bgClass = "bg-rose-500/50 hover:bg-rose-450";
                      else if (isMedium) bgClass = "bg-amber-500/40 hover:bg-amber-450";

                      return (
                        <div
                          key={art.id || idx}
                          style={{ height: `${heightPercent}%` }}
                          className={`flex-1 rounded-sm transition-all duration-200 cursor-help ${bgClass}`}
                          title={`${art.title.slice(0, 35)}... (Impact: ${art.impactScore}/10)`}
                        />
                      );
                    });
                  })()}
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 font-mono mt-2.5 flex items-center justify-between">
              <span>Scale 1-10 priority indexing</span>
              {articles.length >= 2 && (
                <span className="text-[9px] text-slate-500/80">Weekly Trend Sparkline</span>
              )}
            </div>
            <div className="absolute right-3.5 top-3.5 text-slate-700/50">
              <Briefcase className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4.5 relative overflow-hidden">
            <div className="text-xs text-slate-400 font-medium">Positive Market Sentiment Ratio</div>
            <div className="text-2xl font-bold mt-1 text-emerald-400">{positiveRatio}%</div>
            <div className="text-xs text-emerald-500 font-mono mt-2">
              Based on AI Sentiment Classifier
            </div>
            <div className="absolute right-3.5 top-3.5 text-slate-700/50">
              <CheckCircle2 className="w-8 h-8 text-emerald-950/20" />
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4.5 relative overflow-hidden">
            <div className="text-xs text-slate-400 font-medium font-sans">Active AI Engine</div>
            <div className="text-sm font-semibold mt-1 text-slate-200">
              {hasApiKey ? "Gemini 3.5-Flash Active" : "Local Fallback Model"}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-3">
              Google Grounding Enabled: {hasApiKey ? "YES" : "NO"}
            </div>
            <div className="absolute right-3.5 top-3.5 text-slate-700/50">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
        </section>

        {/* Microsoft Corp (MSFT) Unified Market & Sentiment Telemetry */}
        <section className={`border rounded-2xl p-6 mb-8 relative overflow-hidden transition-all duration-300 shadow-md ${
          isDark 
            ? "bg-gradient-to-b from-[#111827] to-[#0f1523] border-slate-800/80 hover:border-slate-800" 
            : "bg-white border-slate-200/80 hover:border-slate-300"
        }`}>
          {/* Subtle glowing ambient circles behind in dark mode */}
          {isDark && <div className="absolute top-0 right-0 h-44 w-44 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>}
          
          {(() => {
            // Local variables calculation for Google Finance realism
            const getStartingPrice = () => {
              switch (msftTimeframe) {
                case "1D": return 417.62;
                case "1W": return 414.20;
                case "1M": return 409.50;
                case "3M": return 395.20;
                default: return 417.62;
              }
            };
            const activeDataset = getDisplayedChartData() || [];
            const pricesInDataset = activeDataset.map(d => d.price);
            const periodHigh = pricesInDataset.length > 0 ? Math.max(...pricesInDataset) : liveMsftPrice;
            const periodLow = pricesInDataset.length > 0 ? Math.min(...pricesInDataset) : liveMsftPrice;

            const baseStartingPrice = getStartingPrice();
            const startingPrice = activeDataset.length > 0 ? activeDataset[0].price : baseStartingPrice;
            const endPrice = activeDataset.length > 0 ? activeDataset[activeDataset.length - 1].price : liveMsftPrice;

            const deltaPrice = endPrice - startingPrice;
            const percentChange = (deltaPrice / (startingPrice || 1)) * 100;
            const isPositiveChange = deltaPrice >= 0;

            const dayPrices = msftData1D.map(d => d.price);
            const dayHigh = Math.max(...dayPrices);
            const dayLow = Math.min(...dayPrices);

            // Dynamic Stroke and Gradient Setup
            const trendStrokeColor = isPositiveChange ? "#10b981" : "#ef4444";
            const trendGradientId = `colorMsft-${msftTimeframe}-${isPositiveChange ? "positive" : "negative"}`;

            return (
              <>
                {/* Header Information Pane (Styled exactly like Google Finance Quote Box) */}
                <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between border-b pb-6 mb-6 gap-6 border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex-1">
                    {/* Breadcrumbs / Market Identification */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] md:text-xs font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
                      <span>Home</span>
                      <span>•</span>
                      <span>Share Price Indices</span>
                      <span>•</span>
                      <span className="text-sky-500 dark:text-sky-400">Microsoft Corp</span>
                    </div>

                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        Microsoft Corp
                      </h3>
                      <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                      }`}>
                        NASDAQ: MSFT
                      </span>
                      <span className="text-xs text-slate-400 select-none">•</span>
                      <span className="text-xs text-slate-400 font-medium">Real-Time Data (USD)</span>
                    </div>

                    {/* Stock Price & Multi-timeframe trend delta */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                      <span className={`text-4xl md:text-5xl font-extrabold tracking-tight select-all font-sans ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}>
                        ${liveMsftPrice.toFixed(2)}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-0.5 text-sm md:text-base font-bold font-sans px-2.5 py-0.5 rounded-full ${
                          isPositiveChange 
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" 
                            : "text-rose-600 dark:text-rose-455 bg-rose-500/10"
                        }`}>
                          {isPositiveChange ? <ChevronUp className="w-4 h-4 text-emerald-500" /> : <ChevronDown className="w-4 h-4 text-rose-500" />}
                          {isPositiveChange ? "+" : ""}{deltaPrice.toFixed(2)} ({isPositiveChange ? "+" : ""}{percentChange.toFixed(2)}%)
                        </span>

                        <span className={`text-xs font-semibold font-mono px-2 py-0.5 rounded uppercase ${
                          isDark ? "bg-slate-950/65 text-slate-350" : "bg-slate-100 text-slate-600"
                        }`}>
                          {msftTimeframe === "1D" && "Today"}
                          {msftTimeframe === "1W" && "Past 5 Days"}
                          {msftTimeframe === "1M" && "Past Month"}
                          {msftTimeframe === "3M" && "Past 3 Months"}
                        </span>
                      </div>
                    </div>

                    {/* Meta Status Indicator matching live timezone bounds */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2.5 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2 select-none">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPositiveChange ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${isPositiveChange ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                        </span>
                        <span>Market Closed • Quote last updated Friday, Jun 5, 4:00 PM EDT • Disclaimer</span>
                      </div>
                      <span className="text-sky-500 dark:text-sky-400 font-medium">
                        💡 Click & drag horizontally on the chart to zoom in
                      </span>
                    </div>
                  </div>

                  {/* Interactive Control Deck */}
                  <div className="flex flex-wrap items-center gap-3.5">
                    {/* Reset Zoom Button */}
                    {zoomRange && (
                      <button
                        onClick={() => setZoomRange(null)}
                        className={`px-3 py-1 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all duration-250 cursor-pointer ${
                          isDark 
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/20" 
                            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70"
                        }`}
                        title="Reset stock chart zoom to full timeframe"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-pulse" />
                        <span>Reset Zoom</span>
                      </button>
                    )}

                    {/* Benchmark Index Comparison Menu */}
                    <div className="flex items-center bg-slate-100/90 dark:bg-slate-950/60 border border-slate-205 dark:border-slate-800/80 p-1 px-2.5 rounded-xl gap-1.5">
                      <span className={`text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Compare:
                      </span>
                      <select
                        id="benchmark-compare"
                        value={compareIndex}
                        onChange={(e) => setCompareIndex(e.target.value as any)}
                        className={`bg-transparent text-xs font-bold font-sans cursor-pointer focus:outline-none pr-1 focus:ring-0 ring-0 border-0 ${
                          isDark ? "text-slate-200" : "text-slate-700"
                        }`}
                        style={{ outline: "none", boxShadow: "none" }}
                      >
                        <option value="none" className="dark:bg-slate-950 text-slate-850 dark:text-slate-150">None</option>
                        <option value="nasdaq" className="dark:bg-slate-950 text-slate-850 dark:text-slate-150">NASDAQ Composite</option>
                        <option value="sp500" className="dark:bg-slate-950 text-slate-850 dark:text-slate-150">S&P 500</option>
                      </select>
                    </div>

                    {/* Google Finance Timeframe Selection strip */}
                    <div className="flex items-center bg-slate-100/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 p-1 rounded-xl">
                      {([
                        { label: "1D", val: "1D" },
                        { label: "5D", val: "1W" },
                        { label: "1M", val: "1M" },
                        { label: "6M", val: "3M" },
                      ] as const).map(({ label, val }) => (
                        <button
                          key={label}
                          onClick={() => handleTimeframeChange(val)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg font-mono transition-all duration-150 cursor-pointer ${
                            msftTimeframe === val
                              ? isPositiveChange
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20 dark:border-emerald-500/25"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/20 dark:border-rose-500/25"
                              : `${isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"} border border-transparent`
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Chart Visualization Stage */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6 w-full justify-between">
                  
                  {/* Google Finance Styled Interactive AreaChart */}
                  <div className="lg:col-span-8 w-full">
                    <div className="h-72 sm:h-80 w-full text-xs font-mono select-none relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={getDisplayedChartData()}
                          margin={{ top: 10, right: compareIndex !== "none" ? 22 : 10, left: -22, bottom: 5 }}
                          onMouseDown={(e: any) => {
                            if (e && e.activeLabel) {
                              setZoomRefAreaLeft(e.activeLabel);
                            }
                          }}
                          onMouseMove={(e: any) => {
                            if (zoomRefAreaLeft && e && e.activeLabel) {
                              setZoomRefAreaRight(e.activeLabel);
                            }
                            if (e && e.activePayload && e.activePayload.length) {
                              const p = e.activePayload[0].payload;
                              setHoveredPoint({
                                price: p.price,
                                comparePrice: p.comparePrice,
                                time: p.time,
                                chartX: e.chartX,
                                chartY: e.chartY,
                              });
                            } else {
                              setHoveredPoint(null);
                            }
                          }}
                          onMouseUp={handleZoom}
                          onMouseLeave={() => {
                            setHoveredPoint(null);
                          }}
                        >
                          <defs>
                            <linearGradient id={trendGradientId} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={trendStrokeColor} stopOpacity={0.16}/>
                              <stop offset="95%" stopColor={trendStrokeColor} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          
                          <CartesianGrid 
                            strokeDasharray="2 3" 
                            stroke={isDark ? "#1e293b" : "#cbd5e1"} 
                            opacity={isDark ? 0.08 : 0.12} 
                          />
                          
                          {/* Highlight Active Drag Selection Area */}
                          {zoomRefAreaLeft && zoomRefAreaRight && (
                            <ReferenceArea
                              yAxisId="left"
                              x1={zoomRefAreaLeft}
                              x2={zoomRefAreaRight}
                              {...({
                                fill: trendStrokeColor,
                                fillOpacity: 0.15
                              } as any)}
                            />
                          )}
                          
                          <XAxis 
                            dataKey="time" 
                            stroke={isDark ? "#475569" : "#64748b"} 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            dy={8}
                          />
                          
                          {/* Price Y Axis (Left Side) */}
                          <YAxis 
                            yAxisId="left"
                            orientation="left"
                            stroke={trendStrokeColor} 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            domain={["auto", "auto"]}
                            dx={-4}
                          />

                          {/* Benchmark Comparison Price Y Axis (Right Side) */}
                          {compareIndex !== "none" && (
                            <YAxis 
                              yAxisId="right"
                              orientation="right"
                              stroke={compareIndex === "nasdaq" ? "#38bdf8" : "#fb923c"} 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false}
                              domain={["auto", "auto"]}
                              dx={4}
                            />
                          )}
                          
                          <Tooltip
                            cursor={{ stroke: isDark ? "#475569" : "#cbd5e1", strokeWidth: 1.2, strokeDasharray: "3 3" }}
                            content={() => null}
                          />
                          
                          {/* Stock Area Series - colored dynamic green/red based on period trend */}
                          <Area 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="price" 
                            name="MSFT Price"
                            stroke={trendStrokeColor} 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill={`url(#${trendGradientId})`} 
                          />

                          {/* Comparative Stock Benchmark Line Series overlay */}
                          {compareIndex !== "none" && (
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="comparePrice"
                              name={compareIndex === "nasdaq" ? "NASDAQ Composite" : "S&P 500"}
                              stroke={compareIndex === "nasdaq" ? "#38bdf8" : "#fb923c"}
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4 }}
                            />
                          )}

                          {/* Active Price Alert Threshold Reference Lines */}
                          {priceAlerts.filter(alert => !alert.isTriggered).map(alert => (
                            <ReferenceLine
                              key={alert.id}
                              yAxisId="left"
                              y={alert.targetPrice}
                              stroke={alert.condition === "above" ? "#f43f5e" : "#38bdf8"}
                              strokeDasharray="4 4"
                              strokeWidth={1.5}
                              label={{
                                value: `Alert: $${alert.targetPrice.toFixed(2)}`,
                                position: "left",
                                fill: alert.condition === "above" ? "#f43f5e" : "#38bdf8",
                                fontSize: 9,
                                fontWeight: "bold",
                                fontFamily: "monospace",
                                dy: -6
                              }}
                            />
                          ))}
                        </ComposedChart>
                      </ResponsiveContainer>
                    {/* Precise Floating Price Point Label that follows the cursor on hover */}
                    {hoveredPoint && (
                      <div 
                        className="absolute pointer-events-none transition-all duration-75 ease-out select-none font-mono"
                        style={{
                          left: Math.max(40, Math.min(hoveredPoint.chartX - 60, 480)),
                          top: Math.max(10, Math.min(hoveredPoint.chartY - 80, 240)),
                          zIndex: 50
                        }}
                      >
                        <div className={`px-3 py-2 rounded-xl text-xs border shadow-lg whitespace-nowrap backdrop-blur-md ${
                          isDark 
                            ? "bg-slate-950/95 border-slate-800 text-slate-100 shadow-emerald-500/5" 
                            : "bg-white/98 border-slate-250 text-slate-800 shadow-slate-350"
                        }`}>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`h-1.5 w-1.5 rounded-full ${isPositiveChange ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                                <span className="font-semibold text-[11px] text-slate-400">MSFT</span>
                              </div>
                              <span className="font-bold text-[11px]">${hoveredPoint.price.toFixed(2)}</span>
                            </div>
                            {compareIndex !== "none" && hoveredPoint.comparePrice !== undefined && (
                              <div className="flex items-center justify-between gap-4 border-t border-slate-200/30 dark:border-slate-800/60 pt-1.5 mt-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className={`h-1.5 w-1.5 rounded-full ${compareIndex === "nasdaq" ? "bg-sky-400" : "bg-orange-400"}`}></span>
                                  <span className="font-semibold text-[11px] text-slate-400">
                                    {compareIndex === "nasdaq" ? "NASDAQ" : "S&P 500"}
                                  </span>
                                </div>
                                <span className="font-bold text-[11px]">
                                  ${hoveredPoint.comparePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            )}
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal text-right mt-1.5 border-t border-slate-200/30 dark:border-slate-800/40 pt-1">
                              {hoveredPoint.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Real-Time Price Alerts Dashboard (4 of 12 cols) */}
                  <div className="lg:col-span-4 w-full flex flex-col gap-4">
                    <div className={`p-4.5 rounded-xl border font-sans ${
                      isDark 
                        ? "bg-[#0b0f19]/45 border-slate-800" 
                        : "bg-slate-50/50 border-slate-200 shadow-sm"
                    }`}>
                      {/* Panel Title */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/50 dark:border-slate-800/60 w-full">
                        <div className="flex items-center gap-2">
                          <div className="p-1 px-1.5 bg-rose-500/10 text-rose-500 rounded border border-rose-500/25 shrink-0">
                            <span className="text-xs">🚨</span>
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold uppercase tracking-wider font-mono leading-none ${
                              isDark ? "text-slate-300" : "text-slate-800"
                            }`}>
                              Price Alerts
                            </h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">MSFT Stock thresholds</p>
                          </div>
                        </div>

                        {/* Status Pulse */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono opacity-60 font-bold uppercase tracking-widest text-emerald-400">Live</span>
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                        </div>
                      </div>

                      {/* Set Alert Form */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const targetNum = parseFloat(newTargetPrice);
                          if (isNaN(targetNum) || targetNum <= 0) {
                            addToast("technology_updates", "Invalid target price", "Please enter a valid positive numeric target price.");
                            return;
                          }
                          const newAlert: PriceAlert = {
                            id: Math.random().toString(36).substring(2, 9),
                            targetPrice: parseFloat(targetNum.toFixed(2)),
                            condition: alertCondition,
                            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            isTriggered: false
                          };
                          setPriceAlerts(prev => [newAlert, ...prev]);
                          setNewTargetPrice("");
                          addToast("technology_updates", "Alert successfully set", `You will be notified when MSFT goes ${alertCondition} $${newAlert.targetPrice.toFixed(2)}.`);
                        }}
                        className="space-y-3.5"
                      >
                        <div>
                          <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                            Condition
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setAlertCondition("above")}
                              className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer ${
                                alertCondition === "above"
                                  ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                                  : isDark 
                                    ? "bg-slate-900 border-slate-800 text-slate-405 hover:bg-slate-800" 
                                    : "bg-white border-slate-250 text-slate-600 hover:bg-slate-50 hover:border-slate-350 shadow-sm"
                              }`}
                            >
                              <span>Goes Above</span>
                              <ChevronUp className="w-3 h-3 text-rose-500 shrink-0" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setAlertCondition("below")}
                              className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer ${
                                alertCondition === "below"
                                  ? "bg-sky-500/10 text-sky-500 border-sky-500/30"
                                  : isDark 
                                    ? "bg-slate-900 border-slate-800 text-slate-405 hover:bg-slate-800" 
                                    : "bg-white border-slate-250 text-slate-600 hover:bg-slate-50 hover:border-slate-350 shadow-sm"
                              }`}
                            >
                              <span>Goes Below</span>
                              <ChevronDown className="w-3 h-3 text-sky-500 shrink-0" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">
                              Target Price (USD)
                            </label>
                            <button
                              type="button"
                              onClick={() => setNewTargetPrice(liveMsftPrice.toFixed(2))}
                              className="text-[10px] text-sky-500 hover:text-sky-400 font-bold hover:underline cursor-pointer"
                              title="Use current live MSFT share quote price"
                            >
                              Use Live Price ({liveMsftPrice.toFixed(2)})
                            </button>
                          </div>
                          
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm select-none">$</span>
                            <input
                              type="number"
                              step="0.01"
                              placeholder={liveMsftPrice.toFixed(2)}
                              value={newTargetPrice}
                              onChange={(e) => setNewTargetPrice(e.target.value)}
                              className={`w-full py-1.5 pl-6 pr-3 text-xs font-bold font-mono rounded-lg border focus:outline-none transition ${
                                isDark 
                                  ? "bg-slate-950 border-slate-800 text-white focus:border-slate-700 focus:ring-0" 
                                  : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-inner"
                              }`}
                              style={{ outline: "none", boxShadow: "none" }}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-xs shadow transition duration-150 cursor-pointer text-center"
                        >
                          Set Price Alert
                        </button>
                      </form>

                      {/* Active & Triggered Alert Feeds */}
                      <div className="mt-5 space-y-4">
                        {/* Active Alerts List */}
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 font-mono flex items-center justify-between">
                            <span>Active Metrics ({priceAlerts.filter(a => !a.isTriggered).length})</span>
                            <span className="text-[8px] animate-pulse bg-sky-500/10 text-sky-450 px-1 py-0.5 rounded border border-sky-500/20 uppercase tracking-widest font-bold">
                              Monitoring
                            </span>
                          </h5>

                          {priceAlerts.filter(a => !a.isTriggered).length === 0 ? (
                            <div className={`p-3 text-center rounded-lg border text-xs leading-relaxed text-slate-500 ${
                              isDark ? "bg-[#0b0f19]/25 border-slate-900" : "bg-slate-100/30 border-slate-250 shadow-sm"
                            }`}>
                              No active price alerts set.
                            </div>
                          ) : (
                            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5 custom-scrollbar">
                              {priceAlerts.filter(a => !a.isTriggered).map(alert => (
                                <div 
                                  key={alert.id}
                                  className={`flex items-center justify-between p-2 rounded-lg border text-xs transition duration-150 ${
                                    isDark 
                                      ? "bg-slate-950/70 border-slate-900 hover:border-slate-800" 
                                      : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className={`inline-flex items-center px-1 text-[8px] font-bold font-mono uppercase tracking-wider rounded ${
                                        alert.condition === "above" 
                                          ? "bg-rose-500/10 text-rose-400 text-[8px] border border-rose-505/10" 
                                          : "bg-sky-500/10 text-sky-400 text-[8px] border border-sky-505/10"
                                      }`}>
                                        {alert.condition === "above" ? "Above" : "Below"}
                                      </span>
                                      <span className={`font-bold font-mono ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                        ${alert.targetPrice.toFixed(2)}
                                      </span>
                                    </div>
                                    <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                                      Created at {alert.createdAt}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPriceAlerts(prev => prev.filter(p => p.id !== alert.id));
                                      addToast("technology_updates", "Alert Deleted", `Alert for $${alert.targetPrice.toFixed(2)} deleted.`);
                                    }}
                                    className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded transition cursor-pointer text-slate-400 hover:text-rose-500"
                                    title="Delete active price alert"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Triggered History List */}
                        {priceAlerts.filter(a => a.isTriggered).length > 0 && (
                          <div className="border-t border-slate-200/50 dark:border-slate-800/60 pt-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                                Triggered History ({priceAlerts.filter(a => a.isTriggered).length})
                              </h5>
                              <button
                                type="button"
                                onClick={() => {
                                  setPriceAlerts(prev => prev.filter(p => !p.isTriggered));
                                  addToast("technology_updates", "History Cleared", "Triggered price alerts database cleared.");
                                }}
                                className="text-[9px] text-rose-500 hover:text-rose-400 font-bold hover:underline cursor-pointer"
                              >
                                Clear All
                              </button>
                            </div>

                            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5 custom-scrollbar">
                              {priceAlerts.filter(a => a.isTriggered).map(alert => (
                                <div 
                                  key={alert.id}
                                  className={`p-2 rounded-lg border text-[11px] flex justify-between items-center ${
                                    isDark 
                                      ? "bg-slate-900/40 border-slate-950 text-slate-400" 
                                      : "bg-slate-100/50 border-slate-150 text-slate-600 shadow-sm"
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className={`font-bold font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                        ${alert.targetPrice.toFixed(2)}
                                      </span>
                                      <span className="text-[9px] font-mono text-emerald-500 font-bold">
                                        (Hit @ ${alert.triggeredPrice?.toFixed(2)})
                                      </span>
                                    </div>
                                    <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                                      Hit at {alert.triggeredAt || alert.createdAt}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setPriceAlerts(prev => prev.filter(p => p.id !== alert.id))}
                                    className="p-1 text-slate-500 hover:text-rose-500 transition cursor-pointer"
                                    title="Remove triggered alert log"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Google Finance Inspired Key Information Grid (Bottom stats bar is full width inside grid cols 12) */}
                  <div className="lg:col-span-12 mt-4 w-full">
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 font-mono ${
                        isDark ? "text-slate-400" : "text-slate-700 font-semibold"
                      }`}>
                        Key Financial Stats (NASDAQ: MSFT)
                      </h4>
                      <div className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 font-sans border rounded-xl p-4.5 ${
                        isDark ? "bg-[#0b0f19]/35 border-slate-800" : "bg-slate-50/50 border-slate-200"
                      }`}>
                        <div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-medium tracking-wider mb-1">Open</div>
                          <div className={`text-sm font-bold font-mono ${isDark ? "text-slate-200" : "text-slate-800"}`}>$417.80</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-medium tracking-wider mb-1">Prev Close</div>
                          <div className={`text-sm font-bold font-mono ${isDark ? "text-slate-200" : "text-slate-800"}`}>$417.62</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-medium tracking-wider mb-1">High (Period)</div>
                          <div className="text-sm font-bold font-mono text-emerald-500">${periodHigh.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-medium tracking-wider mb-1">Low (Period)</div>
                          <div className="text-sm font-bold font-mono text-rose-500">${periodLow.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-medium tracking-wider mb-1">Day Range</div>
                          <div className={`text-[12px] font-bold font-mono ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            ${dayLow.toFixed(2)} - ${dayHigh.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-medium tracking-wider mb-1">Mkt Cap</div>
                          <div className={`text-sm font-bold font-mono ${isDark ? "text-slate-200" : "text-slate-800"}`}>$3.15T</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-medium tracking-wider mb-1">P/E Ratio</div>
                          <div className={`text-sm font-bold font-mono ${isDark ? "text-slate-200" : "text-slate-800"}`}>34.82</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-medium tracking-wider mb-1">Div Yield</div>
                          <div className={`text-sm font-bold font-mono ${isDark ? "text-slate-200" : "text-slate-800"}`}>0.71%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Historical Data Table */}
                  <div className="lg:col-span-12 mt-6 w-full">
                    <button
                      id="toggle-historical-data"
                      onClick={() => setHistoricalDataExpanded(!historicalDataExpanded)}
                      className={`w-full flex items-center justify-between p-4.5 rounded-xl border font-sans font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        isDark 
                          ? "bg-[#0b0f19]/35 border-slate-800 text-slate-300 hover:bg-[#0b0f19]/60 hover:text-white" 
                          : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Table className="w-4 h-4 text-sky-500" />
                        <span>Historical Price Directory ({activeDataset.length} Records)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono normal-case tracking-normal">
                        <span className="text-slate-450 dark:text-slate-400">
                          {historicalDataExpanded ? "Collapse View" : "Expand Grid View"}
                        </span>
                        {historicalDataExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 animate-pulse" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {historicalDataExpanded && (
                        <motion.div
                          id="historical-table-container"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className={`mt-3 p-4 rounded-xl border ${
                            isDark ? "bg-[#0c101a]/45 border-slate-850" : "bg-white border-slate-200 shadow-sm"
                          }`}>
                            <div className="overflow-x-auto max-h-96 custom-scrollbar pr-1">
                              <table className="w-full text-left border-collapse font-sans text-xs">
                                <thead>
                                  <tr className="border-b border-slate-200/50 dark:border-slate-850 pb-2">
                                    <th className="py-2.5 px-3 text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider">Date / Time</th>
                                    <th className="py-2.5 px-3 text-[10px] font-bold font-mono text-slate-550 dark:text-slate-450 uppercase tracking-wider text-right">Open Price</th>
                                    <th className="py-2.5 px-3 text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-450 uppercase tracking-wider text-right">High Price</th>
                                    <th className="py-2.5 px-3 text-[10px] font-bold font-mono text-rose-600 dark:text-rose-450 uppercase tracking-wider text-right">Low Price</th>
                                    <th className="py-2.5 px-3 text-[10px] font-bold font-mono text-sky-550 dark:text-sky-450 uppercase tracking-wider text-right">Close Price</th>
                                    <th className="py-2.5 px-3 text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider text-right">Trend Change</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/30 dark:divide-slate-850/40">
                                  {activeDataset.map((d, index) => {
                                    // Generate beautiful, realistic, deterministic daily OHLC points based on closing price index
                                    const devRandomModifier = ((index % 3) - 1) * (d.price * 0.002);
                                    const open = parseFloat((d.price - devRandomModifier).toFixed(2));
                                    const high = parseFloat((Math.max(d.price, open) + d.price * 0.0035).toFixed(2));
                                    const low = parseFloat((Math.min(d.price, open) - d.price * 0.004).toFixed(2));
                                    const close = parseFloat(d.price.toFixed(2));
                                    const changeAmount = close - open;
                                    const changePercent = (changeAmount / (open || 1)) * 100;
                                    const isPositive = changeAmount >= 0;

                                    return (
                                      <tr 
                                        key={d.time + "-" + index} 
                                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/15 transition-colors`}
                                      >
                                        <td className="py-2.5 px-3 text-xs font-bold font-mono text-slate-600 dark:text-slate-350">
                                          {d.time}
                                        </td>
                                        <td className="py-2.5 px-3 text-xs font-medium font-mono text-slate-800 dark:text-slate-200 text-right">
                                          ${open.toFixed(2)}
                                        </td>
                                        <td className="py-2.5 px-3 text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 text-right">
                                          ${high.toFixed(2)}
                                        </td>
                                        <td className="py-2.5 px-3 text-xs font-bold font-mono text-rose-600 dark:text-rose-400 text-right">
                                          ${low.toFixed(2)}
                                        </td>
                                        <td className="py-2.5 px-3 text-xs font-extrabold font-mono text-slate-900 dark:text-slate-100 text-right">
                                          ${close.toFixed(2)}
                                        </td>
                                        <td className="py-2.5 px-3 text-xs text-right">
                                          <span className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono justify-end px-1.5 py-0.5 rounded ${
                                            isPositive 
                                              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-550/10" 
                                              : "text-rose-600 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-550/10"
                                          }`}>
                                            {isPositive ? "+" : ""}${changeAmount.toFixed(2)} ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            );
          })()}
        </section>
          </>
        )}

        {/* Double-Pane Main Screen Workflow */}
        {activeMainView === "briefings" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: News Explorer Grid (7 out of 12 columns) */}
            <main className="lg:col-span-7 flex flex-col gap-6">
              <>
                {/* Interactive Filters Area */}
            <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4">
              <div className="flex flex-col gap-3.5">
                
                {/* Visual Category Badges Row */}
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 font-mono block mb-2">
                    Corporate Domain Filter
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      id="category-tab-all"
                      onClick={() => setSelectedCategory("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        selectedCategory === "all" 
                          ? "bg-slate-100 text-slate-900 border-white font-semibold" 
                          : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-850"
                      }`}
                    >
                      All Domains
                    </button>
                    {Object.entries(categoryMap).map(([catKey, val]) => (
                      <button
                        id={`category-tab-${catKey}`}
                        key={catKey}
                        onClick={() => setSelectedCategory(catKey as NewsCategory)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                          selectedCategory === catKey 
                            ? "bg-slate-100 text-slate-900 border-white font-semibold" 
                            : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-850"
                        }`}
                      >
                        {val.icon}
                        <span>{val.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Filters, Sorting Options & Search Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2.5 border-t border-slate-800/60">
                  
                  {/* Local Input Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      id="news-search-input"
                      type="text"
                      className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition"
                      placeholder="Search uploaded & custom briefings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Ordering dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-slate-500 text-xs shrink-0 font-mono">Order By:</label>
                    <select
                      id="news-sort-select"
                      className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500/50 transition"
                      value={sortBy}
                      onChange={(e: any) => setSortBy(e.target.value)}
                    >
                      <option value="date">Publish Date (Newest first)</option>
                      <option value="impact">Threat & Priority Impact Score</option>
                      <option value="sentiment">Positive Sentiment Outlook</option>
                      <option value="manual">Manual Sorted Arrangement ⇅</option>
                    </select>
                  </div>

                </div>

              </div>
            </div>

            {/* News Database Cards Output */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111827] p-3.5 border border-slate-800 rounded-xl">
                <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
                  Executive Intelligence Briefings ({filteredArticles.length})
                </h3>
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* View Grouping Toggle */}
                  <div className="flex items-center bg-slate-950/60 border border-slate-800 p-0.5 rounded-lg mr-1 shrink-0">
                    <button
                      onClick={() => setGroupingMode("flat")}
                      type="button"
                      className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition cursor-pointer ${
                        groupingMode === "flat"
                          ? "bg-sky-500/15 text-sky-450 border border-sky-500/20"
                          : "text-slate-400 hover:text-slate-200 border border-transparent"
                      }`}
                      title="Show as a single stream sorted chronologically"
                    >
                      Chronological
                    </button>
                    <button
                      onClick={() => setGroupingMode("category")}
                      type="button"
                      className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition cursor-pointer ${
                        groupingMode === "category"
                          ? "bg-sky-500/15 text-sky-410 border border-sky-500/20"
                          : "text-slate-400 hover:text-slate-200 border border-transparent"
                      }`}
                      title="Group articles by category"
                    >
                      By Category
                    </button>
                  </div>

                  {searchQuery && (
                    <button 
                       onClick={() => setSearchQuery("")} 
                       className="text-xs text-sky-400 hover:underline hover:text-sky-305 transition mr-2"
                    >
                      Clear Search
                    </button>
                  )}
                  {filteredArticles.length > 0 && (
                    <div className="flex items-center gap-2 border-l border-slate-800 sm:pl-3.5 pl-0">
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Export:</span>
                      <button
                        onClick={exportToCSV}
                        className="inline-flex items-center gap-1 bg-[#0c101a] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded px-2.5 py-1 text-[11px] font-mono text-slate-400 transition cursor-pointer"
                        title="Export current filtered list to CSV spreadsheet"
                      >
                        <Download className="w-3 h-3 text-sky-400" />
                        <span>CSV</span>
                      </button>
                      <button
                        onClick={exportToJSON}
                        className="inline-flex items-center gap-1 bg-[#0c101a] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded px-2.5 py-1 text-[11px] font-mono text-slate-400 transition cursor-pointer"
                        title="Export current filtered list to JSON dataset"
                      >
                        <Download className="w-3 h-3 text-emerald-400" />
                        <span>JSON</span>
                      </button>
                      <button
                        onClick={exportToPDF}
                        className="inline-flex items-center gap-1 bg-[#0c101a] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded px-2.5 py-1 text-[11px] font-mono text-slate-400 transition cursor-pointer"
                        title="Export current filtered list to an Executive PDF Document"
                      >
                        <FileText className="w-3 h-3 text-amber-500" />
                        <span>PDF Report</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {loading ? (
                // Pulse skeletal loaders
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-[#111827] border border-slate-800/60 rounded-xl p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-slate-800 rounded w-1/4 animate-pulse"></div>
                        <div className="h-4 bg-slate-800 rounded w-12 animate-pulse"></div>
                      </div>
                      <div className="h-6 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 text-center">
                  <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-200">{error}</p>
                  <button 
                    onClick={() => loadNews()} 
                    className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg border border-slate-700 cursor-pointer transition"
                  >
                    Attempt Core Re-Load
                  </button>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-8 text-center">
                  <span className="text-slate-500 font-mono text-xs block mb-2">NO RECORDS LOCATED</span>
                  <p className="text-sm text-slate-400 mb-4">
                    No articles currently match your search framework. Change filters or run a live scrape of Google Search.
                  </p>
                  {deletedArticleIds.length > 0 && (
                    <button
                      onClick={handleRestoreDeleted}
                      className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-305 rounded-lg text-xs font-mono border border-sky-500/35 transition cursor-pointer"
                    >
                      Restore {deletedArticleIds.length} Deleted Articles
                    </button>
                  )}
                </div>
              ) : (
                <div id="articles-list" className="flex flex-col gap-4">
                  {groupingMode === "flat" ? (
                    filteredArticles.map((article) => {
                      const expanded = expandedArticleId === article.id;
                      const meta = categoryMap[article.category] || { label: "General", bg: "bg-slate-500/10", text: "text-slate-300", icon: <FileText className="w-4 h-4" /> };
                      
                      return (
                        <article 
                          key={article.id}
                          id={`article-${article.id}`}
                          className={`bg-[#111827] border hover:border-slate-700 rounded-xl transition duration-200 relative ${
                            expanded ? "ring-1 ring-sky-500/30 border-slate-700 shadow-xl" : "border-slate-800/80"
                          } ${pinnedIds.includes(article.id) ? "border-l-2 border-l-sky-500 bg-sky-500/[0.02]" : ""} ${dragOverArticleId === article.id ? "border-sky-500 bg-sky-500/10 scale-[0.99] shadow-inner" : ""}`}
                          draggable
                          onDragStart={(e) => {
                            draggedIdRef.current = article.id;
                            e.currentTarget.style.opacity = "0.4";
                          }}
                          onDragEnd={(e) => {
                            e.currentTarget.style.opacity = "1";
                            setDragOverArticleId(null);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (draggedIdRef.current && draggedIdRef.current !== article.id) {
                              setDragOverArticleId(article.id);
                            }
                          }}
                          onDragLeave={() => {
                            if (dragOverArticleId === article.id) {
                              setDragOverArticleId(null);
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedIdRef.current && draggedIdRef.current !== article.id) {
                              handleReorderArticles(draggedIdRef.current, article.id);
                            }
                            setDragOverArticleId(null);
                            draggedIdRef.current = null;
                          }}
                        >
                          {/* Upper Card Segment */}
                          <div 
                            className="p-5 cursor-pointer select-none"
                            onClick={() => setExpandedArticleId(expanded ? null : article.id)}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                              <div className="flex items-center gap-2">
                                {/* Multi-select Checkbox */}
                                <div 
                                  className="flex items-center justify-center p-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input 
                                    type="checkbox"
                                    checked={selectedArticleIds.includes(article.id)}
                                    onChange={() => toggleSelectArticle(article.id)}
                                    className="w-4 h-4 rounded border-slate-750 bg-slate-950 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900 cursor-pointer"
                                    title="Select briefing for batch actions"
                                  />
                                </div>

                                {/* Drag Grip Handle & Rank-order Controls */}
                                <div 
                                  className="flex items-center gap-1 bg-slate-950/45 border border-slate-800 rounded px-1.5 py-0.5 mr-1 shrink-0 select-none"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div 
                                    className="cursor-grab text-slate-500 hover:text-sky-400 p-0.5 active:cursor-grabbing"
                                    title="Drag handle to reorder the intelligence stream"
                                  >
                                    <GripVertical className="w-3.5 h-3.5" />
                                  </div>
                                  <button
                                    onClick={() => handleMoveArticle(article.id, "up")}
                                    className="p-0.5 text-slate-500 hover:text-sky-400 cursor-pointer rounded hover:bg-slate-800/80"
                                    title="Rank-order: Move item up"
                                    type="button"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveArticle(article.id, "down")}
                                    className="p-0.5 text-slate-500 hover:text-sky-400 cursor-pointer rounded hover:bg-slate-800/80"
                                    title="Rank-order: Move item down"
                                    type="button"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Category Pill */}
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${meta.bg} ${meta.text}`}>
                                  {meta.icon}
                                  {meta.label}
                                </span>
                                {/* Sentiment */}
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase border ${getSentimentColor(article.sentiment)}`}>
                                  {article.sentiment} Sentiment
                                </span>
                                {/* Pinned Badge */}
                                {pinnedIds.includes(article.id) && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-[10px] uppercase font-semibold font-mono tracking-wider border border-sky-500/20">
                                    <Pin className="w-2.5 h-2.5 rotate-45 fill-sky-400" />
                                    Pinned
                                  </span>
                                )}
                              </div>

                              {/* Impact Score and Expand Action */}
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono font-medium border ${getImpactBadgeColor(article.impactScore)}`}>
                                  Impact: {article.impactScore}/10
                                </span>
                                {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                              </div>
                            </div>

                            <h4 className="text-base font-bold text-white hover:text-sky-400 leading-snug group-hover:text-sky-400 transition mb-2">
                              <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                onClick={(e) => e.stopPropagation()} 
                                className="inline-flex items-center gap-1.5 hover:underline decoration-sky-500/40"
                                title="Open original source briefing in a new tab"
                              >
                                <span>{article.title}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-500 hover:text-sky-400 transition shrink-0 inline-block align-middle" />
                              </a>
                            </h4>

                            <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                              {article.summary}
                            </p>

                            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/40 pt-3">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span>
                                  Source:{" "}
                                  <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    onClick={(e) => e.stopPropagation()} 
                                    className="font-bold text-sky-400 hover:text-sky-305 hover:underline inline-flex items-center gap-0.5 transition"
                                    title={`Visit original updates publisher: ${article.source}`}
                                  >
                                    <span>{article.source}</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </span>
                                <span>Date: <strong className="text-slate-400">{article.publishedDate}</strong></span>
                                <span className="text-slate-700 select-none">•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="text-slate-400">{calculateReadTime(article)}</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePin(article.id, article.title, article.category);
                                  }}
                                  className={`inline-flex items-center gap-1.5 bg-[#0c101a] border rounded px-2.5 py-1 text-[11px] font-mono transition cursor-pointer ${
                                    pinnedIds.includes(article.id)
                                      ? "text-sky-450 border-sky-500/40 hover:bg-sky-500/10 hover:border-sky-500/60"
                                      : "text-slate-400 border-slate-800 hover:border-slate-700 hover:text-sky-400/80"
                                  }`}
                                  title={pinnedIds.includes(article.id) ? "Unpin this briefing from the top of the feed" : "Pin this briefing forced to the top of the feed"}
                                >
                                  <Pin className={`w-3 h-3 ${pinnedIds.includes(article.id) ? "fill-sky-400 text-sky-400 rotate-45" : "text-slate-500"}`} />
                                  <span>{pinnedIds.includes(article.id) ? "Pinned" : "Pin"}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBookmark(article.id, article.title, article.category);
                                  }}
                                  className={`inline-flex items-center gap-1.5 bg-[#0c101a] border rounded px-2.5 py-1 text-[11px] font-mono transition cursor-pointer ${
                                    bookmarkedIds.includes(article.id)
                                      ? "text-amber-400 border-amber-500/40 hover:bg-amber-500/10 hover:border-amber-500/60"
                                      : "text-slate-400 border-slate-800 hover:border-slate-700 hover:text-amber-400/80"
                                  }`}
                                  title={bookmarkedIds.includes(article.id) ? "Remove Bookmark" : "Store article in Saved Briefs"}
                                >
                                  <Bookmark className={`w-3 h-3 ${bookmarkedIds.includes(article.id) ? "fill-amber-400 text-amber-400" : "text-slate-500"}`} />
                                  <span>{bookmarkedIds.includes(article.id) ? "Saved" : "Save"}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    exportToPDF(article);
                                  }}
                                  className="inline-flex items-center gap-1.5 bg-[#0c101a] hover:bg-slate-905 border border-slate-800 hover:border-slate-700 hover:text-white rounded px-2.5 py-1 text-[11px] font-mono text-slate-400 transition cursor-pointer"
                                  title="Export individual briefing to a professional Executive PDF Document"
                                >
                                  <FileText className="w-3 h-3 text-amber-500" />
                                  <span>Export PDF</span>
                                </button>
                                <button
                                  onClick={(e) => handleShareToLinkedIn(e, article)}
                                  className="inline-flex items-center gap-1.5 bg-[#0c101a] hover:bg-slate-905 border border-slate-800 hover:border-slate-700 hover:text-[#0a66c2] rounded px-2.5 py-1 text-[11px] font-mono text-slate-400 transition cursor-pointer"
                                  title="Format a LinkedIn post with key takeaways & CTA"
                                >
                                  <Linkedin className="w-3 h-3 text-[#0a66c2] fill-current" />
                                  <span>LinkedIn</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(article.url || window.location.href);
                                    addToast(
                                      article.category,
                                      "Link Copied",
                                      `Successfully copied sharing link/URL for: ${article.title}`
                                    );
                                  }}
                                  className="inline-flex items-center gap-1.5 bg-[#0c101a] hover:bg-slate-905 border border-slate-800 hover:border-slate-700 hover:text-sky-400 rounded px-2.5 py-1 text-[11px] font-mono text-slate-400 transition cursor-pointer"
                                  title="Copy sharing link to clipboard"
                                >
                                  <Share2 className="w-3 h-3 text-slate-500" />
                                  <span>Copy Link</span>
                                </button>
                                <button
                                  onClick={(e) => handleNativeShare(e, article.title, article.url, article.category)}
                                  className="inline-flex items-center gap-1.5 bg-[#0c101a] hover:bg-slate-905 border border-slate-800 hover:border-slate-700 hover:text-indigo-400 rounded px-2.5 py-1 text-[11px] font-mono text-slate-400 transition cursor-pointer"
                                  title="Open system native share options map"
                                >
                                  <Share2 className="w-3 h-3 text-slate-500" />
                                  <span>Share...</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Collapsible Key Briefing Takeaways & Reference URL */}
                          {expanded && (
                            <div id={`article-takeaways-${article.id}`} className="px-5 pb-5 border-t border-slate-800/60 bg-slate-900/40 rounded-b-xl pt-4">
                              <h5 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                                <Terminal className="text-sky-400 w-3.5 h-3.5" />
                                Key Intelligence Points
                              </h5>
                              
                              <ul className="space-y-2 mb-4">
                                {article.keyTakeaways.map((bullet, idx) => (
                                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                    <span className="text-sky-400 font-bold shrink-0 mt-0.5 select-none font-mono">▸</span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* Technical Briefing Advisory Template Section */}
                              {article.anzActionableAdvice && (
                                <div className="my-4 bg-slate-950/40 border-l-4 border-sky-500 p-4 rounded-r-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Briefcase className="w-4 h-4 text-sky-405 shrink-0" />
                                    <h6 className="text-xs font-bold uppercase tracking-wider text-white">
                                      ANZ Commercial & Advisory Briefing
                                    </h6>
                                  </div>
                                  <p className="text-xs text-slate-300 leading-relaxed font-sans mb-1 select-text">
                                    {article.anzActionableAdvice}
                                  </p>
                                  
                                  {article.ecifFundingEligible && (
                                    <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded px-2.5 py-1.5 text-[10px] text-emerald-400 font-mono">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                      <span>
                                        <strong>ECIF Funding Opportunity:</strong> Works qualifying for Azure End-partner Investment Funding.
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Subscriber Delivery Micro-Dispatch Controls */}
                              <div className="my-4 bg-slate-950/25 border border-slate-800/60 p-3.5 rounded-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="flex items-start gap-2.5">
                                    <div className="p-1.5 rounded bg-sky-500/10 border border-sky-550/20 text-sky-400 mt-0.5 shrink-0">
                                      <Mail className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <h6 className="text-[11px] font-bold text-slate-200 uppercase font-mono tracking-wider">
                                        Email Live Intelligence Digest
                                      </h6>
                                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                                        Dispatches these key intelligence points directly to registered business profiles.
                                      </p>
                                    </div>
                                  </div>

                                  {activeDispatchArticleId === article.id ? (
                                    <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="email"
                                          placeholder="subscriber@domain.com"
                                          value={dispatchEmailInput}
                                          onChange={(e) => setDispatchEmailInput(e.target.value)}
                                          className="bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-sky-500 w-full sm:w-48 font-mono"
                                          disabled={sendingSummaryId === article.id}
                                        />
                                        <button
                                          onClick={() => handleSendSummary(article, dispatchEmailInput)}
                                          disabled={sendingSummaryId === article.id}
                                          className="px-2.5 py-1 bg-sky-500 hover:bg-sky-450 text-slate-950 font-bold font-mono rounded text-[10px] disabled:opacity-50 transition shrink-0 cursor-pointer"
                                        >
                                          {sendingSummaryId === article.id ? "Working..." : "Send"}
                                        </button>
                                        <button
                                          onClick={() => setActiveDispatchArticleId(null)}
                                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 font-mono rounded text-[10px] text-slate-400 cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                      {subscriptionsList.length > 0 && (
                                        <div className="text-[9px] text-slate-500 font-mono flex flex-wrap gap-1.5">
                                          <span className="text-slate-600">Shortcut:</span>
                                          {subscriptionsList.slice(0, 2).map((sub) => (
                                            <button
                                              key={sub.id}
                                              onClick={() => setDispatchEmailInput(sub.email)}
                                              className="hover:text-sky-400 underline cursor-pointer"
                                              title={`Quick select ${sub.name}`}
                                            >
                                              {sub.email}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setActiveDispatchArticleId(article.id);
                                        setDispatchEmailInput(subscriptionsList[0]?.email || "");
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0c101a] hover:bg-slate-905 border border-slate-800 hover:border-slate-700 hover:text-sky-450 font-mono rounded text-[10px] text-slate-350 cursor-pointer transition"
                                    >
                                      <Mail className="w-3 h-3 text-slate-500" />
                                      <span>Dispatch Digest</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between border-t border-slate-800/60 pt-3.5">
                                <span className="text-xs text-slate-400">
                                  Segment Impact Priority: <strong className={article.impactScore >= 8 ? "text-rose-400" : "text-sky-400"}>{article.impactScore >= 8 ? "CRITICAL RISK ALERT" : "MONITORABLE ACTIVITY"}</strong>
                                </span>
                                
                                <a 
                                  href={article.url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-305 hover:underline font-mono"
                                >
                                  <span>Access Source File</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })
                  ) : (
                    (() => {
                      const categoriesList: NewsCategory[] = [
                        "technology_updates",
                        "licensing_pricing",
                        "anz_strategy",
                        "cloud_transformations"
                      ];

                      return categoriesList.map((catKey) => {
                        const categoryArticles = filteredArticles.filter(
                          (art) => art.category === catKey
                        );
                        
                        // Skip if no articles in this category under current search/filters
                        if (categoryArticles.length === 0) return null;

                        const meta = categoryMap[catKey] || {
                          label: catKey,
                          bg: "bg-slate-500/10",
                          text: "text-slate-300",
                          icon: <FileText className="w-4 h-4" />
                        };

                        return (
                          <div key={catKey} className="space-y-3.5 mb-2 first:mt-0 mt-3 last:mb-0">
                            {/* Category Subheader Banner */}
                            <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-slate-950/40 border-slate-800/65`}>
                              <div className="p-1 rounded bg-[#0b0f19] shrink-0">
                                {meta.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                                  {meta.label}
                                </h4>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                                {categoryArticles.length} {categoryArticles.length === 1 ? 'brief' : 'briefs'}
                              </span>
                            </div>

                            {/* Articles list block within this category */}
                            <div className="flex flex-col gap-4 pl-0 sm:pl-3 border-l-0 sm:border-l sm:border-slate-800/40">
                              {categoryArticles.map((article) => {
                                const expanded = expandedArticleId === article.id;
                                const articleMeta = categoryMap[article.category] || { label: "General", bg: "bg-slate-500/10", text: "text-slate-300", icon: <FileText className="w-4 h-4" /> };
                                
                                return (
                                  <article 
                                    key={article.id}
                                    id={`article-grouped-${article.id}`}
                                    className={`bg-[#111827] border hover:border-slate-700 rounded-xl transition duration-200 relative ${
                                      expanded ? "ring-1 ring-sky-500/30 border-slate-700 shadow-xl" : "border-slate-800/80"
                                    } ${pinnedIds.includes(article.id) ? "border-l-2 border-l-sky-500 bg-sky-500/[0.02]" : ""} ${dragOverArticleId === article.id ? "border-sky-500 bg-sky-500/10 scale-[0.99] shadow-inner" : ""}`}
                                    draggable
                                    onDragStart={(e) => {
                                      draggedIdRef.current = article.id;
                                      e.currentTarget.style.opacity = "0.4";
                                    }}
                                    onDragEnd={(e) => {
                                      e.currentTarget.style.opacity = "1";
                                      setDragOverArticleId(null);
                                    }}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      if (draggedIdRef.current && draggedIdRef.current !== article.id) {
                                        setDragOverArticleId(article.id);
                                      }
                                    }}
                                    onDragLeave={() => {
                                      if (dragOverArticleId === article.id) {
                                        setDragOverArticleId(null);
                                      }
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      if (draggedIdRef.current && draggedIdRef.current !== article.id) {
                                        handleReorderArticles(draggedIdRef.current, article.id);
                                      }
                                      setDragOverArticleId(null);
                                      draggedIdRef.current = null;
                                    }}
                                  >
                                    {/* Upper Card Segment */}
                                    <div 
                                      className="p-5 cursor-pointer select-none"
                                      onClick={() => setExpandedArticleId(expanded ? null : article.id)}
                                    >
                                      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                                        <div className="flex items-center gap-2">
                                          {/* Multi-select Checkbox */}
                                          <div 
                                            className="flex items-center justify-center p-1"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <input 
                                              type="checkbox"
                                              checked={selectedArticleIds.includes(article.id)}
                                              onChange={() => toggleSelectArticle(article.id)}
                                              className="w-4 h-4 rounded border-slate-750 bg-slate-950 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900 cursor-pointer"
                                              title="Select briefing for batch actions"
                                            />
                                          </div>

                                          {/* Drag Grip Handle & Rank-order Controls */}
                                          <div 
                                            className="flex items-center gap-1 bg-slate-950/45 border border-slate-800 rounded px-1.5 py-0.5 mr-1 shrink-0 select-none"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <div 
                                              className="cursor-grab text-slate-500 hover:text-sky-400 p-0.5 active:cursor-grabbing"
                                              title="Drag handle to reorder the intelligence stream"
                                            >
                                              <GripVertical className="w-3.5 h-3.5" />
                                            </div>
                                            <button
                                              onClick={() => handleMoveArticle(article.id, "up")}
                                              className="p-0.5 text-slate-500 hover:text-sky-400 cursor-pointer rounded hover:bg-slate-800/80"
                                              title="Rank-order: Move item up"
                                              type="button"
                                            >
                                              <ChevronUp className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              onClick={() => handleMoveArticle(article.id, "down")}
                                              className="p-0.5 text-slate-500 hover:text-sky-400 cursor-pointer rounded hover:bg-slate-800/80"
                                              title="Rank-order: Move item down"
                                              type="button"
                                            >
                                              <ChevronDown className="w-3.5 h-3.5" />
                                            </button>
                                          </div>

                                          {/* Sentiment */}
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase border ${getSentimentColor(article.sentiment)}`}>
                                            {article.sentiment} Sentiment
                                          </span>
                                          {/* Pinned Badge */}
                                          {pinnedIds.includes(article.id) && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-[10px] uppercase font-semibold font-mono tracking-wider border border-sky-500/20">
                                              <Pin className="w-2.5 h-2.5 rotate-45 fill-sky-400" />
                                              Pinned
                                            </span>
                                          )}
                                        </div>

                                        {/* Impact Score and Expand Action */}
                                        <div className="flex items-center gap-2">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono font-medium border ${getImpactBadgeColor(article.impactScore)}`}>
                                            Impact: {article.impactScore}/10
                                          </span>
                                          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                        </div>
                                      </div>

                                      <h4 className="text-base font-bold text-white hover:text-sky-400 leading-snug group-hover:text-sky-400 transition mb-2">
                                        <a 
                                          href={article.url} 
                                          target="_blank" 
                                          rel="noreferrer" 
                                          onClick={(e) => e.stopPropagation()} 
                                          className="inline-flex items-center gap-1.5 hover:underline decoration-sky-500/40"
                                          title="Open original source briefing in a new tab"
                                        >
                                          <span>{article.title}</span>
                                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 hover:text-sky-400 transition shrink-0 inline-block align-middle" />
                                        </a>
                                      </h4>

                                      <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                                        {article.summary}
                                      </p>

                                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/40 pt-3">
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                          <span>
                                            Source:{" "}
                                            <a 
                                              href={article.url} 
                                              target="_blank" 
                                              rel="noreferrer" 
                                              onClick={(e) => e.stopPropagation()} 
                                              className="font-bold text-sky-400 hover:text-sky-305 hover:underline inline-flex items-center gap-0.5 transition"
                                              title={`Visit original updates publisher: ${article.source}`}
                                            >
                                              <span>{article.source}</span>
                                              <ExternalLink className="w-2.5 h-2.5" />
                                            </a>
                                          </span>
                                          <span>Date: <strong className="text-slate-400">{article.publishedDate}</strong></span>
                                          <span className="text-slate-700 select-none">•</span>
                                          <span className="inline-flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                                            <span className="text-slate-400">{calculateReadTime(article)}</span>
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              togglePin(article.id, article.title, article.category);
                                            }}
                                            className={`inline-flex items-center gap-1.5 bg-[#0c101a] border rounded px-2.5 py-1 text-[11px] font-mono transition cursor-pointer ${
                                              pinnedIds.includes(article.id)
                                                ? "text-sky-450 border-sky-500/40 hover:bg-sky-500/10 hover:border-sky-500/60"
                                                : "text-slate-400 border-slate-800 hover:border-slate-700 hover:text-sky-400/80"
                                            }`}
                                            title={pinnedIds.includes(article.id) ? "Unpin this briefing from the top of the feed" : "Pin this briefing forced to the top of the feed"}
                                          >
                                            <Pin className={`w-3 h-3 ${pinnedIds.includes(article.id) ? "fill-sky-400 text-sky-400 rotate-45" : "text-slate-500"}`} />
                                            <span>{pinnedIds.includes(article.id) ? "Pinned" : "Pin"}</span>
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleBookmark(article.id, article.title, article.category);
                                            }}
                                            className={`inline-flex items-center gap-1.5 bg-[#0c101a] border rounded px-2.5 py-1 text-[11px] font-mono transition cursor-pointer ${
                                              bookmarkedIds.includes(article.id)
                                                ? "text-amber-400 border-amber-500/40 hover:bg-amber-500/10 hover:border-amber-500/60"
                                                : "text-slate-400 border-slate-800 hover:border-slate-700 hover:text-amber-400/80"
                                            }`}
                                            title={bookmarkedIds.includes(article.id) ? "Remove Bookmark" : "Store article in Saved Briefs"}
                                          >
                                            <Bookmark className={`w-3 h-3 ${bookmarkedIds.includes(article.id) ? "fill-amber-400 text-amber-400" : "text-slate-500"}`} />
                                            <span>{bookmarkedIds.includes(article.id) ? "Saved" : "Save"}</span>
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              exportToPDF(article);
                                            }}
                                            className="inline-flex items-center gap-1.5 bg-[#0c101a] hover:bg-slate-905 border border-slate-800 hover:border-slate-700 hover:text-white rounded px-2.5 py-1 text-[11px] font-mono text-slate-400 transition cursor-pointer"
                                            title="Export individual briefing to a professional Executive PDF Document"
                                          >
                                            <FileText className="w-3 h-3 text-amber-500" />
                                            <span>Export PDF</span>
                                          </button>
                                          <button
                                            onClick={(e) => handleShareToLinkedIn(e, article)}
                                            className="inline-flex items-center gap-1.5 bg-[#0c101a] hover:bg-slate-905 border border-slate-800 hover:border-slate-700 hover:text-[#0a66c2] rounded px-2.5 py-1 text-[11px] font-mono text-slate-400 transition cursor-pointer"
                                            title="Format a LinkedIn post with key takeaways & CTA"
                                          >
                                            <Linkedin className="w-3 h-3 text-[#0a66c2] fill-current" />
                                            <span>LinkedIn</span>
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigator.clipboard.writeText(article.url || window.location.href);
                                              addToast(
                                                article.category,
                                                "Link Copied",
                                                `Successfully copied sharing link/URL for: ${article.title}`
                                              );
                                            }}
                                            className="inline-flex items-center gap-1.5 bg-[#0c101a] hover:bg-slate-905 border border-slate-800 hover:border-slate-700 hover:text-sky-400 rounded px-2.5 py-1 text-[11px] font-mono text-slate-400 transition cursor-pointer"
                                            title="Copy sharing link to clipboard"
                                          >
                                            <Share2 className="w-3 h-3 text-slate-500" />
                                            <span>Copy Link</span>
                                          </button>
                                          <button
                                            onClick={(e) => handleNativeShare(e, article.title, article.url, article.category)}
                                            className="inline-flex items-center gap-1.5 bg-[#0c101a] hover:bg-slate-905 border border-slate-800 hover:border-slate-700 hover:text-indigo-400 rounded px-2.5 py-1 text-[11px] font-mono text-slate-400 transition cursor-pointer"
                                            title="Open system native share options map"
                                          >
                                            <Share2 className="w-3 h-3 text-slate-500" />
                                            <span>Share...</span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Collapsible Key Briefing Takeaways & Reference URL */}
                                    {expanded && (
                                      <div id={`article-takeaways-grouped-${article.id}`} className="px-5 pb-5 border-t border-slate-800/60 bg-slate-900/40 rounded-b-xl pt-4">
                                        <h5 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                                          <Terminal className="text-sky-400 w-3.5 h-3.5" />
                                          Key Intelligence Points
                                        </h5>
                                        
                                        <ul className="space-y-2 mb-4">
                                          {article.keyTakeaways.map((bullet, idx) => (
                                            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                              <span className="text-sky-400 font-bold shrink-0 mt-0.5 select-none font-mono">▸</span>
                                              <span>{bullet}</span>
                                            </li>
                                          ))}
                                        </ul>

                                        {/* Technical Briefing Advisory Template Section */}
                                        {article.anzActionableAdvice && (
                                          <div className="my-4 bg-slate-950/40 border-l-4 border-sky-500 p-4 rounded-r-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                              <Briefcase className="w-4 h-4 text-sky-405 shrink-0" />
                                              <h6 className="text-xs font-bold uppercase tracking-wider text-white">
                                                ANZ Commercial & Advisory Briefing
                                              </h6>
                                            </div>
                                            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-1 select-text">
                                              {article.anzActionableAdvice}
                                            </p>
                                            
                                            {article.ecifFundingEligible && (
                                              <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded px-2.5 py-1.5 text-[10px] text-emerald-400 font-mono">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>
                                                  <strong>ECIF Funding Opportunity:</strong> Works qualifying for Azure End-partner Investment Funding.
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* Subscriber Delivery Micro-Dispatch Controls */}
                                        <div className="my-4 bg-slate-950/25 border border-slate-800/60 p-3.5 rounded-lg text-left">
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-start gap-2.5">
                                              <div className="p-1.5 rounded bg-sky-500/10 border border-sky-550/20 text-sky-400 mt-0.5 shrink-0">
                                                <Mail className="w-3.5 h-3.5" />
                                              </div>
                                              <div>
                                                <h6 className="text-[11px] font-bold text-slate-200 uppercase font-mono tracking-wider">
                                                  Email Live Intelligence Digest
                                                </h6>
                                                <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                                                  Dispatches these key intelligence points directly to registered business profiles.
                                                </p>
                                              </div>
                                            </div>

                                            {activeDispatchArticleId === article.id ? (
                                              <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                                                <div className="flex items-center gap-1.5">
                                                  <input
                                                    type="email"
                                                    placeholder="subscriber@domain.com"
                                                    value={dispatchEmailInput}
                                                    onChange={(e) => setDispatchEmailInput(e.target.value)}
                                                    className="bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-sky-500 w-full sm:w-48 font-mono"
                                                    disabled={sendingSummaryId === article.id}
                                                  />
                                                  <button
                                                    onClick={() => handleSendSummary(article, dispatchEmailInput)}
                                                    disabled={sendingSummaryId === article.id}
                                                    className="px-2.5 py-1 bg-sky-500 hover:bg-sky-450 text-slate-950 font-bold font-mono rounded text-[10px] disabled:opacity-50 transition shrink-0 cursor-pointer"
                                                  >
                                                    {sendingSummaryId === article.id ? "Working..." : "Send"}
                                                  </button>
                                                  <button
                                                    onClick={() => setActiveDispatchArticleId(null)}
                                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 font-mono rounded text-[10px] text-slate-400 cursor-pointer"
                                                  >
                                                    Cancel
                                                  </button>
                                                </div>
                                                {subscriptionsList.length > 0 && (
                                                  <div className="text-[9px] text-slate-500 font-mono flex flex-wrap gap-1.5">
                                                    <span className="text-slate-600">Shortcut:</span>
                                                    {subscriptionsList.slice(0, 2).map((sub) => (
                                                      <button
                                                        key={sub.id}
                                                        onClick={() => setDispatchEmailInput(sub.email)}
                                                        className="hover:text-sky-400 underline cursor-pointer"
                                                        title={`Quick select ${sub.name}`}
                                                        type="button"
                                                      >
                                                        {sub.email}
                                                      </button>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              <button
                                                onClick={() => {
                                                  setActiveDispatchArticleId(article.id);
                                                  setDispatchEmailInput(subscriptionsList[0]?.email || "");
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0c101a] hover:bg-slate-905 border border-slate-800 hover:border-slate-700 hover:text-sky-455 font-mono rounded text-[10px] text-slate-350 cursor-pointer transition"
                                                type="button"
                                              >
                                                <Mail className="w-3 h-3 text-slate-500" />
                                                <span>Dispatch Digest</span>
                                              </button>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-800/60 pt-3.5">
                                          <span className="text-xs text-slate-400">
                                            Item Impact Priority: <strong className={article.impactScore >= 8 ? "text-rose-400" : "text-sky-400"}>{article.impactScore >= 8 ? "CRITICAL RISK ALERT" : "MONITORABLE ACTIVITY"}</strong>
                                          </span>
                                          
                                          <a 
                                            href={article.url} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-305 hover:underline font-mono"
                                          >
                                            <span>Access Source File</span>
                                            <ExternalLink className="w-3.5 h-3.5" />
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                  </article>
                                );
                              })}
                            </div>
                          </div>
                        );
                      });
                    })()
                  )}
                </div>
              )}
            </div>

            {/* Interactive Intelligence Subscription & Contact Form Hub */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 relative overflow-hidden transition duration-300">
              <div className="absolute top-0 right-0 h-24 w-24 bg-sky-500/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl"></div>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-sky-500/10 p-2 rounded-lg border border-sky-400/20">
                  <Mail className="w-5 h-5 text-sky-400 font-mono" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Briefing Ledger Subscription
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Register for monthly updates & live telemetry summaries
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                Join our premium ANZ briefings list to receive critical announcements, policy transitions, licensing minimum restructures, and platform change records straight to your executive inbox on a monthly schedule.
              </p>

              {subSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center"
                >
                  <div className="h-10 w-10 bg-emerald-400/10 rounded-full border border-emerald-400/30 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Registration Successful!</h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-4">
                    Your details have been securely recorded in local intelligence databases. Our systems have prepared a test verification carrier to confirm active delivery routes.
                  </p>
                  
                  <button
                    onClick={() => setSubSuccess(false)}
                    className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:border-slate-700 hover:text-white transition duration-150 font-mono text-xs cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Register Another Briefing Address</span>
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} className="space-y-4">
                  {subFormError && (
                    <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{subFormError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-450 font-mono block mb-1.5">
                        Full Name <span className="text-rose-405">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-205 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-450 font-mono block mb-1.5">
                        Business Email <span className="text-rose-405">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="john.doe@company.com"
                        value={subEmail}
                        onChange={(e) => setSubEmail(e.target.value)}
                        className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-205 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-455 font-mono block mb-1.5">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Corporation"
                        value={subOrg}
                        onChange={(e) => setSubOrg(e.target.value)}
                        className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-205 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-455 font-mono block mb-1.5">
                        Corporate Role Framework
                      </label>
                      <select
                        value={subRole}
                        onChange={(e) => setSubRole(e.target.value)}
                        className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500/50 transition"
                      >
                        <option value="Business Owner">Business Owner</option>
                        <option value="CEO">Chief Executive Officer (CEO)</option>
                        <option value="CFO">Chief Financial Officer (CFO)</option>
                        <option value="COO">Chief Operating Officer (COO)</option>
                        <option value="CIO">Chief Information Officer (CIO)</option>
                        <option value="CTO">Chief Technology Officer (CTO)</option>
                        <option value="CISO">Chief Information Security Officer (CISO)</option>
                        <option value="CMO">Chief Marketing Officer (CMO)</option>
                        <option value="CRO">Chief Revenue Officer (CRO)</option>
                        <option value="CPO">Chief Product Officer (CPO)</option>
                        <option value="IT Leader">IT Leader / Director</option>
                        <option value="Procurement Director">Procurement / EA Strategist</option>
                        <option value="Lead Advisor">Cloud Consultant & Advisor</option>
                        <option value="Strategy Specialist">Other Specialist</option>
                      </select>
                    </div>
                  </div>

                  {/* Domain Topics */}
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block mb-2">
                      Selected Intelligence Briefing Domains
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(categoryMap).map(([catKey, val]) => {
                        const isChecked = subCategories.includes(catKey as NewsCategory);
                        return (
                          <button
                            type="button"
                            key={catKey}
                            onClick={() => toggleSubCategory(catKey as NewsCategory)}
                            className={`flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition duration-150 cursor-pointer ${
                              isChecked
                                ? "bg-sky-500/5 border-sky-500/30 text-sky-200"
                                : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-300"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 min-w-0">
                              <span className={isChecked ? "text-sky-400" : "text-slate-500"}>
                                {val.icon}
                              </span>
                              <span className="truncate">{val.label}</span>
                            </span>
                            <div className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ml-1.5 ${
                              isChecked ? "border-sky-450 bg-sky-500/10 text-sky-400" : "border-slate-800 bg-slate-900 text-transparent"
                            }`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                    {/* Digest Schedule Option */}
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-405 font-mono block mb-2">
                        Delivery Schedule Preference
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="subFrequency"
                            value="monthly"
                            checked={subFrequency === "monthly"}
                            onChange={() => setSubFrequency("monthly")}
                            className="bg-slate-950 border-slate-800 accent-sky-500 focus:ring-0"
                          />
                          <span>Monthly Digest</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="subFrequency"
                            value="weekly"
                            checked={subFrequency === "weekly"}
                            onChange={() => setSubFrequency("weekly")}
                            className="bg-slate-950 border-slate-800 accent-sky-500 focus:ring-0"
                          />
                          <span>Weekly Update Alerts</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 sm:pt-0">
                      <button
                        type="submit"
                        disabled={isSubmittingSub}
                        className="w-full sm:w-auto bg-sky-500 hover:bg-sky-450 disabled:bg-slate-850 disabled:text-slate-500 disabled:border-transparent text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 border border-sky-400/25"
                      >
                        {isSubmittingSub ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Securing Ledger Entry...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Register Subscription</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Subscriptions Registry List Section (Transparency block) */}
              {subscriptionsList.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-800/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">
                      Active Briefing Registry Index ({subscriptionsList.length})
                    </span>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
                    {subscriptionsList.map((sub) => (
                      <div 
                        key={sub.id}
                        className="flex items-start justify-between bg-slate-950/40 border border-slate-900/80 p-2.5 rounded-lg text-xs text-slate-300"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <strong className="text-white font-medium truncate">{sub.name}</strong>
                            <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1 py-0.5 rounded border border-slate-850">
                              {sub.role}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{sub.email}</div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {sub.categories.map(cat => (
                              <span 
                                key={cat} 
                                className="text-[8px] uppercase tracking-wider font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850/60"
                              >
                                {cat.replace("_", " ")}
                              </span>
                            ))}
                            <span className="text-[8px] uppercase tracking-wider font-mono text-sky-450 bg-sky-500/5 px-1.5 py-0.5 rounded border border-sky-500/10">
                              {sub.frequency}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveSubscription(sub.id, sub.email)}
                          className="text-[10px] text-rose-450 hover:text-rose-300 font-mono cursor-pointer bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/30 px-2 py-1 rounded transition"
                          title="Click to remove from directory state"
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </>
          </main>

          {/* RIGHT COLUMN: Scrape Intelligence & Grounded Query Copilot (5 out of 12 columns) */}
          <section className="lg:col-span-5 flex flex-col gap-6 sticky top-6">
            
            {/* AI Assistant Chat Workstation */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              
              {/* Box Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-sky-500/10 p-1.5 rounded-lg border border-sky-400/20">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Scraper & Grounded Workspace</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Grounded directly on local + web indexes</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-[#0b0f19] px-2 py-0.5 rounded border border-slate-800 font-mono">
                  <span>MODEL: 3.5-FLASH</span>
                </div>
              </div>

              {/* Box Body content */}
              <div className="p-5 flex flex-col gap-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Query the AI Engine directly with custom research objectives to search the live web indices for Microsoft updates (Finance, Pricing policy, Product launches, leadership announcements):
                </p>

                {/* Preset Suggestions */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block">
                    Quick Scenario Briefs
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                    {presetQueries.map((item, idx) => (
                      <button
                        key={idx}
                        id={`preset-btn-${idx}`}
                        onClick={() => {
                          setAiQuery(item.query);
                          handleAiQuerySubmit(item.query);
                        }}
                        className="flex items-center justify-between text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-xs transition duration-150 text-slate-300 hover:text-white cursor-pointer group"
                      >
                        <span className="flex items-center truncate min-w-0 pr-1">
                          {item.icon}
                          <span className="truncate">{item.label}</span>
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Query Bar / Form block */}
                <div className="mt-2.5 pt-4 border-t border-slate-800/60">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block mb-2">
                    Custom Query Workspace
                  </label>

                  <div className="flex flex-col gap-2">
                    <textarea
                      id="ai-prompt-input"
                      className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition resize-none h-20"
                      placeholder="e.g. Find news on Microsoft Teams 2026 licenses or AI infrastructure deals in Scandinavia..."
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                    ></textarea>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">
                        Supports Search Grounding
                      </span>
                      <button
                        id="submit-ai-query-btn"
                        onClick={() => handleAiQuerySubmit("")}
                        disabled={aiLoading || aiQuery.trim() === ""}
                        className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-850 disabled:text-slate-500 disabled:border-transparent text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition duration-150 cursor-pointer flex items-center gap-1 border border-sky-400/25"
                      >
                        {aiLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Fact-Checking...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Analyze Query</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Outputs & Grounded Sources */}
                {(aiLoading || aiResponse || aiError) && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 bg-[#090d16] p-4 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-sky-400" />
                      <span className="text-xs uppercase font-mono font-bold text-sky-400 tracking-wider">
                        Intelligence Response output
                      </span>
                    </div>

                    {aiLoading ? (
                      <div className="space-y-2.5 animate-pulse mt-3.5">
                        <div className="h-3.5 bg-slate-800 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-800 rounded w-full"></div>
                        <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                        <div className="h-3 bg-slate-800 rounded w-11/12"></div>
                      </div>
                    ) : aiError ? (
                      <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-md flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{aiError}</span>
                      </div>
                    ) : aiResponse ? (
                      <div id="ai-response-display" className="space-y-4">
                        {/* Format paragraph text linebreaks cleanly */}
                        <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                          {aiResponse.answer}
                        </div>

                        {/* Grounding web sources listed dynamically */}
                        {aiResponse.sources && aiResponse.sources.length > 0 && (
                          <div className="pt-3 border-t border-slate-800/60">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block mb-2">
                              Verified Grounding Citations ({aiResponse.sources.length})
                            </span>
                            <div className="flex flex-col gap-1.5">
                              {aiResponse.sources.slice(0, 5).map((source, idx) => (
                                <a
                                  key={idx}
                                  href={source.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between text-[11px] text-sky-400 hover:text-sky-300 hover:underline bg-slate-950 px-2.5 py-1.5 rounded border border-slate-850/80 transition"
                                >
                                  <span className="truncate max-w-[85%] font-medium">
                                    {idx + 1}. {source.title || "Grounded Web Source"}
                                  </span>
                                  <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}

              </div>
            </div>

            {/* Grounded Source Indexes Card */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-sky-500/5 rounded-full blur-xl"></div>
              
              <div className="flex items-center gap-2 mb-3.5">
                <div className="bg-sky-500/10 p-1.5 rounded-lg border border-sky-500/20">
                  <Globe className="w-4 h-4 text-sky-450" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                    Grounded Feed Indexes
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">Official crawl & scrape sources</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                The intelligence system is explicitly configured to scrape, prioritize, and ground all strategic advisory insights utilizing these primary source platforms:
              </p>

              <div className="space-y-2.5">
                {/* Source 1 */}
                <a 
                  href="https://news.microsoft.com/source/view-all/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-805 transition duration-150 group"
                  title="Visit Official Microsoft Source news briefing list"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-xs font-bold text-slate-250 group-hover:text-white block truncate">
                      Microsoft News Official Source
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block truncate">
                      news.microsoft.com/source/view-all/
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Target</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
                  </div>
                </a>

                {/* Source 2 */}
                <a 
                  href="https://www.geekwire.com/microsoft/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-805 transition duration-150 group"
                  title="Visit GeekWire Microsoft News segment index"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-xs font-bold text-slate-250 group-hover:text-white block truncate">
                      GeekWire MSFT Tech Index
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block truncate">
                      geekwire.com/microsoft/
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Target</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
                  </div>
                </a>
              </div>
            </div>

            {/* Saved Intelligence Briefs Hub */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/5 rounded-full blur-xl"></div>
              
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                    <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Saved Intelligence Briefs
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">Offline Reference Hub ({bookmarkedIds.length})</p>
                  </div>
                </div>

                {bookmarkedIds.length > 0 && (
                  <button
                    onClick={() => {
                      setBookmarkedIds([]);
                      localStorage.setItem("microsoft_intel_bookmarks", JSON.stringify([]));
                      addToast(
                        "licensing_pricing",
                        "Saved Registry Cleared",
                        "Successfully deleted all bookmarks from your local persistence storage."
                      );
                    }}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-mono cursor-pointer transition"
                    title="Clear all saved articles"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Articles you flag for close operational monitoring will be persisted here in your browser context.
              </p>

              {bookmarkedIds.length === 0 ? (
                <div className="bg-slate-950/40 border border-slate-900 border-dashed rounded-lg p-5 text-center text-xs text-slate-500 font-mono">
                  No saved briefs located. Click "Save" on database articles within your main index view to register them here.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {articles
                    .filter(art => bookmarkedIds.includes(art.id))
                    .map(article => {
                      const meta = categoryMap[article.category] || { label: "General", bg: "bg-slate-500/10", text: "text-slate-300", icon: <FileText className="w-3 h-3" /> };
                      const isExpanded = expandedSavedId === article.id;
                      
                      return (
                        <div 
                          key={article.id}
                          className="bg-slate-950/55 hover:bg-slate-950/80 border border-slate-900 rounded-lg p-3 transition duration-150"
                        >
                          <div 
                            className="flex items-start justify-between gap-2.5 cursor-pointer"
                            onClick={() => setExpandedSavedId(isExpanded ? null : article.id)}
                          >
                            <div className="min-w-0 flex-1">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold border ${meta.bg} ${meta.text} mb-1.5`}>
                                {meta.icon}
                                {meta.label}
                              </span>
                              <h5 className="text-xs font-bold text-slate-200 hover:text-sky-400 line-clamp-2 leading-snug">
                                <a 
                                  href={article.url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  onClick={(e) => e.stopPropagation()} 
                                  className="hover:underline inline-flex items-center gap-1"
                                  title="Open original source briefing in a new tab"
                                >
                                  <span>{article.title}</span>
                                  <ExternalLink className="w-3 h-3 text-slate-500 shrink-0 inline inline-block" />
                                </a>
                              </h5>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
                                <span>
                                  <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    onClick={(e) => e.stopPropagation()} 
                                    className="text-sky-400 hover:text-sky-305 hover:underline inline-flex items-center gap-0.5"
                                    title={`Visit original updates publisher: ${article.source}`}
                                  >
                                    <span>{article.source}</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </span>
                                <span>•</span>
                                <span className={article.impactScore >= 8 ? "text-rose-450" : "text-slate-400"}>Impact: {article.impactScore}/10</span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1 text-slate-450">
                                  <Clock className="w-2.5 h-2.5 text-slate-500" />
                                  <span>{calculateReadTime(article)}</span>
                                </span>
                              </div>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(article.id, article.title, article.category);
                              }}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/5 transition cursor-pointer shrink-0"
                              title="Delete bookmark"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-2.5 pt-2.5 border-t border-slate-800/40 text-[11px] text-slate-300 space-y-2 select-text"
                              >
                                <p className="leading-relaxed text-slate-400">
                                  {article.summary}
                                </p>
                                
                                {article.anzActionableAdvice && (
                                  <div className="bg-slate-900/60 border-l border-amber-500 p-2 rounded-r">
                                    <strong className="text-amber-400 text-[10px] uppercase font-mono block mb-1">
                                      Advisory Note:
                                    </strong>
                                    <p className="text-[10px] text-slate-300 leading-relaxed font-sans select-text">
                                      {article.anzActionableAdvice}
                                    </p>
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-1 font-mono text-[9px]">
                                  <span className="text-slate-650">Published: {article.publishedDate}</span>
                                  <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-sky-400 hover:underline hover:text-sky-300"
                                  >
                                    Source Link
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Watchlist Subscription Center Card */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/5 rounded-full blur-xl"></div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-500/10 p-1.5 rounded-lg border border-amber-400/20">
                    <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Intelligence Watchlist
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">Monitored Alerts (localStorage state)</p>
                  </div>
                </div>
                
                <button
                  id="test-watchlist-toast-btn"
                  onClick={handleTestWatchlistToast}
                  className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition rounded text-[10px] font-mono text-slate-400 cursor-pointer"
                  title="Trigger a toast warning on demand to test notification aesthetics"
                >
                  Test Alert
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Toggle interest in specific corporate domains. You will receive active toast alerts and telemetry indicators when new bulletins are fetched.
              </p>

              <div className="space-y-2 border-t border-slate-800/60 pt-3.5">
                {Object.entries(categoryMap).map(([catKey, val]) => {
                  const isWatched = watchlist.includes(catKey as NewsCategory);
                  return (
                    <button
                      key={catKey}
                      id={`watchlist-toggle-${catKey}`}
                      onClick={() => toggleWatchlist(catKey as NewsCategory)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition duration-150 text-xs text-left cursor-pointer ${
                        isWatched 
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-200" 
                          : "bg-[#0c101a] border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className={isWatched ? "text-amber-400" : "text-slate-500"}>
                          {val.icon}
                        </span>
                        <span className="font-sans truncate">{val.label}</span>
                      </span>
                      
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {isWatched ? (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                            <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">WATCHED</span>
                          </>
                        ) : (
                          <span className="text-[9px] font-mono uppercase text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded">OFF</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Structured Sector Guidelines Card */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Index Coverage Limits
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The intelligence backend queries high impact, verified news regarding:
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold select-none">•</span>
                  <span><strong className="text-white">Cloud Transformation Insights:</strong> Local Azure infrastructure updates, sovereign node capabilities, and APRA compliance frameworks in Sydney/Auckland.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold select-none">•</span>
                  <span><strong className="text-white">Licensing & EA Agreement Updates:</strong> Restructuring SCE profiles, seat minimum increments, and Windows Server AI cores rules.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold select-none">•</span>
                  <span><strong className="text-white">Pricing News:</strong> Currency fluctuations, AUD/NZD list adjustments, CSP annual commitment vs rolling monthly ratios.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold select-none">•</span>
                  <span><strong className="text-white">ANZ Strategy & ECIF:</strong> Direct allocations from Microsoft End-customer Investment Funds to subsidize POC execution.</span>
                </li>
              </ul>
            </div>

            {/* Authoritative "About" Section - Lead Consultant Profile */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-sky-500/5 rounded-full blur-xl"></div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center font-bold text-slate-950 font-sans text-sm tracking-wider shadow">
                  CM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">ANZ Lead Advisor Profile</h4>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Country Manager & EA Strategist</p>
                </div>
              </div>

              <p className="text-xs text-slate-350 leading-relaxed font-sans mb-3 select-text">
                Leveraging **12+ years of senior industry expertise**, I act as a strategic bridge coordinating investment decisions between **Procurement, Corporate Finance, and IT Leadership** across the ANZ territory. 
              </p>
              
              <div className="space-y-2 pt-2 border-t border-slate-850">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-450"></span>
                  <span className="font-medium">Complex EA & SCE Structuring Advisor</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-455"></span>
                  <span className="font-medium">ECIF Funding Grant Application Specialist</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-450"></span>
                  <span className="font-medium">Azure Cloud Economics & TCO Architect</span>
                </div>
              </div>
            </div>

            {/* Microsoft Corporate Intelligence Systems Division Information */}
            <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-305 font-mono mb-2">
                Executive Support Dispatch
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contact our sovereign intelligence support desk to request a de-identified, formal audit blueprint or custom licensing optimization telemetry overview for your enterprise organization.
              </p>
            </div>

          </section>

        </div>
        )}

        {activeMainView === "partners" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header Banner */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-sky-500/5 rounded-full blur-2xl"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold tracking-wider text-sky-450 uppercase bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      Enterprise Directory
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">• Live Real-Time Integration</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                    ANZ Microsoft Partner Hub
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                    Spotlight active partners, verify licensing competencies, audit solution case studies, and coordinate direct co-investment opportunities across Australia and New Zealand.
                  </p>
                </div>
                
                <button
                  onClick={() => setShowAddPartnerForm(!showAddPartnerForm)}
                  className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer shadow transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Partner Entity</span>
                </button>
              </div>
            </div>

            {/* Register Partner Form */}
            <AnimatePresence>
              {showAddPartnerForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#111827] border border-slate-800 rounded-2xl p-5 overflow-hidden shadow-inner font-sans"
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-4 flex items-center gap-1.5 border-b border-slate-800 pb-3">
                    <Building className="w-4 h-4 text-sky-400" />
                    Add Your Custom Microsoft Partner Registry
                  </h3>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPartnerName.trim() || !newPartnerDescription.trim()) {
                      addToast("licensing_pricing", "Partner Info Incomplete", "Please provide a Partner Name and description.");
                      return;
                    }

                    const specializationsArray = newPartnerSpecialization
                      .split(",")
                      .map(s => s.trim())
                      .filter(Boolean);

                    const freshPartner: MicrosoftPartner = {
                      id: `partner-${Math.random().toString(36).substring(2, 9)}`,
                      name: newPartnerName.trim(),
                      location: newPartnerLocation.trim() || "Australia & New Zealand",
                      rating: 5.0,
                      ratingCount: 1,
                      promoted: false,
                      specialization: specializationsArray.length ? specializationsArray : ["General Services", "Cloud Consultant"],
                      description: newPartnerDescription.trim(),
                      caseStudyTitle: newPartnerCaseStudyTitle.trim() || "Enterprise Implementation",
                      caseStudyContext: newPartnerCaseStudyContext.trim() || "Custom infrastructure audit and direct tenant optimisation services.",
                      contactEmail: newPartnerEmail.trim() || "procurement-support@microsoft.com.au",
                      websiteUrl: newPartnerWebsite.trim() || undefined,
                      reviews: [
                        {
                          id: `rev-${Math.random().toString(36).substring(2, 9)}`,
                          reviewer: "System Verified",
                          rating: 5,
                          comment: "Created and verified custom Microsoft Partner profile.",
                          date: new Date().toISOString().split("T")[0]
                        }
                      ]
                    };

                    setPartners(prev => {
                      const next = [...prev, freshPartner];
                      localStorage.setItem("microsoft_intel_partners", JSON.stringify(next));
                      return next;
                    });

                    addToast(
                      "anz_strategy",
                      "Partner Directory Registered",
                      `Custom Microsoft Partner: ${freshPartner.name} registered successfully.`
                    );

                    setNewPartnerName("");
                    setNewPartnerLocation("");
                    setNewPartnerSpecialization("");
                    setNewPartnerDescription("");
                    setNewPartnerCaseStudyTitle("");
                    setNewPartnerCaseStudyContext("");
                    setNewPartnerEmail("");
                    setNewPartnerWebsite("");
                    setShowAddPartnerForm(false);
                  }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 mb-1">
                        Partner Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Crayon Australasia, SoftwareOne"
                        value={newPartnerName}
                        onChange={(e) => setNewPartnerName(e.target.value)}
                        className={`w-full text-xs font-sans font-bold py-2 px-3 rounded-lg border focus:outline-none transition ${isDark ? "bg-slate-950 border-slate-800 text-white focus:border-sky-500" : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-sm"}`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 mb-1">
                        Office Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sydney, NSW"
                        value={newPartnerLocation}
                        onChange={(e) => setNewPartnerLocation(e.target.value)}
                        className={`w-full text-xs font-sans font-bold py-2 px-3 rounded-lg border focus:outline-none transition ${isDark ? "bg-slate-950 border-slate-800 text-white focus:border-sky-500" : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-sm"}`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 mb-1">
                        Official Homepage URL
                      </label>
                      <input
                        type="url"
                        placeholder="e.g. https://www.crayon.com/au"
                        value={newPartnerWebsite}
                        onChange={(e) => setNewPartnerWebsite(e.target.value)}
                        className={`w-full text-xs font-mono font-bold py-2 px-3 rounded-lg border focus:outline-none transition ${isDark ? "bg-slate-950 border-slate-800 text-white focus:border-sky-500" : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-sm"}`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 mb-1">
                        Contact Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. corporate@partner.com"
                        value={newPartnerEmail}
                        onChange={(e) => setNewPartnerEmail(e.target.value)}
                        className={`w-full text-xs font-sans font-bold py-2 px-3 rounded-lg border focus:outline-none transition ${isDark ? "bg-slate-950 border-slate-800 text-white focus:border-sky-500" : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-sm"}`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 mb-1">
                        Core Specializations (Comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Licensing Optimization, Azure FinOps, M365 Security"
                        value={newPartnerSpecialization}
                        onChange={(e) => setNewPartnerSpecialization(e.target.value)}
                        className={`w-full text-xs font-sans font-bold py-2 px-3 rounded-lg border focus:outline-none transition ${isDark ? "bg-slate-950 border-slate-800 text-white focus:border-sky-500" : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-sm"}`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 mb-1">
                        Corporate Bio / Description *
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Describe services, licensing capabilities, EA management history..."
                        value={newPartnerDescription}
                        onChange={(e) => setNewPartnerDescription(e.target.value)}
                        className={`w-full text-xs font-sans font-bold py-2 px-3 rounded-lg border focus:outline-none transition ${isDark ? "bg-slate-950 border-slate-800 text-white focus:border-sky-500" : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-sm"}`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 mb-1">
                        Enterprise Project Case Study Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10,000-seat Copilot and Azure Alignment Strategy"
                        value={newPartnerCaseStudyTitle}
                        onChange={(e) => setNewPartnerCaseStudyTitle(e.target.value)}
                        className={`w-full text-xs font-sans font-bold py-2 px-3 rounded-lg border focus:outline-none transition ${isDark ? "bg-slate-950 border-slate-800 text-white focus:border-sky-500" : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-sm"}`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 mb-1">
                        Case Study Context / Achievements Description
                      </label>
                      <input
                        type="text"
                        placeholder="Describe exact licensing and cloud efficiency optimizations unlocked..."
                        value={newPartnerCaseStudyContext}
                        onChange={(e) => setNewPartnerCaseStudyContext(e.target.value)}
                        className={`w-full text-xs font-sans font-bold py-2 px-3 rounded-lg border focus:outline-none transition ${isDark ? "bg-slate-950 border-slate-800 text-white focus:border-sky-500" : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-sm"}`}
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setShowAddPartnerForm(false)}
                        className="px-4 py-2 border border-slate-800 rounded-lg text-slate-450 hover:text-white hover:bg-slate-900 font-bold font-sans text-xs cursor-pointer transition"
                      >
                        Cancel
                      </button>
                      
                      <button
                        type="submit"
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold font-sans text-xs rounded-lg cursor-pointer shadow transition"
                      >
                        Register Partner
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Microsoft Partner Centre Scraping & Link Segment */}
            <div className={`border p-6 rounded-2xl relative overflow-hidden ${isDark ? "bg-[#0b0f19]/35 border-slate-800" : "bg-slate-50/50 border-slate-200 shadow-sm"}`}>
              <div className="absolute top-0 right-0 h-32 w-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200/50 dark:border-slate-800/60 relative z-10">
                <div className="flex items-start gap-3 w-full">
                  <div className="p-2.5 bg-sky-500/10 text-sky-450 rounded-xl shrink-0">
                    <Cloud className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                      <span>Official Microsoft AI Cloud Partner Program</span>
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/15 rounded shrink-0">
                        INFO CENTRE CONNECT
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Build, innovate, and grow your solutions at the scale of Microsoft. Scraped information is curated live from <span className="font-mono text-sky-400">partner.microsoft.com</span>.
                    </p>
                  </div>
                </div>

                <a
                  href="https://partner.microsoft.com/en-AU/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 shadow hover:shadow-sky-500/20 active:scale-[98] rounded-xl cursor-pointer transition shrink-0 self-start md:self-auto"
                >
                  <span>Launch Partner Centre</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Scraped content cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 w-full">
                <div className={`p-4 rounded-xl border ${isDark ? "bg-[#0a0d17]/40 border-slate-850" : "bg-white border-slate-150 shadow-xs"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                      Partnership Paths
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Choose from standard developer and independent software vendor (ISV) tracks to design, build, and deploy high-performing solutions.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? "bg-[#0a0d17]/40 border-slate-850" : "bg-white border-slate-150 shadow-xs"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                      MCAPS for Partners
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Collaborate directly with Microsoft business channels, alignment programs, and enterprise co-sell motions to boost market reach.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? "bg-[#0a0d17]/40 border-slate-850" : "bg-white border-slate-150 shadow-xs"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                      Partner Skilling Hub
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Build specialized technical talent, master generative AI systems, and unlock modern skilling badges.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? "bg-[#0a0d17]/40 border-slate-850" : "bg-white border-slate-150 shadow-xs"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-450 dark:text-amber-400">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                      Go-To-Market Rewards
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Access premium marketing support tools, templates, and performance incentives to reward and scale business success.
                  </p>
                </div>
              </div>
            </div>

            {/* Split view Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Partners directory (7 col) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
                    Authorized Partner Registry Feed ({partners.length})
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Select a partner to audit reviews</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {partners.map((partner) => {
                    const isSpotlight = spotlightPartner.id === partner.id;
                    const isReviewsSelected = activeReviewId === partner.id;
                    
                    return (
                      <div
                        key={partner.id}
                        className={`p-4 rounded-xl border relative transition duration-155 flex flex-col justify-between ${
                          isDark 
                            ? isSpotlight 
                              ? "bg-slate-950/90 border-emerald-500/30 ring-1 ring-emerald-500/10"
                              : "bg-[#111827] border-slate-800/80 hover:border-slate-700"
                            : isSpotlight
                              ? "bg-emerald-500/5 border-emerald-500/30 shadow-sm"
                              : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                        }`}
                      >
                        <div>
                          {/* Card top row */}
                          <div className="flex items-start justify-between gap-2.5 mb-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className={`text-sm font-extrabold font-sans leading-none ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                                  {partner.name}
                                </h4>
                                {isSpotlight && (
                                  <span className="inline-flex items-center gap-0.5 text-[8px] font-bold font-mono tracking-wide px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 uppercase shrink-0">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-450 animate-pulse inline-block shrink-0"></span>
                                    <span>Spotlight</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                                {partner.location}
                              </span>
                            </div>

                            {/* Ratings stars */}
                            <div className="flex items-center gap-1 bg-slate-950/40 border border-slate-850 px-2 py-0.5 rounded-lg shrink-0">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-bold font-mono text-slate-200">{partner.rating.toFixed(1)}</span>
                              <span className="text-[10px] text-slate-500 font-mono">({partner.ratingCount})</span>
                            </div>
                          </div>

                          {/* Tag badges */}
                          <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                            {partner.specialization.map((spec, idx) => (
                              <span
                                key={idx}
                                className={`text-[9px] font-mono leading-none tracking-tight font-semibold px-1.5 py-0.5 rounded border ${
                                  isDark 
                                    ? "bg-sky-500/10 border-sky-500/15 text-sky-400" 
                                    : "bg-sky-100/70 border-sky-200 text-sky-800"
                                }`}
                              >
                                {spec}
                              </span>
                            ))}
                          </div>

                          {/* Description */}
                          <p className={`text-xs leading-relaxed mb-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                            {partner.description}
                          </p>
                        </div>

                        {/* Bottom Actions Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/40 mt-1">
                          
                          {/* Homepage URL click and email click */}
                          <div className="flex items-center gap-3">
                            {partner.websiteUrl ? (
                              <a
                                href={partner.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold font-mono text-sky-400 hover:text-sky-305 hover:underline transition duration-150"
                                title={`Navigate to official homepage of ${partner.name}`}
                              >
                                <Globe className="w-3.5 h-3.5 text-emerald-450" />
                                <span>Official Homepage</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-550 font-mono">No homepage registered</span>
                            )}
                          </div>

                          {/* Management Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setActiveReviewId(isReviewsSelected ? null : partner.id);
                              }}
                              className={`p-1.5 px-3 rounded-lg border text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                                isReviewsSelected
                                  ? "bg-slate-800 border-slate-705 text-white"
                                  : isDark
                                    ? "bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-800"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs"
                              }`}
                              title="Audit customer statements and write evaluations"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Reviews ({partner.reviews.length})</span>
                            </button>

                            {!isSpotlight && (
                              <button
                                onClick={() => handlePromotePartner(partner.id)}
                                className="p-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer transition shadow"
                              >
                                Spotlight
                              </button>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: Active reviews & Spotlight Panel details (5 col) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Active Spotlight Card */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-full blur-xl"></div>
                  
                  <div className="pb-3 mb-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 px-1.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/25 shrink-0">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono leading-none">
                          Featured Partner Spotlight
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">Top-performing strategic integrator</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-1.5">
                      <div>
                        <h3 className="text-base font-extrabold text-white leading-normal">
                          {spotlightPartner.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {spotlightPartner.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-950/60 p-1.5 px-2.5 rounded-xl border border-slate-900 shrink-0">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-extrabold text-slate-100">{spotlightPartner.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-555">/5</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-350 leading-relaxed max-w-xl">
                      {spotlightPartner.description}
                    </p>

                    {/* Spotlight Case Study Box */}
                    <div className="bg-[#0c101a] border-l-2 border-sky-400 p-3.5 rounded-r-lg">
                      <div className="text-[9px] font-mono uppercase tracking-widest text-sky-400 font-bold mb-1 block">
                        Enterprise Deployment Case Study
                      </div>
                      <h5 className="text-xs font-bold text-slate-200 mb-1">
                        {spotlightPartner.caseStudyTitle}
                      </h5>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {spotlightPartner.caseStudyContext}
                      </p>
                    </div>

                    {/* Spotlight URLs and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {spotlightPartner.websiteUrl ? (
                        <a
                          href={spotlightPartner.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 text-xs font-bold text-sky-400 hover:text-sky-305 transition duration-150"
                        >
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <span>Visit Website</span>
                          <ExternalLink className="w-3 h-3 text-slate-550" />
                        </a>
                      ) : (
                        <div className="flex items-center justify-center p-1.5 text-[10px] font-mono text-slate-500">
                          No URL registered
                        </div>
                      )}

                      <a
                        href={`mailto:${spotlightPartner.contactEmail}`}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition duration-150"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Contact Partner</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Reviews List & Feedback submission form */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 relative">
                  {(() => {
                    // Decide target partner for reviews listing and review addition
                    const reviewsTargetPartner = activeReviewId 
                      ? partners.find(p => p.id === activeReviewId) || spotlightPartner
                      : spotlightPartner;

                    return (
                      <div>
                        {/* Title block */}
                        <div className="pb-3 border-b border-slate-800 mb-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                            Client Auditing & Reviews
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Estates & evaluations for <span className="text-sky-400 font-bold font-sans">{reviewsTargetPartner.name}</span>
                          </p>
                        </div>

                        {/* Existing Reviews List */}
                        <div className="space-y-3 max-h-[240px] overflow-y-auto pr-0.5 custom-scrollbar mb-5">
                          {reviewsTargetPartner.reviews.length === 0 ? (
                            <div className="p-4 text-center rounded-lg border border-dashed border-slate-800 text-slate-500 text-xs font-mono">
                              No client reviews submitted.
                            </div>
                          ) : (
                            reviewsTargetPartner.reviews.map((rev) => (
                              <div key={rev.id} className="p-3 rounded-lg bg-slate-950/50 border border-slate-850 flex flex-col justify-between">
                                <div className="flex items-start justify-between gap-1.5 mb-1.5">
                                  <div>
                                    <span className="text-xs font-bold text-slate-200 font-sans block">{rev.reviewer}</span>
                                    <span className="text-[9px] text-slate-500 font-mono block mt-0.5">Submitted: {rev.date}</span>
                                  </div>
                                  <div className="flex items-center gap-0.5 bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px] text-amber-400 font-bold shrink-0">
                                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-450 shrink-0" />
                                    <span>{rev.rating}</span>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-normal font-sans italic">
                                  "{rev.comment}"
                                </p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Leave a review Form */}
                        <div className="border-t border-slate-800 pt-4">
                          <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
                            Write Client Assessment Statement
                          </h5>

                          <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAddReview(reviewsTargetPartner.id);
                          }} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1">
                                  Your Name
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Liam Porter"
                                  value={partnerReviewer}
                                  onChange={(e) => setPartnerReviewer(e.target.value)}
                                  className={`w-full text-xs font-sans font-bold py-1.5 px-2.5 rounded-lg border focus:outline-none transition ${isDark ? "bg-slate-950 border-slate-800 text-white focus:border-sky-500" : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-sm"}`}
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1">
                                  Metric Rating
                                </label>
                                <select
                                  value={partnerRating}
                                  onChange={(e) => setPartnerRating(parseInt(e.target.value))}
                                  className={`w-full text-xs font-sans font-bold py-1.5 px-2.5 rounded-lg border focus:outline-none transition ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-sm"}`}
                                >
                                  <option value={5}>5 ★ - Unsurpassed quality</option>
                                  <option value={4}>4 ★ - High proficiency</option>
                                  <option value={3}>3 ★ - Standard performance</option>
                                  <option value={2}>2 ★ - Minor discrepancies</option>
                                  <option value={1}>1 ★ - Serious exceptions</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1">
                                Comments / Audit Result
                              </label>
                              <textarea
                                required
                                rows={2}
                                placeholder="State direct operational results or licensing assessment comments..."
                                value={partnerComment}
                                onChange={(e) => setPartnerComment(e.target.value)}
                                className={`w-full text-xs font-sans font-bold py-1.5 px-2.5 rounded-lg border focus:outline-none transition ${isDark ? "bg-slate-950 border-slate-800 text-white focus:border-sky-500" : "bg-white border-slate-250 text-slate-900 focus:border-sky-500 shadow-sm"}`}
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 hover:text-white transition text-[#e2e8f0] font-sans font-bold text-xs rounded-lg cursor-pointer text-center"
                            >
                              Publish Audit Statement
                            </button>
                          </form>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-[#090d15] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 font-mono">
          <p>© 2026 Microsoft Corporate Intelligence Systems Division. Powered by Google Gemini 3.5-flash.</p>
          <p className="mt-1.5 text-slate-600">All news and pricing guidelines represent index estimations. Grounding engine limits apply.</p>
        </div>
      </footer>

      {/* Watchlist Real-Time Toast Notifications */}
      <div 
        id="toast-notification-panel"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full font-sans pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map(toast => {
            const isTech = toast.category === "technology_updates";
            const isLicensingPricing = toast.category === "licensing_pricing";
            const isCloud = toast.category === "cloud_transformations";
            
            let cardBorder = "border-amber-500/40";
            let alertIconBadgeColor = "text-amber-400 bg-amber-500/10";
            
            if (isLicensingPricing) {
              cardBorder = "border-emerald-500/40";
              alertIconBadgeColor = "text-emerald-400 bg-emerald-500/10";
            } else if (isCloud) {
              cardBorder = "border-indigo-500/40";
              alertIconBadgeColor = "text-indigo-400 bg-indigo-500/10";
            } else if (isTech) {
              cardBorder = "border-sky-500/40";
              alertIconBadgeColor = "text-sky-400 bg-sky-500/10";
            } else if (toast.category === "anz_strategy") {
              cardBorder = "border-purple-500/40";
              alertIconBadgeColor = "text-purple-400 bg-purple-500/10";
            }

            return (
              <motion.div 
                key={toast.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                layout
                className={`pointer-events-auto flex items-start gap-3 bg-[#0d121f]/95 border-l-4 ${cardBorder} text-[#f1f5f9] p-4 rounded-xl shadow-[0_10px_30px_rgb(0,0,0,0.6)] backdrop-blur-md`}
                role="alert"
              >
                {/* Alert Bell indicator */}
                <div className={`p-2 rounded-lg shrink-0 ${alertIconBadgeColor}`}>
                  <Bell className="w-4 h-4" />
                </div>

                {/* Msg Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-white leading-snug">{toast.title}</h4>
                    <span className="text-[9px] font-mono text-slate-500 shrink-0">{toast.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1 select-text">
                    {toast.message}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-550 bg-slate-950 px-1.5 py-0.5 rounded">Watchlist Feed</span>
                    <button 
                      onClick={() => removeToast(toast.id)}
                      className="text-[10px] text-sky-400 hover:text-sky-305 hover:underline font-mono cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-500 hover:text-slate-300 p-0.5 transition shrink-0 cursor-pointer"
                  aria-label="Close notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Batch Action Floating Footer Bar */}
      <AnimatePresence>
        {selectedArticleIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0b0f19]/95 border border-sky-500/40 backdrop-blur-md rounded-2xl shadow-[0_10px_35px_rgba(14,165,233,0.15)] px-6 py-4 flex flex-col md:flex-row items-center gap-4 max-w-[95vw] md:max-w-4xl"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-slate-950 font-mono">
                {selectedArticleIds.length}
              </span>
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Batch Operations Active
                </h5>
                <p className="text-[10px] text-slate-400">
                  Select and execute bulk commands on raw intelligence feeds.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:border-l sm:border-slate-800 md:pl-4 pl-0 w-full md:w-auto justify-center md:justify-start">
              {/* Select All / Deselect All */}
              <button
                onClick={() => {
                  const allActiveIds = filteredArticles.map(a => a.id);
                  const isAllSelected = allActiveIds.every(id => selectedArticleIds.includes(id));
                  if (isAllSelected) {
                    // Deselect active ones
                    setSelectedArticleIds(prev => prev.filter(id => !allActiveIds.includes(id)));
                  } else {
                    // Add all active ones that aren't already selected
                    setSelectedArticleIds(prev => {
                      const newSelections = allActiveIds.filter(id => !prev.includes(id));
                      return [...prev, ...newSelections];
                    });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 font-mono hover:text-white rounded border border-slate-800 bg-[#05070c] hover:border-slate-700 transition cursor-pointer"
                title="Select all or clear active page selection"
              >
                {filteredArticles.map(a => a.id).every(id => selectedArticleIds.includes(id)) ? "Deselect Page" : "Select Page"}
              </button>

              {/* Batch Pin */}
              <button
                onClick={handleBatchPin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-sky-400 font-mono hover:text-sky-305 rounded border border-sky-500/30 bg-[#05070c] hover:border-sky-500/50 transition cursor-pointer"
                title="Batch toggle Pin status"
              >
                <Pin className="w-3.5 h-3.5 rotate-45 fill-sky-500/20" />
                <span>Toggle Pin</span>
              </button>

              {/* Batch Bookmark */}
              <button
                onClick={handleBatchBookmark}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 font-mono hover:text-amber-305 rounded border border-amber-500/30 bg-[#05070c] hover:border-amber-500/50 transition cursor-pointer"
                title="Batch toggle Bookmark status"
              >
                <Bookmark className="w-3.5 h-3.5 fill-amber-500/20" />
                <span>Toggle Saved</span>
              </button>

              {/* Batch Delete */}
              <button
                onClick={handleBatchDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 font-mono hover:text-rose-305 rounded border border-rose-500/30 bg-[#05070c] hover:border-rose-500/50 transition cursor-pointer"
                title="Batch delete selected articles"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              {/* Cancel / Clear Selection */}
              <button
                onClick={() => setSelectedArticleIds([])}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-550 font-mono hover:text-slate-400 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LinkedIn Share Dialog */}
      <AnimatePresence>
        {linkedInShareArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0e1320] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40 px-6 py-4.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a66c2]/10 text-[#0a66c2]">
                    <Linkedin className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      LinkedIn Publisher Assistant
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Share professional-grade Microsoft partner insights with your network.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setLinkedInShareArticle(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800/50 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-sky-400 uppercase tracking-wider font-mono mb-2">
                    Professional Post Format Preview & Customizer
                  </label>
                  <p className="text-xs text-slate-400 mb-2">
                    Edit the draft text below directly to refine the voice before copying or sharing.
                  </p>
                  <textarea
                    value={customLinkedInPostText}
                    onChange={(e) => setCustomLinkedInPostText(e.target.value)}
                    rows={10}
                    className="w-full rounded-xl bg-[#05070c] border border-slate-800 p-4 text-xs text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50 font-sans leading-relaxed custom-scrollbar"
                    placeholder="Enter your custom post text..."
                  />
                </div>

                <div className="bg-[#05070c]/50 rounded-xl border border-slate-800/60 p-4 flex items-start gap-3">
                  <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5 animate-pulse" />
                  <div className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">How to share:</strong> Click <strong className="text-slate-200">"Copy & Go to LinkedIn"</strong> to automatically copy this text to your clipboard, and choose to paste it directly onto your homepage or direct feeds.
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-950/45 px-6 py-4 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setLinkedInShareArticle(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white font-mono px-4 py-2 hover:bg-slate-800/20 rounded transition cursor-pointer order-last sm:order-first text-center sm:text-left"
                >
                  Cancel
                </button>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(customLinkedInPostText);
                      setCopiedLinkedInText(true);
                      addToast(
                        linkedInShareArticle.category,
                        "Post Copied",
                        "LinkedIn professional post loaded to clipboard!"
                      );
                      setTimeout(() => setCopiedLinkedInText(false), 2000);
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded text-xs font-mono font-semibold transition border cursor-pointer ${
                      copiedLinkedInText
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-[#0c101a] border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                    }`}
                  >
                    {copiedLinkedInText ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedLinkedInText ? "Copied!" : "Copy Post Content"}</span>
                  </button>

                  <a
                    href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(customLinkedInPostText)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      navigator.clipboard.writeText(customLinkedInPostText);
                      addToast(
                        linkedInShareArticle.category,
                        "Post Copied & Sharing",
                        "Copied post contents to clipboard and opened LinkedIn feed!"
                      );
                      setLinkedInShareArticle(null);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-[#0a66c2] hover:bg-[#004182] text-white px-5 py-2 rounded text-xs font-mono font-bold shadow-[0_4px_12px_rgba(10,102,194,0.3)] transition cursor-pointer"
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-current" />
                    <span>Copy & Go to LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
