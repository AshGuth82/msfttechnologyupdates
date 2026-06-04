/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Article, CachedNews } from "./src/types";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies
app.use(express.json());

// In-memory cache for news articles
let newsCache: CachedNews | null = null;
let isCacheLive = false; // true if cache populated from actual Gemini Search Grounding

// High-quality fallback/seed articles matching the exact criteria if API key is missing or calls fail.
const FALLBACK_ARTICLES: Article[] = [
  {
    id: "fb-fin-1",
    title: "Microsoft Reports Strong Q3 2026 Earnings Driven by Cloud Expansion",
    summary: "Microsoft announced its financial results for the quarter ended March 31, 2026. Intelligent Cloud revenue grew 21% to $31.8 billion, led by strong Azure momentum and growing enterprise AI adoption.",
    category: "financial",
    url: "https://www.microsoft.com/en-us/investor",
    source: "Bloomberg Technology",
    publishedDate: "2026-04-28",
    sentiment: "positive",
    impactScore: 9,
    keyTakeaways: [
      "Intelligent Cloud division leads growth with a 21% increase year-over-year",
      "AI services integration adds 6 full percentage points to Azure cloud growth",
      "Overall operating income rises to $28.3 billion, up 19% dynamically"
    ]
  },
  {
    id: "fb-fin-2",
    title: "Microsoft Details $10 Billion Strategic AI Infrastructure Expansion in Northern Europe",
    summary: "Microsoft is expanding its global cloud infrastructure footprint with a massive $10 billion investment in data centers across Sweden, Norway, and Denmark. The initiative deploys clean-energy AI accelerators.",
    category: "financial",
    url: "https://news.microsoft.com/",
    source: "Reuters Financial",
    publishedDate: "2026-05-15",
    sentiment: "positive",
    impactScore: 8,
    keyTakeaways: [
      "Massive carbon-neutral infrastructure play in high-density European regions",
      "Targeting public sector security, compliance, and strict data sovereignty frameworks",
      "Projected online readiness expected incrementally from late 2026"
    ]
  },
  {
    id: "fb-prod-1",
    title: "Microsoft Debuts Copilot 3.0 with Multimodal Autonomous Workflows at Build 2026",
    summary: "At its annual Build developer conference, Microsoft unveiled Copilot 3.0, introducing autonomous agency features that coordinate multi-step tasks across Excel, PowerPoint, and web environments.",
    category: "product_tech",
    url: "https://news.microsoft.com/",
    source: "TechCrunch",
    publishedDate: "2026-05-20",
    sentiment: "positive",
    impactScore: 10,
    keyTakeaways: [
      "Autonomous engines allow Copilot to coordinate background workflows independently",
      "Deeper co-processing limits integrated with local Copilot+ PC architectures",
      "General availability of advanced agents slated for late June 2026"
    ]
  },
  {
    id: "fb-prod-2",
    title: "Azure Quantum Elements Integrates Logical Qubits Directly into chemistry Pipelines",
    summary: "Microsoft and scientific partners have successfully demonstrated high-fidelity logical qubits with error-correction rates suitable for industrial chemistry, modeling battery and materials compounds.",
    category: "product_tech",
    url: "https://azure.microsoft.com/",
    source: "Scientific American",
    publishedDate: "2026-05-18",
    sentiment: "positive",
    impactScore: 8,
    keyTakeaways: [
      "Logical qubit translation is showing 100,200x error rate improvements",
      "Immediate commercially-viable pharmaceutical modeling pipeline launch",
      "Offered as a software utility for Azure High-Performance Computing clusters"
    ]
  },
  {
    id: "fb-lice-1",
    title: "Microsoft Standardizes Copilot Pro and Commercial Enterprise Pricing Tiers",
    summary: "Microsoft has announced pricing restructuring for commercial AI subscriptions starting July 1, 2026. Microsoft 365 Copilot will offer tiered rates starting at $22 per user/month on multi-year plans.",
    category: "licensing_pricing",
    url: "https://www.microsoft.com/licensing",
    source: "ZDNet",
    publishedDate: "2026-05-12",
    sentiment: "neutral",
    impactScore: 7,
    keyTakeaways: [
      "Core enterprise M365 Copilot drops from $30 to $22 on committed 3-year tiers",
      "New premium agent building licensing introduced at $45 per user/month",
      "Aims to accelerate competitive SMB deployments in Europe and Asia"
    ]
  },
  {
    id: "fb-lice-2",
    title: "Windows Server 2026 Licensing Shifts to Hybrid-Core and NPU Density Metrics",
    summary: "Microsoft outlined core licensing changes for Windows Server 2026. The structure introduces hardware metrics accounting for neural processing units, tying costs to local machine hardware capability.",
    category: "licensing_pricing",
    url: "https://www.microsoft.com/licensing",
    source: "Redmond Channel Partner",
    publishedDate: "2026-05-08",
    sentiment: "negative",
    impactScore: 7,
    keyTakeaways: [
      "New GPU and NPU hardware parameters added to core client licensing calculations",
      "Increases localized licensing metrics for heavy on-prem AI server deployments",
      "Provides clear incentives for migrating legacy instances directly into Azure"
    ]
  },
  {
    id: "fb-lead-1",
    title: "Microsoft Appoints Chief Artificial Intelligence Officer to Senior Leadership Team",
    summary: "CEO Satya Nadella announced the appointment of Dr. Aris Vance as Executive VP and Chief AI Officer. Vance will oversee the unified research, compliance, Azure, and consumer divisions.",
    category: "leadership",
    url: "https://news.microsoft.com/exec",
    source: "Wall Street Journal",
    publishedDate: "2026-05-24",
    sentiment: "positive",
    impactScore: 8,
    keyTakeaways: [
      "Vance centralizes engineering management for all OpenAI-joint and consumer apps",
      "Direct line-report establishes accountability structure under Satya Nadella",
      "Focus is directed on policy alignments of frontier models with EU safety laws"
    ]
  },
  {
    id: "fb-lead-2",
    title: "Longtime Microsoft Corporate Vice President of Azure Storage Announces Retirement",
    summary: "Cloud Infrastructure VP Sarah Jenkins has announced her retirement after 22 years of leading Storage systems from inception to millions of globally synchronized servers.",
    category: "leadership",
    url: "https://news.microsoft.com/exec",
    source: "GeekWire",
    publishedDate: "2026-06-01",
    sentiment: "neutral",
    impactScore: 6,
    keyTakeaways: [
      "Jenkins is highly respected for scaling blob files systems through early Azure years",
      "Existing Azure Networking leaders will act as transitional interim management",
      "No disruption in day-to-day enterprise cloud file systems availability is expected"
    ]
  }
];

// Helper to initialize Gemini Client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
}

// Function to fetch and update news via Google Search Grounding
async function fetchNewsViaGemini(): Promise<{ articles: Article[]; isRealTime: boolean }> {
  const ai = getGeminiClient();
  if (!ai) {
    console.log("No valid GEMINI_API_KEY found, using local high-fidelity intelligence data");
    return { articles: FALLBACK_ARTICLES, isRealTime: false };
  }

  try {
    console.log("Querying Gemini 3.5-flash with Google Search grounding for Microsoft news...");
    const prompt = `You are a professional corporate intelligence tool. Search the web for recent high-quality news and articles from early 2026 regarding the Microsoft Corporation.
You must fetch several news updates, especially covering these four categories:
1. 'financial' (e.g., Q3/Q4 earnings, stock values, Azure revenue, major acquisitions/investments)
2. 'product_tech' (e.g., Azure updates, Copilot agents, Windows 11 updates, Office AI, Quantum)
3. 'licensing_pricing' (e.g., Microsoft 365 pricing shifts, Azure core licensing terms, Copilot licensing models)
4. 'leadership' (e.g., board announcements, executive departures, key hire quotes, VP appointments)

Return the news as a valid raw string of a JSON array, representing a list of articles. Each article in the JSON array MUST follow this exact schema:
[
  {
    "id": "highly-unique-string-identifier-1",
    "title": "Specific news title",
    "summary": "2-3 sentence overview of why this news is critical for Microsoft",
    "category": "one of: 'financial' | 'product_tech' | 'licensing_pricing' | 'leadership'",
    "url": "Actual URL webpage/resource found in your Web Search results (if unavailable, output a valid Microsoft domain URL)",
    "source": "Name of the publishing newspaper/blog/outlet (e.g., WSJ, Reuters, ZDNet, Microsoft News)",
    "publishedDate": "Date in format YYYY-MM-DD",
    "sentiment": "one of: 'positive' | 'neutral' | 'negative'",
    "impactScore": 8, // Integer from 1 to 10 based on how major this is for Microsoft's business model
    "keyTakeaways": [
      "Key summary bullet point 1",
      "Key summary bullet point 2",
      "Key summary bullet point 3"
    ]
  }
]

CRITICAL: Return ONLY the JSON. Do not include markdown headers like \`\`\`json or anything else. Just the pure valid stringified array. Maximize authenticity. Ensure you provide at least 2 distinct articles for each of the four categories.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Ask for json output mime type to enforce valid parsing
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty text response from Gemini");
    }

    try {
      const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedArticles = JSON.parse(cleanedText);
      if (Array.isArray(parsedArticles) && parsedArticles.length > 0) {
        console.log(`Successfully parsed ${parsedArticles.length} live grounded articles!`);
        
        // Enrich URLs if Gemini output generic strings
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const fallbackUrls = chunks ? chunks.map(chunk => chunk.web?.uri).filter(Boolean) as string[] : [];
        
        const validatedArticles: Article[] = parsedArticles.map((art: any, index: number) => {
          let category: any = "product_tech";
          if (["financial", "product_tech", "licensing_pricing", "leadership"].includes(art.category)) {
            category = art.category;
          }
          
          let sentiment: any = "neutral";
          if (["positive", "neutral", "negative"].includes(art.sentiment)) {
            sentiment = art.sentiment;
          }

          let artUrl = art.url || "https://news.microsoft.com/";
          if ((!artUrl || artUrl === "https://news.microsoft.com/") && fallbackUrls.length > 0) {
            artUrl = fallbackUrls[index % fallbackUrls.length];
          }

          return {
            id: art.id || `live-${category}-${index}-${Date.now()}`,
            title: art.title || "Latest Microsoft update",
            summary: art.summary || "Microsoft announced updates concerning general system development and cloud scalability.",
            category: category,
            url: artUrl,
            source: art.source || "Microsoft Corporate News",
            publishedDate: art.publishedDate || new Date().toISOString().split("T")[0],
            sentiment: sentiment,
            impactScore: Number(art.impactScore) || 5,
            keyTakeaways: Array.isArray(art.keyTakeaways) ? art.keyTakeaways.slice(0, 4) : ["Significant enterprise implications", "Demonstrates continuing AI product strategy"],
          };
        });

        return { articles: validatedArticles, isRealTime: true };
      } else {
        throw new Error("Parsed JSON is not a valid list");
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON. Response text was:\n", responseText, parseError);
      throw parseError;
    }
  } catch (error) {
    console.error("Error communicating with Gemini Search Grounding API:", error);
    return { articles: FALLBACK_ARTICLES, isRealTime: false };
  }
}

// ----------------------
// REST API ENDPOINTS
// ----------------------

// 1. Get categorized news (cached for 15 minutes unless refreshed)
app.get("/api/news", async (req, res) => {
  const forceRefresh = req.query.refresh === "true";
  const now = new Date();

  // Check if cache is valid (15 minutes limit)
  const isCacheExpired = !newsCache || 
    (now.getTime() - new Date(newsCache.lastUpdated).getTime() > 15 * 60 * 1000);

  if (forceRefresh || isCacheExpired) {
    console.log(`Cache missing, expired or refresh requested. Fetching fresh news (forceRefresh: ${forceRefresh})...`);
    const result = await fetchNewsViaGemini();
    newsCache = {
      articles: result.articles,
      lastUpdated: now.toISOString()
    };
    isCacheLive = result.isRealTime;
  }

  res.json({
    articles: newsCache.articles,
    lastUpdated: newsCache.lastUpdated,
    isLive: isCacheLive,
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
  });
});

// 2. Custom Intelligence query endpoint
app.post("/api/query", async (req, res) => {
  const { query } = req.body;
  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query is required" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Elegant local fallback QA model
    console.log(`Local static QA executing for user query: "${query}"`);
    let answer = "Answering query with pre-seeded Corporate intelligence:\n\n";
    if (query.toLowerCase().includes("finance") || query.toLowerCase().includes("earning") || query.toLowerCase().includes("stock")) {
      answer += "Microsoft continues to exhibit high growth, particularly in its Cloud division. In standard 2026 performance matrices, Intelligent Cloud accounts for over 42% of total corporate revenues, and Azure AI expansions have increased baseline operating margin yields. Stock sentiments remain predominantly resilient and positive due to early strategic positioning with advanced multimodal engines.";
    } else if (query.toLowerCase().includes("licens") || query.toLowerCase().includes("pricing")) {
      answer += "Microsoft has introduced flexible tiered licensing structures for Copilot. Multi-year commitments reduce baseline M365 Copilot licensing down to $22/user/month, while premium collaborative workspace autonomous agents start at $45/user/month. Windows Server 2026 core-based licenses now incorporate localized GPU physical acceleration limits.";
    } else if (query.toLowerCase().includes("executive") || query.toLowerCase().includes("leadership") || query.toLowerCase().includes("nadella")) {
      answer += "Satya Nadella continues as CEO, pushing heavily into autonomous and modular agency. The recently formed unified AI divisions fall under newly created VP and executive safety roles designed to coordinate internal systems and maintain policy-level alignment with evolving international AI standards.";
    } else {
      answer += "Based on stored Microsoft corporate briefings, Microsoft's core engineering focus centers heavily around agentic productivity workspaces (Copilot 3.0), decentralized hardware integrations via Copilot+ PCs, and solidifying cloud margins across regional data centers (such as the recent $10B clean-energy Scandinavian expansions).";
    }

    return res.json({
      answer: answer + "\n\n*(Note: Configure a valid GEMINI_API_KEY in the Secrets panel to activate live web searches regarding latest updates.)*",
      sources: [
        { title: "Microsoft Investor Relations", url: "https://www.microsoft.com/en-us/investor" },
        { title: "Microsoft Security and Trust Center", url: "https://news.microsoft.com/" }
      ]
    });
  }

  try {
    console.log(`Running grounded web search query for user: "${query}"`);
    const systemPrompt = `You are a professional Microsoft Corporate Intelligence Advisor. Answer the user's research question comprehensively based on current, real-time web information.
Construct a highly professional response using Markdown. Organize it with clear headings, bullets, and bold terms where necessary. Mention specific figures, dates, or product details if available.
Always maintain an objective corporate analyst tone. Highlight sources and verify facts.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "No response generated.";
    
    // Extract search grounding sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map(chunk => ({
        title: chunk.web?.title || "Web Resource",
        url: chunk.web?.uri || ""
      }))
      .filter(source => source.url !== "");

    // De-duplicate sources
    const seenUrls = new Set<string>();
    const uniqueSources = sources.filter(source => {
      if (seenUrls.has(source.url)) return false;
      seenUrls.add(source.url);
      return true;
    });

    res.json({
      answer: text,
      sources: uniqueSources
    });
  } catch (error: any) {
    console.error("Gemini query search failed:", error);
    res.status(500).json({ error: "Intelligence analysis failed, please try again." });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve index.html for SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
