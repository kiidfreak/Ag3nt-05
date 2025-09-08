import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Folder, Search, Bot, MessageSquare, Home, Shield } from 'lucide-react';

interface SidebarProps {
  recentFlows?: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  agents?: Array<{
    id: string;
    name: string;
    status: string;
    type: string;
  }>;
  onFlowClick?: (flowId: string) => void;
  onAgentClick?: (agentId: string) => void;
  onCreateFlow?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  recentFlows = [], 
  agents = [], 
  onFlowClick, 
  onAgentClick, 
  onCreateFlow 
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="space-y-6">
        {/* Navigation */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Navigation
          </h3>
          <div className="space-y-2">
            <Link
              to="/"
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                isActive('/') ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link
              to="/agents"
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                isActive('/agents') ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span className="text-sm">Agents</span>
            </Link>
            <Link
              to="/sessions"
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                isActive('/sessions') ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Sessions</span>
            </Link>
                <Link
                  to="/studio"
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    isActive('/studio') ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Studio</span>
                </Link>
                <Link
                  to="/compliance"
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    isActive('/compliance') ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Compliance</span>
                </Link>
          </div>
        </div>

        <div>
          <button 
            onClick={onCreateFlow}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Flow</span>
          </button>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Recent Flows
          </h3>
          <div className="space-y-2">
            {recentFlows.length > 0 ? (
              recentFlows.map((flow) => (
                <button
                  key={flow.id}
                  onClick={() => onFlowClick?.(flow.id)}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer text-left"
                >
                  <Folder className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{flow.name}</span>
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-500 p-2">No recent flows</div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Agent Library
          </h3>
          <div className="space-y-2">
            {agents.length > 0 ? (
              agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => onAgentClick?.(agent.id)}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer text-left"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-700">{agent.name}</span>
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-500 p-2">No agents available</div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
