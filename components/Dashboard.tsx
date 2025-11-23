import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, Search, MapPin, ExternalLink, Bot } from 'lucide-react';
import { MOCK_USERS, MOCK_EVENTS, RISK_TREND_DATA } from '../constants';
import { RiskLevel } from '../types';
import RiskBadge from './RiskBadge';
import AiAnalysisModal from './AiAnalysisModal';

const Dashboard: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const stats = [
    { title: 'Total Monitored Users', value: '2,845', change: '+12%', trend: 'up', color: 'indigo' },
    { title: 'Active Anomalies', value: '14', change: '+3', trend: 'up', color: 'red' },
    { title: 'Avg Risk Score', value: '24', change: '-2.5%', trend: 'down', color: 'emerald' },
    { title: 'Data Ingestion', value: '4.2 TB', change: '+8%', trend: 'up', color: 'blue' },
  ];

  const handleAnalyze = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const selectedEvent = MOCK_EVENTS.find(e => e.id === selectedEventId) || null;
  const selectedEventUser = MOCK_USERS.find(u => u.id === selectedEvent?.userId);

  return (
    <div className="p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Security Overview</h2>
          <p className="text-slate-400">Real-time threat monitoring and behavioral analytics</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users, IPs, events..." 
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <button className="relative p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors border border-slate-700 text-slate-400 hover:text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-white">Admin User</div>
              <div className="text-xs text-slate-500">Security Ops</div>
            </div>
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="Profile" className="w-9 h-9 rounded-full border border-slate-600" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-sm font-medium">{stat.title}</span>
              <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                stat.trend === 'up' && stat.color === 'red' ? 'bg-red-500/10 text-red-500' :
                stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 
                'bg-emerald-500/10 text-emerald-500'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Global Risk Score Trend</h3>
              <p className="text-xs text-slate-500">Aggregated risk score over last 24 hours</p>
            </div>
            <select className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RISK_TREND_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Risky Users */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Top Risky Entities</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {MOCK_USERS.sort((a, b) => b.riskScore - a.riskScore).slice(0, 4).map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-transparent hover:border-slate-700 transition-all group cursor-pointer">
                <div className="relative">
                  <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                  {user.riskScore > 80 && (
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-slate-900">!</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">{user.name}</h4>
                    <span className={`text-xs font-bold ${user.riskScore > 75 ? 'text-red-500' : user.riskScore > 50 ? 'text-orange-500' : 'text-emerald-500'}`}>
                      {user.riskScore}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{user.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Live Anomaly Feed</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 font-medium hover:bg-slate-700 transition-colors">All Events</button>
            <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-xs text-red-500 font-medium hover:bg-red-500/20 transition-colors">Critical Only</button>
          </div>
        </div>
        
        <div className="divide-y divide-slate-800/50">
          {MOCK_EVENTS.map(event => {
            const user = MOCK_USERS.find(u => u.id === event.userId);
            return (
              <div key={event.id} className="p-4 hover:bg-slate-800/30 transition-colors flex items-start gap-4 group">
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  event.riskLevel === RiskLevel.CRITICAL ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                  event.riskLevel === RiskLevel.HIGH ? 'bg-orange-500' : 'bg-yellow-500'
                }`} />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-200">{event.type.replace(/_/g, ' ')}</span>
                      <RiskBadge level={event.riskLevel} />
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-2">{event.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 text-indigo-400">
                       <img src={user?.avatarUrl} className="w-4 h-4 rounded-full" />
                       <span className="font-medium hover:underline cursor-pointer">{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono bg-slate-800/50 px-1.5 py-0.5 rounded">
                      <span>{event.sourceIp}</span>
                    </div>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                   <button 
                    onClick={() => handleAnalyze(event.id)}
                    className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 flex items-center gap-2 text-xs font-medium"
                   >
                     <Bot className="w-4 h-4" />
                     Analyze
                   </button>
                   <button className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800">
                     <ExternalLink className="w-4 h-4" />
                   </button>
                   <button className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800">
                     <MoreHorizontal className="w-4 h-4" />
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AiAnalysisModal 
        isOpen={!!selectedEventId} 
        onClose={() => setSelectedEventId(null)}
        event={selectedEvent}
        user={selectedEventUser}
      />
    </div>
  );
};

export default Dashboard;