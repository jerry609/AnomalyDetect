import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Shield, Clock, HardDrive, Key, AlertTriangle, Download, XCircle, CheckCircle, Lock, MoreHorizontal, ArrowLeft, MapPin } from 'lucide-react';
import { MOCK_USERS, RADAR_DATA, SELECTED_USER_STATS, ACTIVITY_LOGS, HEATMAP_DATA, USER_RISK_HISTORY } from '../constants';
import { RiskLevel } from '../types';
import RiskBadge from './RiskBadge';

interface UserDetailProps {
  onBack: () => void;
  userId: string | null;
}

const UserDetail: React.FC<UserDetailProps> = ({ onBack, userId }) => {
  // Find user by ID, default to first user if not found or null (for demo robustness)
  const user = MOCK_USERS.find(u => u.id === userId) || MOCK_USERS[0];
  
  const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const kpis = [
    { label: 'Login Failures (24h)', value: SELECTED_USER_STATS.loginFailures, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Data Accessed', value: SELECTED_USER_STATS.dataAccessed, icon: HardDrive, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Privilege Changes', value: SELECTED_USER_STATS.privilegeChanges, icon: Key, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'After-Hours Events', value: SELECTED_USER_STATS.afterHoursActivity, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Navigation & Header */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* User Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Shield className="w-64 h-64 text-indigo-500" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="flex gap-6 items-start">
            <div className="relative">
              <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-2xl border-2 border-slate-700 shadow-xl" />
              <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700">
                <div className={`w-3 h-3 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse`}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono">{user.id}</span>
                <span>{user.role}</span>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span>{user.department}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-400">{user.location || 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 border-l border-slate-800 pl-8 flex items-center justify-around">
            <div className="text-center">
              <div className="text-sm text-slate-500 mb-1 font-medium">Risk Score</div>
              <div className="text-5xl font-bold text-red-500 tracking-tight">{user.riskScore}</div>
              <div className="text-xs text-red-400 font-medium mt-1">CRITICAL LEVEL</div>
            </div>
            
            <div className="hidden lg:block w-px h-16 bg-slate-800"></div>
            
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-red-500"></div>
                 <span className="text-sm text-slate-300">Deviation from Peer Group: <b className="text-white">+240%</b></span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                 <span className="text-sm text-slate-300">Anomalies (Last 7d): <b className="text-white">12</b></span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4 hover:border-slate-700 transition-all">
            <div className={`w-12 h-12 rounded-lg ${kpi.bg} flex items-center justify-center`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{kpi.value}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Risk History Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white">Risk Score Timeline</h3>
          <p className="text-xs text-slate-500">Historical risk progression over the last 7 days</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={USER_RISK_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f87171' }}
              />
              <Area type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Baseline Comparison (Radar) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Baseline Comparison</h3>
            <p className="text-xs text-slate-500">User vs. Department Average</p>
          </div>
          <div className="flex-1 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="User" dataKey="A" stroke="#ef4444" strokeWidth={2} fill="#ef4444" fillOpacity={0.3} />
                <Radar name="Dept Avg" dataKey="B" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.1} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                   itemStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-3 h-1 bg-red-500 rounded-full"></span> Actual
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-3 h-1 bg-indigo-500 rounded-full"></span> Baseline
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Activity Heatmap</h3>
              <p className="text-xs text-slate-500">Intensity of actions by Hour & Day</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Low</span>
              <div className="flex gap-0.5">
                <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
                <div className="w-3 h-3 bg-indigo-900 rounded-sm"></div>
                <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              </div>
              <span className="text-slate-500">High</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header Hours */}
              <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 mb-1">
                 <div className="text-[10px] text-slate-600"></div>
                 {Array.from({ length: 24 }).map((_, i) => (
                   <div key={i} className="text-[10px] text-slate-600 text-center">{i}</div>
                 ))}
              </div>
              
              {/* Rows */}
              {heatmapDays.map((day) => (
                <div key={day} className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 mb-1 items-center">
                  <div className="text-xs text-slate-500 font-medium">{day}</div>
                  {HEATMAP_DATA.filter(d => d.day === day).map((point, i) => {
                    let bg = 'bg-slate-800'; // No activity
                    if (point.value > 8) bg = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] z-10'; // Anomaly
                    else if (point.value > 5) bg = 'bg-indigo-500'; // High
                    else if (point.value > 2) bg = 'bg-indigo-900'; // Med
                    else if (point.value > 0) bg = 'bg-slate-700'; // Low

                    return (
                      <div 
                        key={i} 
                        className={`h-6 rounded-sm transition-all hover:scale-125 cursor-pointer relative group ${bg}`}
                      >
                         <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-20">
                           {day} {point.hour}:00 - Intensity: {point.value}
                         </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
             <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
             <p className="text-sm text-red-200">
               <span className="font-bold">Anomaly Detected:</span> Unusual high-intensity activity detected on <span className="text-white font-mono">Saturday 02:00-03:00</span>, deviating 4.5σ from the standard baseline for this user.
             </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Recent Activity Log</h3>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium">Resource</th>
                <th className="p-4 font-medium">Result</th>
                <th className="p-4 font-medium text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ACTIVITY_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="p-4 text-slate-400 text-sm font-mono">{log.timestamp}</td>
                  <td className="p-4 text-slate-200 text-sm font-medium">{log.action}</td>
                  <td className="p-4 text-indigo-300 text-sm font-mono">{log.resource}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      log.result === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : 
                      log.result === 'BLOCKED' ? 'bg-red-500/10 text-red-500' :
                      'bg-orange-500/10 text-orange-500'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <RiskBadge level={
                      log.riskScore > 80 ? RiskLevel.CRITICAL : 
                      log.riskScore > 50 ? RiskLevel.HIGH : 
                      log.riskScore > 20 ? RiskLevel.MEDIUM : RiskLevel.LOW
                    } />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;