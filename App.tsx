import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UserDetail from './components/UserDetail';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserDetail onBack={() => setActiveTab('dashboard')} />;
      default:
        return (
          <div className="flex items-center justify-center h-screen text-slate-500">
             <div className="text-center">
               <div className="mb-4 text-4xl opacity-20">🚧</div>
               <h2 className="text-xl font-semibold mb-2">Module Under Development</h2>
               <p className="max-w-md mx-auto">The {activeTab} module is currently being built. Please return to the Dashboard for the live demonstration.</p>
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