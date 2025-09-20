/**
 * Modern Sidebar Component
 * Beautiful, collapsible sidebar with agent library and templates
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Search, 
  Filter, 
  Grid, 
  List,
  Plus,
  Bot,
  Zap,
  Shield,
  Database,
  Globe,
  FileText,
  Settings,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  status: 'active' | 'inactive' | 'beta';
  rating: number;
  usage: number;
  lastUpdated: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  agents: string[];
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
  rating: number;
  usage: number;
}

export interface ModernSidebarProps {
  agents: Agent[];
  templates: Template[];
  onAgentSelect?: (agent: Agent) => void;
  onTemplateSelect?: (template: Template) => void;
  onAgentEdit?: (agent: Agent) => void;
  onTemplateEdit?: (template: Template) => void;
  onSearch?: (query: string) => void;
  className?: string;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  agents,
  templates,
  onAgentSelect,
  onTemplateSelect,
  onAgentEdit,
  onTemplateEdit,
  onSearch,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'agents' | 'templates'>('agents');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    all: true,
    ai: true,
    data: true,
    security: true,
    integration: true,
    processing: true,
  });
  const [isDragging, setIsDragging] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: Grid },
    { id: 'ai', name: 'AI', icon: Bot },
    { id: 'data', name: 'Data', icon: Database },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integration', name: 'Integration', icon: Globe },
    { id: 'processing', name: 'Processing', icon: Zap },
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const toggleCategoriesSection = useCallback(() => {
    setCategoriesExpanded(!categoriesExpanded);
  }, [categoriesExpanded]);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, type: 'agent' | 'template', data: any) => {
    setIsDragging(true);
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ type, data }));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    dragImage.style.pointerEvents = 'none';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up the drag image after a short delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'complex':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ width: 320 }}
      animate={{ width: isCollapsed ? 64 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`bg-white border-r border-gray-200 flex flex-col h-full ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-900">Agent Library</h2>
              <p className="text-sm text-gray-500">Drag agents to canvas</p>
            </motion.div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Search */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 border-b border-gray-200"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents and templates..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 border-b border-gray-200"
          >
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('agents')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'agents'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Agents
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'templates'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Templates
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-gray-200"
          >
            {/* Categories Header */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={toggleCategoriesSection}
                  className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700"
                >
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${
                      categoriesExpanded ? 'rotate-0' : '-rotate-90'
                    }`} 
                  />
                  <span>Categories</span>
                </button>
                <div className="flex space-x-1">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="p-1"
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="p-1"
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Categories List */}
              <AnimatePresence>
                {categoriesExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 gap-2"
                  >
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isExpanded = expandedCategories[category.id];
                      const itemCount = activeTab === 'agents' 
                        ? filteredAgents.filter(agent => 
                            selectedCategory === 'all' ? true : agent.category === category.id
                          ).length
                        : filteredTemplates.filter(template => 
                            selectedCategory === 'all' ? true : template.category === category.id
                          ).length;
                      
                      return (
                        <div key={category.id} className="space-y-1">
                          <button
                            onClick={() => setSelectedCategory(category.id)}
                            className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                              selectedCategory === category.id
                                ? 'bg-blue-100 text-blue-900'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="flex-1 text-left">{category.name}</span>
                            <span className="text-xs text-gray-500">({itemCount})</span>
                          </button>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 space-y-4"
            >
              {/* Drag Indicator */}
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <Bot className="w-5 h-5" />
                    <span className="text-sm font-medium">Drag to canvas to add</span>
                  </div>
                </motion.div>
              )}
              {activeTab === 'agents' ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-3' : 'space-y-2'}>
                  {filteredAgents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, 'agent', agent)}
                      onDragEnd={handleDragEnd}
                      className="group"
                    >
                      <Card
                        variant="default"
                        hover
                        className={`cursor-move transition-all duration-200 group-hover:shadow-md ${
                          viewMode === 'list' ? 'p-3' : 'p-4'
                        } ${isDragging ? 'opacity-50 scale-95' : ''}`}
                        onClick={() => onAgentSelect?.(agent)}
                        onDoubleClick={() => onAgentEdit?.(agent)}
                      >
                        <div className={`flex items-start gap-3 ${viewMode === 'list' ? 'gap-2' : ''}`}>
                          <div className={`p-2 bg-blue-100 rounded-lg ${viewMode === 'list' ? 'p-1.5' : ''}`}>
                            {agent.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium text-gray-900 truncate ${
                                viewMode === 'list' ? 'text-sm' : 'text-sm'
                              }`}>
                                {agent.name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                                {agent.status}
                              </span>
                            </div>
                            <p className={`text-gray-600 mb-2 ${
                              viewMode === 'list' 
                                ? 'text-xs line-clamp-1' 
                                : 'text-xs line-clamp-2'
                            }`}>
                              {agent.description}
                            </p>
                            <div className={`flex items-center gap-3 text-gray-500 ${
                              viewMode === 'list' ? 'text-xs gap-2' : 'text-xs'
                            }`}>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                <span>{agent.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>{agent.usage}</span>
                              </div>
                              {viewMode === 'grid' && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(agent.lastUpdated).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-3' : 'space-y-2'}>
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, 'template', template)}
                      onDragEnd={handleDragEnd}
                      className="group"
                    >
                      <Card
                        variant="default"
                        hover
                        className={`cursor-move transition-all duration-200 group-hover:shadow-md ${
                          viewMode === 'list' ? 'p-3' : 'p-4'
                        } ${isDragging ? 'opacity-50 scale-95' : ''}`}
                        onClick={() => onTemplateSelect?.(template)}
                        onDoubleClick={() => onTemplateEdit?.(template)}
                      >
                        <div className={`flex items-start gap-3 ${viewMode === 'list' ? 'gap-2' : ''}`}>
                          <div className={`p-2 bg-purple-100 rounded-lg ${viewMode === 'list' ? 'p-1.5' : ''}`}>
                            <FileText className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium text-gray-900 truncate ${
                                viewMode === 'list' ? 'text-sm' : 'text-sm'
                              }`}>
                                {template.name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                                {template.complexity}
                              </span>
                            </div>
                            <p className={`text-gray-600 mb-2 ${
                              viewMode === 'list' 
                                ? 'text-xs line-clamp-1' 
                                : 'text-xs line-clamp-2'
                            }`}>
                              {template.description}
                            </p>
                            <div className={`flex items-center gap-3 text-gray-500 ${
                              viewMode === 'list' ? 'text-xs gap-2' : 'text-xs'
                            }`}>
                              <div className="flex items-center gap-1">
                                <Bot className="w-3 h-3" />
                                <span>{template.agents.length} agents</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{template.estimatedTime}</span>
                              </div>
                              {viewMode === 'grid' && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  <span>{template.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 border-t border-gray-200"
          >
            <Button
              variant="primary"
              fullWidth
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {/* Create new agent */}}
            >
              Create Agent
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ModernSidebar;
