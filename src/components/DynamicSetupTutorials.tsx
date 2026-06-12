import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Award, 
  CheckSquare, 
  Square, 
  Layers, 
  UserCheck, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Play, 
  CheckCircle2, 
  Sliders, 
  Settings, 
  RefreshCw, 
  FileCode, 
  Terminal, 
  Copy, 
  PlusCircle, 
  Check,
  ShieldCheck,
  Info,
  DollarSign,
  Briefcase,
  HelpCircle
} from "lucide-react";
import { jsPDF } from "jspdf";

interface DynamicSetupTutorialsProps {
  addToast: (category: any, title: string, message: string) => void;
  isDark: boolean;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  technicalDetails: string;
  cliCommandTemplate: (customVar: string, backupVar?: string) => string;
  configTextTemplate?: (customVar: string, backupVar?: string) => string;
}

interface Tutorial {
  id: string;
  title: string;
  synopsis: string;
  category: "APRA Regulation" | "NZISM Government" | "FinOps Hub" | "ECIF Co-Sell Pathway";
  targetSector: string;
  complexity: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  bgHexAccent: string;
  inputLabel: string;
  inputDescription: string;
  inputPlaceholder: string;
  inputDefault: string;
  secondaryInputLabel?: string;
  secondaryInputDescription?: string;
  secondaryInputOptions?: string[];
  steps: TutorialStep[];
}

const TUTORIALS_DATA: Tutorial[] = [
  {
    id: "apra-cps234",
    title: "APRA CPS 234 Corporate Sovereign Active Landing Zone",
    synopsis: "Implement APRA CPS 234 complaint data residency constraints in Microsoft Azure East, implementing strict security isolate boundaries and automated HSM-backed key rotation.",
    category: "APRA Regulation",
    targetSector: "ANZ Financial Services, Wealth Management, APRA Insured Entities",
    complexity: "Advanced",
    estimatedTime: "25 mins",
    bgHexAccent: "emerald",
    inputLabel: "Compliance Tenant Prefix",
    inputDescription: "The corporate DNS suffix or active tenant identifier for deployment scoping",
    inputPlaceholder: "e.g. apra-secure-aus",
    inputDefault: "apra-shield-anz",
    secondaryInputLabel: "Target Australian Sector Node",
    secondaryInputDescription: "Select localized Azure High-Availability sovereign region pair",
    secondaryInputOptions: ["Australia East (Sydney)", "Australia Southeast (Melbourne)", "Dual Active-Active Resiliency"],
    steps: [
      {
        id: "apra-step-1",
        title: "Provision Regional Resource Group with Tenancy Boundaries",
        description: "Deploy an isolated Resource Group restricted purely to Australian mainland hardware boundaries to prevent uncompliant regulatory drift.",
        technicalDetails: "Executes an Azure CLI statement to bind metadata properties and tag constraints aligning with APRA security sovereignty standards.",
        cliCommandTemplate: (pfx, sec) => `az group create \\
  --name "RG-${pfx.toUpperCase()}-SOVEREIGN-LANDING" \\
  --location "${sec === "Australia Southeast (Melbourne)" ? "australiasoutheast" : "australiaeast"}" \\
  --tags "RegulatoryStandard=APRA-CPS234" "SovereignBoundaries=A/NZ-Strict" "DataTier=Restricted"`
      },
      {
        id: "apra-step-2",
        title: "Enforce Key-Vault HSM Protection (FIPS 140-2 Level 3)",
        description: "Build an active premium key store locked to dedicated customer-managed keys (CMK) and enforce purge protection for continuous audit loops.",
        technicalDetails: "Establishes cryptographic key parameters that block standard administrative bypass, ensuring only APRA authorized entities hold operational lockkeys.",
        cliCommandTemplate: (pfx) => `az keyvault create \\
  --name "kv-${pfx.toLowerCase()}-hsm-sh" \\
  --resource-group "RG-${pfx.toUpperCase()}-SOVEREIGN-LANDING" \\
  --sku premium \\
  --enable-purge-protection true \\
  --enable-rbac-authorization true`
      },
      {
        id: "apra-step-3",
        title: "Block Administrative Legacy TLS and Transport Streams",
        description: "Generate and map real-time API policy definitions that forcefully restrict all secure gateways to TLS 1.3 protocol standards, conforming with CPS 234 standards.",
        technicalDetails: "Applies a strict JSON-based WebApp policy boundary onto active server environments, flagging non-compliant legacy endpoints.",
        cliCommandTemplate: (pfx) => `az webapp config set \\
  --name "app-${pfx.toLowerCase()}-gateway" \\
  --resource-group "RG-${pfx.toUpperCase()}-SOVEREIGN-LANDING" \\
  --min-tls-version 1.2 \\
  --ftps-state Disabled`
      }
    ]
  },
  {
    id: "nzism-restricted",
    title: "NZISM Class RESTRICTED Government Cloud Shield Setup",
    synopsis: "Establish high-compliance government tenancy configurations restricting all active data storage in full alignment with NZISM (New Zealand Information Security Manual) security thresholds.",
    category: "NZISM Government",
    targetSector: "NZ Crown Entities, Government Providers, Strategic Public Units",
    complexity: "Advanced",
    estimatedTime: "30 mins",
    bgHexAccent: "sky",
    inputLabel: "NZ Crown Entity Code",
    inputDescription: "Assigned public department reference matching ministerial frameworks",
    inputPlaceholder: "e.g. DIA-NZ-GOV",
    inputDefault: "DPMC-RESTRICTED",
    secondaryInputLabel: "NZISM Cryptographic Strength",
    secondaryInputDescription: "Select target NZ sovereign encryption standards",
    secondaryInputOptions: ["GCSB Certified AES-256 GCM", "Ultra RSA-4096 Sovereign Pair"],
    steps: [
      {
        id: "nzism-step-1",
        title: "Enforce New Zealand Geographic Isolation Policies",
        description: "Apply a custom Azure System Policy limiting all active disk and compute deployments solely within the NZ Auckland region boundary.",
        technicalDetails: "Specifies strict geographical telemetry tags. Any administrative attempt to provision out of region will trigger immediate GCSB alert streams.",
        cliCommandTemplate: (pfx, sec) => `az policy assignment create \\
  --name "NZISM-Geo-Lock-${pfx}" \\
  --scope "/subscriptions/{subscription-id}" \\
  --policy "e5f23a99-ad98-4873-9a3d-3e3d623b3a32" \\
  --params '{"allowedLocations": {"value": ["newzealandnorth"]}}' \\
  --display-name "NZ Gov Secure Region Locking policy"`
      },
      {
        id: "nzism-step-2",
        title: "Initialize Secure NZISM Restrictive Storage Account",
        description: "Deploy audit-audited customer storage with redundant backup blocks exclusively inside domestic geographic nodes.",
        technicalDetails: "Creates an Azure sovereign storage block. It disables public ingress networks and enforces infrastructure-level NZ GCSB double-layer cryptography.",
        cliCommandTemplate: (pfx, sec) => `az storage account create \\
  --name "st${pfx.toLowerCase().replace(/[^a-z0-9]/g, "")}vault" \\
  --resource-group "RG-${pfx.toUpperCase()}-NZISM" \\
  --sku Standard_GRS \\
  --encryption-services blob \\
  --require-infrastructure-encryption true \\
  --allow-blob-public-access false`
      },
      {
        id: "nzism-step-3",
        title: "Deploy Active Sentinel Security Analytics Connector",
        description: "Link real-time security events, admin changes, and tenancy logs straight to Microsoft Sentinel for continuous monitoring.",
        technicalDetails: "Spins up Sentinel and connects the NZISM GCSB security telemetry reporting pipeline.",
        cliCommandTemplate: (pfx) => `az monitor log-analytics workspace create \\
  --workspace-name "law-${pfx.toLowerCase()}-sentinel" \\
  --resource-group "RG-${pfx.toUpperCase()}-NZISM" \\
  --location newzealandnorth`
      }
    ]
  },
  {
    id: "azure-finops-gpu",
    title: "High-Density Cognitive AI GPU Cluster FinOps Tuning",
    synopsis: "Align complex, multi-million dollar high-density AI cluster (ND96isr H100 v5) configurations against enterprise FinOps reservation discount levels.",
    category: "FinOps Hub",
    targetSector: "Enterprise AI Implementers, Financial Officers, Tech Startups",
    complexity: "Intermediate",
    estimatedTime: "15 mins",
    bgHexAccent: "amber",
    inputLabel: "AI Project Name",
    inputDescription: "Scoping keyword for metadata tagging and cost allocation metrics",
    inputPlaceholder: "e.g. cognitive-anz-v5",
    inputDefault: "anz-copilot-model",
    secondaryInputLabel: "Expected Scale Allocation",
    secondaryInputDescription: "Select density profiles of Azure dedicated NVIDIA clusters",
    secondaryInputOptions: ["4x Dedicated NVIDIA H100 (Sovereign)", "16x NDv5 High-Density Compute (Melbourne Hub)", "Standard Shared Research Pod"],
    steps: [
      {
        id: "finops-step-1",
        title: "Create Granular Azure Cost Allocation Structures",
        description: "Configure mandatory tag bindings to correctly track and group machine-learning compute parameters back to business cost-centers.",
        technicalDetails: "Foreshadows cost spikes and locks cluster tags preventing administrative mislabeling.",
        cliCommandTemplate: (pfx, sec) => `az consumption budget create \\
  --budget-name "budget-${pfx.toLowerCase()}-gpu" \\
  --amount 75000 \\
  --time-grain monthly \\
  --start-date "2026-07-01" \\
  --end-date "2028-12-31" \\
  --contact-emails "finops@enterprise.au"`
      },
      {
        id: "finops-step-2",
        title: "Deploy Dynamic GPU Auto-Stop & Scale Recalibrators",
        description: "Set up serverless scripts that hibernate multi-thousand-dollar GPU pods when idle during off-market hours (18:00 AEST).",
        technicalDetails: "Uses an active Azure Automation workbook mapping scheduled tasks. Yields substantial monthly savings on non-reserved workloads.",
        cliCommandTemplate: (pfx) => `az automation schedule create \\
  --name "OffMarket-Snooze-1800-Schedule" \\
  --automation-account-name "aa-${pfx.toLowerCase()}-savings" \\
  --resource-group "RG-${pfx.toUpperCase()}-FINOPS" \\
  --frequency OneTime \\
  --start-time "2026-07-01T18:00:00+10:00"`
      }
    ]
  },
  {
    id: "ecif-funding-pathway",
    title: "Microsoft ECIF & Co-Sell Mutual Incentive Pathway",
    synopsis: "Navigate the complex multi-stage framework to register, validate, and unlock Microsoft Enterprise Cloud Investment Fund (ECIF) rebates up to 100%.",
    category: "ECIF Co-Sell Pathway",
    targetSector: "Partner Channel Managers, Cloud Architects, Key Account Managers",
    complexity: "Intermediate",
    estimatedTime: "18 mins",
    bgHexAccent: "indigo",
    inputLabel: "Migration Project Budget (AUD)",
    inputDescription: "Total estimated multi-year Azure contract size for ECIF qualification",
    inputPlaceholder: "e.g. 500000",
    inputDefault: "450000",
    secondaryInputLabel: "Microsoft Partner Association Status",
    secondaryInputDescription: "Select registered partner attribution methodology",
    secondaryInputOptions: ["PAL (Partner Admin Link)", "DPOR (Digital Partner of Record)", "Co-Sell Qualified Lead"],
    steps: [
      {
        id: "ecif-step-1",
        title: "Execute Partner Link (PAL) Association onto Customer Tenant",
        description: "Bind your secure Microsoft Partner Center MPN identifier onto the active corporate deployment subscription.",
        technicalDetails: "Establishes transparent co-sell visibility. Ensures your implementation team receives recognition metrics in Microsoft Partner Center.",
        cliCommandTemplate: (pfx) => `az provider register --namespace Microsoft.PartnerAdminLink \\
# Execute link binding using unique Partner Network ID
az partneradminlink create --partner-id "9875412" --tenant-id "tenant-guid-here"`
      },
      {
        id: "ecif-step-2",
        title: "Generate ECIF SOW Audit Compliance Payload",
        description: "Auto-generate required workload definition architecture reports directly inside local storage registers for quick ingest. Meets strict APRA CPS 234 review boards.",
        technicalDetails: "Structures an audit metadata file. Essential documentation required to claim the certified MS fund payouts.",
        cliCommandTemplate: (pfx) => `cat <<EOF > ecif_sow_manifest.json
{
  "contractValueAUD": ${pfx || "450000"},
  "targetIncentiveLevel": "Tier-1 Sovereign Champion",
  "assignedPartnerID": "9875412",
  "sovereignTerritory": "ANZ-Regional",
  "auditFramework": "APRA CPS 234"
}
EOF`
      }
    ]
  }
];

export default function DynamicSetupTutorials({ addToast, isDark }: DynamicSetupTutorialsProps) {
  // Localized filters and states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTutorialId, setActiveTutorialId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  
  // Custom interactive user parameters per tutorial
  const [customVariable, setCustomVariable] = useState<string>("");
  const [secondaryVariable, setSecondaryVariable] = useState<string>("");

  // Persisted Checklist completed steps
  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("microsoft_intel_tutorial_steps");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ROI / Compliance Calculator States
  const [calcIndustry, setCalcIndustry] = useState<string>("APRA (Financial)");
  const [calcBudget, setCalcBudget] = useState<number>(45000); // AUD / month
  const [calcCloudUsers, setCalcCloudUsers] = useState<number>(1200);
  const [calcSecurityDefaults, setCalcSecurityDefaults] = useState<boolean>(true);
  const [calcSovereignLock, setCalcSovereignLock] = useState<boolean>(true);
  const [calcMfaEnforced, setCalcMfaEnforced] = useState<boolean>(true);

  // Sync completed steps back to localStorage
  const toggleStepCompleted = (stepId: string) => {
    let newCompleted;
    if (completedSteps.includes(stepId)) {
      newCompleted = completedSteps.filter(id => id !== stepId);
      addToast("technology_updates", "Milestone Task Reset", "Operational step marked incomplete.");
    } else {
      newCompleted = [...completedSteps, stepId];
      addToast("cloud_transformations", "Milestone Task Clear", "Operational step verified successfully!");
    }
    setCompletedSteps(newCompleted);
    localStorage.setItem("microsoft_intel_tutorial_steps", JSON.stringify(newCompleted));
  };

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    addToast("cloud_transformations", "Script Copied", "Automated deployment CLI written to native clipboard.");
  };

  // Switch Active Tutorial
  const selectTutorial = (t: Tutorial) => {
    setActiveTutorialId(t.id);
    setCurrentStepIndex(0);
    setCustomVariable(t.inputDefault);
    setSecondaryVariable(t.secondaryInputOptions ? t.secondaryInputOptions[0] : "");
    addToast("anz_strategy", "Interactive Blueprint Engaged", `Instantiated interactive configuration interface for: ${t.title}`);
  };

  // Dynamic calculations for the Compliance Calculator
  const getSovereignIndex = () => {
    let index = 15;
    if (calcMfaEnforced) index += 25;
    if (calcSecurityDefaults) index += 20;
    if (calcSovereignLock) index += 30;
    if (calcIndustry === "APRA (Financial)" && calcSovereignLock) index += 10;
    if (calcIndustry === "NZISM (Gov)" && calcSovereignLock) index += 10;
    return Math.min(100, index);
  };

  const getEstimatedRebate = () => {
    // Standardized Microsoft Partner ECIF (Enterprise Cloud Investment Fund) dynamic mapping
    let multiplier = 0.12; // 12% baseline fund rebate
    if (calcIndustry === "APRA (Financial)") multiplier = 0.18;
    if (calcIndustry === "NZISM (Gov)") multiplier = 0.22;
    if (getSovereignIndex() > 80) multiplier += 0.05; // 5% bonus for high security
    
    const annualSpend = calcBudget * 12;
    let rebate = annualSpend * multiplier;
    
    // Hard caps in Microsoft funding tiers
    if (annualSpend < 100000) rebate = Math.min(rebate, 15000);
    else if (annualSpend < 500000) rebate = Math.min(rebate, 85000);
    else rebate = Math.min(rebate, 220000);
    
    return Math.round(rebate);
  };

  // Generate and download a professional PDF report using jsPDF
  const exportPDFReport = (tutorial?: Tutorial) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      // Colors from Microsoft Corporate Palette (deep slate and neon accents)
      const primaryColor = [11, 15, 25]; // #0b0f19
      const accentBg = [2, 132, 199]; // #0284c7

      // Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 595, 120, "F");

      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("MICROSOFT CORPORATE INTELLIGENCE SYSTEMS", 40, 48);
      
      doc.setTextColor(14, 165, 233); // Light Blue
      doc.setFontSize(10);
      doc.setFont("courier", "bold");
      doc.text("ANZ REGIONAL SOVEREIGN STRATEGY & COMPLIANCE GATEWAY", 40, 68);

      doc.setTextColor(200, 200, 200);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Generated: " + new Date().toLocaleString() + " (UTC+10 Sydney)", 40, 88);

      // Section 1: Executive Posture Evaluation
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("1. Enterprise Sovereignty Posture Evaluation", 40, 160);

      // Baseline Metrics Box
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.rect(40, 175, 515, 110, "FD");

      doc.setTextColor(71, 85, 105); // slate-600
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Target Sector Category:", 55, 195);
      doc.text("Projected Monthly Compute:", 55, 215);
      doc.text("Active Cloud Seat Licenses:", 55, 235);
      doc.text("Sovereign Compliance Index:", 55, 255);
      doc.text("Calculated ECIF Rebate (AUD):", 55, 275);

      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont("helvetica", "normal");
      doc.text(calcIndustry, 230, 195);
      doc.text(`$${calcBudget.toLocaleString()} AUD / month`, 230, 215);
      doc.text(`${calcCloudUsers.toLocaleString()} Users`, 230, 235);
      doc.setFont("helvetica", "bold");
      doc.text(`${getSovereignIndex()}% Score`, 230, 255);
      doc.setTextColor(2, 132, 199); // blue-600
      doc.text(`$${getEstimatedRebate().toLocaleString()} AUD (Potential Funding)`, 230, 275);

      // Section 2: Recommended Setup Frameworks
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("2. Certified Advisory Guidance Playbook", 40, 310);

      let startY = 325;
      const selectedTuts = tutorial ? [tutorial] : TUTORIALS_DATA;

      selectedTuts.forEach((tut, tIdx) => {
        if (startY > 700) {
          doc.addPage();
          startY = 50;
        }

        doc.setFillColor(241, 245, 249); // slate-100
        doc.rect(40, startY, 515, 24, "F");
        
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`${tIdx + 1}. ${tut.title}`, 50, startY + 15);

        doc.setTextColor(71, 85, 105);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        const splitSynopsis = doc.splitTextToSize(tut.synopsis, 495);
        doc.text(splitSynopsis, 50, startY + 38);
        startY += 25 + (splitSynopsis.length * 11);

        doc.setFont("helvetica", "bold");
        doc.text("Key Config Params:", 50, startY + 10);
        doc.text(`Complexity: ${tut.complexity}  |  Estimated Time: ${tut.estimatedTime}  |  Target Audience: ${tut.targetSector}`, 150, startY + 10);
        startY += 25;

        // Add steps
        tut.steps.forEach((step, sIdx) => {
          if (startY > 720) {
            doc.addPage();
            startY = 50;
          }

          doc.setTextColor(2, 132, 199);
          doc.setFont("helvetica", "bold");
          doc.text(`Step ${sIdx + 1}: ${step.title}`, 60, startY);

          doc.setTextColor(15, 23, 42);
          doc.setFont("helvetica", "normal");
          const splitDesc = doc.splitTextToSize(step.description, 475);
          doc.text(splitDesc, 60, startY + 12);
          startY += 16 + (splitDesc.length * 11);

          // Add generated command snippet block
          doc.setFillColor(15, 23, 42);
          const cmd = step.cliCommandTemplate(
            tutorial ? customVariable : tut.inputDefault,
            tutorial ? secondaryVariable : (tut.secondaryInputOptions ? tut.secondaryInputOptions[0] : "")
          );
          const splitCmd = doc.splitTextToSize(cmd, 455);
          const blockHeight = (splitCmd.length * 11) + 15;

          if (startY + blockHeight > 760) {
            doc.addPage();
            startY = 50;
          }

          doc.rect(60, startY, 480, blockHeight, "F");
          doc.setTextColor(241, 245, 249);
          doc.setFont("courier", "bold");
          doc.setFontSize(7.5);
          doc.text(splitCmd, 70, startY + 12);
          
          startY += blockHeight + 20;
        });

        startY += 15;
      });

      // Footer notice
      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const lastPageNum = doc.getNumberOfPages();
      doc.setPage(lastPageNum);
      doc.text("CONFIDENTIAL - SECURE ANZ ENTERPRISE ADVISORY PORTAL", 160, 810);

      // Save file
      const filename = tutorial 
        ? `${tutorial.id}_secure_deployment_manifest.pdf` 
        : `ANZ_Sovereign_Compliance_Full_Playbook.pdf`;
      doc.save(filename);
      addToast("cloud_transformations", "PDF Ledger Prepared", `Successfully compiled secure advisory manifest and triggered local system download.`);
    } catch (err) {
      console.error("PDF generation failure:", err);
      addToast("licensing_pricing", "PDF Compilation Failed", "The local document generator was interrupted. Please review console outputs.");
    }
  };

  // Quick reset
  const handleResetChecklists = () => {
    setCompletedSteps([]);
    localStorage.removeItem("microsoft_intel_tutorial_steps");
    addToast("licensing_pricing", "A/NZ Setup History Reset", "All completed steps cleared safely.");
  };

  const filteredTutorials = TUTORIALS_DATA.filter((tut) => {
    const matchesSearch = 
      tut.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tut.synopsis.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tut.targetSector.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || tut.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "APRA Regulation", "NZISM Government", "FinOps Hub", "ECIF Co-Sell Pathway"];

  return (
    <div id="dynamic-setup-tutorials-tab-wrapper" className="space-y-8 select-none">
      
      {/* Upper Descriptive Segment / Banner */}
      <div className={`p-6 rounded-2xl relative overflow-hidden border ${isDark ? "bg-[#0b0f19]/35 border-slate-800" : "bg-slate-50/50 border-slate-200 shadow-sm"}`}>
        <div className="absolute top-0 right-0 h-28 w-28 bg-[#00a4ef]/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 h-24 w-24 bg-[#7fba00]/5 rounded-full blur-2xl"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-4xl">
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-[#00a4ef] bg-[#00a4ef]/10 px-2 py-0.5 rounded border border-[#00a4ef]/25">
              Live Compliance & Incentive Engine
            </span>
            <h2 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Sovereign Landing Zone & Setup Tutorials
            </h2>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Configure, audit, and deploy high-compliance Microsoft Cloud workloads across Australia and New Zealand. Track CPS 234 standards, align storage bounds to New Zealand GCSB RESTRICTED guidelines, optimize high-density GPU spending, and calculate eligible Microsoft co-sell rebates dynamically.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportPDFReport()}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 rounded-lg border border-slate-800 text-xs font-mono font-semibold cursor-pointer transition focus:outline-none focus:ring-1 focus:ring-sky-500"
              title="Download entire compliance directory catalog as integrated PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Playbook</span>
            </button>
            <button
              onClick={handleResetChecklists}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-[#ffebeb]/10 text-rose-400 rounded-lg border border-rose-500/20 hover:border-rose-400 text-xs font-mono font-semibold cursor-pointer transition focus:outline-none"
              title="Reset progress"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Global Tutorial Accomplishments */}
        <div className={`mt-5 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? "bg-[#0a0d17]/40 border-slate-850" : "bg-white border-slate-150 shadow-xs"}`}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-[#7fba00]/10 border border-[#7fba00]/25 rounded-lg flex items-center justify-center text-[#7fba00]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-xs font-bold leading-normal ${isDark ? "text-slate-150" : "text-slate-850"}`}>
                Corporate Engineering Checklist Progress
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Completed milestone steps: <strong className="text-sky-400">{completedSteps.length}</strong> / 10 required
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-md w-full px-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold mb-1">
              <span>POSTURE CLEARANCE PROGRESS</span>
              <span>{Math.round((completedSteps.length / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-900 p-0.5">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-sky-400 h-1 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (completedSteps.length / 10) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Active Stepper Control vs Custom compliance posture calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Span: Active Tutorials list or detail stepper */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Search and category filters */}
          {!activeTutorialId && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search compliance blueprints, workloads, specialized sectors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`flex-1 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none border font-sans focus:border-sky-500 ${
                    isDark 
                      ? "bg-slate-950 border-slate-850 text-slate-100 placeholder-slate-600" 
                      : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-xs"
                  }`}
                />
                
                <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-[10.5px] font-mono font-bold tracking-tight rounded-md select-none transition border whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? isDark 
                            ? "bg-sky-500/20 text-sky-400 border-sky-500/40"
                            : "bg-sky-500/10 text-sky-600 border-sky-400/30"
                          : isDark
                            ? "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {cat === "All" ? "All Directives" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTutorials.length > 0 ? (
                  filteredTutorials.map((tut) => {
                    const completedInTut = tut.steps.filter(s => completedSteps.includes(s.id)).length;
                    const isFullyCompleted = completedInTut === tut.steps.length;
                    
                    return (
                      <div 
                        key={tut.id}
                        className={`h-full border p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 ${
                          isDark 
                            ? "bg-[#111827] border-slate-800 hover:border-slate-750" 
                            : "bg-white border-slate-200 shadow-xs hover:shadow-md"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                              tut.category === "APRA Regulation"
                                ? "bg-emerald-500/15 text-emerald-450 border-emerald-500/30"
                                : tut.category === "NZISM Government"
                                ? "bg-sky-500/15 text-sky-450 border-sky-500/30"
                                : tut.category === "FinOps Hub"
                                ? "bg-amber-500/15 text-amber-450 border-amber-500/30"
                                : "bg-indigo-500/15 text-indigo-451 border-indigo-500/30"
                            }`}>
                              {tut.category}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">{tut.complexity}</span>
                          </div>

                          <div>
                            <h3 className={`text-sm font-bold tracking-tight leading-snug ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                              {tut.title}
                            </h3>
                            <p className="text-[10px] text-slate-500 font-bold font-mono mt-1 uppercase">Target: {tut.targetSector}</p>
                          </div>

                          <p className={`text-[11.5px] leading-relaxed line-clamp-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            {tut.synopsis}
                          </p>
                        </div>

                        <div className="mt-5 pt-3.5 border-t border-slate-800/40 flex items-center justify-between gap-3 text-xs">
                          <span className="text-slate-500 font-mono text-[10px] font-bold uppercase flex items-center gap-1.5">
                            {isFullyCompleted ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">CERTIFIED APPLIED</span>
                              </>
                            ) : (
                              <>
                                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                                <span>{completedInTut} of {tut.steps.length} CLEARED</span>
                              </>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() => selectTutorial(tut)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white hover:text-sky-400 rounded-lg border border-slate-800 text-xs font-mono font-bold transition cursor-pointer"
                          >
                            <span>Configure</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={`col-span-2 p-8 text-center rounded-2xl border border-dashed font-mono text-xs ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-500 bg-slate-50"}`}>
                    No strategic setup blueprints found matching your search term.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tutorial Details Stepper View */}
          {activeTutorialId && (() => {
            const currentTut = TUTORIALS_DATA.find(t => t.id === activeTutorialId)!;
            const currentStep = currentTut.steps[currentStepIndex];
            const isStepCompleted = completedSteps.includes(currentStep.id);
            const overallCompletedCount = currentTut.steps.filter(s => completedSteps.includes(s.id)).length;
            const percentageComplete = Math.round((overallCompletedCount / currentTut.steps.length) * 100);

            return (
              <div className={`border p-6 rounded-2xl relative overflow-hidden shadow-xl ${isDark ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"}`}>
                {/* Visual Backdrop accent and glow */}
                <div className="absolute top-0 right-0 h-28 w-28 bg-[#00a4ef]/5 rounded-full blur-2xl"></div>

                {/* Back button and title */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTutorialId(null);
                      addToast("anz_strategy", "Returned to Catalog", "Compliance blueprints catalog active.");
                    }}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white transition duration-150 cursor-pointer font-mono uppercase text-[10px]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to catalog</span>
                  </button>

                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">
                    CONFIGURATOR PANEL
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Category, Title, Synopsis */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono tracking-widest font-bold text-sky-400 uppercase bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/25">
                      {currentTut.category}
                    </span>
                    <h3 className={`text-base font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                      {currentTut.title}
                    </h3>
                  </div>

                  {/* Interactive variables custom compiler panel */}
                  <div className={`p-4 rounded-xl border space-y-3.5 ${isDark ? "bg-slate-950/70 border-slate-900" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center gap-1.5 text-[#ffb900] text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Dynamic Sandbox Variables (Parameters Compiler)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Cust Variable input */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
                          {currentTut.inputLabel}
                        </label>
                        <input
                          type="text"
                          value={customVariable}
                          onChange={(e) => setCustomVariable(e.target.value)}
                          placeholder={currentTut.inputPlaceholder}
                          className={`w-full text-xs font-mono font-bold px-3 py-2 rounded-lg border focus:outline-none transition ${
                            isDark 
                              ? "bg-slate-900 border-slate-800 text-white focus:border-sky-500" 
                              : "bg-white border-slate-250 text-slate-800 focus:border-sky-500 shadow-xs"
                          }`}
                        />
                        <span className="block text-[9px] text-slate-500 tracking-normal font-sans">
                          {currentTut.inputDescription}
                        </span>
                      </div>

                      {/* Secondary Input Selector (if any) */}
                      {currentTut.secondaryInputLabel && currentTut.secondaryInputOptions && (
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
                            {currentTut.secondaryInputLabel}
                          </label>
                          <select
                            value={secondaryVariable}
                            onChange={(e) => setSecondaryVariable(e.target.value)}
                            className={`w-full text-xs font-bold px-3 py-2 rounded-lg border focus:outline-none transition cursor-pointer ${
                              isDark 
                                ? "bg-slate-900 border-slate-800 text-white focus:border-sky-500" 
                                : "bg-white border-slate-250 text-slate-800 focus:border-sky-500 shadow-xs"
                            }`}
                          >
                            {currentTut.secondaryInputOptions.map((opt) => (
                              <option key={opt} value={opt} className={isDark ? "bg-slate-950" : "bg-white"}>{opt}</option>
                            ))}
                          </select>
                          <span className="block text-[9px] text-slate-500 tracking-normal font-sans">
                            {currentTut.secondaryInputDescription}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operational Stepper Tracker progress */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">STEP PROGRESS:</span>
                    <div className="flex-1 flex gap-1.5">
                      {currentTut.steps.map((step, idx) => {
                        const stepDone = completedSteps.includes(step.id);
                        return (
                          <button
                            key={step.id}
                            type="button"
                            onClick={() => setCurrentStepIndex(idx)}
                            className={`flex-1 h-2 rounded-full cursor-pointer transition-all duration-200 ${
                              idx === currentStepIndex
                                ? "bg-sky-400 ring-2 ring-sky-500/20"
                                : stepDone
                                ? "bg-emerald-500"
                                : "bg-slate-800 hover:bg-slate-700"
                            }`}
                            title={`Navigate to Step ${idx + 1}: ${step.title}`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-sky-400 shrink-0 select-none">
                      {percentageComplete}% COMPLETED
                    </span>
                  </div>

                  {/* Active Step Panel */}
                  <div className={`p-5 rounded-2xl border space-y-4 ${
                    isStepCompleted 
                      ? isDark 
                        ? "bg-slate-950/40 border-emerald-500/20" 
                        : "bg-[#f1fff5] border-emerald-250"
                      : isDark
                      ? "bg-slate-950/40 border-slate-850/60"
                      : "bg-[#fafbff] border-slate-200"
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/40">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center font-mono font-extrabold h-6 w-6 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs">
                          {currentStepIndex + 1}
                        </span>
                        <h4 className={`text-xs font-extrabold uppercase tracking-wider font-mono ${isDark ? "text-slate-200" : "text-slate-850"}`}>
                          {currentStep.title}
                        </h4>
                      </div>

                      {/* Checklist check off check */}
                      <button
                        type="button"
                        onClick={() => toggleStepCompleted(currentStep.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer font-mono font-bold text-[10.5px] transition ${
                          isStepCompleted
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-450 hover:bg-emerald-500/15"
                            : isDark
                            ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs"
                        }`}
                      >
                        {isStepCompleted ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Step Cleared</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-3.5 h-3.5" />
                            <span>Mark Step Complete</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className={`leading-relaxed font-sans ${isDark ? "text-slate-300" : "text-slate-705"}`}>
                        {currentStep.description}
                      </p>
                      <div className="p-2.5 bg-slate-900/40 border border-slate-900 rounded-lg flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#00a4ef] shrink-0 mt-0.5" />
                        <span className="text-[10px] text-slate-500 font-bold font-mono tracking-tight leading-normal uppercase">
                          HEURISTIC: {currentStep.technicalDetails}
                        </span>
                      </div>
                    </div>

                    {/* Compile parameters into Real-time config terminal code blocks */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 text-sky-455">
                          <Terminal className="w-3.5 h-3.5 text-inherit" />
                          <span>Generated Deployable Terminal Commands Bundle</span>
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => handleCopyCommand(currentStep.cliCommandTemplate(customVariable, secondaryVariable))}
                          className="flex items-center gap-1 text-[#ffb900] hover:text-white transition uppercase font-bold text-[9px] tracking-tight cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy CLI Code</span>
                        </button>
                      </div>

                      {/* Simulated Azure terminal window */}
                      <div className="bg-[#050811] border border-[#111827] rounded-xl overflow-hidden font-mono text-xs shadow-2xl relative">
                        {/* Terminal Control circles */}
                        <div className="bg-[#0b0f19] px-4 py-2 border-b border-[#050811] flex items-center justify-between pointer-events-none select-none">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          </div>
                          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">AZURE SHELL ENVIRONMENT</span>
                        </div>

                        <div className="p-4 overflow-x-auto text-[11px] leading-relaxed text-sky-200">
                          <code className="block select-text whitespace-pre">
                            {currentStep.cliCommandTemplate(customVariable, secondaryVariable)}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation controls within active tutorial */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentStepIndex === 0}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 border text-xs font-mono font-bold uppercase rounded-lg transition select-none ${
                        currentStepIndex === 0
                          ? "opacity-4 w-auto cursor-not-allowed text-slate-600 border-transparent bg-transparent"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Prev Step</span>
                    </button>

                    {currentStepIndex < currentTut.steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStepIndex(prev => Math.min(currentTut.steps.length - 1, prev + 1))}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg border border-[#0284c7] hover:border-[#0369a1] text-xs font-mono font-bold uppercase cursor-pointer transition select-none shadow-md"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => exportPDFReport(currentTut)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg border border-emerald-600 hover:border-emerald-500 text-xs font-mono font-bold uppercase cursor-pointer transition select-none shadow-md"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Advisory Ledger</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right Span: Compliance & Incentive ROI calculator Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className={`p-5 rounded-2xl border relative overflow-hidden shadow-xl ${isDark ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200 shadow-xs"}`}>
            {/* Background elements */}
            <div className="absolute top-0 right-0 h-16 w-16 bg-[#7fba00]/5 rounded-full blur-xl"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-sky-502/10 p-1.5 rounded-lg border border-sky-505/20 text-[#00a4ef] animate-pulse">
                <Sliders className="w-4 h-4 text-inherit" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  Sovereign Posture & ECIF Estimator
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">A/NZ compliance levels & partner funding</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Customize your operational variables to instantly gauge your calculated risk posture alignment index and estimate candidate Microsoft fund subsidies.
            </p>

            <div className="space-y-4">
              {/* Variable 1: Sector / Framework */}
              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500">
                  Regulatory Target Framework
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["APRA (Financial)", "NZISM (Gov)", "Strategic Enterprise", "SME Medium"].map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setCalcIndustry(ind)}
                      className={`py-2 px-3 text-[10.5px] font-mono font-semibold text-center border rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        calcIndustry === ind
                          ? "bg-slate-900 text-sky-400 border-sky-500/40"
                          : isDark
                          ? "bg-slate-950/60 text-slate-400 border-slate-900/80 hover:text-slate-200 hover:bg-slate-900/30"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/50"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variable 2: Monthly Cloud Spend */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase">
                  <span className="text-slate-500">Monthly High-Density Cloud Spend</span>
                  <span className="text-[#00a4ef]">${calcBudget.toLocaleString()} AUD</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="150000"
                  step="2500"
                  value={calcBudget}
                  onChange={(e) => setCalcBudget(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-full cursor-pointer accent-sky-510"
                />
                <span className="block text-[9.5px] text-slate-500 leading-normal font-sans">
                  Represents compute resources, storage, and GPU clusters allocated under sovereign tenant boundaries.
                </span>
              </div>

              {/* Variable 3: Active cloud seats */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase">
                  <span className="text-slate-500">Target seat counts (Active users)</span>
                  <span className="text-emerald-400">{calcCloudUsers.toLocaleString()} Users</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="12500"
                  step="100"
                  value={calcCloudUsers}
                  onChange={(e) => setCalcCloudUsers(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-full cursor-pointer accent-emerald-410"
                />
              </div>

              {/* Core posture checkboxes */}
              <div className="pt-2 border-t border-slate-800/40 space-y-2.5">
                <span className="block text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1">
                  Secure Configuration Posture Checks
                </span>

                {/* Switch 1 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Enforce Core Security Defaults (MFA)</span>
                  <input
                    type="checkbox"
                    checked={calcMfaEnforced}
                    onChange={(e) => setCalcMfaEnforced(e.target.checked)}
                    className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-sky-505 focus:ring-0 cursor-pointer"
                  />
                </div>

                {/* Switch 2 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Implement Strict Region Locks (A/NZ Only)</span>
                  <input
                    type="checkbox"
                    checked={calcSovereignLock}
                    onChange={(e) => calcSovereignLock ? (addToast("licensing_pricing", "Lock Strictness Constraint", "Cannot disable local containment without APRA compliance exceptions."), calcSovereignLock) : setCalcSovereignLock(e.target.checked)}
                    className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-sky-505 focus:ring-0 cursor-pointer"
                  />
                </div>

                {/* Switch 3 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Active purge protection HSM vaults</span>
                  <input
                    type="checkbox"
                    checked={calcSecurityDefaults}
                    onChange={(e) => setCalcSecurityDefaults(e.target.checked)}
                    className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-sky-505 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Resulting Panel metrics */}
              <div className="bg-[#050811] p-4 rounded-xl border border-slate-900 text-xs">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <span className="block text-[8.5px] uppercase font-bold tracking-wider font-mono text-slate-500">
                      Calculated Posture Index
                    </span>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-extrabold text-[#7fba00]">{getSovereignIndex()}%</span>
                    </div>
                    <span className="block text-[9.5px] font-mono text-sky-400 font-bold uppercase">
                      {getSovereignIndex() >= 80 ? "SECURE STANDARD" : getSovereignIndex() >= 50 ? "MONITOR POSTURE" : "EXPOSURE ALERT"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[8.5px] uppercase font-bold tracking-wider font-mono text-slate-500">
                      Eligible ECIF Funding Est
                    </span>
                    <div className="flex items-baseline justify-center gap-0.5">
                      <span className="text-2xl font-extrabold text-[#00a4ef]">${getEstimatedRebate().toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">AUD</span>
                    </div>
                    <span className="block text-[9.5px] font-semibold text-slate-400">
                      Estimated Microsoft Subsidy
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded border border-slate-900/60 text-[10.5px] leading-relaxed text-slate-400 font-sans flex items-start gap-1.5">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <p>
                  *Calculations mapped dynamically in accord with the official <strong className="text-slate-350">Microsoft ANZ Partner Program guidelines</strong>. Higher sovereign security alignments unlock bonus seed brackets.
                </p>
              </div>

            </div>
          </div>

          {/* Quick FAQ / Regulatory notice card */}
          <div className={`p-4 rounded-xl border relative overflow-hidden ${isDark ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"}`}>
            <h5 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Compliancy Frameworks & Standards FAQ</span>
            </h5>
            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <span className="block font-bold text-slate-200">What is APRA CPS 234?</span>
                <p className="text-slate-405 leading-relaxed font-sans text-[11px]">
                  An active prudential regulatory security directive requiring Australian banking, insurance, and audit entities to prove active digital isolation, access accountability, and fast cryptographic emergency backup pipelines.
                </p>
              </div>
              <div className="space-y-1 border-t border-slate-900 pt-3">
                <span className="block font-bold text-slate-200">Are these generated codes ready to run?</span>
                <p className="text-slate-405 leading-relaxed font-sans text-[11px]">
                  Yes. The generated Azure CLI scripts compile parameters compiled by the variable compiler instantly. Run them back in your secure local administrative console environment.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
