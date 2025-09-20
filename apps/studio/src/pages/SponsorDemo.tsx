/**
 * Sponsor Demo Page
 * Showcases real API integrations with hackathon sponsors
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Zap,
  Bot,
  Phone,
  CreditCard,
  Cloud,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  Globe,
  Shield,
  Database
} from 'lucide-react';

import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import SponsorIntegrations from '../components/sponsors/SponsorIntegrations';
import { useNavigate } from 'react-router-dom';

const SponsorDemo: React.FC = () => {
  const navigate = useNavigate();
  const [demoStep, setDemoStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [demoData, setDemoData] = useState({
    workflows: 0,
    agents: 0,
    apiCalls: 0,
    successRate: 0,
  });

  const demoSteps = [
    {
      title: 'OpenAI GPT-4 Integration',
      description: 'Generate intelligent workflows from natural language',
      icon: <Bot className="w-8 h-8 text-purple-600" />,
      action: 'Generating workflow...',
      result: 'Workflow created with 5 agents and 8 connections',
    },
    {
      title: 'Twilio Voice API',
      description: 'Make AI-powered voice calls to customers',
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      action: 'Making call...',
      result: 'Call connected to +1-555-0123',
    },
    {
      title: 'Solana Blockchain',
      description: 'Send decentralized payments to agents',
      icon: <CreditCard className="w-8 h-8 text-green-600" />,
      action: 'Processing payment...',
      result: 'Payment of 0.1 SOL sent to agent wallet',
    },
    {
      title: 'AWS Cloud Services',
      description: 'Deploy agents to AWS Lambda and store data in S3',
      icon: <Cloud className="w-8 h-8 text-orange-600" />,
      action: 'Deploying to AWS...',
      result: 'Agent deployed to Lambda, data stored in S3',
    },
  ];

  const metrics = [
    { label: 'Active Workflows', value: demoData.workflows, icon: <Zap className="w-5 h-5" />, color: 'text-blue-600' },
    { label: 'Running Agents', value: demoData.agents, icon: <Bot className="w-5 h-5" />, color: 'text-purple-600' },
    { label: 'API Calls Today', value: demoData.apiCalls, icon: <Globe className="w-5 h-5" />, color: 'text-green-600' },
    { label: 'Success Rate', value: `${demoData.successRate}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-orange-600' },
  ];

  const sponsors = [
    { name: 'OpenAI', logo: '🤖', apis: ['GPT-4', 'DALL-E', 'Whisper'], usage: '1,250 calls' },
    { name: 'Twilio', logo: '📞', apis: ['Voice', 'SMS', 'Video'], usage: '890 messages' },
    { name: 'Solana', logo: '⛓️', apis: ['RPC', 'Web3', 'Payments'], usage: '156 transactions' },
    { name: 'AWS', logo: '☁️', apis: ['Lambda', 'S3', 'DynamoDB'], usage: '2.4TB processed' },
    { name: 'Google Cloud', logo: '🔍', apis: ['Vertex AI', 'Speech', 'Vision'], usage: '650 requests' },
    { name: 'Microsoft Azure', logo: '🔷', apis: ['Cognitive', 'Functions', 'Storage'], usage: '320 operations' },
  ];

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setDemoData(prev => ({
          workflows: Math.min(prev.workflows + 1, 12),
          agents: Math.min(prev.agents + 2, 48),
          apiCalls: prev.apiCalls + Math.floor(Math.random() * 10) + 5,
          successRate: Math.min(prev.successRate + 0.1, 98.5),
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const startDemo = () => {
    setIsRunning(true);
    setDemoStep(0);
    setDemoData({ workflows: 0, agents: 0, apiCalls: 0, successRate: 0 });
  };

  const nextStep = () => {
    if (demoStep < demoSteps.length - 1) {
      setDemoStep(demoStep + 1);
    } else {
      setIsRunning(false);
    }
  };

  const resetDemo = () => {
    setIsRunning(false);
    setDemoStep(0);
    setDemoData({ workflows: 0, agents: 0, apiCalls: 0, successRate: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/studio')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Studio
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Hackathon Sponsor Demo</h1>
              <p className="text-sm text-gray-500">Real API integrations in action</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isRunning ? 'warning' : 'success'}
              size="sm"
              onClick={isRunning ? () => setIsRunning(false) : startDemo}
              leftIcon={isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            >
              {isRunning ? 'Pause Demo' : 'Start Demo'}
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={resetDemo}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="elevated" className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${metric.color}`}>
                    {metric.icon}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Demo Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Step */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {demoSteps[demoStep]?.icon}
                {demoSteps[demoStep]?.title}
              </CardTitle>
              <CardDescription>{demoSteps[demoStep]?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {isRunning ? (
                    <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span className="text-sm font-medium">
                    {isRunning ? demoSteps[demoStep]?.action : demoSteps[demoStep]?.result}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: isRunning ? '100%' : `${((demoStep + 1) / demoSteps.length) * 100}%` }}
                    transition={{ duration: 2 }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Step {demoStep + 1} of {demoSteps.length}</span>
                  <span>{Math.round(((demoStep + 1) / demoSteps.length) * 100)}% Complete</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sponsor APIs */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Active Sponsor APIs</CardTitle>
              <CardDescription>Real-time API usage from hackathon sponsors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sponsors.map((sponsor, index) => (
                  <motion.div
                    key={sponsor.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sponsor.logo}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{sponsor.name}</h4>
                        <p className="text-xs text-gray-600">{sponsor.apis.join(', ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{sponsor.usage}</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500">Active</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Controls */}
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Demo Controls</h3>
                <p className="text-gray-600">
                  {isRunning 
                    ? 'Demo is running automatically. Watch the metrics update in real-time.'
                    : 'Click "Start Demo" to see sponsor APIs in action with live data.'
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={isRunning ? () => setIsRunning(false) : startDemo}
                  leftIcon={isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                >
                  {isRunning ? 'Pause Demo' : 'Start Demo'}
                </Button>
                
                {isRunning && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={nextStep}
                    leftIcon={<ArrowLeft className="w-5 h-5" />}
                  >
                    Next Step
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={resetDemo}
                  leftIcon={<RotateCcw className="w-5 h-5" />}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sponsor Integrations Component */}
        <SponsorIntegrations />
      </div>
    </div>
  );
};

export default SponsorDemo;
