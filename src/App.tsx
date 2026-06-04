/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
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
  ChevronDown,
  ChevronUp,
  Info,
  FileText,
  Bell,
  BellOff,
  X,
  Mail,
  Send,
  Check
} from "lucide-react";
import { Article, NewsCategory, CachedNews, CustomQueryResponse } from "./types";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const categoryMap: Record<NewsCategory, { label: string; bg: string; text: string; icon: any }> = {
    cloud_transformation: { 
      label: "Cloud Transformation Insights", 
      bg: "bg-sky-500/10 border-sky-500/30", 
      text: "text-sky-450", 
      icon: <Cpu className="w-4 h-4 text-sky-400" /> 
    },
    licensing_ea: { 
      label: "Licensing & EA Updates", 
      bg: "bg-amber-500/10 border-amber-500/30", 
      text: "text-amber-450", 
      icon: <Layers className="w-4 h-4 text-amber-400" /> 
    },
    pricing_news: { 
      label: "Pricing News", 
      bg: "bg-emerald-500/10 border-emerald-500/30", 
      text: "text-emerald-450", 
      icon: <DollarSign className="w-4 h-4 text-emerald-400" /> 
    },
    anz_strategy: { 
      label: "ANZ Strategy & ECIF", 
      bg: "bg-purple-500/10 border-purple-500/30", 
      text: "text-purple-400", 
      icon: <Globe className="w-4 h-4 text-purple-400" /> 
    }
  };

  // Watchlist & Toast Notification State (Persisted in localStorage)
  const [watchlist, setWatchlist] = useState<NewsCategory[]>(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_watchlist");
      return stored ? JSON.parse(stored) : ["pricing_news"];
    } catch {
      return ["pricing_news"];
    }
  });

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

  const handleTestWatchlistToast = () => {
    if (watchlist.length === 0) {
      addToast(
        "pricing_news",
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

  // Filters and Selection States
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "impact" | "sentiment">("date");
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  // Subscription Form State (Persisted in localStorage)
  const [subName, setSubName] = useState<string>("");
  const [subEmail, setSubEmail] = useState<string>("");
  const [subOrg, setSubOrg] = useState<string>("");
  const [subRole, setSubRole] = useState<string>("IT Leader");
  const [subCategories, setSubCategories] = useState<NewsCategory[]>([
    "cloud_transformation",
    "licensing_ea",
    "pricing_news",
    "anz_strategy"
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
          categories: ["pricing_news", "licensing_ea"],
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
      "pricing_news",
      "Subscription Revoked",
      `Removed ${email} from the monthly intelligence briefings index.`
    );
  };

  const toggleSubCategory = (category: NewsCategory) => {
    setSubCategories(current =>
      current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category]
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
      setArticles(data.articles || []);
      setLastUpdated(data.lastUpdated || new Date().toISOString());
      setIsLive(data.isLive || false);
      setHasApiKey(data.hasApiKey || false);

      // Analyze news articles against watchlist for immediate toast indicators
      if (data.articles && data.articles.length > 0) {
        const matching = data.articles.filter((art: any) => watchlist.includes(art.category));
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
      console.warn("Error loading news archives:", err);
      setError(err.message || "An unexpected network error occurred while accessing the database.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
      console.warn("AI consultation failed:", err);
      setAiError(err.message || "AI Analysis experienced a connection interruption. Please retry.");
    } finally {
      setAiLoading(false);
    }
  };

  // Filter & Search Logic
  const filteredArticles = articles
    .filter(art => {
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
    <div className="min-h-screen bg-[#0b0f19] text-[#f1f5f9] antialiased">
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
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
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
                  AI-Powered Real-Time Scraping & Grounded Search Analysis
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
          </div>
        </header>

        {/* API Key Missing Alert if appropriate */}
        {!hasApiKey && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-amber-200">Pre-seeded High Fidelity Data Active:</span> To trigger live search engines scraping real-time Microsoft financial announcements or technology releases directly from Google search indexes inside this app, configure your <code className="bg-slate-900 border border-slate-800 text-amber-300 px-1 py-0.5 rounded font-mono text-xs">GEMINI_API_KEY</code> in the <strong className="text-white">Secrets panel</strong> on the bottom right.
            </div>
          </div>
        )}

        {/* Overview Statistics Dash Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4.5 relative overflow-hidden">
            <div className="text-xs text-slate-400 font-medium">Scanned Base Articles</div>
            <div className="text-2xl font-bold mt-1 text-white">{articles.length}</div>
            <div className="text-xs text-sky-400 font-mono mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Covers 4 core segments</span>
            </div>
            <div className="absolute right-3.5 top-3.5 text-slate-700/50">
              <FileText className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4.5 relative overflow-hidden">
            <div className="text-xs text-slate-400 font-medium">Avg Market/Corporate Impact</div>
            <div className="text-2xl font-bold mt-1 text-white">{avgImpact} <span className="text-xs text-slate-400">/ 10</span></div>
            <div className="text-xs text-rose-400 font-mono mt-2">
              Scale 1-10 priority indexing
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

        {/* Double-Pane Main Screen Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: News Explorer Grid (7 out of 12 columns) */}
          <main className="lg:col-span-7 flex flex-col gap-6">
            
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
                      placeholder="Search scanned database titles..."
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
                    </select>
                  </div>

                </div>

              </div>
            </div>

            {/* News Database Cards Output */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase font-mono">
                  Scanned Intelligence Briefs ({filteredArticles.length})
                </h3>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="text-xs text-sky-400 hover:underline hover:text-sky-300 transition"
                  >
                    Clear Search
                  </button>
                )}
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
                  <p className="text-sm text-slate-400">
                    No articles currently match your search framework. Change filters or run a live scrape of Google Search.
                  </p>
                </div>
              ) : (
                <div id="articles-list" className="flex flex-col gap-4">
                  {filteredArticles.map((article) => {
                    const expanded = expandedArticleId === article.id;
                    const meta = categoryMap[article.category] || { label: "General", bg: "bg-slate-500/10", text: "text-slate-300", icon: <FileText className="w-4 h-4" /> };
                    
                    return (
                      <article 
                        key={article.id}
                        id={`article-${article.id}`}
                        className={`bg-[#111827] border hover:border-slate-700 rounded-xl transition duration-200 ${
                          expanded ? "ring-1 ring-sky-500/30 border-slate-700 shadow-xl" : "border-slate-800/80"
                        }`}
                      >
                        {/* Upper Card Segment */}
                        <div 
                          className="p-5 cursor-pointer select-none"
                          onClick={() => setExpandedArticleId(expanded ? null : article.id)}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                            <div className="flex items-center gap-2">
                              {/* Category Pill */}
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${meta.bg} ${meta.text}`}>
                                {meta.icon}
                                {meta.label}
                              </span>
                              {/* Sentiment */}
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase border ${getSentimentColor(article.sentiment)}`}>
                                {article.sentiment} Sentiment
                              </span>
                            </div>

                            {/* Impact Score and Expand Action */}
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono font-medium border ${getImpactBadgeColor(article.impactScore)}`}>
                                Impact: {article.impactScore}/10
                              </span>
                              {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </div>
                          </div>

                          <h4 className="text-base font-bold text-white leading-snug group-hover:text-blue-400 transition mb-2">
                            {article.title}
                          </h4>

                          <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                            {article.summary}
                          </p>

                          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/40 pt-3">
                            <span>Source: <strong className="text-slate-400">{article.source}</strong></span>
                            <span>Date: <strong className="text-slate-400">{article.publishedDate}</strong></span>
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
                  })}
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
                        <option value="IT Leader">IT Leader / Director</option>
                        <option value="Procurement Director">Procurement / EA Strategist</option>
                        <option value="Corporate CIO">Corporate CIO / CTO</option>
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

            {/* Local Engagement Hub - Narrabeen Business Group Meetup */}
            <div className="bg-gradient-to-b from-[#111827] to-[#121622] border border-slate-800/90 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-500/10 rounded border border-purple-500/25">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    Local Meetup Integration
                  </h4>
                </div>
                <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                  Sydney Session
                </span>
              </div>

              <h5 className="text-sm font-bold text-white mb-2 tracking-wide font-sans">
                Narrabeen Business Group: MS Strategy Table
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Join our Sydney NSW roundtable to swap real contract renewal structures, compare de-identified licensing metrics, and review step-by-step maps on claiming ECIF credits directly.
              </p>

              {/* Meetup Interactive Registration CTA Panel */}
              <div className="bg-slate-950/50 rounded-lg p-3.5 border border-slate-850 mb-4 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Next Scheduled Event</span>
                  <strong className="text-slate-200 block text-xs mt-0.5">Thursday, 6:30 PM (AEST)</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px] uppercase">RSVP Capacity</span>
                  <strong className="text-slate-200 block text-xs mt-0.5">18 / 25 Booked</strong>
                </div>
              </div>

              <a
                id="meetup-registration-link"
                href="https://www.meetup.com"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700/80 text-xs text-slate-200 font-bold py-2.5 px-4 rounded-lg transition duration-150 cursor-pointer text-center"
              >
                <span>Register for Next Free Roundtable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </section>

        </div>

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
            const isPricing = toast.category === "pricing_news";
            const isLicensing = toast.category === "licensing_ea";
            const isCloud = toast.category === "cloud_transformation";
            
            let cardBorder = "border-amber-500/40";
            let alertIconBadgeColor = "text-amber-400 bg-amber-500/10";
            
            if (isPricing) {
              cardBorder = "border-emerald-500/40";
              alertIconBadgeColor = "text-emerald-400 bg-emerald-500/10";
            } else if (isCloud) {
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
    </div>
  );
}
