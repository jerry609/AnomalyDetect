import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UserDetail from './components/UserDetail';
import AlertsView from './components/AlertsView';
import InvestigationView from './components/InvestigationView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleNavigateToUser = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab('users');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return (
          <UserDetail 
            userId={selectedUserId} 
            onBack={() => {
              setSelectedUserId(null);
              setActiveTab('dashboard');
            }} 
          />
        );
      case 'alerts':
        return <AlertsView />;
      case 'investigation':
        return (
          <InvestigationView 
            onNavigate={setActiveTab} 
            onViewProfile={handleNavigateToUser} 
          />
        );
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div className="flex items-center justify-center h-screen text-slate-500">
             <div className="text-center">
               <div className="mb-4 text-4xl opacity-20">🚧</div>
               <h2 className="text-xl font-semibold mb-2">Module Not Found</h2>
               <p className="max-w-md mx-auto">The requested module "{activeTab}" does not exist.</p>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pl-64 min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;