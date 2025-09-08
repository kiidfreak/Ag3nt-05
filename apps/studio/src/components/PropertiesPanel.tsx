import React from 'react';

const PropertiesPanel: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Flow Name
        </label>
        <input
          type="text"
          className="input"
          placeholder="Enter flow name"
          defaultValue="My Agent Flow"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          className="input h-20 resize-none"
          placeholder="Describe your flow"
          defaultValue="A simple agent workflow for demonstration"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          className="input"
          placeholder="compliance, payment, trust"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Environment
        </label>
        <select className="input">
          <option value="development">Development</option>
          <option value="staging">Staging</option>
          <option value="production">Production</option>
        </select>
      </div>
    </div>
  );
};

export default PropertiesPanel;
