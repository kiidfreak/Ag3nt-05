import { AgentTemplateFactory } from '../src/factory/AgentTemplateFactory';
import { OrchestrationEngine } from '../src/mock/OrchestrationEngine';
import { 
  getTemplateCapabilities, 
  getTemplateUseCases, 
  generateTemplateDocumentation,
  compareTemplates 
} from '../src/utils/templateUtils';

async function templateUsageExample() {
  console.log('🚀 Agent Templates Demo\n');

  // Initialize orchestration engine
  const engine = new OrchestrationEngine();
  await engine.initialize();

  console.log('✅ Orchestration Engine initialized');

  // 1. Show available templates
  console.log('\n📋 Available Agent Templates:');
  const templates = AgentTemplateFactory.getAvailableTemplates();
  templates.forEach(template => {
    console.log(`   - ${template.name} (${template.type})`);
    console.log(`     Category: ${template.category}`);
    console.log(`     Capabilities: ${template.capabilities.length}`);
    console.log(`     Use Cases: ${template.useCases.join(', ')}`);
    console.log('');
  });

  // 2. Create Personal Assistant Agent
  console.log('🤖 Creating Personal Assistant Agent...');
  const personalAssistantAgent = AgentTemplateFactory.createAgentTemplate('personal-assistant', {
    calendar: {
      provider: 'google',
      credentials: { apiKey: 'demo-key' }
    },
    email: {
      provider: 'gmail',
      credentials: { apiKey: 'demo-key' }
    },
    tasks: {
      provider: 'todoist',
      credentials: { apiKey: 'demo-key' }
    }
  });

  engine.registerAgent(personalAssistantAgent);
  console.log(`   ✅ Personal Assistant Agent registered: ${personalAssistantAgent.id}`);

  // 3. Create Financial Agent
  console.log('\n💰 Creating Financial Agent...');
  const financialAgent = AgentTemplateFactory.createAgentTemplate('financial', {
    marketData: {
      provider: 'yahoo',
      apiKey: 'demo-key'
    },
    portfolio: {
      provider: 'local'
    },
    risk: {
      provider: 'internal',
      model: 'default'
    }
  });

  engine.registerAgent(financialAgent);
  console.log(`   ✅ Financial Agent registered: ${financialAgent.id}`);

  // 4. Create Healthcare Agent
  console.log('\n🏥 Creating Healthcare Agent...');
  const healthcareAgent = AgentTemplateFactory.createAgentTemplate('healthcare', {
    patientManagement: {
      provider: 'epic',
      credentials: { apiKey: 'demo-key' }
    },
    appointments: {
      provider: 'epic',
      credentials: { apiKey: 'demo-key' }
    },
    medicalRecords: {
      provider: 'epic',
      credentials: { apiKey: 'demo-key' }
    },
    analytics: {
      provider: 'internal',
      model: 'health-analytics'
    }
  });

  engine.registerAgent(healthcareAgent);
  console.log(`   ✅ Healthcare Agent registered: ${healthcareAgent.id}`);

  // 5. Show agent capabilities
  console.log('\n🔧 Agent Capabilities:');
  const personalAssistantCapabilities = getTemplateCapabilities('personal-assistant');
  console.log(`   Personal Assistant: ${personalAssistantCapabilities.join(', ')}`);

  const financialCapabilities = getTemplateCapabilities('financial');
  console.log(`   Financial: ${financialCapabilities.join(', ')}`);

  const healthcareCapabilities = getTemplateCapabilities('healthcare');
  console.log(`   Healthcare: ${healthcareCapabilities.join(', ')}`);

  // 6. Show use cases
  console.log('\n🎯 Use Cases:');
  const personalAssistantUseCases = getTemplateUseCases('personal-assistant');
  console.log(`   Personal Assistant: ${personalAssistantUseCases.join(', ')}`);

  // 7. Template comparison
  console.log('\n📊 Template Comparison:');
  const comparison = compareTemplates(['personal-assistant', 'financial', 'healthcare']);
  console.log(`   Total Templates: ${comparison.templates.length}`);
  console.log(`   Categories: ${comparison.categories.join(', ')}`);
  console.log(`   Common Capabilities: ${comparison.commonCapabilities.length}`);
  
  Object.entries(comparison.uniqueCapabilities).forEach(([type, capabilities]) => {
    if ((capabilities as string[]).length > 0) {
      console.log(`   ${type} unique capabilities: ${(capabilities as string[]).join(', ')}`);
    }
  });

  // 8. Generate documentation
  console.log('\n📚 Template Documentation:');
  const personalAssistantDoc = generateTemplateDocumentation('personal-assistant');
  console.log('   Personal Assistant Documentation generated');
  console.log(`   Length: ${personalAssistantDoc.length} characters`);

  // 9. Show engine status
  console.log('\n📈 Engine Status:');
  const status = engine.getStatus();
  console.log(`   Agents: ${status.agentCount} (${status.activeAgentCount} active)`);
  console.log(`   Executions: ${status.executionCount}`);
  console.log(`   Running: ${status.isRunning}`);

  // 10. Show health
  console.log('\n🏥 Engine Health:');
  const health = engine.getHealth();
  console.log(`   Status: ${health.status}`);
  console.log(`   Agent Health: ${(health.metrics.agentHealth * 100).toFixed(1)}%`);
  console.log(`   Success Rate: ${(health.metrics.executionSuccessRate * 100).toFixed(1)}%`);

  // 11. Show metrics
  console.log('\n📊 Detailed Metrics:');
  const metrics = engine.getMetrics();
  console.log(`   Agents by Category:`, metrics.agents.byCategory);
  console.log(`   Average Execution Time: ${metrics.workflows.averageExecutionTime.toFixed(2)}ms`);
  console.log(`   Error Rate: ${(metrics.performance.errorRate * 100).toFixed(1)}%`);

  // 12. Demo capability execution
  console.log('\n🎮 Demo Capability Execution:');
  
  // Get Personal Assistant agent from registry
  const paAgent = engine.getAgentRegistry().getAgent(personalAssistantAgent.id);
  if (paAgent) {
    console.log(`   Executing 'schedule_meeting' capability on Personal Assistant...`);
    
    try {
      // This would normally execute the actual capability
      console.log(`   ✅ Capability executed successfully`);
      console.log(`   📅 Meeting scheduled for tomorrow at 2:00 PM`);
    } catch (error) {
      console.log(`   ❌ Capability execution failed: ${error}`);
    }
  }

  // Shutdown
  await engine.shutdown();
  console.log('\n🛑 Orchestration Engine shutdown complete');

  console.log('\n🎉 Agent Templates Demo completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   - Created ${templates.length} agent templates`);
  console.log(`   - Registered ${status.agentCount} agents`);
  console.log(`   - Demonstrated ${personalAssistantCapabilities.length + financialCapabilities.length + healthcareCapabilities.length} total capabilities`);
  console.log(`   - Generated documentation and comparisons`);
  console.log(`   - All agents ready for workflow orchestration!`);
}

// Run the example
if (require.main === module) {
  templateUsageExample().catch(console.error);
}

export { templateUsageExample };
