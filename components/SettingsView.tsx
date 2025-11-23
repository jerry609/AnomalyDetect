import React, { useState } from 'react';
import { Save, Bell, Shield, Database, Webhook, UserCog, Mail, Lock } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General & Retention', icon: Database },
    { id: 'integrations', label: 'Integrations', icon: Webhook },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'access', label: 'Access Control', icon: UserCog },
  ];

  return (
    <div className="p-8 bg-[#0f172a] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">System Settings</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-sm">
          
          {activeTab === 'general' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Data Retention</h2>
                <p className="text-slate-400 text-sm mb-4">Configure how long historical logs and events are stored.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Activity Logs (Hot Storage)</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>30 Days</option>
                      <option>90 Days</option>
                      <option>1 Year</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Archived Events (Cold Storage)</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>1 Year</option>
                      <option>3 Years</option>
                      <option>7 Years</option>
                      <option>Forever</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800">
                <h2 className="text-lg font-bold text-white mb-1">Risk Scoring Thresholds</h2>
                <p className="text-slate-400 text-sm mb-4">Adjust sensitivity for anomaly detection engine.</p>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">High Risk Threshold</span>
                      <span className="text-indigo-400 font-bold">80</span>
                    </div>
                    <input type="range" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Critical Alert Trigger</span>
                      <span className="text-red-400 font-bold">95</span>
                    </div>
                    <input type="range" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-600">
                    <Shield className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Splunk SIEM</h3>
                    <p className="text-xs text-slate-400">Forward alerts and raw logs to Splunk Enterprise.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-sm text-emerald-500 font-medium">Connected</span>
                   <button className="ml-4 text-xs bg-slate-800 border border-slate-600 text-slate-300 px-3 py-1.5 rounded hover:bg-slate-700">Configure</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-600">
                    <Lock className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Okta Identity</h3>
                    <p className="text-xs text-slate-400">Sync user directory and SSO events.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-500">Connect</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-600">
                    <Webhook className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Slack Webhooks</h3>
                    <p className="text-xs text-slate-400">Send critical alerts to #sec-ops channel.</p>
                  </div>
                </div>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-sm text-emerald-500 font-medium">Active</span>
                   <button className="ml-4 text-xs bg-slate-800 border border-slate-600 text-slate-300 px-3 py-1.5 rounded hover:bg-slate-700">Configure</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
             <div className="space-y-6 animate-fade-in">
               <h2 className="text-lg font-bold text-white">Alert Routing</h2>
               <div className="space-y-4">
                 {['Critical Security Alerts', 'Weekly Reports', 'System Health Warnings'].map((item, i) => (
                   <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                     <span className="text-slate-300 text-sm font-medium">{item}</span>
                     <div className="flex gap-4">
                       <label className="flex items-center gap-2 text-xs text-slate-400">
                         <input type="checkbox" defaultChecked className="rounded bg-slate-700 border-slate-600 text-indigo-500" />
                         Email
                       </label>
                       <label className="flex items-center gap-2 text-xs text-slate-400">
                         <input type="checkbox" defaultChecked={i===0} className="rounded bg-slate-700 border-slate-600 text-indigo-500" />
                         Slack
                       </label>
                       <label className="flex items-center gap-2 text-xs text-slate-400">
                         <input type="checkbox" defaultChecked={i===0} className="rounded bg-slate-700 border-slate-600 text-indigo-500" />
                         SMS
                       </label>
                     </div>
                   </div>
                 ))}
               </div>
               
               <div className="mt-6">
                 <label className="text-sm font-medium text-slate-300 block mb-2">SOC Team Email Distribution List</label>
                 <div className="flex gap-2">
                   <div className="relative flex-1">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                     <input type="email" defaultValue="soc-alerts@sentinel.corp" className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 text-sm" />
                   </div>
                   <button className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-700">Update</button>
                 </div>
               </div>
             </div>
          )}

          {/* Action Footer for all tabs */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex justify-end gap-3">
             <button className="px-4 py-2 text-sm text-slate-400 hover:text-white font-medium">Discard Changes</button>
             <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-900/50">
               <Save className="w-4 h-4" />
               Save Configuration
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsView;