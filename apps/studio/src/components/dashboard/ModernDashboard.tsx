/**
 * Modern Dashboard Component
 * Beautiful dashboard with data visualization and modern cards
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Zap, 
  Shield, 
  Database, 
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  Square,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  description?: string;
}

export interface WorkflowStatus {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'error' | 'pending';
  progress: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  agents: string[];
}

export interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  cpu: number;
  memory: number;
  requests: number;
  lastActivity: Date;
}

export interface ModernDashboardProps {
  className?: string;
}

export const ModernDashboard: React.FC<ModernDashboardProps> = ({
  className = '',
}) => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data
  const metrics: DashboardMetric[] = [
    {
      id: '1',
      title: 'Active Workflows',
      value: 12,
      change: 15.3,
      changeType: 'increase',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-blue-600',
      description: 'Currently running workflows',
    },
    {
      id: '2',
      title: 'Total Agents',
      value: 48,
      change: 8.2,
      changeType: 'increase',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-purple-600',
      description: 'Registered agents in the system',
    },
    {
      id: '3',
      title: 'Success Rate',
      value: '98.5%',
      change: 2.1,
      changeType: 'increase',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-600',
      description: 'Workflow completion rate',
    },
    {
      id: '4',
      title: 'Avg Response Time',
      value: '245ms',
      change: 12.5,
      changeType: 'decrease',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-orange-600',
      description: 'Average agent response time',
    },
    {
      id: '5',
      title: 'Data Processed',
      value: '2.4TB',
      change: 23.8,
      changeType: 'increase',
      icon: <Database className="w-5 h-5" />,
      color: 'text-indigo-600',
      description: 'Data processed in the last 24h',
    },
    {
      id: '6',
      title: 'Security Scans',
      value: 156,
      change: 5.2,
      changeType: 'increase',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-red-600',
      description: 'Security scans completed',
    },
  ];

  const workflows: WorkflowStatus[] = [
    {
      id: '1',
      name: 'Knowledge Pipeline',
      status: 'running',
      progress: 75,
      startTime: new Date(Date.now() - 300000),
      agents: ['GPT-4 Agent', 'Data Processor', 'Security Scanner'],
    },
    {
      id: '2',
      name: 'Finance Pipeline',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 600000),
      endTime: new Date(Date.now() - 120000),
      duration: 480,
      agents: ['Data Processor', 'Risk Analyzer', 'Compliance Checker'],
    },
    {
      id: '3',
      name: 'Healthcare Pipeline',
      status: 'error',
      progress: 45,
      startTime: new Date(Date.now() - 180000),
      agents: ['Patient Monitor', 'Alert System', 'Care Coordinator'],
    },
    {
      id: '4',
      name: 'Developer Tools',
      status: 'pending',
      progress: 0,
      startTime: new Date(Date.now() + 300000),
      agents: ['Code Reviewer', 'Test Runner', 'Deployment Agent'],
    },
  ];

  const agents: AgentStatus[] = [
    {
      id: '1',
      name: 'GPT-4 Agent',
      status: 'active',
      cpu: 45,
      memory: 128,
      requests: 1250,
      lastActivity: new Date(Date.now() - 30000),
    },
    {
      id: '2',
      name: 'Data Processor',
      status: 'active',
      cpu: 32,
      memory: 96,
      requests: 890,
      lastActivity: new Date(Date.now() - 15000),
    },
    {
      id: '3',
      name: 'Security Scanner',
      status: 'active',
      cpu: 28,
      memory: 64,
      requests: 650,
      lastActivity: new Date(Date.now() - 45000),
    },
    {
      id: '4',
      name: 'API Integrator',
      status: 'inactive',
      cpu: 0,
      memory: 32,
      requests: 320,
      lastActivity: new Date(Date.now() - 300000),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'pending':
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'active':
        return <Activity className="w-4 h-4" />;
      case 'inactive':
        return <Pause className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor your Agent OS performance and workflows</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Time Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => {/* Refresh data */}}
          >
            Refresh
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card variant="elevated" hover className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}>
                  {metric.icon}
                </div>
                <div className="flex items-center gap-1">
                  {getChangeIcon(metric.changeType)}
                  <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
              
              <div className="mb-1">
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm text-gray-600">{metric.title}</p>
              </div>
              
              {metric.description && (
                <p className="text-xs text-gray-500">{metric.description}</p>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflows */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Active Workflows</CardTitle>
            <CardDescription>Monitor running and recent workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(workflow.status)}
                      <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{workflow.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          workflow.status === 'running' ? 'bg-blue-500' :
                          workflow.status === 'completed' ? 'bg-green-500' :
                          workflow.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{workflow.agents.length} agents</span>
                    <span>
                      Started: {workflow.startTime.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" fullWidth>
              View All Workflows
            </Button>
          </CardFooter>
        </Card>

        {/* Agents */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
            <CardDescription>Monitor agent performance and health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(agent.status)}
                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">CPU</div>
                      <div className="text-sm font-medium">{agent.cpu}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Memory</div>
                      <div className="text-sm font-medium">{agent.memory}MB</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Requests</div>
                      <div className="text-sm font-medium">{agent.requests}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Last activity: {agent.lastActivity.toLocaleTimeString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" fullWidth>
              View All Agents
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Workflow execution over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Performance chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Agent Distribution</CardTitle>
            <CardDescription>Agent usage by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Distribution chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernDashboard;
