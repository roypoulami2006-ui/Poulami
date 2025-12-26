
import React, { useState } from 'react';
import { AnalysisResult, AnalysisStatus, UserReport } from '../types';

interface AnalysisCardProps {
  result: AnalysisResult;
  onClose?: () => void;
  onReportSubmit?: (report: UserReport) => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ result, onClose, onReportSubmit }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getStatusConfig = (status: AnalysisStatus) => {
    switch (status) {
      case AnalysisStatus.SCAM:
        return {
          bg: 'bg-red-50/90',
          border: 'border-red-200',
          text: 'text-red-700',
          badge: 'bg-red-600 text-white',
          icon: '⚠️',
          label: 'Immediate Scam Detected',
          highlight: 'bg-red-500/10'
        };
      case AnalysisStatus.RISK:
        return {
          bg: 'bg-amber-50/90',
          border: 'border-amber-200',
          text: 'text-amber-700',
          badge: 'bg-amber-500 text-white',
          icon: '🚧',
          label: 'Moderate Risk Warning',
          highlight: 'bg-amber-500/10'
        };
      case AnalysisStatus.SAFE:
      default:
        return {
          bg: 'bg-emerald-50/90',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          badge: 'bg-emerald-600 text-white',
          icon: '✅',
          label: 'Message Verified Safe',
          highlight: 'bg-emerald-500/10'
        };
    }
  };

  const config = getStatusConfig(result.status);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    const report: UserReport = {
      messageId: result.id,
      content: result.inputText,
      aiClassification: result.status,
      userReason: reportReason,
      timestamp: Date.now(),
    };

    onReportSubmit?.(report);
    setIsSubmitted(true);
    setIsReporting(false);
  };

  return (
    <div className={`w-full max-w-3xl rounded-[2.5rem] border ${config.border} ${config.bg} p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 relative overflow-hidden group`}>
      {/* Decorative accent background */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10 blur-3xl ${config.badge.split(' ')[0]}`}></div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${config.badge} shadow-lg shadow-current/30 text-xl`}>
            {config.icon}
          </div>
          <div className="flex flex-col">
            <span className={`text-xs font-black uppercase tracking-[0.2em] ${config.text}`}>
              Shield Status
            </span>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              {config.label}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isSubmitted && !isReporting && (
            <button 
              onClick={() => setIsReporting(true)}
              className="group flex items-center gap-2 px-4 py-2 bg-white/50 border border-white hover:bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 transition-all shadow-sm"
              title="Report Feedback"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Flag
            </button>
          )}
          {onClose && (
            <button 
              onClick={onClose}
              className="bg-white/50 hover:bg-white border border-white text-slate-400 hover:text-slate-600 transition-all p-2 rounded-xl shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="bg-white/50 rounded-3xl p-6 border border-white/60">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Intercepted Message</h3>
          <p className="text-slate-800 leading-relaxed font-medium italic break-words text-lg">
            "{result.inputText}"
          </p>
        </div>

        <div>
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${config.text}`}>AI Forensic Analysis</h3>
          <p className="text-slate-700 leading-relaxed text-lg font-medium">
            {result.explanation}
          </p>
        </div>

        {result.flaggedPhrases.length > 0 && (
          <div className="bg-red-500/5 rounded-3xl p-6 border border-red-500/10">
            <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
               <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
               High-Risk Triggers
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.flaggedPhrases.map((phrase, idx) => (
                <span key={idx} className="px-4 py-2 bg-white border border-red-100 rounded-xl text-xs font-black text-red-600 shadow-sm uppercase tracking-wider">
                  {phrase}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-indigo-600 h-8 w-1 rounded-full"></div>
             <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Mandatory Safety Protocol</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.actionableTips.map((tip, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-white/40 rounded-2xl border border-white/50 items-start">
                 <div className="bg-indigo-100 text-indigo-600 p-1 rounded-lg text-xs font-black shrink-0">
                    {idx + 1}
                 </div>
                 <p className="text-sm text-slate-600 font-bold leading-tight">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {isReporting && (
          <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white shadow-2xl animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-500 p-2.5 rounded-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
              </div>
              <h4 className="text-lg font-black tracking-tight">Report Classification Error</h4>
            </div>
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <textarea
                autoFocus
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Briefly describe the error (e.g. False Positive, Missing Phishing Link)..."
                className="w-full p-5 bg-white/10 text-white placeholder-white/30 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none h-28 font-medium"
              />
              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsReporting(false)}
                  className="px-6 py-2.5 text-xs font-black text-white/50 hover:text-white uppercase tracking-widest transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-600/30 uppercase tracking-[0.2em]"
                >
                  Send Report
                </button>
              </div>
            </form>
          </div>
        )}

        {isSubmitted && (
          <div className="mt-8 p-6 bg-indigo-600 rounded-3xl text-white flex items-center gap-6 animate-in fade-in zoom-in-95 duration-500 shadow-xl shadow-indigo-600/40">
            <div className="bg-white text-indigo-600 rounded-full p-2.5 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-black uppercase tracking-widest mb-1">Feedback Verified</p>
              <p className="text-sm font-medium text-white/80">
                Data point submitted to central intelligence. You're making the community safer.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisCard;
