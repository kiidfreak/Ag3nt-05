import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Bot, Settings } from 'lucide-react';
import { apiService } from '../services/api';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    agentId: '',
    config: {
      temperature: 0.7,
      maxMessages: 50,
      autoApprove: false,
    },
  });
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAgents();
    }
  }, [isOpen]);

  const loadAgents = async () => {
    try {
      const response = await apiService.getAgents();
      if (response.success) {
        setAgents(response.data);
        if (response.data.length > 0 && !formData.agentId) {
          setFormData({ ...formData, agentId: response.data[0].id });
        }
      }
    } catch (err) {
      console.error('Failed to load agents:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agentId) {
      setError('Please select an agent');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiService.createSession({
        name: formData.name || undefined,
        agentId: formData.agentId,
        config: formData.config,
        metadata: {
          source: 'studio',
          tags: ['demo'],
        },
      });

      onSuccess();
      onClose();
      setFormData({
        name: '',
        agentId: '',
        config: {
          temperature: 0.7,
          maxMessages: 50,
          autoApprove: false,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({
        name: '',
        agentId: '',
        config: {
          temperature: 0.7,
          maxMessages: 50,
          autoApprove: false,
        },
      });
      setError(null);
    }
  };

  const selectedAgent = agents.find(agent => agent.id === formData.agentId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Session</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Enter session name (optional)"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Agent *
            </label>
            <div className="space-y-2">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, agentId: agent.id })}
                  disabled={loading}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.agentId === agent.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.description}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          agent.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {agent.status}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {agent._count.sessions} sessions
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedAgent && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Session Configuration
              </label>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Temperature: {formData.config.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.config.temperature}
                    onChange={(e) => setFormData({
                      ...formData,
                      config: { ...formData.config, temperature: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Max Messages: {formData.config.maxMessages}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="10"
                    value={formData.config.maxMessages}
                    onChange={(e) => setFormData({
                      ...formData,
                      config: { ...formData.config, maxMessages: parseInt(e.target.value) }
                    })}
                    className="w-full"
                    disabled={loading}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoApprove"
                    checked={formData.config.autoApprove}
                    onChange={(e) => setFormData({
                      ...formData,
                      config: { ...formData.config, autoApprove: e.target.checked }
                    })}
                    className="mr-2"
                    disabled={loading}
                  />
                  <label htmlFor="autoApprove" className="text-sm text-gray-600">
                    Auto-approve actions
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.agentId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{loading ? 'Creating...' : 'Create Session'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionModal;
