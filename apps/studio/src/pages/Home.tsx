import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Zap, Shield, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Agent Labs OS
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The Canva for Agents - Build, compose, and deploy multi-agent systems
        </p>
        <Link
          to="/studio"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <Play className="w-5 h-5" />
          <span>Start Building</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Composition</h3>
          <p className="text-gray-600">
            Drag and drop agents to create complex workflows without coding
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Built-in Security</h3>
          <p className="text-gray-600">
            Human-in-the-loop approvals and on-chain reputation tracking
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Agent Marketplace</h3>
          <p className="text-gray-600">
            Discover, rent, and monetize agents in our growing ecosystem
          </p>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Create a New Flow</h3>
              <p className="text-gray-600">Start with a blank canvas or choose from our templates</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add Agents</h3>
              <p className="text-gray-600">Drag agents from the library and connect them with flows</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Deploy & Monitor</h3>
              <p className="text-gray-600">Run your agent flow and monitor performance in real-time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
