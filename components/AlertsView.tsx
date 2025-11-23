import React, { useState } from 'react';
import { 
  Filter, Search, AlertCircle, CheckCircle2, Clock, 
  MoreVertical, ChevronRight, User, Shield, Tag,
  BarChart2, XCircle, ArrowUpRight
} from 'lucide-react';
import { MOCK_ALERTS, MOCK_USERS } from '../constants';
import { AlertStatus, RiskLevel } from '../types';
import RiskBadge from './RiskBadge';

const AlertsView: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Stats for the header
  const stats = {
    total: MOCK_ALERTS.length,
    open: MOCK_ALERTS.filter(a => a.status === AlertStatus.NEW || a.status === AlertStatus.INVESTIGATING).length,
    critical: MOCK_ALERTS.filter(a => a.severity === RiskLevel.CRITICAL).length,
    resolvedToday: 3, // Mocked
  };

  const filteredAlerts = MOCK_ALERTS.filter(alert => {
    const matchesStatus = filterStatus === 'ALL' || alert.status === filterStatus;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const selectedAlert = MOCK_ALERTS.find(a => a.id === selectedAlertId);
  const selectedUser = MOCK_USERS.find(u => u.id === selectedAlert?.entityId);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f172a]">
      {/* Main Content (Table) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${selectedAlertId ? 'mr-96' : ''}`}>
        
        {/* Header Stats */}
        <div className="p-8 pb-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Alerts & Incidents</h1>
            <p className="text-slate-400 text-sm">Manage security alerts, track investigations, and remediate threats.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase">Open Incidents</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.open}</p>
              </div>
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><AlertCircle className="w-5 h-5"/></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase">Critical Severity</p>
                <p className="text-2xl font-bold text-red-500 mt-1">{stats.critical}</p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><Shield className="w-5 h-5"/></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase">MTTR (Avg)</p>
                <p className="text-2xl font-bold text-emerald-500 mt-1">45m</p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Clock className="w-5 h-5"/></div>
            </div>
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase">Resolved Today</p>
                <p className="text-2xl font-bold text-slate-200 mt-1">{stats.resolvedToday}</p>
              </div>
              <div className="p-2 bg-slate-700/30 rounded-lg text-slate-400"><CheckCircle2 className="w-5 h-5"/></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-t-xl border border-slate-800 border-b-0">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search alerts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="h-8 w-px bg-slate-700 mx-2"></div>
              <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                {['ALL', 'NEW', 'INVESTIGATING', 'RESOLVED'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      filterStatus === status 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm hover:bg-slate-700">
               <Filter className="w-4 h-4" />
               <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-b-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-12">
                    <input type="checkbox" className="rounded bg-slate-800 border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900" />
                  </th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Alert Name</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map(alert => {
                    const entity = MOCK_USERS.find(u => u.id === alert.entityId);
                    const isSelected = selectedAlertId === alert.id;
                    
                    return (
                      <tr 
                        key={alert.id} 
                        onClick={() => setSelectedAlertId(alert.id)}
                        className={`cursor-pointer transition-colors group ${
                          isSelected ? 'bg-indigo-900/20' : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="p-4 pl-6" onClick={e => e.stopPropagation()}>
                           <input type="checkbox" className="rounded bg-slate-800 border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900" />
                        </td>
                        <td className="p-4">
                          <RiskBadge level={alert.severity} />
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-200 group-hover:text-indigo-400 transition-colors">{alert.title}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{alert.id}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                             <img src={entity?.avatarUrl || `https://ui-avatars.com/api/?name=${alert.entityId}`} className="w-6 h-6 rounded-full" alt="" />
                             <span className="text-sm text-slate-300">{entity?.name || alert.entityId}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                            alert.status === AlertStatus.NEW ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            alert.status === AlertStatus.INVESTIGATING ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                            alert.status === AlertStatus.RESOLVED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {alert.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-400 whitespace-nowrap">
                          {new Date(alert.timestamp).toLocaleDateString()} <span className="text-slate-600">{new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </td>
                        <td className="p-4 text-center">
                          <button className="p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 opacity-20" />
                        <p>No alerts match your filter criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 z-40 ${selectedAlertId ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedAlert && (
          <div className="h-full flex flex-col">
            {/* Panel Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-slate-500">{selectedAlert.id}</span>
                    <RiskBadge level={selectedAlert.severity} className="scale-90 origin-left" />
                  </div>
                  <h2 className="text-lg font-bold text-white leading-tight">{selectedAlert.title}</h2>
               </div>
               <button onClick={() => setSelectedAlertId(null)} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                 <XCircle className="w-6 h-6" />
               </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Description */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                 <p className="text-sm text-slate-300 leading-relaxed">{selectedAlert.description}</p>
              </div>

              {/* Entity Info */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Affected Entity</h3>
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                   <img src={selectedUser?.avatarUrl || "https://ui-avatars.com/api/?name=?"} className="w-10 h-10 rounded-full" alt="" />
                   <div>
                     <div className="text-sm font-bold text-white">{selectedUser?.name || 'Unknown Entity'}</div>
                     <div className="text-xs text-slate-400">{selectedUser?.role || 'Unknown Role'}</div>
                   </div>
                   <button className="ml-auto p-1.5 hover:bg-slate-700 rounded text-indigo-400">
                     <ArrowUpRight className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tags</h3>
                 <div className="flex flex-wrap gap-2">
                   {selectedAlert.tags.map(tag => (
                     <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5">
                       <Tag className="w-3 h-3" />
                       {tag}
                     </span>
                   ))}
                   <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5">
                      {selectedAlert.source}
                   </span>
                 </div>
              </div>

              {/* Timeline / Metadata */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Source System</span>
                   <span className="text-slate-300">{selectedAlert.source}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Detected At</span>
                   <span className="text-slate-300">{new Date(selectedAlert.timestamp).toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Assignee</span>
                   <span className="text-slate-300 flex items-center gap-1.5">
                     <User className="w-3.5 h-3.5" />
                     {selectedAlert.assignee || 'Unassigned'}
                   </span>
                 </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex gap-3">
               <button className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-indigo-900/50">
                 Investigate
               </button>
               <button className="px-4 py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg font-medium text-sm transition-colors">
                 Dismiss
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsView;