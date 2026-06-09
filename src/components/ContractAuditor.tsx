import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileCheck, 
  AlertTriangle, 
  Percent, 
  ShieldAlert, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Download, 
  Sparkles, 
  ChevronRight, 
  Info,
  RefreshCw,
  HelpCircle,
  TrendingDown,
  ShieldCheck
} from "lucide-react";
import { NewsCategory } from "../types";

interface AuditResult {
  riskScore: number; // 0 to 100
  complianceGrade: "A" | "B" | "C" | "D" | "F";
  complianceStatus: string;
  ecifFundingEligible: boolean;
  estimatedSavingPercent: number;
  identifiedRisks: string[];
  actionableRecommendations: string[];
}

interface ContractClauseTemplate {
  id: string;
  name: string;
  type: string;
  text: string;
  desc: string;
}

const TEMPLATE_CLAUSES: ContractClauseTemplate[] = [
  {
    id: "sov-data-4",
    name: "Clause 4.2 - Azure Sovereign Data Custody (Standard Sydney Region)",
    type: "Sovereignty / Compliance",
    desc: "Specifies cloud storage location and regulatory constraints for Australian federal pipelines under ASD rules.",
    text: "Microsoft guarantees that Customer Content stored in the Sydney Azure Sovereign Cloud Region will remain physically localized within Australian geographic borders. However, telemetry metadata, systemic error diagnostics, and administrative monitoring statistics may be securely backhauled to Azure Core services located in non-Australian jurisdictions for service optimization operations under standard GDPR regulatory safe-harbors."
  },
  {
    id: "ecif-co-invest",
    name: "Clause 11.5 - ECIF Dynamic Co-investment & Partner Account-Funded Pilot",
    type: "Funding & Incentives",
    desc: "Specifies conditions for Microsoft Account Team co-investing in client cloud transformation.",
    text: "Microsoft shall match up to 50% of the certified implementation partner's pilot workload installation cost via the End-Customer Investment Fund (ECIF), provided the Partner registers the scope in Microsoft Partner Center. If Azure consumption (ACR) doesn't achieve target thresholds of $120,000 monthly run-rate within 12 months, Microsoft reserves claw-back rights of up to 100% of advanced pilot funding from the Partner Partner Accounts allocation."
  },
  {
    id: "ea-discount-8",
    name: "Clause 8.1 - Enterprise Agreement (EA) Multi-Year Commitment Pricing",
    type: "Licensing & Pricing",
    desc: "Specifies price step-up offsets and escalation rules for 36-month terms.",
    text: "The Customer agrees to purchase and maintain active Microsoft 365 E5 and Core CAL licenses for 100% of Qualified Users. If corporate workforce headcount retracts or licenses are unassigned, the Customer may decrease overall subscription commitments by at most 10% on the anniversary date. All price protection updates are fixed for 36 months, with an escalating rate of 4.5% applied exclusively on the primary SCE renewal extension."
  },
  {
    id: "unified-support",
    name: "Clause 18.3 - Unified Support Addendum Guarantee SLA",
    type: "Operations & support",
    desc: "Guarantees on incident response severity levels and advisory availability.",
    text: "Microsoft will deliver technical support through the Unified Enterprise Tier. Response guarantees are 30 minutes for Severity 1 incidents and 2 hours for Severity 2 incidents. Failure to meet these timelines over three consecutive months triggers technical service credits equivalent to 5% of the annual support fee surcharge premium, capped at a maximum aggregate limit of 15%."
  }
];

interface ContractAuditorProps {
  addToast: (category: NewsCategory, title: string, message: string) => void;
  isDark: boolean;
}

export const ContractAuditor: React.FC<ContractAuditorProps> = ({ addToast, isDark }) => {
  const [contractType, setContractType] = useState<string>("ea");
  const [termValue, setTermValue] = useState<number>(1500000);
  const [discountTier, setDiscountTier] = useState<number>(15);
  const [customText, setCustomText] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("sov-data-4");
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditDone, setAuditDone] = useState<boolean>(false);
  const [auditReport, setAuditReport] = useState<AuditResult | null>(null);

  // Set the clause text dynamically if template changes
  const activeTemplateText = TEMPLATE_CLAUSES.find(c => c.id === selectedTemplate)?.text || "";
  const textToAudit = customText || activeTemplateText;

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    setCustomText("");
    setAuditDone(false);
  };

  const handleRunAudit = () => {
    if (!textToAudit.trim()) {
      addToast("licensing_pricing", "Empty Snippet", "Please input or select a contract clause before running the auditor.");
      return;
    }

    setIsAuditing(true);
    setAuditDone(false);

    // Simulate deeply professional analysis taking 2.2 seconds
    setTimeout(() => {
      // Logic-driven mock analysis based on text markers to provide dynamic feedback
      const textLower = textToAudit.toLowerCase();
      let calculatedRisk = 30;
      let calculatedSaving = discountTier + 2; 
      let isEcif = false;
      const risks: string[] = [];
      const suggestions: string[] = [];

      // Type-specific baseline adjustments
      if (contractType === "ea") {
        calculatedRisk += 10;
        suggestions.push("Leverage Microsoft Enterprise Agreement Anniversary true-down clauses to reduce under-assigned seats.");
      } else if (contractType === "sce") {
        calculatedRisk += 15;
        suggestions.push("Validate Server and Cloud Enrollment commitments against Azure hybrid hybrid-benefit licensing rules.");
      } else if (contractType === "csp") {
        calculatedSaving = 8;
        suggestions.push("Negotiate direct indirect-seller discounts via certified tier-1 MSP partners in ANZ region.");
      }

      // Check key phrases in contract body
      if (textLower.includes("metadata") || textLower.includes("backhaul") || textLower.includes("non-australian")) {
        calculatedRisk += 25;
        risks.push("Foreign Jurisdiction Metadata Backhauling: Telemetry transit outside Australian borders breaches Level 4 protective requirements.");
        suggestions.push("Ensure your ASD IRAP certified deployment explicitly defines metadata handling parameters in the standard SLA addendum.");
      }

      if (textLower.includes("claw-back") || textLower.includes("clawback") || textLower.includes("acr")) {
        calculatedRisk += 20;
        calculatedSaving += 5; // higher financial stakes
        isEcif = true;
        risks.push("Claw-Back Provisions: The 100% pilot refund penalty for failing to achieve targeted consumption poses material financial exposure.");
        suggestions.push("Confirm that consumption projections are validated by a third-party FinOps analyst before executing this pilot funding commitment.");
      }

      if (textLower.includes("escalating rate") || textLower.includes("anniversary date")) {
        calculatedRisk += 15;
        risks.push("Inflationary Lock-In escalator: The annual price escalators limit benefits of fixed 36-month subscription guarantees.");
        suggestions.push("Seek to cap the pricing escalation factors to a maximum of 3% or tie them strictly to localized CPI metrics.");
      }

      if (textLower.includes("unified support")) {
        calculatedRisk += 10;
        suggestions.push("Audit standard technical services response rates using Azure Monitor metrics before committing to Unified Tier premiums.");
      }

      // Cap bounds
      calculatedRisk = Math.min(95, Math.max(10, calculatedRisk));
      let grade: "A" | "B" | "C" | "D" | "F" = "A";
      let statusStr = "Optimized & Low-Risk Contract Alignment";

      if (calculatedRisk >= 80) {
        grade = "F";
        statusStr = "Critical Compliance Exposure Detected";
      } else if (calculatedRisk >= 60) {
        grade = "D";
        statusStr = "Major Financial or Regulatory Risks Found";
      } else if (calculatedRisk >= 40) {
        grade = "C";
        statusStr = "Moderate Operational Warnings";
      } else if (calculatedRisk >= 20) {
        grade = "B";
        statusStr = "Satisfactory Licensing Structure";
      }

      // Add standard recommendations if empty
      if (risks.length === 0) {
        risks.push("No severe clauses or immediate data compliance warnings trigger major priority action items.");
      }
      if (suggestions.length === 0) {
        suggestions.push("Validate standard True-up terms with your account executive ahead of annual calendar reviews.");
      }

      setAuditReport({
        riskScore: calculatedRisk,
        complianceGrade: grade,
        complianceStatus: statusStr,
        ecifFundingEligible: isEcif || textLower.includes("funding") || termValue > 1000000,
        estimatedSavingPercent: calculatedSaving,
        identifiedRisks: risks,
        actionableRecommendations: suggestions
      });

      setIsAuditing(false);
      setAuditDone(true);
      addToast(
        "licensing_pricing",
        "Contract Audit Complete",
        `Assessed snippet with Risk Score of ${calculatedRisk}% (Grade ${grade})`
      );
    }, 2200);
  };

  const downloadAuditPDF = () => {
    if (!auditReport) return;
    addToast("licensing_pricing", "Generating Advisor Report", "Assembling contract auditing findings into static layout...");
    
    // Simulate generation and download
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([
        `========================================================================\n`,
        `   MICROSOFT CO-INVESTMENT & LICENSING ADVISORY SERVICE: CONTRACT AUDIT\n`,
        `========================================================================\n`,
        `Generated: ${new Date().toLocaleString()}\n`,
        `Contract Type Profile: ${contractType.toUpperCase()}\n`,
        `Indicative Value: $${termValue.toLocaleString()}\n`,
        `Discount Applied: ${discountTier}%\n\n`,
        `AUDIT APPRAISAL RESULT:\n`,
        `-----------------------\n`,
        `Compliance Assessment Grade: ${auditReport.complianceGrade}\n`,
        `Status Description: ${auditReport.complianceStatus}\n`,
        `Assessed Clause Risk Rating: ${auditReport.riskScore}/100\n`,
        `Eligible for ECIF Co-Investment: ${auditReport.ecifFundingEligible ? "YES" : "NO"}\n`,
        `Estimated Optimized Saving Ratio: ${auditReport.estimatedSavingPercent}%\n\n`,
        `IDENTIFIED RISK EXPOSURES:\n`,
        ...auditReport.identifiedRisks.map((r, i) => `  [${i+1}] ${r}\n`),
        `\nACTIONABLE COMPLIANCE ADVISORY NOTES:\n`,
        ...auditReport.actionableRecommendations.map((r, i) => `  [${i+1}] ${r}\n`),
        `\n========================================================================\n`,
        `CONFIDENTIALITY NOTICE: This strategic digest represents the preliminary pricing,\n`,
        `SLA, and security compliance review based on the ground rules of the ANZ region.\n`
      ], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `MSFT_Contract_Audit_Report_${contractType.toUpperCase()}_Assessed.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      addToast("licensing_pricing", "Audit Ledger Downloaded", "Strategic audit report downloaded to device successfully.");
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="contract-auditor-root-dashboard">
      
      {/* Left Input panel (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Profile Card & Parameters */}
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-[#111827] border-slate-805" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                Contract Profile Parameters
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">Specify agreement terms & regional thresholds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Agreement Type */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5 font-bold">
                Agreement Type
              </label>
              <select
                value={contractType}
                onChange={(e) => { setContractType(e.target.value); setAuditDone(false); }}
                className={`w-full text-xs font-semibold px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                  isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300 text-slate-800"
                }`}
              >
                <option value="ea">Enterprise Agreement (EA)</option>
                <option value="sce">Server & Cloud Enrollment (SCE)</option>
                <option value="csp">Cloud Solution Provider (CSP)</option>
                <option value="direct">Direct Web / Sovereign Subscription</option>
              </select>
            </div>

            {/* Total Annual Value */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5 font-bold">
                Est. Contract Value (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs font-bold">$</span>
                <input
                  type="number"
                  value={termValue}
                  onChange={(e) => { setTermValue(Number(e.target.value)); setAuditDone(false); }}
                  className={`w-full text-xs font-mono font-bold pl-7 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    isDark ? "bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-600" : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                  placeholder="500000"
                />
              </div>
            </div>

            {/* Discount Target Percentage */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5 font-bold">
                Targeted Discount %
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountTier}
                  onChange={(e) => { setDiscountTier(Number(e.target.value)); setAuditDone(false); }}
                  className={`w-full text-xs font-mono font-bold pl-3 pr-8 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                />
                <span className="absolute right-3 top-2 text-slate-500 font-mono text-xs font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clause Ingestion & Selection */}
        <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${isDark ? "bg-[#111827] border-slate-805" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  Document Clause Scope Auditor
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">Ingest contract clauses with local sovereignty markers</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-400">
              <ShieldCheck className="w-3 h-3 animate-pulse" />
              <span>Sovereign Compliance Verified</span>
            </div>
          </div>

          {/* Quick templates */}
          <div>
            <span className="block text-[10px] font-mono text-slate-400 uppercase mb-2 font-bold">
              Select Pre-set Multi-Year Strategic Clauses:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {TEMPLATE_CLAUSES.map((tpl) => (
                <button
                  type="button"
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className={`p-2.5 text-left rounded-xl border text-[11px] transition-all duration-150 cursor-pointer flex flex-col justify-between h-20 ${
                    selectedTemplate === tpl.id && !customText
                      ? "bg-indigo-550/15 border-indigo-500 text-white"
                      : isDark
                        ? "bg-slate-900/60 border-slate-850 hover:bg-slate-900 text-slate-300 hover:border-slate-700"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-705 hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold line-clamp-1">{tpl.name}</div>
                  <div className="text-[9px] opacity-75 font-mono line-clamp-2 mt-1">{tpl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold">
                Contract Text / Scope of Work Snippet
              </label>
              {customText && (
                <button
                  onClick={() => { setCustomText(""); setAuditDone(false); }}
                  className="text-[9px] font-mono text-sky-400 hover:underline hover:text-sky-300 cursor-pointer"
                >
                  Reset to Template
                </button>
              )}
            </div>
            <textarea
              value={customText || activeTemplateText}
              onChange={(e) => { setCustomText(e.target.value); setAuditDone(false); }}
              rows={5}
              placeholder="Paste custom contract terms, annexes, or executive SLA metrics to assess regulatory & financial risks..."
              className={`w-full text-xs p-3.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-650"
                  : "bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Button Action */}
          <div className="flex items-center justify-between gap-4 mt-1">
            <p className="text-[10px] text-slate-500 max-w-sm leading-snug">
              Note: Contract audits inspect for GDPR metadata leaks, financial SLA structures, claw-back terms, and ECIF co-investment eligibility.
            </p>
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_14px_rgba(99,102,241,0.35)] shrink-0 transition-transform active:scale-95 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-white ${isAuditing ? "animate-spin" : ""}`} />
              <span>{isAuditing ? "Analyzing clause structures..." : "Run Advisor Audit"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Output panel (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Results assessment details */}
        <div className={`p-6 rounded-2xl border min-h-[400px] flex flex-col justify-between ${
          isDark 
            ? "bg-[#111827] border-slate-805" 
            : "bg-white border-slate-200 shadow-sm"
        }`}>
          <AnimatePresence mode="wait">
            {!isAuditing && !auditDone && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-6"
              >
                <div className="w-14 h-14 bg-slate-500/10 rounded-full flex items-center justify-center border border-slate-500/15 mb-4">
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  Awaiting Strategic Appraisal Ingestion
                </h4>
                <p className="text-xs text-slate-405 mt-2 max-w-sm leading-relaxed">
                  Select a template contract clause or enter standard pricing details, then click "Run Advisor Audit" to evaluate risk vectors, sovereign cloud compliance, and licensing cost savings estimates.
                </p>
                
                <div className="mt-6 p-3 rounded-xl border border-dashed border-sky-500/20 bg-sky-500/5 max-w-xs text-center">
                  <div className="flex items-center justify-center gap-1.5 text-sky-450 font-semibold text-[10px] uppercase font-mono mb-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Average Advisory Savings Metrics</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Firms negotiating dynamic SCE programs reduce monthly Azure consumption overruns by up to <strong className="text-white">22.5%</strong>.
                  </p>
                </div>
              </motion.div>
            )}

            {isAuditing && (
              <motion.div
                key="auditing-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-indigo-550/20 border-t-indigo-505 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                    Processing Advisory Grounding
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Cross-referencing ASD standards and regional funding criteria...</p>
                </div>
                <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full w-2/3 rounded-full animate-[shimmer_1.5s_infinite]" style={{ backgroundSize: "200% 100%" }}></div>
                </div>
              </motion.div>
            )}

            {!isAuditing && auditDone && auditReport && (
              <motion.div
                key="results-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col justify-between"
              >
                {/* Header overview grade */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800/40 pb-4 mb-4 gap-4">
                    <div>
                      <span className="text-[10px] font-bold font-mono tracking-wider text-sky-450 uppercase mb-0.5 block">
                        Audit Appraisal Ledger
                      </span>
                      <h4 className={`text-sm font-extrabold ${isDark ? "text-emerald-400" : "text-emerald-600"} truncate`}>
                        {auditReport.complianceStatus}
                      </h4>
                    </div>
                    {/* Compliance Grade seal badge */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-sans font-black text-lg shadow ${
                        auditReport.complianceGrade === "A" || auditReport.complianceGrade === "B"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : auditReport.complianceGrade === "C"
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}>
                        {auditReport.complianceGrade}
                      </div>
                      <span className="text-[8px] text-slate-500 font-mono font-bold mt-1 uppercase tracking-widest">Grade</span>
                    </div>
                  </div>

                  {/* Meter bars Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    {/* Risk Rating bar */}
                    <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-900 border-slate-850" : "bg-slate-50 border-slate-200"}`}>
                      <div className="flex items-center justify-between mb-1 text-[10px] font-mono uppercase text-slate-500">
                        <span>Risk Score</span>
                        <span className={`font-bold ${
                          auditReport.riskScore >= 70 ? "text-rose-400" : auditReport.riskScore >= 40 ? "text-amber-400" : "text-emerald-400"
                        }`}>{auditReport.riskScore}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            auditReport.riskScore >= 70 ? "bg-rose-500" : auditReport.riskScore >= 40 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${auditReport.riskScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Saving Estimate */}
                    <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-900 border-slate-850" : "bg-slate-50 border-slate-200"}`}>
                      <div className="flex items-center justify-between mb-1 text-[10px] font-mono uppercase text-slate-500">
                        <span>Savings Boost</span>
                        <span className="font-bold text-sky-400">+{auditReport.estimatedSavingPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-sky-550 to-indigo-505 transition-all duration-300" 
                          style={{ width: `${Math.min(100, auditReport.estimatedSavingPercent * 2.5)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Highlights section (ECIF Co investment Eligibility etc) */}
                  <div className="space-y-4">
                    {/* Ingestion co-fund badge */}
                    <div className={`p-3 rounded-xl border border-dashed flex items-start gap-2.5 ${
                      auditReport.ecifFundingEligible 
                        ? "bg-indigo-500/5 border-indigo-550/20 text-indigo-400"
                        : "bg-slate-500/5 border-slate-800 text-slate-400"
                    }`}>
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                      <div>
                        <div className="text-[11px] font-bold">
                          Sovereign Pilot Co-investment Eligibility: {auditReport.ecifFundingEligible ? "ELIGIBLE" : "NOT APPLICABLE"}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                          {auditReport.ecifFundingEligible 
                            ? "This scope qualifies for co-funding via the End-Customer Investment Fund (ECIF) for Australian pilots."
                            : "Minimum cloud consumption levels or specific compliance scopes of work are pre-requisite for pilot incentives."}
                        </p>
                      </div>
                    </div>

                    {/* Identified risks */}
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400 uppercase mb-2 font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                        <span>Identified Compliance Exposures ({auditReport.identifiedRisks.length}):</span>
                      </span>
                      <ul className="space-y-1.5 text-xs">
                        {auditReport.identifiedRisks.map((risk, index) => (
                          <li key={index} className="flex gap-2 text-slate-300 leading-relaxed text-[11px]">
                            <span className="text-rose-500 shrink-0">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actionable recommendations */}
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400 uppercase mb-2 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                        <span>Actionable Advisor Adjustments:</span>
                      </span>
                      <ul className="space-y-1.5 text-xs">
                        {auditReport.actionableRecommendations.map((rec, index) => (
                          <li key={index} className="flex gap-2 text-slate-300 leading-relaxed text-[11px]">
                            <span className="text-emerald-500 shrink-0">▸</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer action button */}
                <div className="mt-6 pt-4 border-t border-slate-800/40 flex items-center justify-between">
                  <div className="text-[9px] text-slate-500 font-mono">
                    Audit Ref ID: ASD-L4-CFD-{contractType.toUpperCase()}
                  </div>
                  <button
                    onClick={downloadAuditPDF}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl border border-slate-700 transition duration-150 cursor-pointer text-xs"
                    title="Export Audit Report as static text document"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Download Audit Report</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
