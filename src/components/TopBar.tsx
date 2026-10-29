import React from 'react';
import { BookOpen, Terminal, Activity, BarChart3, FileText, CheckCircle2 } from 'lucide-react';

interface TopBarProps {
  activeTab: 'curriculum' | 'notebook' | 'simulator' | 'metrics' | 'docs';
  setActiveTab: (tab: 'curriculum' | 'notebook' | 'simulator' | 'metrics' | 'docs') => void;
  currentStageId: number;
  completedStages: number[];
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  currentStageId,
  completedStages
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); setActiveTab('curriculum'); }}
        className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-sky-400 transition-colors flex items-center gap-2"
      >
        <span className="text-sky-400 font-mono text-base">&gt;</span>
        <span>CodeAlpha ML Mentor</span>
        <span className="text-xs text-slate-400 font-normal hidden sm:inline">· Credit Scoring</span>
      </a>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'curriculum' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Curriculum</span>
        </button>

        <button
          onClick={() => setActiveTab('notebook')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'notebook' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Virtual Notebook</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'simulator' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Credit Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'metrics' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Metrics Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'docs' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Project Docs</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('notebook')}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm"
        >
          <span>Stage {currentStageId} Active</span>
          <span className="text-[10px] bg-sky-500/30 text-slate-900 px-1.5 py-0.5 rounded font-mono font-bold">
            {completedStages.length}/14
          </span>
        </button>
      </div>
    </header>
  );
};
