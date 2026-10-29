import React, { useState } from 'react';
import { BarChart3, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';

export const MetricsLab: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(0.50);

  // Total test population: 30,000 applicants (27,995 good, 2,005 actual defaulters = 6.68% base rate)
  const totalGood = 27995;
  const totalBad = 2005;

  // Realistic simulation of Random Forest predictions at varying thresholds
  // As threshold goes up, predictions of default decrease
  const t = threshold;
  // Recall decreases as threshold increases: Recall approx 0.95 at 0.15, 0.74 at 0.50, 0.40 at 0.80
  const recall = Math.max(0.20, Math.min(0.96, 0.96 - Math.pow(t, 1.4) * 0.75));
  // False Positive Rate decreases sharply as threshold increases
  const fpr = Math.max(0.02, Math.min(0.55, 0.55 * Math.pow(1 - t, 1.6)));

  const truePositives = Math.round(totalBad * recall);
  const falseNegatives = totalBad - truePositives; // Missed bad loans
  const falsePositives = Math.round(totalGood * fpr); // Good loans wrongly rejected
  const trueNegatives = totalGood - falsePositives;

  const precision = (truePositives + falsePositives > 0) 
    ? (truePositives / (truePositives + falsePositives)) 
    : 0;
  const f1 = (precision + recall > 0) 
    ? (2 * (precision * recall) / (precision + recall)) 
    : 0;
  const accuracy = (truePositives + trueNegatives) / (totalGood + totalBad);

  // Financial impact calculation
  const lossPerDefault = 20000; // $20k average loss if defaulted
  const profitPerGoodLoan = 1500; // $1.5k net interest margin on good loan

  const defaultLosses = falseNegatives * lossPerDefault;
  const interestEarned = trueNegatives * profitPerGoodLoan;
  const opportunityLoss = falsePositives * profitPerGoodLoan;
  const netBankProfit = interestEarned - defaultLosses;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
          <span>MODEL EVALUATION & FINANCIAL OPTIMIZATION</span>
          <span>·</span>
          <span>STAGES 9 & 10</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Confusion Matrix & Decision Threshold Lab
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          See why 93% accuracy is dangerous in credit risk, and explore how adjusting the probability cutoff balances credit risk vs lost revenue.
        </p>
      </div>

      {/* Threshold Slider Card */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-sm font-semibold text-white">
              Classification Decision Threshold: <span className="font-mono text-sky-400 font-bold">{threshold.toFixed(2)}</span>
            </label>
            <p className="text-xs text-slate-400">
              Applicants with predicted P(Default) ≥ {threshold.toFixed(2)} are classified as High-Risk (Declined).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setThreshold(0.30)}
              className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            >
              Risk-Averse (0.30)
            </button>
            <button
              onClick={() => setThreshold(0.50)}
              className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            >
              Standard (0.50)
            </button>
            <button
              onClick={() => setThreshold(0.65)}
              className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            >
              Aggressive (0.65)
            </button>
          </div>
        </div>

        <input
          type="range"
          min={0.10}
          max={0.85}
          step={0.01}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-sky-400 cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>0.10 (Very Conservative - Decline More)</span>
          <span>0.50 (Default Cutoff)</span>
          <span>0.85 (Aggressive - Approve Almost All)</span>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Recall (Sensitivity)</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
            {(recall * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Defaulters caught</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Precision</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-sky-400 mt-1">
            {(precision * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Flagged who were truly bad</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">F1-Score</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-400 mt-1">
            {f1.toFixed(3)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Harmonic balance</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Apparent Accuracy</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-300 mt-1">
            {(accuracy * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Misleading due to imbalance</p>
        </div>
      </div>

      {/* Confusion Matrix Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Confusion Matrix (30,000 Test Applicants)
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* True Negatives */}
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-lg p-4 space-y-1">
              <div className="flex items-center justify-between text-emerald-400 font-semibold">
                <span>True Negatives (TN)</span>
                <span>Good Approved</span>
              </div>
              <div className="text-2xl font-extrabold font-mono tabular-nums text-emerald-300">
                {trueNegatives.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Good borrowers granted credit who successfully repay.
              </p>
            </div>

            {/* False Positives */}
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-lg p-4 space-y-1">
              <div className="flex items-center justify-between text-amber-400 font-semibold">
                <span>False Positives (FP)</span>
                <span>Good Denied</span>
              </div>
              <div className="text-2xl font-extrabold font-mono tabular-nums text-amber-300">
                {falsePositives.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Creditworthy borrowers mistakenly turned away (lost interest margin).
              </p>
            </div>

            {/* False Negatives */}
            <div className="bg-rose-950/40 border border-rose-500/50 rounded-lg p-4 space-y-1">
              <div className="flex items-center justify-between text-rose-400 font-semibold">
                <span>False Negatives (FN)</span>
                <span>CRITICAL RISK</span>
              </div>
              <div className="text-2xl font-extrabold font-mono tabular-nums text-rose-300">
                {falseNegatives.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Bad borrowers approved who default and cause severe write-offs!
              </p>
            </div>

            {/* True Positives */}
            <div className="bg-sky-950/30 border border-sky-500/40 rounded-lg p-4 space-y-1">
              <div className="flex items-center justify-between text-sky-400 font-semibold">
                <span>True Positives (TP)</span>
                <span>Bad Caught</span>
              </div>
              <div className="text-2xl font-extrabold font-mono tabular-nums text-sky-300">
                {truePositives.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                High-risk applicants correctly identified and declined.
              </p>
            </div>
          </div>
        </div>

        {/* Financial P&L Impact */}
        <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Financial Business Impact</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-2.5 bg-slate-900/70 rounded border border-slate-700/50">
              <span className="text-slate-400">Gross Interest Earned:</span>
              <span className="font-mono text-emerald-400 font-bold tabular-nums">
                +${interestEarned.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-900/70 rounded border border-slate-700/50">
              <span className="text-slate-400">Default Write-Off Losses:</span>
              <span className="font-mono text-rose-400 font-bold tabular-nums">
                -${defaultLosses.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-900/70 rounded border border-slate-700/50">
              <span className="text-slate-400">Opportunity Cost (Declined Good):</span>
              <span className="font-mono text-amber-400 font-bold tabular-nums">
                -${opportunityLoss.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-700 font-semibold text-sm">
              <span className="text-white">Net Portfolio Margin:</span>
              <span className={`font-mono tabular-nums font-extrabold ${netBankProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${netBankProfit.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed pt-2">
            <strong>Key Takeaway:</strong> A machine learning model is only as good as its business ROI. Lowering threshold catches more defaults (saves $20k each) at the expense of rejecting some good borrowers ($1.5k loss each).
          </div>
        </div>
      </div>
    </div>
  );
};
