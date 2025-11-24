
import React, { useState, useEffect } from 'react';
import { Save, Bell, Shield, Database, Webhook, UserCog, Mail, Lock, FileClock, History, Download, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { MOCK_SYSTEM_AUDIT_LOGS, ROLE_PERMISSIONS } from '../constants';
import { SystemAuditLog, UserRole, Permission } from '../types';

interface RiskFactor {
  id: string;
  name: string;
  description: string;
  multiplier: number;
}

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [logs, setLogs] = useState<SystemAuditLog[]>(MOCK_SYSTEM_AUDIT_LOGS);
  const [showToast, setShowToast] = useState(false);

  // RBAC State - Default to Admin for full access initially
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);

  // Initial State mimicking "saved" configuration
  const [settings, setSettings] = useState({
    activityRetention: '30 Days',
    archiveRetention: '1 Year',
    riskThreshold: 80,
    criticalThreshold: 95,
    socEmail: 'soc-alerts@sentinel.corp',
    customRiskFactors: [
      { id: 'rf-1', name: 'Flight Risk', description: 'Employees with upcoming resignation dates', multiplier: 1.5 },
      { id: 'rf-2', name: 'Privileged User', description: 'Admins with root access capabilities', multiplier: 1.2 }
    ] as RiskFactor[]
  });

  // State to track changes before save
  const [formState, setFormState] = useState(settings);
  const [newFactor, setNewFactor] = useState({ name: '', description: '', multiplier: 1.1 });

  // Helper to check permissions
  const hasPermission = (permission: Permission) => {
    return ROLE_PERMISSIONS[currentRole]?.includes(permission);
  };

  const tabs = [
    { id: 'general', label: 'General & Retention', icon: Database, permission: Permission.VIEW_SETTINGS },
    { id: 'integrations', label: 'Integrations', icon: Webhook, permission: Permission.MANAGE_INTEGRATIONS },
    { id: 'notifications', label: 'Notifications', icon: Bell, permission: Permission.MANAGE_NOTIFICATIONS },
    { id: 'access', label: 'Access Control', icon: UserCog, permission: Permission.MANAGE_ACCESS },
    { id: 'audit', label: 'Audit Logs', icon: FileClock, permission: Permission.VIEW_AUDIT },
  ];

  // Effect to handle tab restrictions when role changes
  useEffect(() => {
    const currentTab = tabs.find(t => t.id === activeTab);
    if (currentTab && !hasPermission(currentTab.permission)) {
      setActiveTab('general'); // Fallback
    }
  }, [currentRole]);

  const handleSave = () => {
    const newLogs: SystemAuditLog[] = [];
    const timestamp = new Date().toISOString();
    const user = currentRole === UserRole.ADMIN ? 'Admin User' : 'Analyst User';

    // Check for changes and create logs
    if (formState.activityRetention !== settings.activityRetention) {
      newLogs.push({
        id: `audit-${Date.now()}-1`,
        timestamp,
        user,
        setting: 'Activity Logs Retention',
        oldValue: settings.activityRetention,
        newValue: formState.activityRetention
      });
    }

    if (formState.archiveRetention !== settings.archiveRetention) {
      newLogs.push({
        id: `audit-${Date.now()}-2`,
        timestamp,
        user,
        setting: 'Archived Events Retention',
        oldValue: settings.archiveRetention,
        newValue: formState.archiveRetention
      });
    }

    if (formState.riskThreshold !== settings.riskThreshold) {
      newLogs.push({
        id: `audit-${Date.now()}-3`,
        timestamp,
        user,
        setting: 'High Risk Threshold',
        oldValue: settings.riskThreshold.toString(),
        newValue: formState.riskThreshold.toString()
      });
    }

    if (formState.criticalThreshold !== settings.criticalThreshold) {
      newLogs.push({
        id: `audit-${Date.now()}-4`,
        timestamp,
        user,
        setting: 'Critical Alert Trigger',
        oldValue: settings.criticalThreshold.toString(),
        newValue: formState.criticalThreshold.toString()
      });
    }

    if (formState.socEmail !== settings.socEmail) {
      newLogs.push({
        id: `audit-${Date.now()}-5`,
        timestamp,
        user,
        setting: 'SOC Email Distribution',
        oldValue: settings.socEmail,
        newValue: formState.socEmail
      });
    }

    if (JSON.stringify(formState.customRiskFactors) !== JSON.stringify(settings.customRiskFactors)) {
      newLogs.push({
        id: `audit-${Date.now()}-6`,
        timestamp,
        user,
        setting: 'Custom Risk Factors',
        oldValue: `${settings.customRiskFactors.length} factors`,
        newValue: `${formState.customRiskFactors.length} factors`
      });
    }

    // Update state
    if (newLogs.length > 0) {
      setSettings(formState);
      setLogs(prev => [...newLogs, ...prev]);
      // Update global mock
      MOCK_SYSTEM_AUDIT_LOGS.unshift(...newLogs);
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleDiscard = () => {
    setFormState(settings);
    setNewFactor({ name: '', description: '', multiplier: 1.1 });
  };

  const handleAddFactor = () => {
    if (!newFactor.name || !newFactor.description) return;
    
    const factor: RiskFactor = {
      id: `rf-${Date.now()}`,
      name: newFactor.name,
      description: newFactor.description,
      multiplier: Number(newFactor.multiplier)
    };

    setFormState(prev => ({
      ...prev,
      customRiskFactors: [...prev.customRiskFactors, factor]
    }));
    setNewFactor({ name: '', description: '', multiplier: 1.1 });
  };

  const handleRemoveFactor = (id: string) => {
    setFormState(prev => ({
      ...prev,
      customRiskFactors: prev.customRiskFactors.filter(f => f.id !== id)
    }));
  };

  return (
    <div className="p-8 bg-[#0f172a] min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        
        {/* Role Simulator (Demo Only) */}
        <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-lg border border-slate-700">
           <span className="text-xs text-slate-400 font-medium uppercase px-2">Simulate Role:</span>
           <div className="flex bg-slate-900 rounded p-1">
              {[UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER].map(role => (
                <button
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                    currentRole === role ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {role}
                </button>
              ))}
           </div>
        </div>
      </div>

      {showToast && (
        <div className="absolute top-8 right-8 z-50 animate-slide-in-right">
          <div className="bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
             <div className="bg-white/20 p-1 rounded-full"><Save className="w-4 h-4" /></div>
             <div>
               <div className="font-bold text-sm">Configuration Saved</div>
               <div className="text-xs opacity-90">Audit log entries created.</div>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-1">
          {tabs.map((tab) => {
             const canAccess = hasPermission(tab.permission);
             return (
              <button
                key={tab.id}
                onClick={() => canAccess && setActiveTab(tab.id)}
                disabled={!canAccess}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left group ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                    : canAccess 
                      ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      : 'text-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
                {!canAccess && <Lock className="w-3 h-3 text-slate-600" />}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-sm relative overflow-hidden">
          
          {/* Permission Banner */}
          {currentRole !== UserRole.ADMIN && (
            <div className="absolute top-0 left-0 right-0 bg-indigo-500/10 border-b border-indigo-500/20 p-2 text-center">
              <p className="text-xs text-indigo-300 flex items-center justify-center gap-2">
                <Shield className="w-3 h-3" />
                Viewing as <b>{currentRole}</b>. Some settings are read-only or restricted.
              </p>
            </div>
          )}

          <div className={currentRole !== UserRole.ADMIN ? "pt-6" : ""}>
          
            {activeTab === 'general' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Data Retention</h2>
                  <p className="text-slate-400 text-sm mb-4">Configure how long historical logs and events are stored.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        Activity Logs (Hot Storage)
                        {!hasPermission(Permission.EDIT_GENERAL) && <Lock className="w-3 h-3 text-slate-500" />}
                      </label>
                      <select 
                        disabled={!hasPermission(Permission.EDIT_GENERAL)}
                        value={formState.activityRetention}
                        onChange={(e) => setFormState({...formState, activityRetention: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option>30 Days</option>
                        <option>90 Days</option>
                        <option>1 Year</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        Archived Events (Cold Storage)
                        {!hasPermission(Permission.EDIT_GENERAL) && <Lock className="w-3 h-3 text-slate-500" />}
                      </label>
                      <select 
                        disabled={!hasPermission(Permission.EDIT_GENERAL)}
                        value={formState.archiveRetention}
                        onChange={(e) => setFormState({...formState, archiveRetention: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
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
                  
                  {!hasPermission(Permission.EDIT_RISK_CONFIG) && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 mb-4 flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-xs text-slate-300">You do not have permission to modify risk algorithms. Contact an administrator.</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300 flex items-center gap-2">
                          High Risk Threshold
                          {!hasPermission(Permission.EDIT_RISK_CONFIG) && <Lock className="w-3 h-3 text-slate-500" />}
                        </span>
                        <span className="text-indigo-400 font-bold">{formState.riskThreshold}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" max="100"
                        disabled={!hasPermission(Permission.EDIT_RISK_CONFIG)}
                        value={formState.riskThreshold}
                        onChange={(e) => setFormState({...formState, riskThreshold: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300 flex items-center gap-2">
                          Critical Alert Trigger
                          {!hasPermission(Permission.EDIT_RISK_CONFIG) && <Lock className="w-3 h-3 text-slate-500" />}
                        </span>
                        <span className="text-red-400 font-bold">{formState.criticalThreshold}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" max="100"
                        disabled={!hasPermission(Permission.EDIT_RISK_CONFIG)}
                        value={formState.criticalThreshold}
                        onChange={(e) => setFormState({...formState, criticalThreshold: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Risk Factors Section */}
                <div className="pt-8 border-t border-slate-800">
                  <h2 className="text-lg font-bold text-white mb-1">Custom Risk Factors</h2>
                  <p className="text-slate-400 text-sm mb-4">Define external factors that influence the overall risk calculation.</p>
                  
                  <div className="space-y-4">
                    {/* List of Factors */}
                    {formState.customRiskFactors.map((factor) => (
                      <div key={factor.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between group">
                         <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-white">{factor.name}</span>
                              <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                                x{factor.multiplier} Multiplier
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">{factor.description}</p>
                         </div>
                         {hasPermission(Permission.EDIT_RISK_CONFIG) && (
                           <button 
                             onClick={() => handleRemoveFactor(factor.id)}
                             className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded transition-colors opacity-0 group-hover:opacity-100"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         )}
                      </div>
                    ))}

                    {/* Add New Factor Form */}
                    {hasPermission(Permission.EDIT_RISK_CONFIG) ? (
                      <div className="bg-slate-800/30 border border-slate-700/50 border-dashed rounded-lg p-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Add New Factor</h3>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                          <div className="md:col-span-4">
                            <label className="text-xs text-slate-400 block mb-1">Factor Name</label>
                            <input 
                              type="text" 
                              value={newFactor.name}
                              onChange={(e) => setNewFactor({...newFactor, name: e.target.value})}
                              placeholder="e.g. Flight Risk"
                              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="md:col-span-5">
                            <label className="text-xs text-slate-400 block mb-1">Description</label>
                            <input 
                              type="text" 
                              value={newFactor.description}
                              onChange={(e) => setNewFactor({...newFactor, description: e.target.value})}
                              placeholder="Description of the risk factor"
                              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                             <label className="text-xs text-slate-400 block mb-1">Multiplier</label>
                             <input 
                               type="number" 
                               step="0.1" 
                               min="1.0"
                               max="5.0"
                               value={newFactor.multiplier}
                               onChange={(e) => setNewFactor({...newFactor, multiplier: parseFloat(e.target.value)})}
                               className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                             />
                          </div>
                          <div className="md:col-span-1">
                            <button 
                              onClick={handleAddFactor}
                              disabled={!newFactor.name || !newFactor.description}
                              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded px-3 py-2 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic text-center py-2">
                        You do not have permission to add custom risk factors.
                      </div>
                    )}
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
                      <input 
                        type="email" 
                        value={formState.socEmail}
                        onChange={(e) => setFormState({...formState, socEmail: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <button className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-700">Update</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'access' && (
              <div className="space-y-6 animate-fade-in">
                 <h2 className="text-lg font-bold text-white">Access Control</h2>
                 <p className="text-slate-400 text-sm">Manage roles, permissions, and session policies for the dashboard.</p>
                 <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8 text-center">
                    <div className="inline-flex p-3 bg-slate-800 rounded-full mb-4">
                      <UserCog className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Role Management</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                      Configure RBAC policies and map identity provider groups to Sentinel roles.
                    </p>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-600 transition-colors">
                      Manage Roles
                    </button>
                 </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white">Audit Trail</h2>
                  <button className="text-xs text-indigo-400 hover:text-white flex items-center gap-1">
                    <Download className="w-3 h-3" /> Export CSV
                  </button>
                </div>
                <p className="text-slate-400 text-sm mb-4">Chronological record of system configuration changes.</p>
                
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-800 flex items-start gap-4">
                      <div className="mt-1 p-2 bg-slate-800 rounded-full border border-slate-700">
                        <History className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-bold text-slate-200">{log.setting}</span>
                          <span className="text-xs text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Changed by <span className="text-indigo-400">{log.user}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs font-mono bg-slate-900/50 p-2 rounded">
                          <span className="text-red-400 line-through opacity-70">{log.oldValue}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-emerald-400">{log.newValue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-center p-8 text-slate-500">No audit logs found.</div>
                  )}
                </div>
              </div>
            )}

            {/* Action Footer for configuration tabs */}
            {activeTab !== 'audit' && activeTab !== 'access' && (
              <div className="mt-10 pt-6 border-t border-slate-800 flex justify-end gap-3">
                <button onClick={handleDiscard} className="px-4 py-2 text-sm text-slate-400 hover:text-white font-medium">Discard Changes</button>
                <button 
                  onClick={handleSave} 
                  disabled={currentRole === UserRole.VIEWER}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-900/50"
                >
                  <Save className="w-4 h-4" />
                  Save Configuration
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
