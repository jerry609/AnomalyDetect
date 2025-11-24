import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar, Share2, Download, ZoomIn, ZoomOut, Maximize, Play, Pause, FileText, Activity, Globe, Laptop, Terminal, User, X, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { INVESTIGATION_GRAPH_NODES, INVESTIGATION_GRAPH_LINKS, FORENSIC_LOGS } from '../constants';
import { NodeType, RiskLevel, GraphNode } from '../types';
import RiskBadge from './RiskBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const InvestigationView: React.FC = () => {
  // --- State ---
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'graph' | 'timeline' | 'logs'>('graph');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Graph State
  const [nodes, setNodes] = useState(INVESTIGATION_GRAPH_NODES);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  
  // Filter State
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // --- Helpers ---
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
      case 'USER': return 'bg-indigo-500 border-indigo-400';
      case 'IP': return 'bg-emerald-500 border-emerald-400';
      case 'FILE': return 'bg-orange-500 border-orange-400';
      case 'PROCESS': return 'bg-slate-600 border-slate-500';
      case 'DOMAIN': return 'bg-pink-600 border-pink-500';
      default: return 'bg-slate-500 border-slate-400';
    }
  };

  // --- Derived Data ---
  
  // Filter logs based on search query and timeline selection
  const filteredLogs = useMemo(() => {
    return FORENSIC_LOGS.filter(log => {
      const matchesQuery = query === '' || 
        log.details.toLowerCase().includes(query.toLowerCase()) || 
        log.user.toLowerCase().includes(query.toLowerCase()) ||
        log.src.includes(query);
      
      const matchesTime = selectedTimeRange ? log.time.includes(selectedTimeRange) : true;
      
      return matchesQuery && matchesTime;
    });
  }, [query, selectedTimeRange]);

  // Highlight nodes based on query
  const highlightedNodeIds = useMemo(() => {
    if (!query) return new Set();
    return new Set(nodes.filter(n => 
      n.label.toLowerCase().includes(query.toLowerCase()) || 
      n.id.toLowerCase().includes(query.toLowerCase())
    ).map(n => n.id));
  }, [query, nodes]);

  // NEW: Connected nodes based on selection for highlighting
  const connectedIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const ids = new Set<string>();
    INVESTIGATION_GRAPH_LINKS.forEach(link => {
      if (link.source === selectedNodeId) ids.add(link.target);
      if (link.target === selectedNodeId) ids.add(link.source);
    });
    return ids;
  }, [selectedNodeId]);

  // Timeline Data Aggregation
  const timelineData = useMemo(() => {
    const counts: Record<string, { time: string, risk: number, count: number }> = {};
    FORENSIC_LOGS.forEach(log => {
      const timeKey = log.time.split(' ')[1].substring(0, 5); // HH:MM
      if (!counts[timeKey]) {
        counts[timeKey] = { time: timeKey, risk: 0, count: 0 };
      }
      counts[timeKey].risk = Math.max(counts[timeKey].risk, log.risk);
      counts[timeKey].count += 1;
    });
    return Object.values(counts).sort((a, b) => a.time.localeCompare(b.time));
  }, []);

  // --- Interaction Handlers ---

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault(); // Prevent default if possible, though React synthetic events might limit this
    const scaleFactor = 1.1;
    const delta = e.deltaY > 0 ? 1 / scaleFactor : scaleFactor;
    
    setTransform(prev => ({
      ...prev,
      k: Math.min(Math.max(0.5, prev.k * delta), 4) // Clamp zoom
    }));
  };

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (dragNodeId) return;
    setIsDragging(true);
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (dragNodeId) {
      // Dragging a node
      setNodes(prev => prev.map(n => {
        if (n.id === dragNodeId) {
          return {
            ...n,
            x: n.x + e.movementX / transform.k,
            y: n.y + e.movementY / transform.k
          };
        }
        return n;
      }));
    } else if (isDragging) {
      // Panning the canvas
      setTransform(prev => ({
        ...prev,
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleMouseUpCanvas = () => {
    setIsDragging(false);
    setDragNodeId(null);
  };

  const handleResetView = () => {
    setTransform({ x: 0, y: 0, k: 1 });
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] overflow-hidden">
      
      {/* Top Search Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-col gap-4 z-20 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-500" />
            Threat Hunt Workbench
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={() => { setQuery(''); setSelectedTimeRange(null); setSelectedNodeId(null); }}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-medium rounded hover:bg-slate-700 flex items-center gap-2"
            >
              Reset Filters
            </button>
            <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-500 shadow-lg shadow-indigo-900/50">
              Save Case
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`w-4 h-4 ${query ? 'text-indigo-400' : 'text-slate-500'}`} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by User ID, IP, File Name, or Query Syntax (e.g., event.type='LOGIN')"
              className="block w-full pl-10 pr-12 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-inner transition-all"
            />
            {query && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Filters) */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-6 overflow-y-auto hidden lg:flex shrink-0">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Investigation Scope</h3>
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Time Range</span>
                 <span className="text-slate-200 font-mono">24h</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Events</span>
                 <span className="text-slate-200 font-mono">{filteredLogs.length}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Entities</span>
                 <span className="text-slate-200 font-mono">{nodes.length}</span>
               </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Event Sources</h3>
            <div className="space-y-2">
              {['Firewall Logs', 'Active Directory', 'Endpoint Security', 'CloudTrail'].map((filter, i) => (
                <label key={i} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white group">
                  <div className="relative flex items-center">
                    <input type="checkbox" defaultChecked className="peer appearance-none w-4 h-4 border border-slate-600 rounded bg-slate-800 checked:bg-indigo-600 checked:border-indigo-600 transition-colors" />
                    <CheckCircle2 className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  {filter}
                </label>
              ))}
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
              <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-2 mb-1">
                <ShieldAlert className="w-3 h-3" />
                AI Insight
              </h4>
              <p className="text-[10px] text-indigo-200/80 leading-relaxed">
                Lateral movement pattern detected from <b>10.0.0.52</b> to <b>197.210.X.X</b>. Recommend isolating host.
              </p>
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0b1120] relative">
          
          {/* Visual Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm z-10 absolute top-0 left-0 right-0">
            <button 
              onClick={() => setActiveTab('graph')}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === 'graph' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Share2 className="w-4 h-4" />
              Link Analysis
            </button>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === 'timeline' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Activity className="w-4 h-4" />
              Event Timeline
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === 'logs' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <FileText className="w-4 h-4" />
              Raw Logs
            </button>
          </div>

          {/* Canvas Content */}
          <div className="flex-1 pt-12 relative overflow-hidden h-full">
            
            {activeTab === 'graph' && (
              <div 
                ref={containerRef}
                className="h-full w-full bg-[#0b1120] relative overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDownCanvas}
                onMouseMove={handleMouseMoveCanvas}
                onMouseUp={handleMouseUpCanvas}
                onMouseLeave={handleMouseUpCanvas}
                onWheel={handleWheel}
              >
                 {/* Graph Background Grid */}
                 <div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                      backgroundSize: `${20 * transform.k}px ${20 * transform.k}px`,
                      backgroundPosition: `${transform.x}px ${transform.y}px`
                    }}
                 />

                 {/* Graph Controls */}
                 <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
                   <div className="bg-slate-800 rounded-lg p-1 border border-slate-700 shadow-xl flex flex-col gap-1">
                      <button onClick={() => setTransform(p => ({...p, k: p.k * 1.2}))} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"><ZoomIn className="w-4 h-4"/></button>
                      <button onClick={() => setTransform(p => ({...p, k: p.k / 1.2}))} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"><ZoomOut className="w-4 h-4"/></button>
                      <button onClick={handleResetView} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"><Maximize className="w-4 h-4"/></button>
                   </div>
                 </div>

                 {/* SVG Graph */}
                 <svg className="w-full h-full overflow-visible pointer-events-none">
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                      </marker>
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
                      {/* Links */}
                      {INVESTIGATION_GRAPH_LINKS.map((link, i) => {
                        const source = nodes.find(n => n.id === link.source);
                        const target = nodes.find(n => n.id === link.target);
                        if (!source || !target) return null;

                        // Calculate visual state
                        const isLinkConnectedToSelection = selectedNodeId ? (link.source === selectedNodeId || link.target === selectedNodeId) : false;
                        const isLinkDimmed = selectedNodeId ? !isLinkConnectedToSelection : false;

                        return (
                          <g key={i} className={`transition-opacity duration-500 ${isLinkDimmed ? 'opacity-10' : 'opacity-100'}`}>
                            <line 
                              x1={source.x} y1={source.y} 
                              x2={target.x} y2={target.y} 
                              stroke={isLinkConnectedToSelection ? '#818cf8' : (link.active ? '#ef4444' : '#334155')} 
                              strokeWidth={isLinkConnectedToSelection ? 2.5 : (link.active ? 2 : 1)}
                              strokeDasharray={link.active && !isLinkConnectedToSelection ? "5,5" : ""}
                              markerEnd="url(#arrowhead)"
                            />
                            {/* Link Label Background */}
                            <rect 
                              x={(source.x + target.x)/2 - 30} 
                              y={(source.y + target.y)/2 - 8} 
                              width="60" height="16" 
                              fill="#0f172a" 
                              rx="4"
                            />
                            <text
                              x={(source.x + target.x)/2} 
                              y={(source.y + target.y)/2 + 4} 
                              textAnchor="middle"
                              fill={isLinkConnectedToSelection ? '#a5b4fc' : "#64748b"}
                              fontSize="10"
                              className="font-mono pointer-events-auto select-none"
                            >
                              {link.label}
                            </text>
                          </g>
                        );
                      })}

                      {/* Nodes */}
                      {nodes.map((node) => {
                        const Icon = getNodeIcon(node.type);
                        const isSelected = selectedNodeId === node.id;
                        const isConnected = connectedIds.has(node.id);
                        const isSearchMatch = highlightedNodeIds.has(node.id);
                        
                        // Determine dimming state
                        let isNodeDimmed = false;
                        if (selectedNodeId) {
                           // If a node is selected, dim everything except the node itself and its neighbors
                           isNodeDimmed = !isSelected && !isConnected;
                        } else if (highlightedNodeIds.size > 0) {
                           // If searching, dim everything that doesn't match
                           isNodeDimmed = !isSearchMatch;
                        }

                        return (
                          <g 
                            key={node.id} 
                            className={`pointer-events-auto transition-all duration-500 ${isNodeDimmed ? 'opacity-10 grayscale' : 'opacity-100'}`}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setDragNodeId(node.id);
                              setSelectedNodeId(node.id);
                            }}
                            style={{ cursor: 'grab' }}
                          >
                            {/* Selection Ring */}
                            {isSelected && (
                              <circle cx={node.x} cy={node.y} r="32" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow" />
                            )}

                            {/* Risk Halo (if Critical) */}
                            {node.risk > 80 && (
                              <circle cx={node.x} cy={node.y} r="40" className="fill-red-500/10 animate-pulse" />
                            )}
                            
                            {/* HTML Node Content via ForeignObject */}
                            <foreignObject x={node.x - 24} y={node.y - 24} width="48" height="48">
                              <div className={`w-full h-full rounded-full border-2 flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${getNodeColor(node.type)} ${isSelected ? 'ring-2 ring-white scale-110' : ''}`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                            </foreignObject>

                            {/* Label */}
                            <text 
                              x={node.x} y={node.y + 35} 
                              textAnchor="middle" 
                              className={`fill-slate-200 text-xs font-bold pointer-events-none select-none drop-shadow-md shadow-black transition-all ${isSelected ? 'text-white text-sm' : ''}`}
                            >
                              {node.label}
                            </text>

                            {/* Risk Badge on Node */}
                            {node.risk > 0 && (
                              <g transform={`translate(${node.x + 14}, ${node.y - 24})`}>
                                <rect width="20" height="12" rx="3" fill={node.risk > 75 ? '#ef4444' : '#f59e0b'} />
                                <text x="10" y="9" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{node.risk}</text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </g>
                 </svg>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="h-full w-full bg-slate-900/50 p-8 flex flex-col animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-white font-bold text-lg">Event Density & Risk Timeline</h3>
                   {selectedTimeRange && (
                     <button onClick={() => setSelectedTimeRange(null)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                       <X className="w-3 h-3" /> Clear Time Filter ({selectedTimeRange})
                     </button>
                   )}
                </div>
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={timelineData} 
                      onClick={(data) => {
                        if (data && data.activePayload) {
                          setSelectedTimeRange(data.activePayload[0].payload.time);
                        }
                      }}
                      cursor="pointer"
                    >
                      <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                        cursor={{ fill: '#334155', opacity: 0.3 }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
                        {timelineData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.risk > 80 ? '#ef4444' : entry.risk > 50 ? '#f97316' : '#6366f1'} 
                            opacity={selectedTimeRange && selectedTimeRange !== entry.time ? 0.3 : 1}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-xs text-slate-500 mt-4">Click on a bar to filter forensic logs by time interval.</p>
              </div>
            )}

            {activeTab === 'logs' && (
               <div className="h-full w-full bg-slate-900/50 p-6 animate-fade-in flex flex-col">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex-1 flex flex-col shadow-lg">
                    <div className="overflow-auto flex-1 custom-scrollbar">
                      <table className="w-full text-left font-mono text-sm">
                        <thead className="bg-slate-950 text-slate-400 sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th className="p-4 font-medium border-b border-slate-800">Timestamp</th>
                            <th className="p-4 font-medium border-b border-slate-800">Event Type</th>
                            <th className="p-4 font-medium border-b border-slate-800">Source</th>
                            <th className="p-4 font-medium border-b border-slate-800">Details</th>
                            <th className="p-4 font-medium border-b border-slate-800 text-right">Risk</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {filteredLogs.length > 0 ? (
                            filteredLogs.map((log, i) => (
                              <tr key={i} className="hover:bg-slate-800/60 transition-colors">
                                <td className="p-4 text-slate-500 whitespace-nowrap">{log.time}</td>
                                <td className="p-4">
                                  <span className="text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded text-xs border border-yellow-400/20">{log.type}</span>
                                </td>
                                <td className="p-4 text-indigo-300">{log.src}</td>
                                <td className="p-4 text-slate-300 truncate max-w-xs xl:max-w-md" title={log.details}>{log.details}</td>
                                <td className="p-4 text-right">
                                  <span className={`${log.risk > 80 ? 'text-red-500 font-bold' : log.risk > 50 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                    {log.risk}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="p-12 text-center text-slate-500">
                                No logs found matching the current filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
               </div>
            )}
            
          </div>

          {/* Bottom Forensic Log Preview (Collapsible) */}
          <div className="h-48 border-t border-slate-800 bg-slate-950 flex flex-col z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
            <div className="px-4 py-2 flex justify-between items-center bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-3">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                   <Terminal className="w-3.5 h-3.5" />
                   Live Forensic Stream
                 </h4>
                 {selectedTimeRange && (
                   <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] rounded border border-indigo-500/30">
                     Filtered: {selectedTimeRange}
                   </span>
                 )}
              </div>
              <div className="flex gap-2">
                 <button className="text-slate-500 hover:text-white p-1 hover:bg-slate-800 rounded"><Play className="w-3 h-3" /></button>
                 <button className="text-slate-500 hover:text-white p-1 hover:bg-slate-800 rounded"><Download className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto font-mono text-xs text-slate-400 custom-scrollbar">
               {filteredLogs.map((log, i) => (
                 <div key={i} className="flex gap-4 border-b border-slate-900/50 px-4 py-1.5 hover:bg-slate-900 transition-colors cursor-pointer group">
                   <span className="text-slate-600 w-32 shrink-0 group-hover:text-slate-400 transition-colors">{log.time}</span>
                   <span className={`${log.risk > 80 ? 'text-red-400' : 'text-indigo-400'} w-24 shrink-0 font-medium`}>{log.type}</span>
                   <span className="text-slate-400 group-hover:text-slate-200 transition-colors truncate">{log.details}</span>
                 </div>
               ))}
            </div>
          </div>

        </div>

        {/* Right Details Panel (Slide Over) */}
        <div className={`fixed right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ${selectedNodeId ? 'translate-x-0' : 'translate-x-full'}`}>
           {selectedNodeId && (() => {
              const node = nodes.find(n => n.id === selectedNodeId);
              if (!node) return null;
              return (
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900">
                    <div>
                       <h3 className="text-lg font-bold text-white">Entity Details</h3>
                       <p className="text-xs text-slate-500 font-mono mt-1">ID: {node.id}</p>
                    </div>
                    <button onClick={() => setSelectedNodeId(null)} className="text-slate-500 hover:text-white p-1 hover:bg-slate-800 rounded"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="flex items-center gap-4">
                       <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-inner ${node.risk > 80 ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-800 border border-slate-700'}`}>
                          {React.createElement(getNodeIcon(node.type), { className: `w-8 h-8 ${node.risk > 80 ? 'text-red-500' : 'text-slate-400'}` })}
                       </div>
                       <div>
                         <div className="text-xl font-bold text-white">{node.label}</div>
                         <div className="text-sm text-slate-400">{node.type} Node</div>
                       </div>
                    </div>

                    <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
                      <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Current Risk Assessment</div>
                      <div className="flex items-end justify-between">
                        <div className="text-4xl font-bold text-white leading-none">{node.risk}</div>
                        <RiskBadge level={node.risk > 80 ? RiskLevel.CRITICAL : node.risk > 50 ? RiskLevel.HIGH : RiskLevel.MEDIUM} />
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${node.risk > 80 ? 'bg-red-500' : node.risk > 50 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${node.risk}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Related Indicators</h4>
                      <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-300 font-mono border border-slate-700/50 space-y-2">
                         <div className="flex justify-between">
                           <span className="text-slate-500">IP Address:</span>
                           <span>10.0.0.52</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-slate-500">MAC Address:</span>
                           <span>00:1B:44:11:3A:B7</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-slate-500">Last Seen:</span>
                           <span>2 mins ago</span>
                         </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Alerts</h4>
                       <div className="space-y-2">
                         {[1, 2].map(i => (
                           <div key={i} className="flex items-start gap-2 p-2 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">
                              <AlertTriangle className="w-3.5 h-3.5 text-orange-500 mt-0.5" />
                              <div className="text-xs text-slate-300">
                                <span className="font-bold text-slate-200">Suspicious Process Spawned</span>
                                <div className="text-slate-500 mt-0.5">Today, 14:32 • Severity: High</div>
                              </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-800 bg-slate-900 grid grid-cols-2 gap-3">
                    <button className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm shadow-lg shadow-indigo-900/50 transition-colors">
                      View Profile
                    </button>
                    <button className="py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg font-medium text-sm transition-colors">
                      Isolate Entity
                    </button>
                  </div>
                </div>
              );
           })()}
        </div>

      </div>
    </div>
  );
};

export default InvestigationView;