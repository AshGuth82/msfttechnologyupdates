/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
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
  FileText
} from "lucide-react";
import { Article, NewsCategory, CachedNews, CustomQueryResponse } from "./types";

export default function App() {
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
    } catch (err: any) {
      console.error("Error loading news archives:", err);
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
      label: "Financial Report",
      query: "Summarize the recent financial earnings segment performance and Azure cloud growth trend.",
      icon: <DollarSign className="w-3.5 h-3.5 mr-1" />
    },
    {
      label: "Copilot 3.0 Details",
      query: "Explain what is new about Copilot 3.0 autonomous agents, pricing structure and active deployment schedules.",
      icon: <Sparkles className="w-3.5 h-3.5 mr-1" />
    },
    {
      label: "Licensing Changes",
      query: "List the core licensing updates affecting Windows Server 2026, GPU / NPU hardware quotas, and Microsoft 365 Copilot pricing tiers.",
      icon: <Layers className="w-3.5 h-3.5 mr-1" />
    },
    {
      label: "Leadership Shuffles",
      query: "Analyze the strategic impact of the newly appointed Executive VP and Chief AI Officer Aris Vance under Satya Nadella's team.",
      icon: <Users className="w-3.5 h-3.5 mr-1 text-sky-400" />
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
      console.error("AI consultation failed:", err);
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

  const categoryMap: Record<NewsCategory, { label: string; bg: string; text: string; icon: any }> = {
    financial: { 
      label: "Financial Updates", 
      bg: "bg-emerald-500/10 border-emerald-500/30", 
      text: "text-emerald-400", 
      icon: <DollarSign className="w-4 h-4" /> 
    },
    product_tech: { 
      label: "Products & Releases", 
      bg: "bg-sky-500/10 border-sky-500/30", 
      text: "text-sky-400", 
      icon: <Cpu className="w-4 h-4" /> 
    },
    licensing_pricing: { 
      label: "Licensing & Pricing", 
      bg: "bg-amber-500/10 border-amber-500/30", 
      text: "text-amber-400", 
      icon: <Layers className="w-4 h-4" /> 
    },
    leadership: { 
      label: "Executive Leadership", 
      bg: "bg-purple-500/10 border-purple-500/30", 
      text: "text-purple-400", 
      icon: <Users className="w-4 h-4" /> 
    },
  };

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

                            <div className="flex items-center justify-between border-t border-slate-800/60 pt-3.5">
                              <span className="text-xs text-slate-400">
                                Segment Impact Priority: <strong className={article.impactScore >= 8 ? "text-rose-400" : "text-sky-400"}>{article.impactScore >= 8 ? "CRITICAL RISK ALERT" : "MONITORABLE ACTIVITY"}</strong>
                              </span>
                              
                              <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 hover:underline font-mono"
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
                  <span><strong className="text-white">Financial Matrix:</strong> Quarterly earnings reports (Q3/Q4 2026), institutional cloud margin performance, and capital allocation frameworks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold select-none">•</span>
                  <span><strong className="text-white">Product & Technology:</strong> Cloud capabilities, logical qubit demonstrates, Copilot 3.0 agent deployments of neural cores.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold select-none">•</span>
                  <span><strong className="text-white">Licensing Terms:</strong> Hybrid-Core servers, NPU machines, enterprise subscription reductions to $22/month.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold select-none">•</span>
                  <span><strong className="text-white">Executive Management:</strong> Board announcements, key AI directorates reporting straight to CEO Satya Nadella.</span>
                </li>
              </ul>
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
    </div>
  );
}
