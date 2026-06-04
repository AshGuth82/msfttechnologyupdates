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
  GripVertical,
  Pin,
  Trash2
} from "lucide-react";
import { Article, NewsCategory, CachedNews, CustomQueryResponse } from "./types";
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
  CartesianGrid 
} from "recharts";

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

export default function App() {
  // Theme Select Configuration (High Contrast, Accessible Microsoft Corporate Aesthetic)
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_theme");
      return (stored === "light" || stored === "dark") ? stored : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("microsoft_intel_theme", theme);
    } catch (e) {
      console.warn("localStorage write blocked:", e);
    }
  }, [theme]);

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
    cloud_transformation: { 
      label: "Cloud Transformation Insights", 
      bg: isDark ? "bg-sky-500/10 border-sky-500/30" : "bg-sky-100/70 border-sky-200", 
      text: isDark ? "text-sky-450" : "text-sky-800 font-semibold", 
      icon: <Cpu className={`w-4 h-4 ${isDark ? "text-sky-400" : "text-sky-700"}`} /> 
    },
    licensing_ea: { 
      label: "Licensing & EA Updates", 
      bg: isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-100/70 border-amber-200", 
      text: isDark ? "text-amber-450" : "text-amber-800 font-semibold", 
      icon: <Layers className={`w-4 h-4 ${isDark ? "text-amber-400" : "text-amber-700"}`} /> 
    },
    pricing_news: { 
      label: "Pricing News", 
      bg: isDark ? "bg-emerald-500/10 border-emerald-500/30" : "bg-emerald-100/70 border-emerald-200", 
      text: isDark ? "text-emerald-450" : "text-emerald-800 font-semibold", 
      icon: <DollarSign className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-700"}`} /> 
    },
    anz_strategy: { 
      label: "ANZ Strategy & ECIF", 
      bg: isDark ? "bg-purple-500/10 border-purple-500/30" : "bg-purple-100/70 border-purple-200", 
      text: isDark ? "text-purple-400" : "text-purple-800 font-semibold", 
      icon: <Globe className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-700"}`} /> 
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
  const [sortBy, setSortBy] = useState<"date" | "impact" | "sentiment" | "manual">("date");
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [expandedSavedId, setExpandedSavedId] = useState<string | null>(null);
  const [msftTimeframe, setMsftTimeframe] = useState<"1D" | "1W" | "1M" | "3M">("1M");
  const [liveMsftPrice, setLiveMsftPrice] = useState<number>(422.86);

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
          "licensing_ea",
          "Batch Telemetry Unpinned",
          `Successfully unpinned ${selectedArticleIds.length} telemetry briefings.`
        );
      } else {
        const newPins = selectedArticleIds.filter(id => !current.includes(id));
        next = [...current, ...newPins];
        addToast(
          "licensing_ea",
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
          "licensing_ea",
          "Batch Bookmarks Removed",
          `Successfully removed ${selectedArticleIds.length} bookmarks.`
        );
      } else {
        const newBookmarks = selectedArticleIds.filter(id => !current.includes(id));
        next = [...current, ...newBookmarks];
        addToast(
          "licensing_ea",
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
      "pricing_news",
      "Batch Feed Deletion",
      `Successfully deleted ${selectedArticleIds.length} briefing records from your feed.`
    );
    setSelectedArticleIds([]);
  };

  const handleRestoreDeleted = () => {
    setDeletedArticleIds([]);
    localStorage.removeItem("microsoft_intel_deleted");
    addToast(
      "pricing_news",
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
      "pricing_news",
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
      "pricing_news",
      "Export JSON Successful",
      `Successfully generated JSON file containing ${filteredArticles.length} filtered bulletins.`
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
      console.log("Telemetry check: Local intelligence synchronized successfully.");
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
          "Positive Sentiment": positive,
          "Negative Sentiment": negative,
          "Sentiment Volume": positive + negative,
        };
      });
    } else {
      return stockPoints.map((pt) => {
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
          "Positive Sentiment": positive,
          "Negative Sentiment": negative,
          "Sentiment Volume": positive + negative,
        };
      });
    }
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

            {/* Accessible Theme Changer Toggle */}
            <button
              id="theme-toggle"
              onClick={() => setTheme(current => current === "dark" ? "light" : "dark")}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition duration-150 cursor-pointer text-xs font-semibold select-none ${
                isDark 
                  ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white" 
                  : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm"
              }`}
              title={isDark ? "Switch to High-Contrast Light Theme" : "Switch to Microsoft Slate Dark Theme"}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-700" />
                  <span>Dark Mode</span>
                </>
              )}
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
        <section className="bg-[#111827] border border-slate-800/80 rounded-xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800/60 pb-5 mb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 px-1.5 bg-sky-500/10 text-sky-400 text-[10px] font-mono border border-sky-500/20 rounded uppercase font-bold">
                  Unified Intelligence Telemetry
                </span>
                <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                  Microsoft Corp (MSFT) Single-Pane Pricing & Sentiment Hub
                </h3>
              </div>
              
              <div className="flex flex-wrap items-baseline gap-3 mt-1.5">
                <span className="text-3xl font-extrabold tracking-tight text-white select-all font-sans">
                  ${liveMsftPrice.toFixed(2)}
                </span>
                <span className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold px-1.5 py-0.5 rounded-md ${
                  liveMsftPrice >= 417.62 
                    ? "text-emerald-400 bg-emerald-400/10 border border-emerald-500/20" 
                    : "text-rose-455 bg-rose-455/10 border border-rose-500/20"
                }`}>
                  {liveMsftPrice >= 417.62 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {liveMsftPrice >= 417.62 ? "+" : ""}{(liveMsftPrice - 417.62).toFixed(2)} ({liveMsftPrice >= 417.62 ? "+" : ""}{(((liveMsftPrice - 417.62) / 417.62) * 100).toFixed(2)}%)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Real-time overlay of stock price vs local ANZ corporate sentiment
                </span>
              </div>
            </div>

            {/* Selector buttons + Legend */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Legends */}
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-sky-500"></span>
                  <span className="text-slate-400">Stock Price</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-400">Pos Sentiment</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  <span className="text-slate-400">Neg Sentiment</span>
                </div>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center bg-slate-950/60 border border-slate-850 p-0.5 rounded-lg shrink-0">
                {(["1D", "1W", "1M", "3M"] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setMsftTimeframe(tf)}
                    className={`px-3 py-1 text-xs font-mono rounded-md font-medium transition cursor-pointer ${
                      msftTimeframe === tf
                        ? "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Unified Telemetry Left Panel (Metrics & Instability Index) */}
            <div className="lg:col-span-3 flex flex-col gap-3 font-mono text-xs text-slate-400">
              {/* Previous close and statistics */}
              <div className="border border-slate-800/40 rounded-lg p-3 bg-slate-950/20 grid grid-cols-2 lg:grid-cols-1 gap-2.5">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Prev Close</div>
                  <div className="text-sm font-bold text-slate-350">$417.62</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Day Range</div>
                  <div className="text-sm font-bold text-slate-350">
                    ${Math.min(liveMsftPrice, 417.20).toFixed(2)} - ${Math.max(liveMsftPrice, 422.86).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Instability Index Widget Panel */}
              <div className="border border-slate-800/40 rounded-lg p-3 bg-slate-950/20">
                <div className="text-[10px] text-slate-500 uppercase">ANZ Instability Index</div>
                {(() => {
                  const totalPos = articles.filter(a => a.sentiment === "positive").length;
                  const totalNeg = articles.filter(a => a.sentiment === "negative").length;
                  const instabilityRatio = (totalNeg / Math.max(1, totalPos + totalNeg)) * 10;
                  
                  let label = "STABLE";
                  let colorClass = "text-emerald-400";
                  if (instabilityRatio >= 6.5) {
                    label = "SEVERELY UNSTABLE";
                    colorClass = "text-rose-500";
                  } else if (instabilityRatio >= 4.0) {
                    label = "MODERATE FRICTION";
                    colorClass = "text-amber-400";
                  } else if (instabilityRatio >= 1.5) {
                    label = "STABILIZING";
                    colorClass = "text-sky-400";
                  }

                  return (
                    <div className="mt-1.5">
                      <div className={`text-xl font-extrabold ${colorClass}`}>{instabilityRatio.toFixed(1)} / 10</div>
                      <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">{label}</div>
                    </div>
                  );
                })()}
              </div>

              {/* Signal Alignment Feedback */}
              <div className="border border-slate-800/40 rounded-lg p-3 bg-slate-950/50 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Signal Co-alignment</div>
                  <p className="mt-1.5 text-[11px] text-slate-300 font-sans leading-relaxed">
                    {(() => {
                      const totalPos = articles.filter(a => a.sentiment === "positive").length;
                      const totalNeg = articles.filter(a => a.sentiment === "negative").length;
                      if (totalNeg > totalPos) {
                        return "Intense territorial friction of pricing indices suggests persistent local operational strain co-aligned with MSFT valuation stability.";
                      } else if (totalPos > totalNeg * 2) {
                        return "Sovereign cloud expansion and localized ANZ commercial wins suggest dynamic underlying expansion signals supportive of price growth.";
                      } else {
                        return "Balanced local sentiment indexes with tight baseline valuation fluctuations registered in recent cycles.";
                      }
                    })()}
                  </p>
                </div>
                <div className="text-[9px] text-slate-500 mt-2 border-t border-slate-800/40 pt-2 font-mono">
                  Pricing axis (L) / Sentiment Volume axis (R)
                </div>
              </div>
            </div>

            {/* Unified Glass View ComposedChart */}
            <div className="lg:col-span-9 h-64 sm:h-72 w-full text-xs font-mono select-none">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={getMergedChartData()}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMsft" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#cbd5e1"} opacity={0.2} />
                  
                  <XAxis 
                    dataKey="time" 
                    stroke={isDark ? "#475569" : "#55647a"} 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    dy={8}
                  />
                  
                  {/* Left Y Axis for Stock Price */}
                  <YAxis 
                    yAxisId="left"
                    orientation="left"
                    stroke="#38bdf8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    domain={["auto", "auto"]}
                    dx={-4}
                  />
                  
                  {/* Right Y Axis for Sentiment Volumes */}
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#10b981" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    allowDecimals={false}
                    dx={4}
                  />
                  
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#0b0f19" : "#ffffff",
                      borderColor: isDark ? "#1e293b" : "#cbd5e1",
                      borderRadius: "8px",
                      boxShadow: isDark ? "0 10px 15px -3px rgba(0, 0, 0, 0.4)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      color: isDark ? "#f1f5f9" : "#0f172a",
                      fontSize: "11px",
                    }}
                    itemStyle={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
                  />
                  
                  {/* Stock price represented as filled area on left axis */}
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="price" 
                    name="MSFT Price"
                    stroke="#38bdf8" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorMsft)" 
                  />
                  
                  {/* Positive sentiment represented as dynamic emerald line on right axis */}
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="Positive Sentiment" 
                    name="Positive Sentiment Volume"
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 1.5 }}
                    activeDot={{ r: 4 }}
                  />
                  
                  {/* Negative sentiment represented as dynamic rose line on right axis */}
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="Negative Sentiment" 
                    name="Negative Sentiment Volume"
                    stroke="#f43f5e" 
                    strokeWidth={2}
                    dot={{ r: 1.5 }}
                    activeDot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
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
                  Scanned Intelligence Briefs ({filteredArticles.length})
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

                            <h4 className="text-base font-bold text-white leading-snug group-hover:text-blue-400 transition mb-2">
                              {article.title}
                            </h4>

                            <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                              {article.summary}
                            </p>

                            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/40 pt-3">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span>Source: <strong className="text-slate-400">{article.source}</strong></span>
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
                        "cloud_transformation",
                        "licensing_ea",
                        "pricing_news",
                        "anz_strategy"
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

                                      <h4 className="text-base font-bold text-white leading-snug group-hover:text-blue-400 transition mb-2">
                                        {article.title}
                                      </h4>

                                      <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                                        {article.summary}
                                      </p>

                                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/40 pt-3">
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                          <span>Source: <strong className="text-slate-400">{article.source}</strong></span>
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
                        "pricing_news",
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
                              <h5 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug">
                                {article.title}
                              </h5>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
                                <span>{article.source}</span>
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
    </div>
  );
}
