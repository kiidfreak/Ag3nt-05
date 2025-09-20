/**
 * Node Properties Modal
 * Modal for editing node properties and configuration
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw, Settings, Bot, Zap, Shield, Database, Globe, FileText } from 'lucide-react';

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface NodeProperties {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  config: Record<string, any>;
  position: { x: number; y: number };
  data?: Record<string, any>;
}

export interface NodePropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (properties: NodeProperties) => void;
  node: NodeProperties | null;
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'agent':
      return <Bot className="w-5 h-5 text-blue-600" />;
    case 'condition':
      return <Zap className="w-5 h-5 text-yellow-600" />;
    case 'action':
      return <Settings className="w-5 h-5 text-green-600" />;
    case 'input':
      return <Database className="w-5 h-5 text-purple-600" />;
    case 'output':
      return <Globe className="w-5 h-5 text-indigo-600" />;
    default:
      return <FileText className="w-5 h-5 text-gray-600" />;
  }
};

const getNodeTypeLabel = (type: string) => {
  switch (type) {
    case 'agent':
      return 'AI Agent';
    case 'condition':
      return 'Condition';
    case 'action':
      return 'Action';
    case 'input':
      return 'Input';
    case 'output':
      return 'Output';
    default:
      return 'Node';
  }
};

export const NodePropertiesModal: React.FC<NodePropertiesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  node,
}) => {
  const [formData, setFormData] = useState<NodeProperties | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (node) {
      setFormData({ ...node });
      setHasChanges(false);
    }
  }, [node]);

  const handleInputChange = (field: keyof NodeProperties, value: any) => {
    if (!formData) return;
    
    const updated = { ...formData };
    if (field === 'config') {
      updated.config = { ...updated.config, ...value };
    } else {
      (updated as any)[field] = value;
    }
    
    setFormData(updated);
    setHasChanges(true);
  };

  const handleConfigChange = (key: string, value: any) => {
    if (!formData) return;
    
    const updated = { ...formData };
    updated.config = { ...updated.config, [key]: value };
    
    setFormData(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      setHasChanges(false);
      onClose();
    }
  };

  const handleReset = () => {
    if (node) {
      setFormData({ ...node });
      setHasChanges(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !node || !formData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {getNodeIcon(formData.type)}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {getNodeTypeLabel(formData.type)} Properties
                </h2>
                <p className="text-sm text-gray-500">Edit node configuration and settings</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {/* Basic Properties */}
              <Card variant="elevated" className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Properties</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Node Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter node name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter node description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="idle">Idle</option>
                      <option value="running">Running</option>
                      <option value="completed">Completed</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Type-Specific Configuration */}
              <Card variant="elevated" className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
                <div className="space-y-4">
                  {formData.type === 'agent' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Agent Type
                        </label>
                        <select
                          value={formData.config.agentType || 'general'}
                          onChange={(e) => handleConfigChange('agentType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="general">General AI Agent</option>
                          <option value="chatbot">Chatbot</option>
                          <option value="analyzer">Data Analyzer</option>
                          <option value="processor">Data Processor</option>
                          <option value="classifier">Classifier</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Model
                        </label>
                        <select
                          value={formData.config.model || 'gpt-4'}
                          onChange={(e) => handleConfigChange('model', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          <option value="claude-3">Claude 3</option>
                          <option value="gemini-pro">Gemini Pro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Temperature
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={formData.config.temperature || 0.7}
                          onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0 (Deterministic)</span>
                          <span>{formData.config.temperature || 0.7}</span>
                          <span>2 (Creative)</span>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.type === 'condition' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Condition Type
                        </label>
                        <select
                          value={formData.config.conditionType || 'comparison'}
                          onChange={(e) => handleConfigChange('conditionType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="comparison">Value Comparison</option>
                          <option value="threshold">Threshold Check</option>
                          <option value="pattern">Pattern Match</option>
                          <option value="custom">Custom Logic</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Operator
                        </label>
                        <select
                          value={formData.config.operator || 'equals'}
                          onChange={(e) => handleConfigChange('operator', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="equals">Equals</option>
                          <option value="not_equals">Not Equals</option>
                          <option value="greater_than">Greater Than</option>
                          <option value="less_than">Less Than</option>
                          <option value="contains">Contains</option>
                          <option value="starts_with">Starts With</option>
                        </select>
                      </div>
                    </>
                  )}

                  {formData.type === 'action' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Action Type
                        </label>
                        <select
                          value={formData.config.actionType || 'transform'}
                          onChange={(e) => handleConfigChange('actionType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="transform">Data Transform</option>
                          <option value="filter">Filter Data</option>
                          <option value="aggregate">Aggregate Data</option>
                          <option value="send">Send Data</option>
                          <option value="store">Store Data</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Timeout (seconds)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="300"
                          value={formData.config.timeout || 30}
                          onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  {formData.type === 'input' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Input Type
                        </label>
                        <select
                          value={formData.config.inputType || 'text'}
                          onChange={(e) => handleConfigChange('inputType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="text">Text Input</option>
                          <option value="file">File Upload</option>
                          <option value="api">API Call</option>
                          <option value="database">Database Query</option>
                          <option value="stream">Data Stream</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Required
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.config.required || false}
                            onChange={(e) => handleConfigChange('required', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            This input is required
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.type === 'output' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Output Format
                        </label>
                        <select
                          value={formData.config.outputFormat || 'json'}
                          onChange={(e) => handleConfigChange('outputFormat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="json">JSON</option>
                          <option value="xml">XML</option>
                          <option value="csv">CSV</option>
                          <option value="text">Plain Text</option>
                          <option value="html">HTML</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Include Metadata
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.config.includeMetadata || false}
                            onChange={(e) => handleConfigChange('includeMetadata', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            Include execution metadata in output
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Position Info */}
              <Card variant="elevated" className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Position</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      X Position
                    </label>
                    <input
                      type="number"
                      value={formData.position.x}
                      onChange={(e) => handleInputChange('position', { ...formData.position, x: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Y Position
                    </label>
                    <input
                      type="number"
                      value={formData.position.y}
                      onChange={(e) => handleInputChange('position', { ...formData.position, y: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(formData.status)}`}>
                {formData.status}
              </span>
              {hasChanges && (
                <span className="text-sm text-orange-600 font-medium">
                  • Unsaved changes
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                disabled={!hasChanges}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
