import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, RotateCcw, AlertCircle, CheckCircle2, ChevronRight, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { StageData } from '../data/stagesData';

interface VirtualNotebookProps {
  currentStage: StageData;
  onCompleteStage: (stageId: number) => void;
  onNextStage: () => void;
  isCompleted: boolean;
}

export const VirtualNotebook: React.FC<VirtualNotebookProps> = ({
  currentStage,
  onCompleteStage,
  onNextStage,
  isCompleted
}) => {
  const [code, setCode] = useState(currentStage.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [executionCount, setExecutionCount] = useState<number | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'quiz' | 'troubleshooting'>('code');
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Sync code whenever currentStage changes
  useEffect(() => {
    setCode(currentStage.starterCode);
    setExecutionCount(null);
    setOutput(null);
    setActiveTab('code');
    setSelectedAnswers({});
    setQuizSubmitted(false);
  }, [currentStage.id]);

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setExecutionCount((prev) => (prev ? prev + 1 : 1));
      setOutput(currentStage.expectedOutput);
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(currentStage.starterCode);
    setOutput(null);
    setExecutionCount(null);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stage Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/50">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-mono mb-1">
              <span>STAGE {currentStage.id} OF 14</span>
              <span>·</span>
              <span className="text-slate-400">{currentStage.category.toUpperCase()}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {currentStage.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onCompleteStage(currentStage.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Stage Completed' : 'Mark as Complete'}</span>
            </button>

            {currentStage.id < 14 && (
              <button
                onClick={onNextStage}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>Next Stage</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Goal & Real-World Analogy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 text-sm">
          <div className="lg:col-span-2 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Stage Goal
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              {currentStage.goal}
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intuitive Analogy</span>
            </div>
            <p className="text-xs text-slate-400 italic leading-relaxed">
              "{currentStage.analogy}"
            </p>
          </div>
        </div>
      </div>

      {/* Mode Sub-navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'code'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Jupyter Code Cell</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Check Understanding ({currentStage.quiz.length} Qs)</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'troubleshooting'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Common Errors & Fixes ({currentStage.troubleshooting.length})</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Notebook: CodeAlpha_CreditScoringModel.ipynb
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          {/* Virtual Jupyter Notebook Cell */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-md">
            {/* Cell Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sky-400 font-semibold">
                  In [{executionCount !== null ? executionCount : ' '}] :
                </span>
                <span className="text-slate-300 font-medium">Python 3 (ipykernel)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 text-slate-400 hover:text-slate-200 rounded transition-colors flex items-center gap-1 hover:bg-slate-800"
                  title="Reset code cell to starter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-slate-400 hover:text-slate-200 rounded transition-colors flex items-center gap-1 hover:bg-slate-800"
                  title="Copy code for your real Jupyter Notebook"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Executing...' : 'Run Cell'}</span>
                </button>
              </div>
            </div>

            {/* Code Editor Area */}
            <div className="p-4 font-mono text-xs md:text-sm bg-slate-950 text-slate-200">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={Math.min(16, Math.max(8, code.split('\n').length + 1))}
                className="w-full bg-transparent resize-y outline-none font-mono text-slate-200 leading-relaxed selection:bg-sky-500/30"
                spellCheck={false}
              />
            </div>

            {/* Cell Output Area */}
            {output && (
              <div className="border-t border-slate-800 bg-slate-900/90 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">Out [{executionCount}]:</span>
                    <span>Execution Succeeded (0.24s)</span>
                  </div>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Output
                  </span>
                </div>

                <pre className="font-mono text-xs md:text-sm text-emerald-300/90 whitespace-pre-wrap overflow-x-auto p-3 bg-black/40 rounded-lg border border-slate-800">
                  {output}
                </pre>
              </div>
            )}
          </div>

          {/* Stage Instructions & Mentor Guidance */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Step-by-Step Mentor Walkthrough</span>
            </h3>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p className="whitespace-pre-line">{currentStage.conceptSummary}</p>
            </div>

            <div className="pt-3 border-t border-slate-700/40">
              <div className="text-xs font-semibold text-sky-300 mb-2">CodeAlpha Best Practices:</div>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                {currentStage.codealphaTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white mb-1">
              Check Your Understanding for Stage {currentStage.id}
            </h2>
            <p className="text-xs text-slate-400">
              Answer these questions to confirm you understand the core theory before writing production code.
            </p>
          </div>

          <div className="space-y-6">
            {currentStage.quiz.map((q, qIdx) => {
              const selected = selectedAnswers[qIdx];
              const isCorrect = selected === q.correctIndex;

              return (
                <div key={qIdx} className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-4 space-y-3">
                  <div className="text-sm font-semibold text-slate-100 flex items-start gap-2">
                    <span className="text-sky-400 font-mono">Q{qIdx + 1}.</span>
                    <span>{q.question}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/80';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200';
                        } else if (isOptionSelected && !isCorrect) {
                          btnStyle = 'bg-rose-950/80 border-rose-500/80 text-rose-200';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-sky-950/80 border-sky-400 text-sky-200';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`text-left px-3.5 py-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="text-xs p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
                      <div className="font-semibold text-sky-300">Explanation:</div>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
            <div className="text-xs text-slate-400">
              {Object.keys(selectedAnswers).length} of {currentStage.quiz.length} answered
            </div>

            <button
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(selectedAnswers).length < currentStage.quiz.length}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-900 font-semibold text-xs rounded-lg transition-colors"
            >
              Check Answers
            </button>
          </div>
        </div>
      )}

      {/* Troubleshooting Tab */}
      {activeTab === 'troubleshooting' && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white mb-1">
              Common Beginner Pitfalls & Troubleshooting
            </h2>
            <p className="text-xs text-slate-400">
              If your code throws an error in Jupyter, look for the matching symptom below.
            </p>
          </div>

          <div className="space-y-4">
            {currentStage.troubleshooting.map((item, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{item.problem}</span>
                </div>

                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Root Cause: </span>
                  {item.cause}
                </div>

                <div className="text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-900/40 p-2.5 rounded">
                  <span className="font-semibold text-emerald-200">How to Fix: </span>
                  {item.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
