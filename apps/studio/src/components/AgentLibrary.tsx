import React from 'react';

const AgentLibrary: React.FC = () => {
  const agents = [
    {
      id: 'consent-agent',
      name: 'Consent Agent',
      description: 'Voice consent management',
      color: 'green',
      icon: 'C'
    },
    {
      id: 'trust-agent',
      name: 'Trust Agent',
      description: 'Reputation management',
      color: 'blue',
      icon: 'T'
    },
    {
      id: 'payment-agent',
      name: 'Payment Agent',
      description: 'Blockchain payments',
      color: 'purple',
      icon: 'P'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-3">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
          draggable
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(agent.color)}`}>
              <span className="font-medium text-sm">{agent.icon}</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{agent.name}</h4>
              <p className="text-sm text-gray-600">{agent.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentLibrary;
