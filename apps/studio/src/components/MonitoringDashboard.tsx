/**
 * Monitoring Dashboard Component
 * Real-time monitoring of workflow execution, performance, and compliance
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Database, 
  Globe, 
  MemoryStick, 
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

interface WorkflowMetrics {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  startTime: number;
  endTime?: number;
  duration?: number;
  agents: {
    id: string;
    name: string;
    status: 'running' | 'completed' | 'failed' | 'pending';
    executionTime: number;
    memoryUsage: number;
    cpuUsage: number;
  }[];
  performance: {
    throughput: number;
    errorRate: number;
    averageResponseTime: number;
  };
  compliance: {
    securityScore: number;
    fairnessScore: number;
    auditStatus: 'passed' | 'failed' | 'pending';
  };
}

interface SystemMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  completedWorkflows: number;
  failedWorkflows: number;
  averageExecutionTime: number;
  systemHealth: 'healthy' | 'degraded' | 'unhealthy';
  resourceUsage: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

interface MonitoringDashboardProps {
  workflowId?: string;
  refreshInterval?: number;
  onWorkflowSelect?: (workflowId: string) => void;
}

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
  workflowId,
  refreshInterval = 5000,
  onWorkflowSelect
}) => {
  const [workflows, setWorkflows] = useState<WorkflowMetrics[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(workflowId || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockWorkflows: WorkflowMetrics[] = [
    {
      id: 'wf_001',
      name: 'Knowledge Pipeline - AI Research',
      status: 'running',
      startTime: Date.now() - 120000,
      agents: [
        {
          id: 'source_collector',
          name: 'Source Collector',
          status: 'completed',
          executionTime: 45000,
          memoryUsage: 128,
          cpuUsage: 15
        },
        {
          id: 'research_synthesizer',
          name: 'Research Synthesizer',
          status: 'running',
          executionTime: 75000,
          memoryUsage: 256,
          cpuUsage: 45
        },
        {
          id: 'quality_auditor',
          name: 'Quality Auditor',
          status: 'pending',
          executionTime: 0,
          memoryUsage: 0,
          cpuUsage: 0
        }
      ],
      performance: {
        throughput: 12.5,
        errorRate: 0.02,
        averageResponseTime: 850
      },
      compliance: {
        securityScore: 0.95,
        fairnessScore: 0.88,
        auditStatus: 'passed'
      }
    },
    {
      id: 'wf_002',
      name: 'Finance Pipeline - Loan Application',
      status: 'completed',
      startTime: Date.now() - 300000,
      endTime: Date.now() - 60000,
      duration: 240000,
      agents: [
        {
          id: 'bank_connector',
          name: 'Bank Connector',
          status: 'completed',
          executionTime: 30000,
          memoryUsage: 64,
          cpuUsage: 10
        },
        {
          id: 'risk_scorer',
          name: 'Risk Scorer',
          status: 'completed',
          executionTime: 15000,
          memoryUsage: 128,
          cpuUsage: 25
        },
        {
          id: 'fairness_auditor',
          name: 'Fairness Auditor',
          status: 'completed',
          executionTime: 20000,
          memoryUsage: 96,
          cpuUsage: 20
        }
      ],
      performance: {
        throughput: 8.2,
        errorRate: 0.0,
        averageResponseTime: 650
      },
      compliance: {
        securityScore: 0.98,
        fairnessScore: 0.92,
        auditStatus: 'passed'
      }
    },
    {
      id: 'wf_003',
      name: 'Developer Tools - PR Review',
      status: 'failed',
      startTime: Date.now() - 180000,
      endTime: Date.now() - 30000,
      duration: 150000,
      agents: [
        {
          id: 'github_connector',
          name: 'GitHub Connector',
          status: 'completed',
          executionTime: 10000,
          memoryUsage: 32,
          cpuUsage: 5
        },
        {
          id: 'static_analyzer',
          name: 'Static Analyzer',
          status: 'failed',
          executionTime: 45000,
          memoryUsage: 512,
          cpuUsage: 80
        }
      ],
      performance: {
        throughput: 0,
        errorRate: 1.0,
        averageResponseTime: 0
      },
      compliance: {
        securityScore: 0.75,
        fairnessScore: 0.0,
        auditStatus: 'failed'
      }
    }
  ];

  const mockSystemMetrics: SystemMetrics = {
    totalWorkflows: 156,
    activeWorkflows: 3,
    completedWorkflows: 142,
    failedWorkflows: 11,
    averageExecutionTime: 180000,
    systemHealth: 'healthy',
    resourceUsage: {
      cpu: 45,
      memory: 68,
      disk: 23,
      network: 12
    }
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setWorkflows(mockWorkflows);
      setSystemMetrics(mockSystemMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load monitoring data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    
    const interval = setInterval(loadData, refreshInterval);
    return () => clearInterval(interval);
  }, [loadData, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'running':
        return <Activity className="w-4 h-4" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">Error loading monitoring data: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      {systemMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.activeWorkflows}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.completedWorkflows}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.failedWorkflows}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Execution</p>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(systemMetrics.averageExecutionTime)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resource Usage */}
      {systemMetrics && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <Cpu className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>CPU</span>
                  <span>{systemMetrics.resourceUsage.cpu}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${systemMetrics.resourceUsage.cpu}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MemoryStick className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Memory</span>
                  <span>{systemMetrics.resourceUsage.memory}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${systemMetrics.resourceUsage.memory}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Disk</span>
                  <span>{systemMetrics.resourceUsage.disk}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${systemMetrics.resourceUsage.disk}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Network</span>
                  <span>{systemMetrics.resourceUsage.network}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${systemMetrics.resourceUsage.network}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Workflow Executions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {workflows.map((workflow) => (
            <div 
              key={workflow.id}
              className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedWorkflow === workflow.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => {
                setSelectedWorkflow(workflow.id);
                onWorkflowSelect?.(workflow.id);
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(workflow.status)}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{workflow.name}</h4>
                    <p className="text-sm text-gray-500">ID: {workflow.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
                    {workflow.status}
                  </span>
                  {workflow.duration && (
                    <span className="text-sm text-gray-500">
                      {formatDuration(workflow.duration)}
                    </span>
                  )}
                </div>
              </div>

              {/* Agent Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {workflow.agents.map((agent) => (
                  <div key={agent.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Time: {formatDuration(agent.executionTime)}</div>
                      <div>Memory: {formatBytes(agent.memoryUsage * 1024 * 1024)}</div>
                      <div>CPU: {agent.cpuUsage}%</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-gray-900">Throughput</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">{workflow.performance.throughput.toFixed(1)} req/s</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
                    <span className="text-sm font-medium text-gray-900">Error Rate</span>
                  </div>
                  <p className="text-lg font-bold text-red-600">{(workflow.performance.errorRate * 100).toFixed(1)}%</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-sm font-medium text-gray-900">Avg Response</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{workflow.performance.averageResponseTime}ms</p>
                </div>
              </div>

              {/* Compliance Status */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Security Score</p>
                      <p className="text-sm font-bold text-green-600">{(workflow.compliance.securityScore * 100).toFixed(0)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Fairness Score</p>
                      <p className="text-sm font-bold text-blue-600">{(workflow.compliance.fairnessScore * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    workflow.compliance.auditStatus === 'passed' 
                      ? 'text-green-600 bg-green-100' 
                      : workflow.compliance.auditStatus === 'failed'
                      ? 'text-red-600 bg-red-100'
                      : 'text-yellow-600 bg-yellow-100'
                  }`}>
                    Audit: {workflow.compliance.auditStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
