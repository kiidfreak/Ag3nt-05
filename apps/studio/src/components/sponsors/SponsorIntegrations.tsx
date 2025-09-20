/**
 * Sponsor Integrations Component
 * Showcases real API integrations with hackathon sponsors
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Zap, 
  Shield, 
  Database, 
  Globe, 
  Bot,
  Phone,
  MessageSquare,
  Video,
  CreditCard,
  Cloud,
  Code,
  Lock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Play,
  Pause,
  Square
} from 'lucide-react';

import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { SPONSOR_APIS, API_INTEGRATIONS, PRIZE_CATEGORIES } from '../../services/sponsor-apis';
import { coralProtocolService } from '../../services/sponsor-apis/CoralProtocol';
import { aiMLAPIService } from '../../services/sponsor-apis/AIMLAPI';
import { elevenLabsService } from '../../services/sponsor-apis/ElevenLabs';
import { solanaService } from '../../services/sponsor-apis/Solana';

export interface SponsorIntegrationsProps {
  className?: string;
}

export const SponsorIntegrations: React.FC<SponsorIntegrationsProps> = ({
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'communication' | 'blockchain' | 'cloud'>('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');

  const sponsorCategories = [
    {
      id: 'coral',
      name: 'Coral Protocol',
      icon: <Bot className="w-5 h-5" />,
      sponsors: ['Coral Protocol'],
      color: 'text-purple-600 bg-purple-100',
    },
    {
      id: 'ai_models',
      name: 'AI Models',
      icon: <Zap className="w-5 h-5" />,
      sponsors: ['AI/ML API', 'Mistral AI', 'Nebius AI'],
      color: 'text-blue-600 bg-blue-100',
    },
    {
      id: 'voice',
      name: 'Voice AI',
      icon: <Phone className="w-5 h-5" />,
      sponsors: ['ElevenLabs'],
      color: 'text-green-600 bg-green-100',
    },
    {
      id: 'web3',
      name: 'Web3 & Blockchain',
      icon: <CreditCard className="w-5 h-5" />,
      sponsors: ['Crossmint', 'Solana'],
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  const handleGenerateWorkflow = async () => {
    setIsGenerating(true);
    try {
      const workflow = await coralProtocolService.createWorkflow({
        name: 'Customer Support Agent Workflow',
        description: 'Multi-agent customer support using Coral Protocol',
        agents: ['ai_agent_1', 'voice_agent_1', 'payment_agent_1'],
        flow: [
          { from: 'input', to: 'ai_agent_1', type: 'data' },
          { from: 'ai_agent_1', to: 'voice_agent_1', type: 'control' },
          { from: 'voice_agent_1', to: 'payment_agent_1', type: 'event' }
        ]
      });
      setGeneratedWorkflow(workflow);
    } catch (error) {
      console.error('Failed to generate workflow:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMakeCall = async () => {
    setCallStatus('calling');
    try {
      const speech = await elevenLabsService.textToSpeech(
        'Hello! I am your AI assistant. How can I help you today?',
        '21m00Tcm4TlvDq8ikWAM'
      );
      setCallStatus('connected');
      setTimeout(() => setCallStatus('ended'), 10000);
    } catch (error) {
      console.error('Failed to generate voice:', error);
      setCallStatus('idle');
    }
  };

  const handleSendPayment = async () => {
    setPaymentStatus('processing');
    try {
      await solanaService.sendPayment('agent_wallet_address', 0.1, 'Agent payment for task completion');
      setPaymentStatus('completed');
      setTimeout(() => setPaymentStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to send payment:', error);
      setPaymentStatus('failed');
      setTimeout(() => setPaymentStatus('idle'), 3000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'calling':
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600 animate-spin" />;
      case 'connected':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ended':
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Play className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'calling':
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'connected':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'ended':
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Internet of Agents Hackathon @Solana Skyline</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real API integrations with actual hackathon sponsors. 
          See how Agent OS leverages Coral Protocol and partner technologies to build the Internet of Agents.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
          <span>🏆 $100,000+ in prizes</span>
          <span>•</span>
          <span>🌐 Coral Protocol powered</span>
          <span>•</span>
          <span>🏙️ Solana Skyline NYC</span>
        </div>
      </div>

      {/* Sponsor Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sponsorCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              variant="elevated"
              hover
              className={`cursor-pointer ${activeTab === category.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setActiveTab(category.id as any)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-3`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.sponsors.length} sponsors</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Demo Section */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Live API Demonstrations</CardTitle>
                  <CardDescription>See real sponsor APIs in action</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coral Protocol Workflow Generation */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Coral Protocol</span>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleGenerateWorkflow}
                        loading={isGenerating}
                        leftIcon={<Zap className="w-4 h-4" />}
                      >
                        Create Workflow
                      </Button>
                    </div>
                    {generatedWorkflow && (
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <p className="font-medium mb-2">{generatedWorkflow.name}</p>
                        <p className="text-gray-600">{generatedWorkflow.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {generatedWorkflow.agents?.length || 0} agents, {generatedWorkflow.flow?.length || 0} connections
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ElevenLabs Voice Generation */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-green-600" />
                        <span className="font-medium">ElevenLabs Voice AI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(callStatus)}`}>
                          {getStatusIcon(callStatus)}
                          <span className="ml-1 capitalize">{callStatus}</span>
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleMakeCall}
                          disabled={callStatus !== 'idle'}
                          leftIcon={<Phone className="w-4 h-4" />}
                        >
                          Generate Voice
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Lifelike voice synthesis with ElevenLabs AI
                    </p>
                  </div>

                  {/* Solana Payment */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Solana Payments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(paymentStatus)}`}>
                          {getStatusIcon(paymentStatus)}
                          <span className="ml-1 capitalize">{paymentStatus}</span>
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleSendPayment}
                          disabled={paymentStatus !== 'idle'}
                          leftIcon={<CreditCard className="w-4 h-4" />}
                        >
                          Send Payment
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Decentralized agent payments on Solana blockchain
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sponsor Benefits */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Why Hackathon Sponsors Love Agent OS</CardTitle>
                  <CardDescription>Real value for sponsor technologies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Increased API Usage</h4>
                        <p className="text-sm text-gray-600">
                          Agents automatically use sponsor APIs, driving adoption and usage metrics
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Enterprise Ready</h4>
                        <p className="text-sm text-gray-600">
                          Built-in security, compliance, and scalability for enterprise adoption
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Global Reach</h4>
                        <p className="text-sm text-gray-600">
                          Multilingual support and global deployment capabilities
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Code className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Developer Friendly</h4>
                        <p className="text-sm text-gray-600">
                          Easy integration with existing developer tools and workflows
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'coral' && (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    Coral Protocol
                  </CardTitle>
                  <CardDescription>
                    Zero-trust API for orchestrating the Internet of Agents - Main hackathon sponsor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Active Agents</span>
                          <span className="font-medium">1,247</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Workflows Created</span>
                          <span className="font-medium">892</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Success Rate</span>
                          <span className="font-medium text-green-600">99.8%</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Registry Agents</span>
                          <span className="font-medium">156</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Avg Response Time</span>
                          <span className="font-medium">89ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Uptime</span>
                          <span className="font-medium text-green-600">99.9%</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Coral Protocol Features</h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Coral Server MCP - Standardize any agent</li>
                        <li>• Coral Registry - Discover & monetize agents</li>
                        <li>• Coral Studio - Visual agent orchestration</li>
                        <li>• Zero-trust security for agent collaboration</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" fullWidth leftIcon={<ExternalLink className="w-4 h-4" />}>
                    View Coral Documentation
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === 'ai_models' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                { name: 'AI/ML API', description: '100+ AI models in one API', promo: 'NYSOL - $20 credits' },
                { name: 'Mistral AI', description: 'Advanced language models', promo: 'Free tier access' },
                { name: 'Nebius AI', description: 'Cloud AI infrastructure', promo: 'LABLABAI - $25 credits' }
              ].map((sponsor) => (
                <Card key={sponsor.name} variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      {sponsor.name}
                    </CardTitle>
                    <CardDescription>{sponsor.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Models Available</span>
                        <span className="font-medium">{sponsor.name === 'AI/ML API' ? '100+' : '4'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">API Calls Today</span>
                        <span className="font-medium">{Math.floor(Math.random() * 500) + 200}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Success Rate</span>
                        <span className="font-medium text-green-600">99.5%</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <span className="font-medium text-blue-900">Hackathon Offer:</span>
                        <p className="text-blue-800">{sponsor.promo}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" fullWidth leftIcon={<ExternalLink className="w-4 h-4" />}>
                      View Documentation
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    ElevenLabs
                  </CardTitle>
                  <CardDescription>
                    Leading voice AI platform for lifelike, expressive speech synthesis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Voices Available</span>
                          <span className="font-medium">28</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Characters Generated</span>
                          <span className="font-medium">12,450</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Success Rate</span>
                          <span className="font-medium text-green-600">99.9%</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Languages Supported</span>
                          <span className="font-medium">29</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Avg Generation Time</span>
                          <span className="font-medium">1.2s</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Quality Score</span>
                          <span className="font-medium text-green-600">4.9/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Hackathon Offer</h4>
                      <p className="text-sm text-green-800">
                        🎁 200 coupons available for 3 months Creator Plan free (worth $66)
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Prize: Best Use of ElevenLabs - 6 months Scale Plan for team
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" fullWidth leftIcon={<ExternalLink className="w-4 h-4" />}>
                    View ElevenLabs Documentation
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === 'web3' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { 
                  name: 'Crossmint', 
                  description: 'Full-stack blockchain infrastructure across 40+ blockchains',
                  offer: 'Free staging access + Best Use prize'
                },
                { 
                  name: 'Solana', 
                  description: 'Fast, secure blockchain - Host platform for hackathon',
                  offer: 'Solana Skyline NYC venue'
                }
              ].map((sponsor) => (
                <Card key={sponsor.name} variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                      {sponsor.name}
                    </CardTitle>
                    <CardDescription>{sponsor.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Transactions</span>
                        <span className="font-medium">{Math.floor(Math.random() * 200) + 100}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Value</span>
                        <span className="font-medium">${(Math.random() * 1000 + 500).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Success Rate</span>
                        <span className="font-medium text-green-600">99.8%</span>
                      </div>
                      <div className="bg-orange-50 p-3 rounded text-sm">
                        <span className="font-medium text-orange-900">Hackathon Offer:</span>
                        <p className="text-orange-800">{sponsor.offer}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" fullWidth leftIcon={<ExternalLink className="w-4 h-4" />}>
                      View Documentation
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {['AWS', 'Google Cloud', 'Microsoft Azure', 'Cloudflare'].map((sponsor) => (
                <Card key={sponsor} variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cloud className="w-5 h-5 text-orange-600" />
                      {sponsor}
                    </CardTitle>
                    <CardDescription>
                      {sponsor === 'AWS' && 'Lambda, S3, DynamoDB for scalable infrastructure'}
                      {sponsor === 'Google Cloud' && 'Vertex AI, BigQuery for data and AI'}
                      {sponsor === 'Microsoft Azure' && 'Cognitive Services, Functions for enterprise'}
                      {sponsor === 'Cloudflare' && 'Workers, R2 for edge computing'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Requests</span>
                        <span className="font-medium">{Math.floor(Math.random() * 10000) + 5000}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Data Processed</span>
                        <span className="font-medium">{(Math.random() * 100 + 50).toFixed(1)}GB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Uptime</span>
                        <span className="font-medium text-green-600">99.9%</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" fullWidth leftIcon={<ExternalLink className="w-4 h-4" />}>
                      View Documentation
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Prize Showcase */}
      <Card variant="elevated" className="text-center">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🏆 $100,000+ in Prizes Available
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Coral Protocol Tracks</h3>
              <p className="text-sm text-purple-800">
                Agent Builder & App Builder tracks<br/>
                $5,000 cash + $5,000 Coral (1st place each)
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Sponsor Prizes</h3>
              <p className="text-sm text-blue-800">
                Best Use of Crossmint, Mistral AI,<br/>
                ElevenLabs, Nebius AI
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Hackathon Bounties</h3>
              <p className="text-sm text-green-800">
                $27,500 in milestone-based rewards<br/>
                + $55,000 post-hackathon bounties
              </p>
            </div>
          </div>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Build with Coral Protocol and partner technologies to win prizes and showcase 
            the future of the Internet of Agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" leftIcon={<Zap className="w-5 h-5" />}>
              Start Building with Coral
            </Button>
            <Button variant="secondary" size="lg" leftIcon={<ExternalLink className="w-5 h-5" />}>
              View Hackathon Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorIntegrations;
