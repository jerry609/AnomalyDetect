import React, { useEffect, useState } from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck, Fingerprint } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen && event && user) {
      setLoading(true);
      setAnalysis('');
      analyzeThreat(event, user)
        .then(result => {
          setAnalysis(result);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, event, user]);

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-900/20 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Threat Analysis</h2>
              <p className="text-xs text-indigo-400 font-mono">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-300 space-y-6">
          {/* Context Summary */}
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

          {/* AI Output */}
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium text-sm">
            Close
          </button>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50 transition-all font-medium text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Take Action
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAnalysisModal;