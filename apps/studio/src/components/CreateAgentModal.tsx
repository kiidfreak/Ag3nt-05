import React, { useState } from 'react';
import { X, Bot, Zap, Shield, Coins, Settings } from 'lucide-react';
import { apiService } from '../services/api';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const agentTypes = [
  {
    id: 'basic',
    name: 'Basic Chat',
    description: 'Simple conversational agent',
    icon: Bot,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'coral',
    name: 'Coral Protocol',
    description: 'Coral Protocol interactions',
    icon: Zap,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'solana',
    name: 'Solana DeFi',
    description: 'Solana DeFi operations',
    icon: Coins,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Custom agent configuration',
    icon: Settings,
    color: 'bg-gray-100 text-gray-600',
  },
];

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'basic' as 'basic' | 'coral' | 'solana' | 'custom',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Agent name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiService.createAgent({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        config: {
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 1000,
        },
      });

      onSuccess();
      onClose();
      setFormData({ name: '', description: '', type: 'basic' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({ name: '', description: '', type: 'basic' });
      setError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Agent</h2>
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
              Agent Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Enter agent name"
              disabled={loading}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input h-20 resize-none"
              placeholder="Describe what this agent does"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Agent Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {agentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.id as any })}
                    disabled={loading}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.type === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-lg ${type.color} mr-3`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{type.name}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

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
              disabled={loading || !formData.name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{loading ? 'Creating...' : 'Create Agent'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgentModal;
