import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';

const MILESTONES = [
  {
    id: 1,
    date: "Q3 2026",
    title: "Copilot M365 Phase 3 Deployment",
    status: "completed",
    description: "Completion of the mandatory integration training curriculum for all Gold and Platinum Partners operating within the ANZ timezone, enabling automated workflow transformations."
  },
  {
    id: 2,
    date: "Q4 2026",
    title: "Azure Sovereign Hub Launch (NZ)",
    status: "current",
    description: "Official rollout of New Zealand's dedicated regional datacenter, enabling strict data sovereignty and compliance handling for government and secured enterprise workloads."
  },
  {
    id: 3,
    date: "Q1 2027",
    title: "Enterprise Agreement Structure Update",
    status: "upcoming",
    description: "Crucial pricing restructures affecting server enrollments for enterprise fleets (1k+ seats). All licensing optimization partners must recertify on the new quoting API."
  },
  {
    id: 4,
    date: "Q2 2027",
    title: "Dynamics Copilot Certification Refresh",
    status: "upcoming",
    description: "Updated technical curriculum mapping and technical proficiency exams for D365 ERP & CRM specialty partners to maintain advanced specialization status."
  }
];

export const ProjectRoadmap: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [activeId, setActiveId] = useState<number | null>(MILESTONES.find(m => m.status === 'current')?.id || MILESTONES[0].id);

  return (
    <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#111827] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/60">
        <div className="p-2.5 bg-sky-500/10 text-sky-450 rounded-xl shrink-0">
          <Calendar className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <h3 className={`text-sm font-extrabold flex items-center gap-2 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            <span>ANZ Partner Strategic Roadmap</span>
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/15 rounded shrink-0">
              MILESTONES
            </span>
          </h3>
          <p className={`text-xs mt-1 max-w-3xl leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Interactive timeline of major upcoming Microsoft product launches, infrastructure updates, and critical deadlines for the ANZ partner ecosystem.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Timeline Path */}
        <div className="w-full md:w-1/3 flex flex-col pt-2 relative">
          <div className="absolute left-3.5 top-5 bottom-8 w-px bg-slate-200 dark:bg-slate-800 -z-10"></div>
          
          {MILESTONES.map((milestone) => {
            const isActive = activeId === milestone.id;
            const isCompleted = milestone.status === 'completed';
            const isCurrent = milestone.status === 'current';
            
            return (
              <button
                key={milestone.id}
                onClick={() => setActiveId(milestone.id)}
                className={`relative flex items-center gap-4 p-3 rounded-xl transition text-left cursor-pointer ${
                  isActive 
                    ? isDark ? "bg-slate-800/50" : "bg-slate-100" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                }`}
              >
                <div className={`flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-[#111827] border-2 z-10 shrink-0 transition-colors ${
                  isCompleted ? "border-emerald-500 text-emerald-500" :
                  isCurrent ? "border-sky-500 text-sky-500" :
                  isActive ? "border-slate-400 text-slate-400" :
                  "border-slate-300 dark:border-slate-700 text-slate-300"
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                   isCurrent ? <Circle className="w-3.5 h-3.5 fill-current animate-pulse" /> :
                   <Clock className="w-3.5 h-3.5" />}
                </div>
                
                <div className="flex-1">
                  <div className={`text-[10px] font-mono font-bold tracking-wider mb-0.5 ${
                    isCompleted ? "text-emerald-500" :
                    isCurrent ? "text-sky-400" :
                    "text-slate-400"
                  }`}>
                    {milestone.date}
                  </div>
                  <div className={`text-xs font-bold font-sans truncate ${
                    isActive 
                      ? isDark ? "text-white" : "text-slate-900" 
                      : isDark ? "text-slate-300" : "text-slate-600"
                  }`}>
                    {milestone.title}
                  </div>
                </div>
                
                {isActive && (
                  <ChevronRight className={`w-4 h-4 shrink-0 animate-in slide-in-from-left-2 ${isDark ? "text-white" : "text-slate-900"}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Milestone Detail */}
        <div className="w-full md:w-2/3">
          <AnimatePresence mode="wait">
            {MILESTONES.map((milestone) => 
              milestone.id === activeId ? (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`h-full p-6 rounded-xl border flex flex-col justify-center ${
                    isDark ? "bg-[#0b0f19] border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded border ${
                      milestone.status === 'completed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                      milestone.status === 'current' ? "bg-sky-500/10 text-sky-400 border-sky-500/20" :
                      "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    }`}>
                      {milestone.status === 'current' ? 'In Progress' : milestone.status}
                    </span>
                    <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-slate-200/50 dark:bg-slate-800 text-slate-500`}>
                      {milestone.date}
                    </span>
                  </div>
                  
                  <h4 className={`text-lg font-extrabold mb-3 font-sans tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                    {milestone.title}
                  </h4>
                  
                  <p className={`text-sm leading-relaxed max-w-xl ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {milestone.description}
                  </p>
                  
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
