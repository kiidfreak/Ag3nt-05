import React, { useState } from 'react';
import { 
  Plus, 
  Play, 
  Save, 
  Settings, 
  Trash2, 
  Bot, 
  Zap, 
  Shield, 
  Coins, 
  ArrowRight, 
  Folder,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  FileText,
  Activity,
  Database,
  Brain,
  Target,
  Search,
  Filter,
  Menu,
  X
} from 'lucide-react';
import { agentCategories } from '../services/agentTypes';
import { templateCategories } from '../services/pipelineTemplates';

interface EnhancedSidebarProps {
  recentFlows: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  agents: Array<{
    id: string;
    name: string;
    status: string;
    type: string;
  }>;
  onFlowClick: (flowId: string) => void;
  onAgentClick: (agentId: string) => void;
  onCreateFlow: () => void;
  onTemplateSelect: (template: any) => void;
  infrastructureHealth: any;
  pipelineTemplates: any[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({
  recentFlows,
  agents,
  onFlowClick,
  onAgentClick,
  onCreateFlow,
  onTemplateSelect,
  infrastructureHealth,
  pipelineTemplates,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    flows: true,
    agents: false,
    templates: false,
    infrastructure: false
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredTemplates = pipelineTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || template.industry === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '🟢';
      case 'degraded': return '🟡';
      case 'unhealthy': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && <h2 className="text-lg font-semibold text-gray-900">Agent Studio</h2>}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={onCreateFlow}
            className={`p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isCollapsed ? 'w-full' : ''}`}
            title={isCollapsed ? 'New Flow' : ''}
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">New Flow</span>}
          </button>
        </div>
        
        {/* Search */}
        {!isCollapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search agents, templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Recent Flows */}
        <div className="border-b border-gray-200">
          {isCollapsed ? (
            <button
              className="w-full p-3 flex items-center justify-center hover:bg-gray-50"
              title="Recent Flows"
            >
              <Folder className="w-5 h-5 text-gray-500" />
            </button>
          ) : (
            <button
              onClick={() => toggleSection('flows')}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <Folder className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">Recent Flows</span>
              </div>
              {expandedSections.flows ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          
          {!isCollapsed && expandedSections.flows && (
            <div className="px-4 pb-3">
              {recentFlows.length === 0 ? (
                <p className="text-sm text-gray-500">No recent flows</p>
              ) : (
                <div className="space-y-2">
                  {recentFlows.map((flow) => (
                    <button
                      key={flow.id}
                      onClick={() => onFlowClick(flow.id)}
                      className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{flow.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          flow.status === 'active' ? 'bg-green-100 text-green-600' :
                          flow.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {flow.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Agent Categories */}
        <div className="border-b border-gray-200">
          {isCollapsed ? (
            <button
              className="w-full p-3 flex items-center justify-center hover:bg-gray-50"
              title="Agent Library"
            >
              <Bot className="w-5 h-5 text-gray-500" />
            </button>
          ) : (
            <button
              onClick={() => toggleSection('agents')}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">Agent Library</span>
              </div>
              {expandedSections.agents ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          
          {!isCollapsed && expandedSections.agents && (
            <div className="px-4 pb-3">
              {Object.entries(agentCategories).map(([key, category]) => (
                <div key={key} className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {agents.filter(agent => agent.type === key).map((agent) => (
                      <div
                        key={agent.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/json', JSON.stringify({
                            type: 'agent',
                            name: agent.name,
                            agentId: agent.id,
                            config: { agentType: agent.type }
                          }));
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing"
                        onClick={() => onAgentClick(agent.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{agent.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            agent.status === 'active' ? 'bg-green-100 text-green-600' :
                            agent.status === 'inactive' ? 'bg-gray-100 text-gray-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {agent.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pipeline Templates */}
        <div className="border-b border-gray-200">
          {isCollapsed ? (
            <button
              className="w-full p-3 flex items-center justify-center hover:bg-gray-50"
              title="Pipeline Templates"
            >
              <FileText className="w-5 h-5 text-gray-500" />
            </button>
          ) : (
            <button
              onClick={() => toggleSection('templates')}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">Pipeline Templates</span>
              </div>
              {expandedSections.templates ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          
          {!isCollapsed && expandedSections.templates && (
            <div className="px-4 pb-3">
              {/* Category Filter */}
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter by Industry</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      !selectedCategory ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    All
                  </button>
                  {Object.entries(templateCategories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        selectedCategory === key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates */}
              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.templateId}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify({
                        type: 'template',
                        template: template
                      }));
                    }}
                    onClick={() => onTemplateSelect(template)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{templateCategories[template.industry]?.icon || '📋'}</span>
                        <span className="text-sm font-medium text-gray-900">{template.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        template.config.complexity === 'low' ? 'bg-green-100 text-green-600' :
                        template.config.complexity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {template.config.complexity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>${template.config.estimatedCost} • {template.config.estimatedTime}min</span>
                      <span>{template.metadata.usage} uses</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Infrastructure Health */}
        <div className="border-b border-gray-200">
          {isCollapsed ? (
            <button
              className="w-full p-3 flex items-center justify-center hover:bg-gray-50"
              title="Infrastructure"
            >
              <Activity className="w-5 h-5 text-gray-500" />
            </button>
          ) : (
            <button
              onClick={() => toggleSection('infrastructure')}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">Infrastructure</span>
              </div>
              {expandedSections.infrastructure ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          
          {!isCollapsed && expandedSections.infrastructure && infrastructureHealth && (
            <div className="px-4 pb-3">
              {/* Overall Health */}
              <div className="mb-3 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Overall Status</span>
                  <span className={`text-sm font-medium ${getHealthColor(infrastructureHealth.overall)}`}>
                    {getHealthIcon(infrastructureHealth.overall)} {infrastructureHealth.overall}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  Uptime: {infrastructureHealth.uptime}%
                </div>
              </div>

              {/* Component Health */}
              <div className="space-y-2">
                {Object.entries(infrastructureHealth.components).map(([component, status]) => (
                  <div key={component} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">{component.replace(/([A-Z])/g, ' $1')}</span>
                    <span className={`text-sm ${getHealthColor(status as string)}`}>
                      {getHealthIcon(status as string)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSidebar;
