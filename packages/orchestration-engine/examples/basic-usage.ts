import { OrchestrationEngine } from '../src/core/OrchestrationEngine';
import { createAgent, createWorkflow, createAgentTaskNode, createWorkflowEdge } from '../src/utils/factories';
import { AgentCapability } from '../src/types/Agent';
import { ComplexityLevel } from '../src/types/Workflow';

async function basicUsageExample() {
  console.log('🚀 Starting Agent Labs Orchestration Engine Demo\n');

  // Initialize the orchestration engine
  const engine = new OrchestrationEngine();
  await engine.initialize();

  console.log('✅ Orchestration Engine initialized');

  // Create some sample agents
  const personalAssistantAgent = createAgent(
    'Personal Assistant',
    'assistant',
    [
      {
        name: 'schedule_meeting',
        description: 'Schedule a meeting in the calendar',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            date: { type: 'string' },
            duration: { type: 'number' }
          },
          required: ['title', 'date']
        },
        outputSchema: {
          type: 'object',
          properties: {
            meetingId: { type: 'string' },
            status: { type: 'string' }
          }
        },
        required: true
      },
      {
        name: 'send_email',
        description: 'Send an email notification',
        inputSchema: {
          type: 'object',
          properties: {
            to: { type: 'string' },
            subject: { type: 'string' },
            body: { type: 'string' }
          },
          required: ['to', 'subject', 'body']
        },
        outputSchema: {
          type: 'object',
          properties: {
            messageId: { type: 'string' },
            status: { type: 'string' }
          }
        },
        required: true
      }
    ],
    {
      author: 'Agent Labs',
      description: 'A personal assistant agent for managing schedules and communications',
      tags: ['assistant', 'productivity', 'calendar'],
      category: 'productivity'
    }
  );

  const emailAgent = createAgent(
    'Email Agent',
    'email',
    [
      {
        name: 'send_notification',
        description: 'Send email notifications',
        inputSchema: {
          type: 'object',
          properties: {
            recipient: { type: 'string' },
            message: { type: 'string' }
          },
          required: ['recipient', 'message']
        },
        outputSchema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            messageId: { type: 'string' }
          }
        },
        required: true
      }
    ],
    {
      author: 'Agent Labs',
      description: 'An email agent for sending notifications',
      tags: ['email', 'communication', 'notification'],
      category: 'communication'
    }
  );

  // Register agents
  engine.registerAgent(personalAssistantAgent);
  engine.registerAgent(emailAgent);

  console.log('✅ Agents registered:');
  console.log(`   - ${personalAssistantAgent.name} (${personalAssistantAgent.id})`);
  console.log(`   - ${emailAgent.name} (${emailAgent.id})`);

  // Create a workflow
  const workflow = createWorkflow(
    'Meeting Scheduler Workflow',
    'Automatically schedule a meeting and send confirmation emails',
    {
      author: 'Agent Labs',
      tags: ['meeting', 'automation', 'productivity'],
      category: 'productivity',
      complexity: ComplexityLevel.SIMPLE
    }
  );

  // Add nodes to the workflow
  const scheduleNode = createAgentTaskNode(
    'Schedule Meeting',
    personalAssistantAgent.id,
    'schedule_meeting',
    { x: 100, y: 100 },
    {
      title: '{{meetingTitle}}',
      date: '{{meetingDate}}',
      duration: 60
    }
  );

  const emailNode = createAgentTaskNode(
    'Send Confirmation',
    emailAgent.id,
    'send_notification',
    { x: 400, y: 100 },
    {
      recipient: '{{attendeeEmail}}',
      message: 'Your meeting has been scheduled for {{meetingDate}}'
    }
  );

  workflow.nodes.push(scheduleNode, emailNode);

  // Add edge to connect the nodes
  const edge = createWorkflowEdge(scheduleNode.id, emailNode.id);
  workflow.edges.push(edge);

  console.log('✅ Workflow created:');
  console.log(`   - Name: ${workflow.name}`);
  console.log(`   - Nodes: ${workflow.nodes.length}`);
  console.log(`   - Edges: ${workflow.edges.length}`);

  // Execute the workflow
  console.log('\n🎯 Executing workflow...');
  
  const execution = await engine.executeWorkflow(workflow, {
    meetingTitle: 'Project Planning Session',
    meetingDate: '2025-09-15T10:00:00Z',
    attendeeEmail: 'team@example.com'
  });

  console.log('✅ Workflow execution completed:');
  console.log(`   - Execution ID: ${execution.id}`);
  console.log(`   - Status: ${execution.status}`);
  console.log(`   - Duration: ${execution.duration}ms`);
  console.log(`   - Results: ${Object.keys(execution.results).length} nodes completed`);

  // Get engine statistics
  const stats = engine.getStatus();
  console.log('\n📊 Engine Statistics:');
  console.log(`   - Running: ${stats.isRunning}`);
  console.log(`   - Agents: ${stats.agentCount} (${stats.activeAgentCount} active)`);
  console.log(`   - Executions: ${stats.executionCount} (${stats.runningExecutionCount} running)`);

  // Get health status
  const health = engine.getHealth();
  console.log('\n🏥 Engine Health:');
  console.log(`   - Status: ${health.status}`);
  console.log(`   - Agent Health: ${(health.metrics.agentHealth * 100).toFixed(1)}%`);
  console.log(`   - Success Rate: ${(health.metrics.executionSuccessRate * 100).toFixed(1)}%`);

  // Get metrics
  const metrics = engine.getMetrics();
  console.log('\n📈 Detailed Metrics:');
  console.log(`   - Agents by Category:`, metrics.agents.byCategory);
  console.log(`   - Average Execution Time: ${metrics.workflows.averageExecutionTime.toFixed(2)}ms`);
  console.log(`   - Error Rate: ${(metrics.performance.errorRate * 100).toFixed(1)}%`);

  // Shutdown
  await engine.shutdown();
  console.log('\n🛑 Orchestration Engine shutdown complete');
}

// Run the example
if (require.main === module) {
  basicUsageExample().catch(console.error);
}

export { basicUsageExample };
