import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

export const CreditScoreSimulator: React.FC = () => {
  const [income, setIncome] = useState<number>(65000);
  const [debt, setDebt] = useState<number>(22000);
  const [utilization, setUtilization] = useState<number>(45); // %
  const [creditLines, setCreditLines] = useState<number>(6);
  const [delinquencies, setDelinquencies] = useState<number>(0);
  const [severeDefaults, setSevereDefaults] = useState<number>(0);
  const [age, setAge] = useState<number>(42);

  // Financial calculations
  const monthlyIncome = income / 12;
  const estimatedMonthlyDebtPayment = debt * 0.035; // approx 3.5% min payment/amortization
  const dti = monthlyIncome > 0 ? (estimatedMonthlyDebtPayment / monthlyIncome) : 0;

  // Real Machine Learning Probability of Default (Logistic model simulation)
  // z represents log-odds of default
  const utilNorm = utilization / 100;
  const incomeLog = Math.log(Math.max(1000, income));
  const z = -0.5 
    + (delinquencies * 0.95) 
    + (severeDefaults * 1.85) 
    + (utilNorm * 2.10) 
    + (dti * 1.40) 
    - (incomeLog * 0.32) 
    - ((age - 35) * 0.015);

  const probLogistic = 1 / (1 + Math.exp(-z));
  
  // Random Forest probability simulation (capturing non-linear interactions)
  let probRF = 0.04;
  if (severeDefaults > 0) probRF += 0.45;
  if (delinquencies > 0) probRF += delinquencies * 0.12;
  if (utilization > 80) probRF += 0.28;
  else if (utilization > 50) probRF += 0.10;
  if (dti > 0.45) probRF += 0.18;
  if (income < 30000) probRF += 0.12;
  probRF = Math.min(0.98, Math.max(0.02, probRF));

  // Blend model ensemble
  const finalProbDefault = (probLogistic * 0.4) + (probRF * 0.6);

  // Credit Score mapping (standard 300 - 850 range)
  // Score = 850 - (finalProbDefault * 550)
  const creditScore = Math.round(Math.max(300, Math.min(850, 850 - (finalProbDefault * 520))));

  // Risk Tier determination
  let tier = 'Prime (Low Risk)';
  let tierColor = 'text-emerald-400';
  let tierBg = 'bg-emerald-950/40 border-emerald-500/30';
  let decision = 'Approved (Auto-Underwriting)';

  if (creditScore < 600 || finalProbDefault > 0.40) {
    tier = 'Subprime (High Risk)';
    tierColor = 'text-rose-400';
    tierBg = 'bg-rose-950/40 border-rose-500/30';
    decision = 'Declined';
  } else if (creditScore < 700 || finalProbDefault > 0.18) {
    tier = 'Near-Prime (Moderate Risk)';
    tierColor = 'text-amber-400';
    tierBg = 'bg-amber-950/40 border-amber-500/30';
    decision = 'Referred to Senior Underwriter';
  }

  // Adverse Action reasons (FCRA Stage 11 requirement)
  const adverseReasons: string[] = [];
  if (severeDefaults > 0) adverseReasons.push('History of severe delinquency (90+ days past due)');
  if (utilization > 60) adverseReasons.push(`Revolving credit line utilization excessive (${utilization}%)`);
  if (delinquencies > 0) adverseReasons.push(`Recent 30-59 day delinquencies reported (${delinquencies} events)`);
  if (dti > 0.43) adverseReasons.push(`Debt-to-Income ratio (${(dti * 100).toFixed(1)}%) exceeds maximum threshold`);
  if (income < 35000) adverseReasons.push('Insufficient verified gross annual income');
  if (adverseReasons.length === 0) adverseReasons.push('No adverse factors found');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
          <span>WHAT-IF RISK ENGINE</span>
          <span>·</span>
          <span>STAGE 10 & 11 APPLICATION</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Interactive Credit Risk & Score Simulator
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Test how financial attributes directly alter the default probability, credit score, and adverse action notice reasons in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Sliders */}
        <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-700/60">
            Applicant Financial Parameters
          </h2>

          {/* Annual Income */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Annual Gross Income</label>
              <span className="font-mono tabular-nums text-sky-400 font-semibold">
                ${income.toLocaleString()} / year
              </span>
            </div>
            <input
              type="range"
              min={15000}
              max={250000}
              step={2500}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$15,000</span>
              <span>$100,000</span>
              <span>$250,000</span>
            </div>
          </div>

          {/* Total Debt */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Total Outstanding Debt</label>
              <span className="font-mono tabular-nums text-sky-400 font-semibold">
                ${debt.toLocaleString()} (Est. DTI: {(dti * 100).toFixed(1)}%)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={120000}
              step={1000}
              value={debt}
              onChange={(e) => setDebt(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$0</span>
              <span>$60,000</span>
              <span>$120,000</span>
            </div>
          </div>

          {/* Revolving Credit Utilization */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Revolving Credit Line Utilization</label>
              <span className={`font-mono tabular-nums font-semibold ${utilization > 70 ? 'text-rose-400' : 'text-sky-400'}`}>
                {utilization}% of credit limits
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={120}
              step={2}
              value={utilization}
              onChange={(e) => setUtilization(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Ideal)</span>
              <span>30% (Standard Benchmark)</span>
              <span>120% (Maxed Out)</span>
            </div>
          </div>

          {/* Open Credit Lines */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Number of Open Credit Lines & Loans</label>
              <span className="font-mono tabular-nums text-sky-400 font-semibold">
                {creditLines} accounts
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={creditLines}
              onChange={(e) => setCreditLines(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Delinquencies 30-59 Days */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Past 30-59 Days Delinquencies</label>
              <span className={`font-mono tabular-nums font-semibold ${delinquencies > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {delinquencies} times
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              step={1}
              value={delinquencies}
              onChange={(e) => setDelinquencies(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Severe 90+ Days Defaults */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Severe Defaults (90+ Days Past Due)</label>
              <span className={`font-mono tabular-nums font-semibold ${severeDefaults > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {severeDefaults} severe defaults
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={severeDefaults}
              onChange={(e) => setSevereDefaults(Number(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer"
            />
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Applicant Age</label>
              <span className="font-mono tabular-nums text-slate-300 font-semibold">
                {age} years old
              </span>
            </div>
            <input
              type="range"
              min={18}
              max={80}
              step={1}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Model Scoring Output & Adverse Action Notice */}
        <div className="lg:col-span-5 space-y-6">
          {/* Credit Score Gauge Card */}
          <div className={`rounded-xl p-6 border ${tierBg} shadow-sm space-y-4`}>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Predicted Credit Score
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${tierBg} ${tierColor}`}>
                {tier}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-extrabold font-mono tabular-nums ${tierColor}`}>
                {creditScore}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 850</span>
            </div>

            {/* Score Track Bar */}
            <div className="space-y-1">
              <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                <div className="bg-rose-500 h-full w-[35%]" title="Subprime (300-580)" />
                <div className="bg-amber-500 h-full w-[25%]" title="Fair / Near-Prime (580-670)" />
                <div className="bg-sky-500 h-full w-[20%]" title="Good (670-740)" />
                <div className="bg-emerald-500 h-full w-[20%]" title="Excellent (740-850)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>300</span>
                <span>580</span>
                <span>670</span>
                <span>740</span>
                <span>850</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/50 text-xs">
              <div>
                <span className="text-slate-400">P(Default - Logistic):</span>
                <div className="font-mono tabular-nums font-bold text-slate-200">
                  {(probLogistic * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-slate-400">P(Default - Random Forest):</span>
                <div className="font-mono tabular-nums font-bold text-slate-200">
                  {(probRF * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Underwriting Recommendation */}
            <div className="pt-2">
              <div className="text-xs text-slate-400 mb-1">Underwriting Decision:</div>
              <div className={`text-sm font-bold flex items-center gap-2 ${tierColor}`}>
                {decision === 'Approved (Auto-Underwriting)' && <ShieldCheck className="w-4 h-4" />}
                {decision === 'Referred to Senior Underwriter' && <AlertTriangle className="w-4 h-4" />}
                {decision === 'Declined' && <ShieldAlert className="w-4 h-4" />}
                <span>{decision}</span>
              </div>
            </div>
          </div>

          {/* Adverse Action Notice (Stage 11 compliance) */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Adverse Action Notice (FCRA Disclosure)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Under the Equal Credit Opportunity Act (ECOA) & Fair Credit Reporting Act (FCRA), lenders must provide specific key factors influencing adverse scores:
            </p>

            <ul className="text-xs space-y-1.5">
              {adverseReasons.slice(0, 3).map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-sky-400 font-mono font-bold shrink-0">{idx + 1}.</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
