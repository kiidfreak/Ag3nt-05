import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import AgentLibrary from './components/AgentLibrary';
import PropertiesPanel from './components/PropertiesPanel';

// Pages
import Home from './pages/Home';
import Studio from './pages/Studio';
import Sessions from './pages/Sessions';
import Agents from './pages/Agents';
import Compliance from './pages/Compliance';

// Context
import { AppProvider, useAppContext } from './contexts/AppContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const { flows, agents, handleFlowClick, handleAgentClick, handleCreateFlow } = useAppContext();
  const location = useLocation();
  
  // Check if we're on the Studio page
  const isStudioPage = location.pathname === '/studio';

  // Get recent flows (last 3)
  const recentFlows = flows.slice(0, 3).map(flow => ({
    id: flow.id,
    name: flow.name,
    status: flow.status,
  }));

  // Get available agents
  const availableAgents = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    status: agent.status,
    type: agent.type,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {!isStudioPage && <Header />}
      <div className="flex">
        {!isStudioPage && (
          <Sidebar 
            recentFlows={recentFlows}
            agents={availableAgents}
            onFlowClick={handleFlowClick}
            onAgentClick={handleAgentClick}
            onCreateFlow={handleCreateFlow}
          />
        )}
        <main className={`flex-1 ${!isStudioPage ? 'p-6' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/compliance" element={<Compliance />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
