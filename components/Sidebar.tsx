import React from 'react';
import { ShieldAlert, LayoutDashboard, Users, Activity, Settings, LogOut, Radar } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Entities & Users', icon: Users },
    { id: 'alerts', label: 'Alerts & Incidents', icon: ShieldAlert },
    { id: 'investigation', label: 'Investigation', icon: Radar },
    { id: 'reports', label: 'Reports', icon: Activity },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">Sentinel</h1>
          <p className="text-xs text-slate-500 font-mono">UEBA v2.4.0</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Platform
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}

        <div className="mt-8 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          System
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors">
          <Settings className="w-5 h-5 group-hover:text-indigo-400" />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;