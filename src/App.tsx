/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { VirtualNotebook } from './components/VirtualNotebook';
import { CurriculumView } from './components/CurriculumView';
import { CreditScoreSimulator } from './components/CreditScoreSimulator';
import { MetricsLab } from './components/MetricsLab';
import { ProjectDocsBuilder } from './components/ProjectDocsBuilder';
import { STAGES } from './data/stagesData';
import { ShieldCheck, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'notebook' | 'simulator' | 'metrics' | 'docs'>('notebook');
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [completedStages, setCompletedStages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('codealpha_completed_stages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('codealpha_completed_stages', JSON.stringify(completedStages));
    } catch {
      // ignore
    }
  }, [completedStages]);

  const currentStage = STAGES.find((s) => s.id === currentStageId) || STAGES[0];

  const handleCompleteStage = (stageId: number) => {
    setCompletedStages((prev) => {
      if (prev.includes(stageId)) {
        return prev.filter((id) => id !== stageId);
      } else {
        return [...prev, stageId];
      }
    });
  };

  const handleNextStage = () => {
    if (currentStageId < 14) {
      setCurrentStageId((prev) => prev + 1);
    }
  };

  const handleSelectStage = (stageId: number) => {
    setCurrentStageId(stageId);
    setActiveTab('notebook');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation conforming to Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStageId={currentStageId}
        completedStages={completedStages}
      />

      {/* CodeAlpha Compliance & Integrity Notice Banner */}
      <aside aria-label="CodeAlpha Learning Guidelines" className="bg-slate-900/90 border-b border-slate-800/80 px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>CodeAlpha Learning Standards:</strong> Use this mentor to understand concepts, test diagnostics, and debug errors. Implement each notebook cell independently to follow internship rules.
            </span>
          </div>
          <div className="text-slate-400 font-mono text-[11px] shrink-0 hidden md:block">
            Project: CodeAlpha_CreditScoringModel
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8">
        {activeTab === 'curriculum' && (
          <CurriculumView
            currentStageId={currentStageId}
            completedStages={completedStages}
            onSelectStage={handleSelectStage}
          />
        )}

        {activeTab === 'notebook' && (
          <VirtualNotebook
            currentStage={currentStage}
            onCompleteStage={handleCompleteStage}
            onNextStage={handleNextStage}
            isCompleted={completedStages.includes(currentStage.id)}
          />
        )}

        {activeTab === 'simulator' && <CreditScoreSimulator />}

        {activeTab === 'metrics' && <MetricsLab />}

        {activeTab === 'docs' && <ProjectDocsBuilder />}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            CodeAlpha Machine Learning Internship Mentor · Credit Risk & Scoring Pipeline
          </div>
          <div className="text-[11px] text-slate-600 font-mono">
            Python · Pandas · Scikit-Learn · Jupyter
          </div>
        </div>
      </footer>
    </div>
  );
}
