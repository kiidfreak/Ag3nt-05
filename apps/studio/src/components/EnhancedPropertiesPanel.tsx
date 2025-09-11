import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Zap, 
  Settings, 
  ArrowRight, 
  Code, 
  Database, 
  Webhook, 
  Shield, 
  Coins, 
  MessageSquare,
  Link,
  Unlink,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

// Types
interface Port {
  id: string;
  type: 'input' | 'output';
  dataType: 'string' | 'number' | 'boolean' | 'object' | 'any';
  label: string;
  required?: boolean;
}

interface FlowNode {
  id: string;
  type: 'input' | 'agent' | 'condition' | 'action' | 'output';
  name: string;
  position: { x: number; y: number };
  config: any;
  ports: Port[];
  status: 'idle' | 'running' | 'completed' | 'error';
  agentId?: string;
}

interface Connection {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  type: 'data' | 'control' | 'event';
  status: 'connected' | 'disconnected' | 'error';
}

interface EnhancedPropertiesPanelProps {
  selectedNode: FlowNode | null;
  connections: Connection[];
  onNodeUpdate: (node: FlowNode) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeDuplicate: (node: FlowNode) => void;
  onConnectionDelete: (connectionId: string) => void;
}

const EnhancedPropertiesPanel: React.FC<EnhancedPropertiesPanelProps> = ({
  selectedNode,
  connections,
  onNodeUpdate,
  onNodeDelete,
  onNodeDuplicate,
  onConnectionDelete
}) => {
  const [config, setConfig] = useState<any>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.config || {});
    }
  }, [selectedNode]);

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    
    if (selectedNode) {
      onNodeUpdate({
        ...selectedNode,
        config: newConfig
      });
    }
  };

  const handleNameChange = (name: string) => {
    if (selectedNode) {
      onNodeUpdate({
        ...selectedNode,
        name
      });
    }
  };

  const renderInputProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input Type
        </label>
        <select
          value={config.inputType || 'manual'}
          onChange={(e) => handleConfigChange('inputType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="manual">Manual Input</option>
          <option value="webhook">Webhook</option>
          <option value="schedule">Scheduled</option>
          <option value="file">File Upload</option>
          <option value="api">API Call</option>
        </select>
      </div>

      {config.inputType === 'webhook' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL
          </label>
          <input
            type="text"
            value={config.webhookUrl || ''}
            onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
            placeholder="https://your-domain.com/webhook"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      )}

      {config.inputType === 'schedule' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule (Cron)
          </label>
          <input
            type="text"
            value={config.schedule || '0 0 * * *'}
            onChange={(e) => handleConfigChange('schedule', e.target.value)}
            placeholder="0 0 * * *"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data Format
        </label>
        <select
          value={config.dataFormat || 'json'}
          onChange={(e) => handleConfigChange('dataFormat', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="json">JSON</option>
          <option value="xml">XML</option>
          <option value="csv">CSV</option>
          <option value="text">Plain Text</option>
        </select>
      </div>
    </div>
  );

  const renderAgentProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agent Type
        </label>
        <select
          value={config.agentType || 'personal-assistant'}
          onChange={(e) => handleConfigChange('agentType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="personal-assistant">Personal Assistant</option>
          <option value="financial">Financial Agent</option>
          <option value="healthcare">Healthcare Agent</option>
          <option value="custom">Custom Agent</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model Provider
        </label>
        <select
          value={config.modelProvider || 'mistral'}
          onChange={(e) => handleConfigChange('modelProvider', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="mistral">Mistral</option>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="local">Local Model</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model Name
        </label>
        <input
          type="text"
          value={config.modelName || 'mistral-7b'}
          onChange={(e) => handleConfigChange('modelName', e.target.value)}
          placeholder="mistral-7b"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Temperature
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={config.temperature || 0.7}
          onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-xs text-gray-500 mt-1">
          {config.temperature || 0.7}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Tokens
        </label>
        <input
          type="number"
          value={config.maxTokens || 1000}
          onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt
        </label>
        <textarea
          value={config.systemPrompt || ''}
          onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
          placeholder="You are a helpful assistant..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-20 resize-none"
        />
      </div>

      {/* Advanced Settings */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <Settings className="w-4 h-4" />
          <span>Advanced Settings</span>
        </button>
        
        {showAdvanced && (
          <div className="mt-3 space-y-3 pl-6 border-l-2 border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showSecrets ? 'text' : 'password'}
                  value={config.apiKey || ''}
                  onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                  placeholder="Enter API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm pr-10"
                />
                <button
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base URL
              </label>
              <input
                type="text"
                value={config.baseUrl || ''}
                onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
                placeholder="https://api.example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout (seconds)
              </label>
              <input
                type="number"
                value={config.timeout || 30}
                onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderConditionProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Condition Type
        </label>
        <select
          value={config.conditionType || 'simple'}
          onChange={(e) => handleConfigChange('conditionType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="simple">Simple Comparison</option>
          <option value="regex">Regular Expression</option>
          <option value="script">Custom Script</option>
          <option value="ai">AI-Powered</option>
        </select>
      </div>

      {config.conditionType === 'simple' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field Path
            </label>
            <input
              type="text"
              value={config.fieldPath || ''}
              onChange={(e) => handleConfigChange('fieldPath', e.target.value)}
              placeholder="data.user.age"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operator
            </label>
            <select
              value={config.operator || 'equals'}
              onChange={(e) => handleConfigChange('operator', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="equals">Equals</option>
              <option value="not_equals">Not Equals</option>
              <option value="greater_than">Greater Than</option>
              <option value="less_than">Less Than</option>
              <option value="contains">Contains</option>
              <option value="starts_with">Starts With</option>
              <option value="ends_with">Ends With</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="text"
              value={config.value || ''}
              onChange={(e) => handleConfigChange('value', e.target.value)}
              placeholder="Expected value"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </>
      )}

      {config.conditionType === 'regex' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Regular Expression
          </label>
          <input
            type="text"
            value={config.regex || ''}
            onChange={(e) => handleConfigChange('regex', e.target.value)}
            placeholder="^[a-zA-Z0-9]+$"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      )}

      {config.conditionType === 'script' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            JavaScript Code
          </label>
          <textarea
            value={config.script || ''}
            onChange={(e) => handleConfigChange('script', e.target.value)}
            placeholder="return data.value > 18;"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-20 resize-none font-mono"
          />
        </div>
      )}
    </div>
  );

  const renderActionProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Action Type
        </label>
        <select
          value={config.actionType || 'api-call'}
          onChange={(e) => handleConfigChange('actionType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="api-call">API Call</option>
          <option value="webhook">Webhook</option>
          <option value="database">Database Query</option>
          <option value="file">File Operation</option>
          <option value="email">Send Email</option>
          <option value="notification">Send Notification</option>
          <option value="script">Custom Script</option>
        </select>
      </div>

      {config.actionType === 'api-call' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HTTP Method
            </label>
            <select
              value={config.httpMethod || 'GET'}
              onChange={(e) => handleConfigChange('httpMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="text"
              value={config.url || ''}
              onChange={(e) => handleConfigChange('url', e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headers (JSON)
            </label>
            <textarea
              value={config.headers || '{}'}
              onChange={(e) => handleConfigChange('headers', e.target.value)}
              placeholder='{"Content-Type": "application/json"}'
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-16 resize-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body (JSON)
            </label>
            <textarea
              value={config.body || '{}'}
              onChange={(e) => handleConfigChange('body', e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-16 resize-none font-mono"
            />
          </div>
        </>
      )}

      {config.actionType === 'webhook' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL
          </label>
          <input
            type="text"
            value={config.webhookUrl || ''}
            onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      )}

      {config.actionType === 'database' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Type
            </label>
            <select
              value={config.dbType || 'postgresql'}
              onChange={(e) => handleConfigChange('dbType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="mongodb">MongoDB</option>
              <option value="sqlite">SQLite</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Query
            </label>
            <textarea
              value={config.query || ''}
              onChange={(e) => handleConfigChange('query', e.target.value)}
              placeholder="SELECT * FROM users WHERE id = ?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-16 resize-none font-mono"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderOutputProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output Type
        </label>
        <select
          value={config.outputType || 'json'}
          onChange={(e) => handleConfigChange('outputType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="json">JSON</option>
          <option value="xml">XML</option>
          <option value="csv">CSV</option>
          <option value="text">Plain Text</option>
          <option value="file">File Download</option>
          <option value="webhook">Webhook</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Response Format
        </label>
        <textarea
          value={config.responseFormat || '{}'}
          onChange={(e) => handleConfigChange('responseFormat', e.target.value)}
          placeholder='{"status": "success", "data": "{{input}}"}'
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-20 resize-none font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status Code
        </label>
        <input
          type="number"
          value={config.statusCode || 200}
          onChange={(e) => handleConfigChange('statusCode', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
    </div>
  );

  const renderNodeProperties = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case 'input':
        return renderInputProperties();
      case 'agent':
        return renderAgentProperties();
      case 'condition':
        return renderConditionProperties();
      case 'action':
        return renderActionProperties();
      case 'output':
        return renderOutputProperties();
      default:
        return null;
    }
  };

  if (!selectedNode) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">
          <Settings className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Node Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedNode.name}
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              selectedNode.status === 'running' ? 'bg-yellow-500 animate-pulse' :
              selectedNode.status === 'completed' ? 'bg-green-500' :
              selectedNode.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
            }`} />
            <span className="text-xs text-gray-500 capitalize">
              {selectedNode.status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 capitalize">
            {selectedNode.type}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-400">
            {selectedNode.ports.length} ports
          </span>
        </div>
      </div>

      {/* Node Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          value={selectedNode.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      {/* Type-specific Properties */}
      {renderNodeProperties()}

      {/* Ports */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Ports</h4>
        <div className="space-y-2">
          {selectedNode.ports.map(port => (
            <div key={port.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  port.type === 'input' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <span className="text-sm font-medium">{port.label}</span>
                <span className="text-xs text-gray-500">({port.dataType})</span>
              </div>
              {port.required && (
                <span className="text-xs text-red-500">Required</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Connections */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Connections</h4>
          <span className="text-xs text-gray-500">
            {connections.filter(conn => conn.sourceNodeId === selectedNode.id || conn.targetNodeId === selectedNode.id).length} total
          </span>
        </div>
        <div className="space-y-2">
          {connections
            .filter(conn => conn.sourceNodeId === selectedNode.id || conn.targetNodeId === selectedNode.id)
            .map(connection => {
              const isSource = connection.sourceNodeId === selectedNode.id;
              const connectedNodeId = isSource ? connection.targetNodeId : connection.sourceNodeId;
              const connectedPortId = isSource ? connection.targetPortId : connection.sourcePortId;
              
              return (
                <div key={connection.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      connection.status === 'connected' ? 'bg-green-500' :
                      connection.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-sm">
                      {isSource ? '→' : '←'} Node {connectedNodeId.slice(-4)}
                    </span>
                    <span className="text-xs text-gray-500">({connectedPortId})</span>
                  </div>
                  <button
                    onClick={() => onConnectionDelete(connection.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete connection"
                  >
                    <Unlink className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          {connections.filter(conn => conn.sourceNodeId === selectedNode.id || conn.targetNodeId === selectedNode.id).length === 0 && (
            <div className="text-center text-gray-500 py-4">
              <Link className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No connections</p>
              <p className="text-xs">Click on ports to create connections</p>
              <p className="text-xs text-blue-600 mt-1">💡 Multiple connections from one output are supported</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onNodeDuplicate(selectedNode)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Duplicate</span>
          </button>
          
          <button
            onClick={() => onNodeDelete(selectedNode.id)}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPropertiesPanel;
