import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockApiService, type MockFlow, type MockAgent } from '../services/mockData';

interface AppContextType {
  flows: MockFlow[];
  agents: MockAgent[];
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  handleFlowClick: (flowId: string) => void;
  handleAgentClick: (agentId: string) => void;
  handleCreateFlow: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [flows, setFlows] = useState<MockFlow[]>([]);
  const [agents, setAgents] = useState<MockAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [flowsResponse, agentsResponse] = await Promise.all([
        mockApiService.getFlows(),
        mockApiService.getAgents()
      ]);
      
      setFlows(flowsResponse.data);
      setAgents(agentsResponse.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFlowClick = (flowId: string) => {
    // Navigate to Studio page with the selected flow
    window.location.href = `/studio?flow=${flowId}`;
  };

  const handleAgentClick = (agentId: string) => {
    // Navigate to Agents page with the selected agent
    window.location.href = `/agents?agent=${agentId}`;
  };

  const handleCreateFlow = () => {
    // Navigate to Studio page to create a new flow
    window.location.href = '/studio?action=create';
  };

  useEffect(() => {
    loadData();
  }, []);

  const value: AppContextType = {
    flows,
    agents,
    loading,
    error,
    loadData,
    handleFlowClick,
    handleAgentClick,
    handleCreateFlow,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
