import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, BookOpen, Layers, Terminal, Sparkles, Filter } from 'lucide-react';
import { STAGES, StageData } from '../data/stagesData';

interface CurriculumViewProps {
  currentStageId: number;
  completedStages: number[];
  onSelectStage: (stageId: number) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  currentStageId,
  completedStages,
  onSelectStage
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', 'Setup', 'Data Prep', 'Modeling', 'Evaluation', 'Ethics & Submission'];

  const filteredStages = categoryFilter === 'All'
    ? STAGES
    : STAGES.filter((s) => s.category === categoryFilter);

  const progressPercentage = Math.round((completedStages.length / STAGES.length) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <span>CODEALPHA MACHINE LEARNING INTERNSHIP</span>
              <span>·</span>
              <span>INTERACTIVE ROADMAP</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Credit Scoring Model: Step-by-Step Curriculum
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Master end-to-end credit risk classification from your very first Jupyter cell check to production model benchmarks, fairness compliance, and recruiter-ready GitHub documentation.
            </p>
          </div>

          {/* Progress Tracker Widget */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 min-w-[240px] space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Curriculum Progress</span>
              <span className="font-mono font-bold text-sky-400 tabular-nums">
                {progressPercentage}% ({completedStages.length}/14)
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(5, progressPercentage)}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Current: Stage {currentStageId}</span>
              <button
                onClick={() => onSelectStage(currentStageId)}
                className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-0.5"
              >
                <span>Jump in</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 border border-slate-700/60 rounded-lg overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 px-3 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === cat
                ? 'bg-slate-900 text-sky-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStages.map((stage) => {
          const isDone = completedStages.includes(stage.id);
          const isCurrent = currentStageId === stage.id;

          return (
            <div
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`group cursor-pointer rounded-xl p-5 border transition-all duration-200 space-y-3 relative overflow-hidden ${
                isCurrent
                  ? 'bg-slate-800/90 border-sky-400/80 shadow-md ring-1 ring-sky-400/30'
                  : isDone
                  ? 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                  : 'bg-slate-800/60 border-slate-700/40 hover:border-slate-600/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="font-bold text-sky-400">STAGE {stage.id.toString().padStart(2, '0')}</span>
                    <span>·</span>
                    <span>{stage.category}</span>
                  </div>
                  <h2 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {stage.title}
                  </h2>
                </div>

                <div className="shrink-0 pt-0.5">
                  {isDone ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                      <span className="hidden sm:inline">Done</span>
                    </div>
                  ) : isCurrent ? (
                    <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded font-mono font-medium">
                      Active
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {stage.goal}
              </p>

              <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-500">
                <span className="italic truncate pr-2">"{stage.analogy}"</span>
                <span className="text-sky-400 group-hover:underline shrink-0 font-medium">
                  Open Stage →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
