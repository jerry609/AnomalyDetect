import React, { useEffect, useState } from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck, Fingerprint, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { AnomalyEvent, UserEntity } from '../types';
import { analyzeThreat } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: AnomalyEvent | null;
  user: UserEntity | undefined;
}

const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({ isOpen, onClose, event, user }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [view, setView] = useState<'analysis' | 'actions'>('analysis');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [manualAction, setManualAction] = useState<string>('');
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    if (isOpen && event && user) {
      setLoading(true);
      setAnalysis('');
      setView('analysis'); // Reset view on open
      setSelectedActions([]);
      setManualAction('');
      
      analyzeThreat(event, user)
        .then(result => {
          setAnalysis(result);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, event, user]);

  const recommendedActions = [
    "Suspend User Account",
    "Revoke Active Sessions",
    "Isolate Endpoint (Network Quarantine)",
    "Force Password Reset",
    "Create High-Priority Jira Ticket",
    "Escalate to SOC Tier 2"
  ];

  const handleActionToggle = (action: string) => {
    if (selectedActions.includes(action)) {
      setSelectedActions(prev => prev.filter(a => a !== action));
    } else {
      setSelectedActions(prev => [...prev, action]);
    }
  };

  const handleExecute = () => {
    setExecuting(true);
    // Simulate API call
    setTimeout(() => {
      setExecuting(false);
      onClose();
      // In a real app, this would trigger a toast
      alert(`Successfully executed ${selectedActions.length} actions.`);
    }, 1500);
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-900/20 to-slate-900">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${view === 'analysis' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20' : 'bg-emerald-600 shadow-emerald-500/20'}`}>
              {view === 'analysis' ? <Sparkles className="w-5 h-5 text-white" /> : <ShieldCheck className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{view === 'analysis' ? 'AI Threat Analysis' : 'Response Plan'}</h2>
              <p className="text-xs text-slate-400 font-mono">
                {view === 'analysis' ? 'Powered by Gemini 2.5 Flash' : `Event ID: ${event.id}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-300 space-y-6">
          
          {/* Context Header (Always visible) */}
          <div className="flex gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex-1 space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Target User</span>
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-slate-400" />
                <span className="font-mono text-indigo-300">{user?.name}</span>
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Event Type</span>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="font-mono text-slate-200">{event.type}</span>
              </div>
            </div>
          </div>

          {view === 'analysis' ? (
            /* AI Analysis View */
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                  <div className="h-20 bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                </div>
              ) : (
                <div className="prose prose-invert prose-indigo max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-white">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              )}
            </div>
          ) : (
            /* Action View */
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">Recommended Actions</h3>
                <div className="space-y-2">
                  {recommendedActions.map((action, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleActionToggle(action)}
                      className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${
                        selectedActions.includes(action) 
                          ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300' 
                          : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        selectedActions.includes(action) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'
                      }`}>
                        {selectedActions.includes(action) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-sm font-medium">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Manual Notes / Override</h3>
                <textarea 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Enter specific remediation details or notes for the SOC team..."
                  value={manualAction}
                  onChange={(e) => setManualAction(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between gap-3">
          {view === 'actions' && (
            <button onClick={() => setView('analysis')} className="text-slate-500 hover:text-slate-300 text-sm font-medium px-2">
              Back to Analysis
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium text-sm">
              Cancel
            </button>
            {view === 'analysis' ? (
               <button 
                 onClick={() => setView('actions')}
                 className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50 transition-all font-medium text-sm flex items-center gap-2"
               >
                 <ShieldCheck className="w-4 h-4" />
                 Take Action
               </button>
            ) : (
              <button 
                onClick={handleExecute}
                disabled={selectedActions.length === 0 && !manualAction}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-emerald-900/50 transition-all font-medium text-sm flex items-center gap-2"
              >
                {executing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Execute Response
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAnalysisModal;