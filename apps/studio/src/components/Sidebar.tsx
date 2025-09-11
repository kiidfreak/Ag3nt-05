import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Folder, Search, Bot, MessageSquare, Home, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AL</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Agent Labs</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-4">
          {/* Navigation */}
          <div>
            {!isCollapsed && (
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Navigation
              </h3>
            )}
            <div className="space-y-2">
              <Link
                to="/"
                className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'space-x-3 p-2'} rounded-lg transition-colors ${
                  isActive('/') ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title={isCollapsed ? 'Dashboard' : undefined}
              >
                <Home className="w-4 h-4" />
                {!isCollapsed && <span className="text-sm">Dashboard</span>}
              </Link>
              <Link
                to="/studio"
                className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'space-x-3 p-2'} rounded-lg transition-colors ${
                  isActive('/studio') ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title={isCollapsed ? 'Studio' : undefined}
              >
                <Plus className="w-4 h-4" />
                {!isCollapsed && <span className="text-sm">Studio</span>}
              </Link>
              <Link
                to="/sessions"
                className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'space-x-3 p-2'} rounded-lg transition-colors ${
                  isActive('/sessions') ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title={isCollapsed ? 'Sessions' : undefined}
              >
                <MessageSquare className="w-4 h-4" />
                {!isCollapsed && <span className="text-sm">Sessions</span>}
              </Link>
            </div>
          </div>

          {!isCollapsed && (
            <div>
              <button 
                onClick={onCreateFlow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Flow</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
