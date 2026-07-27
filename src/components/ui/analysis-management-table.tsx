import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileDown, Trash2 } from "lucide-react";

export type Analysis = {
  id: string;
  idea_text: string;
  score: number;
  verdict: 'build' | 'pivot' | 'kill';
  report: {
    market_size: string;
    competitors: string[];
    risks: string[];
    action_plan: string;
  };
  pdf_url: string | null;
  created_at: string;
};

interface AnalysisManagementTableProps {
  title?: string;
  analyses: Analysis[];
  onExportPdf?: (analysisId: string) => void;
  onDelete?: (analysisId: string) => void;
  className?: string;
}

export function AnalysisManagementTable({
  title = "Mes Analyses Récentes",
  analyses,
  onExportPdf,
  onDelete,
  className = ""
}: AnalysisManagementTableProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  const openModal = (analysis: Analysis) => {
    setSelectedAnalysis(analysis);
  };

  const closeModal = () => {
    setSelectedAnalysis(null);
  };

  useEffect(() => {
    if (selectedAnalysis) {
      const updated = analyses.find(a => a.id === selectedAnalysis.id);
      if (updated) {
        setSelectedAnalysis(updated);
      }
    }
  }, [analyses, selectedAnalysis]);

  const getVerdictIcon = (verdict: Analysis["verdict"]) => {
    switch (verdict) {
      case "build":
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center p-1.5 border border-border/30 shadow-sm flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        );
      case "pivot":
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center p-1.5 border border-border/30 shadow-sm flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l-3-3 3-3-4 3 4 3M22 12h-4l3 3-3 3 4-3-4-3"></path><path d="M12 2v4l3-3-3-3-3 3 3 3M12 22v-4l-3 3 3 3 3-3-3-3"></path></svg>
          </div>
        );
      case "kill":
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center border border-border/30 p-1.5 shadow-sm flex-shrink-0">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
        );
    }
  };

  const getScoreBars = (percentage: number, verdict: Analysis["verdict"]) => {
    const filledBars = Math.round((percentage / 100) * 10);
    
    const getBarColor = (index: number) => {
      if (index >= filledBars) {
        return "bg-[var(--surface-2)] border border-[var(--border)]";
      }
      
      switch (verdict) {
        case "build":
          return "bg-[var(--green)]";
        case "pivot":
          return "bg-[var(--amber)]";
        case "kill":
          return "bg-[var(--red)]";
        default:
          return "bg-white";
      }
    };
    
    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-5 rounded-full transition-all duration-500 ${getBarColor(index)}`}
            />
          ))}
        </div>
        <span className="text-sm font-mono text-[var(--text)] font-medium min-w-[3rem]">
          {percentage}%
        </span>
      </div>
    );
  };

  const getVerdictBadge = (verdict: Analysis["verdict"]) => {
    switch (verdict) {
      case "build":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-[var(--green)]/10 border border-[var(--green)]/30 flex items-center justify-center">
            <span className="text-[var(--green)] text-sm font-medium">Build</span>
          </div>
        );
      case "pivot":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-[var(--amber)]/10 border border-[var(--amber)]/30 flex items-center justify-center">
            <span className="text-[var(--amber)] text-sm font-medium">Pivot</span>
          </div>
        );
      case "kill":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-[var(--red)]/10 border border-[var(--red)]/30 flex items-center justify-center">
            <span className="text-[var(--red)] text-sm font-medium">Kill</span>
          </div>
        );
    }
  };

  const getStatusGradient = (verdict: Analysis["verdict"]) => {
    switch (verdict) {
      case "build":
        return "from-[var(--green)]/10 to-transparent";
      case "pivot": 
        return "from-[var(--amber)]/10 to-transparent";
      case "kill":
        return "from-[var(--red)]/10 to-transparent";
    }
  };

  const truncate = (str: string, max: number = 40) => {
    return str.length > max ? str.substring(0, max) + "..." : str;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (!analyses || analyses.length === 0) {
    return (
      <div className={`w-full max-w-7xl mx-auto p-6 ${className}`}>
        <div className="border border-[var(--border)] rounded-2xl p-12 bg-[var(--surface)] text-center text-[var(--text-dim)]">
          Aucune analyse trouvée. Rends-toi sur l'accueil pour tester ta première idée !
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-7xl mx-auto p-6 ${className}`}>
      <div className="relative border border-[var(--border)] rounded-2xl p-6 bg-[var(--surface)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--violet)] animate-pulse" />
              <h1 className="text-xl font-medium text-[var(--text)]">{title}</h1>
            </div>
            <div className="text-sm text-[var(--text-dim)]">
              {analyses.length} idées évaluées
            </div>
          </div>
        </div>

        {/* Table */}
        <motion.div
          className="space-y-2"
          variants={{
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
          }}
          initial="hidden"
          animate="visible"
        >
          {/* Headers */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-[var(--text-dim)] uppercase tracking-wider">
            <div className="col-span-1">No.</div>
            <div className="col-span-5">Description de l'idée</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Score Verdikt</div>
            <div className="col-span-1">Verdict</div>
          </div>

          {/* Analysis Rows */}
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              variants={{
                hidden: { opacity: 0, x: -25, scale: 0.95, filter: "blur(4px)" },
                visible: {
                  opacity: 1, x: 0, scale: 1, filter: "blur(0px)",
                  transition: { type: "spring", stiffness: 400, damping: 28, mass: 0.6 },
                },
              }}
              className="relative cursor-pointer"
              onClick={() => openModal(analysis)}
            >
              <motion.div
                className="relative bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 overflow-hidden"
                whileHover={{ y: -1, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              >
                {/* Status gradient overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-l ${getStatusGradient(analysis.verdict)} pointer-events-none opacity-50`}
                  style={{ backgroundSize: "30% 100%", backgroundPosition: "right", backgroundRepeat: "no-repeat" }} 
                />
                
                {/* Grid Content */}
                <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="hidden md:block col-span-1">
                    <span className="text-xl font-bold text-[var(--text-dim)] opacity-50">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="col-span-1 md:col-span-5 flex items-center gap-3">
                    {getVerdictIcon(analysis.verdict)}
                    <span className="text-[var(--text)] font-medium truncate pr-4">
                      {truncate(analysis.idea_text, 60)}
                    </span>
                  </div>

                  <div className="hidden md:block col-span-2">
                    <span className="text-[var(--text)] text-sm">
                      {formatDate(analysis.created_at)}
                    </span>
                  </div>

                  <div className="col-span-1 md:col-span-3">
                    {getScoreBars(analysis.score, analysis.verdict)}
                  </div>

                  <div className="hidden md:block col-span-1">
                    {getVerdictBadge(analysis.verdict)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal Overlay - Inside Card */}
        <AnimatePresence>
          {selectedAnalysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-[var(--ink)]/90 backdrop-blur-md flex flex-col rounded-2xl z-10 overflow-hidden"
            >
              {/* Header with Actions */}
              <div className="relative bg-gradient-to-r from-[var(--surface-2)] to-transparent p-6 border-b border-[var(--border)] flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {getVerdictIcon(selectedAnalysis.verdict)}
                  <div className="flex-1 pr-6">
                    <h3 className="text-lg font-bold text-[var(--text)] mb-2 leading-relaxed max-w-3xl">
                      {selectedAnalysis.idea_text}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[var(--text-dim)]">
                        Soumis le {formatDate(selectedAnalysis.created_at)}
                      </span>
                      {getVerdictBadge(selectedAnalysis.verdict)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  {selectedAnalysis.pdf_url && (
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--violet)]/10 hover:bg-[var(--violet)]/20 text-[var(--violet)] border border-[var(--violet)]/30 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(selectedAnalysis.pdf_url!, '_blank');
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileDown className="w-4 h-4" />
                      Rapport PDF
                    </motion.button>
                  )}
                  {onExportPdf && !selectedAnalysis.pdf_url && (
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--violet)] hover:bg-[var(--violet)]/90 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportPdf(selectedAnalysis.id);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileDown className="w-4 h-4" />
                      Générer PDF
                    </motion.button>
                  )}

                  {onDelete && (
                    <motion.button
                      className="flex items-center gap-2 px-3 py-2 bg-[var(--red)]/10 hover:bg-[var(--red)]/20 text-[var(--red)] border border-[var(--red)]/30 rounded-lg text-sm transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(selectedAnalysis.id);
                        closeModal();
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}

                  {/* Close Button */}
                  <motion.button
                    className="w-10 h-10 bg-[var(--surface)] hover:bg-[var(--surface-2)] rounded-full flex items-center justify-center border border-[var(--border)] ml-2 flex-shrink-0"
                    onClick={(e) => { e.stopPropagation(); closeModal(); }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-[var(--text)]" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Risks */}
                  <div className="bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] shadow-sm">
                    <label className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--red)]" /> Risques Majeurs
                    </label>
                    <ul className="space-y-2">
                      {selectedAnalysis.report.risks?.map((risk, i) => (
                        <li key={i} className="text-sm text-[var(--text)] flex items-start gap-2">
                          <span className="text-[var(--red)] mt-0.5">•</span>
                          {risk}
                        </li>
                      )) || <li className="text-sm text-[var(--text-dim)]">Aucun risque identifié.</li>}
                    </ul>
                  </div>

                  {/* Competitors */}
                  <div className="bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] shadow-sm">
                    <label className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--amber)]" /> Concurrence
                    </label>
                    <ul className="space-y-2">
                      {selectedAnalysis.report.competitors?.map((comp, i) => (
                        <li key={i} className="text-sm text-[var(--text)] flex items-start gap-2">
                          <span className="text-[var(--amber)] mt-0.5">•</span>
                          {comp}
                        </li>
                      )) || <li className="text-sm text-[var(--text-dim)]">Aucun concurrent direct identifié.</li>}
                    </ul>
                  </div>
                </div>

                {/* Score & Market Size */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] shadow-sm">
                    <label className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider mb-4 block">
                      Score de Viabilité
                    </label>
                    {getScoreBars(selectedAnalysis.score, selectedAnalysis.verdict)}
                  </div>
                  <div className="bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] shadow-sm">
                    <label className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider mb-2 block">
                      Taille de Marché Estimée
                    </label>
                    <p className="text-sm text-[var(--text)] leading-relaxed font-medium">
                      {selectedAnalysis.report.market_size || "Donnée indisponible"}
                    </p>
                  </div>
                </div>

                {/* Action Plan */}
                <div className="bg-[var(--surface-2)] rounded-xl p-5 border border-[var(--border)] shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-[var(--green)]"></div>
                  <label className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--green)]" /> Plan d'Action Recommandé
                  </label>
                  <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                    {selectedAnalysis.report.action_plan || "Pas de plan d'action généré."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
