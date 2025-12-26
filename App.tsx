
import React, { useState, useEffect } from 'react';
import { analyzeMessage } from './services/geminiService';
import { AnalysisResult, AnalysisStatus, UserReport } from './types';
import AnalysisCard from './components/AnalysisCard';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<UserReport[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('scamguard_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }

    const savedReports = localStorage.getItem('scamguard_reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error("Failed to parse reports");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scamguard_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('scamguard_reports', JSON.stringify(reports));
  }, [reports]);

  const handleAnalyze = async () => {
    if (!inputText.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);
    setCurrentResult(null);

    try {
      const result = await analyzeMessage(inputText);
      setCurrentResult(result);
      setHistory(prev => [result, ...prev.slice(0, 9)]);
      setInputText('');
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReportSubmit = (report: UserReport) => {
    setReports(prev => [report, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scamguard_history');
  };

  const removeHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen text-slate-100">
      {/* Glass Navbar */}
      <nav className="glass-navbar sticky top-0 z-50 px-4 py-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-600/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Social<span className="text-indigo-400">Shield</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
            <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Analyzer</a>
            <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Safety Guide</a>
            <button className="bg-white text-slate-900 px-5 py-2 rounded-xl hover:bg-slate-200 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-white/10">
              SOS Support
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            <header className="space-y-6">
              <div className="inline-block bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-indigo-500/30 backdrop-blur-md">
                Intelligence Protocol V2.0
              </div>
              <h2 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight">
                Neutralize threats <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">before they strike.</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                SocialShield's multi-layered neural network analyzes semantic structures to identify digital manipulation in milliseconds.
              </p>
            </header>

            <div className="glass-panel rounded-[2rem] shadow-2xl overflow-hidden transition-all hover:border-white/20">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Drop a link, DM, or comment to verify..."
                className="w-full h-56 p-8 bg-transparent resize-none focus:outline-none text-white placeholder-slate-500 text-xl leading-relaxed font-medium"
              />
              <div className="bg-white/5 px-8 py-5 flex items-center justify-between border-t border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                   <div className="flex h-2.5 w-2.5 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${inputText.length > 0 ? 'bg-indigo-400' : 'bg-slate-600'} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${inputText.length > 0 ? 'bg-indigo-400' : 'bg-slate-700'}`}></span>
                   </div>
                   <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                     Bit-Stream Analysis Ready
                   </span>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!inputText.trim() || isAnalyzing}
                  className={`relative overflow-hidden group flex items-center gap-3 px-10 py-4 rounded-2xl font-black transition-all duration-300 ${
                    !inputText.trim() || isAnalyzing
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-2xl shadow-indigo-600/40 hover:-translate-y-1'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Decrypting...
                    </>
                  ) : (
                    <>
                      Secure Message
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 backdrop-blur-xl">
                <div className="bg-red-500 p-2.5 rounded-xl shadow-lg shadow-red-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xs uppercase tracking-[0.2em]">Network Exception</span>
                  <span className="text-sm opacity-80">{error}</span>
                </div>
              </div>
            )}

            {currentResult && (
              <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-6">
                  <h3 className="text-2xl font-black text-white tracking-tight shrink-0">Security Report</h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                </div>
                <AnalysisCard 
                  result={currentResult} 
                  onClose={() => setCurrentResult(null)} 
                  onReportSubmit={handleReportSubmit}
                />
              </div>
            )}
          </div>

          <div className="space-y-10">
            <div className="glass-panel rounded-[2.5rem] p-10 shadow-2xl border border-white/10">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg font-black text-white flex items-center gap-3">
                  <div className="bg-white/5 p-2 rounded-xl text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  System Logs
                </h3>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
                  >
                    Purge
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12 opacity-40">
                   <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                   </div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Logs Empty</p>
                </div>
              ) : (
                <div className="space-y-5 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      className="group relative p-5 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => setCurrentResult(item)}
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeHistoryItem(item.id); }}
                        className="absolute -top-2 -right-2 bg-slate-800 border border-white/10 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 shadow-2xl"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="flex items-center gap-5">
                        <div className={`h-12 w-1.5 flex-shrink-0 rounded-full ${
                          item.status === AnalysisStatus.SCAM ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                          item.status === AnalysisStatus.RISK ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        }`} />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-black text-white truncate uppercase tracking-tight">{item.inputText}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                              item.status === AnalysisStatus.SCAM ? 'text-red-400' :
                              item.status === AnalysisStatus.RISK ? 'text-amber-400' : 'text-emerald-400'
                            }`}>{item.status}</span>
                            <span className="text-white/10">|</span>
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                              {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                 </svg>
              </div>
              <h3 className="font-black text-2xl mb-4 relative z-10 leading-none">Intelligence Contributor</h3>
              <p className="text-indigo-100 text-sm mb-8 relative z-10 leading-relaxed font-medium">
                You've fortified our collective defense with <span className="bg-white/20 px-2 py-0.5 rounded font-black text-white">{reports.length} critical alerts</span>. Every report trains our model to be 1% smarter.
              </p>
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 flex items-center justify-between relative z-10 border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Global Trust Score</span>
                <div className="flex gap-1.5">
                   {[1,2,3,4,5].map(i => <div key={i} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${reports.length >= i ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/10'}`}></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 border-t border-white/5 py-20 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
              <div className="col-span-1 md:col-span-2 space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter">SocialShield</span>
                 </div>
                 <p className="text-slate-400 text-base max-w-sm leading-relaxed font-medium">
                   Empowering digital citizens with decentralized AI threat detection. We are the wall between you and the predators.
                 </p>
              </div>
              <div>
                 <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-8">Ecosystem</h4>
                 <ul className="space-y-5 text-sm font-black text-slate-300 uppercase tracking-widest">
                    <li className="hover:text-white cursor-pointer transition-colors">Neural Hub</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Risk Index</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Core API</li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-8">Resources</h4>
                 <ul className="space-y-5 text-sm font-black text-slate-300 uppercase tracking-widest">
                    <li className="hover:text-white cursor-pointer transition-colors">Dark Web Alerts</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Defense Docs</li>
                    <li className="hover:text-white cursor-pointer transition-colors">SOS Terminal</li>
                 </ul>
              </div>
           </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">&copy; 2025 SOCIALSHIELD CORE // SECURED INFRASTRUCTURE</p>
            <div className="flex items-center gap-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Legal</a>
              <a href="#" className="hover:text-white transition-colors">Uptime</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
