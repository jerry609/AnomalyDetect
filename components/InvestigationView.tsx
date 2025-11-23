import React, { useState } from 'react';
import { Search, Filter, Calendar, Share2, Download, ZoomIn, ZoomOut, Maximize, Play, Pause, FileText, Activity, Share, Globe, Laptop, Terminal, User } from 'lucide-react';
import { INVESTIGATION_GRAPH_NODES, INVESTIGATION_GRAPH_LINKS, FORENSIC_LOGS } from '../constants';
import { NodeType, RiskLevel } from '../types';
import RiskBadge from './RiskBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const InvestigationView: React.FC = () => {
  const [query, setQuery] = useState('user.id="u-001" AND event.risk_score > 70');
  const [activeTab, setActiveTab] = useState<'graph' | 'timeline' | 'logs'>('graph');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // --- Graph Visualization Helper ---
  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'USER': return User;
      case 'IP': return Globe;
      case 'FILE': return FileText;
      case 'PROCESS': return Terminal;
      case 'DOMAIN': return Activity;
      default: return Activity;
    }
  };

  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case 'USER': return 'fill-indigo-500';
      case 'IP': return 'fill-emerald-500';
      case 'FILE': return 'fill-orange-500';
      case 'PROCESS': return 'fill-slate-500';
      case 'DOMAIN': return 'fill-red-500';
      default: return 'fill-slate-500';
    }
  };

  // Mock timeline data based on logs
  const timelineData = FORENSIC_LOGS.map((log, i) => ({
    time: log.time.split(' ')[1],
    risk: log.risk,
    type: log.type
  }));

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] overflow-hidden">
      
      {/* Top Search Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Share className="w-5 h-5 text-indigo-500" />
            Threat Hunt Workbench
          </h1>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-medium rounded hover:bg-slate-700 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Last 24 Hours
            </button>
            <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-500">
              Save Case
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-indigo-500 font-mono font-bold">{'>'}</span>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-8 pr-12 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
              spellCheck={false}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button className="p-1 hover:bg-slate-800 rounded text-indigo-400">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-900/20 transition-all">
            Run Query
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Filters) */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-6 overflow-y-auto hidden md:flex">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Event Sources</h3>
            <div className="space-y-2">
              {['Firewall Logs (2.1k)', 'Active Directory (450)', 'Endpoint Security (120)', 'CloudTrail (85)'].map((filter, i) => (
                <label key={i} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-600 text-indigo-600 focus:ring-indigo-500" />
                  {filter}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Risk Level</h3>
            <div className="space-y-2">
              {['Critical', 'High', 'Medium', 'Low'].map((level, i) => (
                <label key={i} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                  <input type="checkbox" defaultChecked={i < 2} className="rounded bg-slate-800 border-slate-600 text-indigo-600 focus:ring-indigo-500" />
                  {level}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0b1120]">
          
          {/* Visual Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/50">
            <button 
              onClick={() => setActiveTab('graph')}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'graph' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Share2 className="w-4 h-4" />
              Link Analysis
            </button>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Activity className="w-4 h-4" />
              Event Timeline
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'logs' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <FileText className="w-4 h-4" />
              Raw Logs
            </button>
          </div>

          {/* Canvas Content */}
          <div className="flex-1 overflow-hidden relative p-4">
            
            {activeTab === 'graph' && (
              <div className="h-full w-full bg-[#0b1120] relative rounded-xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                 {/* Graph Controls */}
                 <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700 z-10">
                   <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded"><ZoomIn className="w-4 h-4"/></button>
                   <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded"><ZoomOut className="w-4 h-4"/></button>
                   <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded"><Maximize className="w-4 h-4"/></button>
                 </div>

                 {/* SVG Graph */}
                 <svg className="w-full h-full" viewBox="0 0 800 600">
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                      </marker>
                    </defs>
                    
                    {/* Links */}
                    {INVESTIGATION_GRAPH_LINKS.map((link, i) => {
                      const source = INVESTIGATION_GRAPH_NODES.find(n => n.id === link.source)!;
                      const target = INVESTIGATION_GRAPH_NODES.find(n => n.id === link.target)!;
                      return (
                        <g key={i}>
                          <line 
                            x1={source.x} y1={source.y} 
                            x2={target.x} y2={target.y} 
                            stroke={link.active ? '#ef4444' : '#334155'} 
                            strokeWidth={link.active ? 2 : 1}
                            strokeDasharray={link.active ? "5,5" : ""}
                            markerEnd="url(#arrowhead)"
                          />
                          {link.active && <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />}
                        </g>
                      );
                    })}

                    {/* Nodes */}
                    {INVESTIGATION_GRAPH_NODES.map((node) => {
                      const Icon = getNodeIcon(node.type);
                      const isSelected = selectedNodeId === node.id;
                      
                      return (
                        <g 
                          key={node.id} 
                          className="cursor-pointer transition-all duration-300"
                          onClick={() => setSelectedNodeId(node.id)}
                        >
                          {/* Risk Halo */}
                          {node.risk > 80 && (
                            <circle cx={node.x} cy={node.y} r="35" className="fill-red-500/20 animate-pulse" />
                          )}
                          
                          {/* Node Circle */}
                          <circle 
                            cx={node.x} cy={node.y} r="25" 
                            className={`${isSelected ? 'stroke-white stroke-2' : 'stroke-slate-700'} ${getNodeColor(node.type)} drop-shadow-xl`} 
                          />
                          
                          {/* Icon Overlay (Simulated via text/foreignObject is tricky in pure SVG in React, keeping it simple with Circle fill for now, but adding icon via foreignObject for better look) */}
                          <foreignObject x={node.x - 12} y={node.y - 12} width="24" height="24">
                            <Icon className="w-6 h-6 text-white" />
                          </foreignObject>

                          {/* Label */}
                          <text 
                            x={node.x} y={node.y + 45} 
                            textAnchor="middle" 
                            className="fill-slate-300 text-xs font-mono font-medium"
                          >
                            {node.label}
                          </text>
                          
                          {/* Risk Badge */}
                          {node.risk > 0 && (
                             <rect x={node.x + 15} y={node.y - 25} width="24" height="14" rx="4" fill={node.risk > 75 ? '#ef4444' : '#f59e0b'} />
                          )}
                          <text x={node.x + 27} y={node.y - 15} textAnchor="middle" className="fill-white text-[9px] font-bold">{node.risk}</text>
                        </g>
                      );
                    })}
                 </svg>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="h-full w-full bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">Event Density & Risk Timeline</h3>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={timelineData}>
                    <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                      cursor={{ fill: '#334155', opacity: 0.4 }}
                    />
                    <Bar dataKey="risk" barSize={40}>
                      {timelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.risk > 80 ? '#ef4444' : entry.risk > 50 ? '#f97316' : '#6366f1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'logs' && (
               <div className="h-full w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                  <div className="overflow-auto flex-1">
                    <table className="w-full text-left font-mono text-sm">
                      <thead className="bg-slate-950 text-slate-400 sticky top-0 z-10">
                        <tr>
                          <th className="p-3 font-medium border-b border-slate-800">Timestamp</th>
                          <th className="p-3 font-medium border-b border-slate-800">Event Type</th>
                          <th className="p-3 font-medium border-b border-slate-800">Source</th>
                          <th className="p-3 font-medium border-b border-slate-800">Details</th>
                          <th className="p-3 font-medium border-b border-slate-800 text-right">Risk Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {FORENSIC_LOGS.map((log, i) => (
                          <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-3 text-slate-400 whitespace-nowrap">{log.time}</td>
                            <td className="p-3 text-yellow-400">{log.type}</td>
                            <td className="p-3 text-slate-300">{log.src}</td>
                            <td className="p-3 text-slate-400 truncate max-w-md" title={log.details}>{log.details}</td>
                            <td className="p-3 text-right">
                              <span className={`${log.risk > 80 ? 'text-red-500' : 'text-emerald-500'} font-bold`}>{log.risk}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            )}
            
          </div>

          {/* Bottom Forensic Log Preview (Collapsible) */}
          <div className="h-48 border-t border-slate-800 bg-slate-950 p-4 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Forensic Stream</h4>
              <div className="flex gap-2">
                 <button className="text-slate-500 hover:text-white"><Play className="w-3 h-3" /></button>
                 <button className="text-slate-500 hover:text-white"><Download className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto font-mono text-xs text-slate-400 space-y-1">
               {FORENSIC_LOGS.map((log, i) => (
                 <div key={i} className="flex gap-4 border-b border-slate-900 pb-1 mb-1 hover:bg-slate-900/50 cursor-pointer">
                   <span className="text-slate-600 w-32 shrink-0">{log.time}</span>
                   <span className={`${log.risk > 80 ? 'text-red-400' : 'text-indigo-400'} w-24 shrink-0`}>{log.type}</span>
                   <span className="text-slate-300 truncate">{log.details}</span>
                 </div>
               ))}
            </div>
          </div>

        </div>

        {/* Right Details Panel (Conditional) */}
        {selectedNodeId && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 shadow-xl z-20 overflow-y-auto animate-slide-in-right">
             <div className="flex justify-between items-start mb-6">
               <h3 className="text-lg font-bold text-white">Entity Details</h3>
               <button onClick={() => setSelectedNodeId(null)} className="text-slate-500 hover:text-white"><ZoomOut className="w-4 h-4" /></button>
             </div>
             
             {(() => {
                const node = INVESTIGATION_GRAPH_NODES.find(n => n.id === selectedNodeId);
                if (!node) return null;
                return (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${node.risk > 80 ? 'bg-red-500/20' : 'bg-slate-800'}`}>
                          {React.createElement(getNodeIcon(node.type), { className: `w-6 h-6 ${node.risk > 80 ? 'text-red-500' : 'text-slate-400'}` })}
                       </div>
                       <div>
                         <div className="text-xl font-bold text-white">{node.label}</div>
                         <div className="text-xs text-slate-500">{node.type} • ID: {node.id}</div>
                       </div>
                    </div>

                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Current Risk Score</div>
                      <div className="text-3xl font-bold text-white flex items-center gap-2">
                        {node.risk} 
                        <RiskBadge level={node.risk > 80 ? RiskLevel.CRITICAL : RiskLevel.MEDIUM} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase">Related Indicators</h4>
                      <div className="bg-slate-800/50 rounded p-2 text-xs text-slate-300 font-mono">
                         source_ip: 10.0.0.52<br/>
                         user_agent: Mozilla/5.0...<br/>
                         process_owner: SYSTEM
                      </div>
                    </div>

                    <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-sm">
                      Isolate Entity
                    </button>
                  </div>
                );
             })()}
          </div>
        )}

      </div>
    </div>
  );
};

export default InvestigationView;