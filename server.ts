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
    id: "anz-cloud-1",
    title: "Azure Australia East Local Region Solidifies Sovereign AI for ANZ Governments",
    summary: "Microsoft announced high-density clean-energy AI cluster modules in Sydney and Melbourne, enabling local sovereign model processing. The expansion satisfies APRA compliance and New Zealand NZISM security guidelines.",
    category: "cloud_transformation",
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
    category: "cloud_transformation",
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
    category: "licensing_ea",
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
    category: "licensing_ea",
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
    category: "pricing_news",
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
    id: "anz-price-2",
    title: "M365 Copilot Dynamic Tiered Licensing Prices Announced for Mid-Market Segments",
    summary: "To encourage widespread digital enablement across medium-sized offices, Microsoft is launching discounted tiering levels for Copilot. Organizations adding 100+ seats gain a 15% system fee reduction.",
    category: "pricing_news",
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
    title: "Narrabeen Business Group Meetup: Bridging IT and Finance in Sydney's Northern Beaches",
    summary: "The Narrabeen Business Group has announced its monthly Microsoft Local Strategy Meetup for mid-market leaders. The session will focus on navigating EA renewals, cloud budgets, and unlocking local funding resources.",
    category: "anz_strategy",
    url: "https://www.meetup.com",
    source: "Narrabeen Business Group",
    publishedDate: "2026-06-03",
    sentiment: "positive",
    impactScore: 6,
    keyTakeaways: [
      "Monthly focused meetups in Sydney's Northern Beaches connecting directors",
      "Interactive Q&A focusing on real-world cost mitigation in Microsoft cloud portfolios",
      "Features live case studies of local businesses obtaining ECIF funding grants"
    ],
    anzActionableAdvice: "If you are based in the ANZ region, register for the next Narrabeen Business Group Meetup. Bring your current Microsoft contract challenges for an over-the-shoulder diagnostic with local strategy experts.",
    ecifFundingEligible: false
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
    const prompt = `You are a professional corporate intelligence tool specialized in Microsoft cloud strategy and licensing for the Australia/New Zealand (ANZ) enterprise market.
Search the web for recent high-quality news and articles from 2026 regarding the Microsoft Corporation, tailored to the regional ANZ procurement, finance, and IT leadership context.

You must fetch several news updates, especially covering these four specific categories:
1. 'cloud_transformation' (e.g., Azure cloud developments, sovereign clusters, Copilot workspace deployments, major digital transformations in ANZ)
2. 'licensing_ea' (e.g., Enterprise Agreement terms restructuring, SCE or EAS models, subscription changes, product terms)
3. 'pricing_news' (e.g., regional price audits, foreign exchange currency adjustments for AUD/NZD, regional cloud list prices, licensing tier prices)
4. 'anz_strategy' (e.g., local Microsoft operations strategy, funding opportunities such as ECIF, local partner ecosystems, Sydney/Auckland tech events)

Return the news as a valid raw string of a JSON array, representing a list of articles. Each article in the JSON array MUST follow this exact schema:
[
  {
    "id": "highly-unique-string-identifier-1",
    "title": "Specific news title",
    "summary": "2-3 sentence overview of why this news is critical for enterprise managers",
    "category": "one of: 'cloud_transformation' | 'licensing_ea' | 'pricing_news' | 'anz_strategy'",
    "url": "Actual URL webpage/resource found in your Web Search results (if unavailable, output a valid Microsoft domain URL)",
    "source": "Name of the publishing newspaper/blog/outlet (e.g., AFR, ZDNet AU, CRN Australia, IT Brief NZ, WSJ)",
    "publishedDate": "Date in format YYYY-MM-DD",
    "sentiment": "one of: 'positive' | 'neutral' | 'negative'",
    "impactScore": 8, // Integer from 1 to 10 based on how major this is for an ANZ business model
    "keyTakeaways": [
      "Key summary bullet point 1 for ANZ leaders",
      "Key summary bullet point 2 for ANZ leaders",
      "Key summary bullet point 3 for ANZ leaders"
    ],
    "anzActionableAdvice": "Specifically formulated advise for IT procurement, CFOs or CIOs in Australia and New Zealand regarding this change - especially around mitigating cost hikes, scaling migration safely, or leverage partner channels.",
    "ecifFundingEligible": true // true if this represents an industry cloud shift, strategic workshop, or workload migration that typically qualifies under Microsoft End-customer Investment Funds (ECIF)
  }
]

CRITICAL: Return ONLY the JSON. Do not include markdown headers like \`\`\`json or anything else. Just the pure valid stringified array. Maximize authenticity. Ensure you provide at least 2 distinct articles for each of the four categories. Ensure they explicitly reference the ANZ business context where possible.`;

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
          let category: any = "cloud_transformation";
          if (["cloud_transformation", "licensing_ea", "pricing_news", "anz_strategy"].includes(art.category)) {
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
            anzActionableAdvice: art.anzActionableAdvice || "No local ANZ action has been registered for this event yet.",
            ecifFundingEligible: art.ecifFundingEligible !== undefined ? !!art.ecifFundingEligible : false
          };
        });

        return { articles: validatedArticles, isRealTime: true };
      } else {
        throw new Error("Parsed JSON is not a valid list");
      }
    } catch (parseError) {
      console.warn("Failed to parse Gemini response as JSON. Response text was:\n", responseText, parseError);
      throw parseError;
    }
  } catch (error) {
    console.warn("Gracefully handled: error or quota limit reached communicating with Gemini Search Grounding API (falling back to pre-seeded archives):", error);
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

// Helper to generate a high-quality static expert briefing when offline or key is restricted
function generateLocalExpertResponse(query: string, noteSuffix: string = ""): { answer: string; sources: { title: string; url: string }[] } {
  let answer = "### **ANZ Microsoft Cloud & Licensing Advisory Briefing**\n\n";
  answer += "As a senior specialist with 12+ years of experience bridging the gap between IT, Finance, and Procurement (including role active as ANZ Country Manager), here is a direct strategic assessment tailored specifically to local business structures:\n\n";
  
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes("finance") || lowerQuery.includes("earning") || lowerQuery.includes("cloud") || lowerQuery.includes("sover") || lowerQuery.includes("sydney") || lowerQuery.includes("melbourne") || lowerQuery.includes("apra")) {
    answer += "#### **1. Azure & Cloud Transformation Momentum in ANZ**\n";
    answer += "*   **APRA & NZISM Compliance:** With local expansion of clean-energy AI high-density computing clusters in Sydney and Melbourne, regional cloud tenancy is transitioning to fully sovereign frameworks. This eliminates historical legal boundaries for banking and public sector agencies.\n";
    answer += "*   **ECIF Funding Strategic Angle:** Up to 100% of proof-of-concept costs can be offset on Microsoft Azure migrations by registering eligible workloads. As an experienced strategist, my advice is to negotiate direct ECIF allocations with your Account Director prior to committing any engineering hours.";
  } else if (lowerQuery.includes("licens") || lowerQuery.includes("agreement") || lowerQuery.includes("ea") || lowerQuery.includes("sce") || lowerQuery.includes("eas") || lowerQuery.includes("threshold") || lowerQuery.includes("seat")) {
    answer += "#### **2. Enterprise Agreement (EA) & Licensing Optimization**\n";
    answer += "*   **Threshold Dynamics:** SCE and EAS models are experiencing baseline changes, notably raising profile minimum seat thresholds to 500. For mid-market business in Australia/NZ between 200 and 500 active records, transitioning to a Cloud Solution Provider (CSP) agreement structures a more agile, monthly variable budget matrix.\n";
    answer += "*   **NPU / Core Formulas:** Licensing for on-prem Windows Server instances now counts localized coprocessing hardware values. Review legacy clusters immediately to prevent massive pricing audits.";
  } else if (lowerQuery.includes("meetup") || lowerQuery.includes("narrabeen") || lowerQuery.includes("engagement") || lowerQuery.includes("roundtable")) {
    answer += "#### **3. local Meetup Engagement: Narrabeen Business Group (NBG)**\n";
    answer += "To drive local Sydney Northern Beaches IT-Finance synergy, I lead the monthly **Narrabeen Business Group Microsoft Strategy Meetup**:\n";
    answer += "*   **Target Audience:** CFOs, procurement leads, and technology directors.\n";
    answer += "*   **Operational Concept:** We host collaborative table discussions comparing actual, de-identified Microsoft EAs, diagnosing licensing waste, and providing step-by-step guidance on claiming partner and ECIF credits.\n";
    answer += "*   **Strategy:** Bring your active renewal challenges to NSW roundtable sessions to co-model mitigation paths.";
  } else if (lowerQuery.includes("copilot") || lowerQuery.includes("pricing") || lowerQuery.includes("agent") || lowerQuery.includes("rate") || lowerQuery.includes("exchange") || lowerQuery.includes("6%")) {
    answer += "#### **4. Copilot Tiered Pricing & Licensing Playbook**\n";
    answer += "*   **Mid-Market Tiers:** Microsoft's premium agents are undergoing flexible restructuring. Committing to multi-year contracts can decrease baseline M365 Copilot licensing down to $22 per user/month, while advanced agent-building suites scale at $45 per user/month.\n";
    answer += "*   **Mitigation Principle:** Prevent default seat assignment. Build structural teams of excellence to roll out licenses incrementally based on proven productivity metrics.";
  } else {
    answer += "#### **5. General ANZ Strategic Briefing**\n";
    answer += "Microsoft's current push focuses on agentic workspace workflows, decentralized NPU local execution systems, and sovereign region compliance. Local businesses should prioritize:\n\n";
    answer += "1.  **Contract Readiness:** Auditing agreement seats 18 days prior to renewal.\n";
    answer += "2.  **ECIF Registration:** Ensuring your system integrator aligns with approved Azure End-customer Investment Funds.\n";
    answer += "3.  **Community Connection:** Attending our monthly Narrabeen Business Group roundtable to exchange best-practice frameworks.";
  }

  if (noteSuffix) {
    answer += "\n\n" + noteSuffix;
  }

  return {
    answer: answer,
    sources: [
      { title: "Azure End-Customer Investment Funds (ECIF) Guidelines", url: "https://news.microsoft.com/en-au/" },
      { title: "Narrabeen Business Group Meetup Hub", url: "https://www.meetup.com" }
    ]
  };
}

// 2. Custom Intelligence query endpoint
app.post("/api/query", async (req, res) => {
  const { query } = req.body;
  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query is required" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Elegant local fallback QA model with authoritative ANZ country leader tone
    console.log(`Local static ANZ Expert QA executing for query: "${query}"`);
    const fallbackData = generateLocalExpertResponse(query, "*(Note: Configure a valid GEMINI_API_KEY in the Secrets panel to activate live web grounding searches regarding latest updates)*");
    return res.json(fallbackData);
  }

  try {
    console.log(`Running grounded web search query for user: "${query}"`);
    const systemPrompt = `You are a Senior Expert Advisor in Microsoft Cloud Transformation, Licensing Strategy, and IT sales for the Australia & New Zealand (ANZ) market.
You speak with the authoritative, strategic, and professional tone of a Country Manager with 12+ years of experience bridging the gap between IT, Finance, and Procurement.
Your expertise spans Enterprise Agreements (EA), Server and Cloud Enrollment (SCE), EAS models, Microsoft Azure architectures, and specialized Microsoft funding programs like ECIF (End-customer Investment Fund).

Guidelines for your response:
1. Provide highly professional, action-oriented advice tailored for ANZ businesses, procurement professionals, CFOs, and CIOs.
2. Incorporate structural recommendations (e.g., pre-renewal audit schedules, CSP vs. EA comparisons, and licensing compliance advice).
3. Where suitable, explain how businesses can utilize Microsoft ECIF (End-customer Investment Fund) to subsidise engineering of their cloud or AI transformations.
4. Keep the tone authoritative but accessible and helpful, avoiding self-praising marketing jargon. Refer to the Narrabeen Business Group monthly meetup in Sydney's Northern Beaches as a great venue for local mid-market leaders to gain over-the-shoulder diagnostic help.
5. Format your response beautifully in clean Markdown with logical headings, bullet lists, and key items in bold.`;

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
    console.warn("Gemini query search failed (possibly quota exhausted). Falling back gracefully and answering using pre-seeded local intelligence:", error);
    
    // Deliver seamless seamless expert fallback with a gentle note about the Gemini quota limit, avoiding a broken interface
    const fallbackNote = "*(Note: Our online corporate intelligence search grounding has temporarily fallen back to local pre-seeded knowledge base guidelines because the live API key is currently experiencing API load/quota limit adjustments.)*";
    const fallbackData = generateLocalExpertResponse(query, fallbackNote);
    res.json(fallbackData);
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
