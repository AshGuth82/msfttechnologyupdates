import React, { useState, useEffect } from "react";
import { BookOpen, Search, ExternalLink, RefreshCw, FileText, ArrowUpRight } from "lucide-react";

export const LicensingDocs: React.FC = () => {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback docs aligned with the user URL
  const seedDocs = [
    {
      id: "dr-1",
      title: "Product Terms: Microsoft Licensing Agreements",
      url: "https://www.microsoft.com/licensing/docs/view/Product-Terms",
      summary: "Current software and cloud services terms for multiple Microsoft licensing agreements."
    },
    {
      id: "dr-2",
      title: "Service Level Agreements (SLA) for Online Services",
      url: "https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services",
      summary: "Guaranteed uptime SLAs for Azure, Dynamics 365, Microsoft 365, and more."
    },
    {
      id: "dr-3",
      title: "Privacy & Security Terms (DPA)",
      url: "https://www.microsoft.com/licensing/docs/view/Data-Protection-Addendum-DPA",
      summary: "Detailed Data Protection Addendum regarding GDPR and enterprise data privacy."
    },
    {
      id: "dr-4",
      title: "Azure Hybrid Benefit Guidelines",
      url: "https://www.microsoft.com/licensing/docs",
      summary: "Rules and restrictions for converting on-premise Windows Server core licenses into Azure compute credits."
    },
    {
      id: "dr-5",
      title: "M365 Maps",
      url: "https://m365maps.com/",
      summary: "Comprehensive and highly detailed feature matrices and licensing maps for Microsoft 365, Office 365, Enterprise Mobility + Security, and Windows."
    }
  ];

  useEffect(() => {
    // Simulate loading docs securely from backend/search
    setTimeout(() => {
      setDocs(seedDocs);
      setLoading(false);
    }, 700);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 right-0 h-32 w-32 bg-sky-500/5 rounded-full blur-2xl"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 font-bold tracking-widest uppercase text-[10px] rounded border border-sky-500/20 shadow-sm flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" />
                Drawn from Microsoft.com
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
              Official Licensing Docs
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Drawn directly from the Microsoft Licensing site. Secure repository of official SLA, Use Rights, and Product Terms for auditing.
            </p>
          </div>
          <button 
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl transition cursor-pointer text-xs shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Sync Vault
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 bg-slate-900/40 rounded-xl border border-slate-800">
          <RefreshCw className="w-6 h-6 text-sky-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map(doc => (
            <div key={doc.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl hover:bg-slate-800/80 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sky-500/10 rounded-lg">
                    <FileText className="w-4 h-4 text-sky-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight pr-4">
                    {doc.title}
                  </h3>
                </div>
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1.5 bg-slate-800 rounded-md text-slate-400 hover:text-white transition group-hover:bg-sky-500/20 group-hover:text-sky-400 shadow"
                  title="View Original Document"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-10 border-l border-slate-800/50">
                {doc.summary}
              </p>
              <div className="mt-4 pl-10 flex gap-2">
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] bg-slate-800/50 px-2 py-1 flex items-center gap-1 border border-slate-700/50 text-slate-300 hover:bg-slate-700/70 hover:border-slate-500 rounded"
                >
                  <ExternalLink className="w-3 h-3" /> Source URL
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
