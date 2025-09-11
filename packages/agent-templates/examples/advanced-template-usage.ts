import { AgentTemplateFactory } from '../src/factory/AgentTemplateFactory';
import { OrchestrationEngine } from '../src/mock/OrchestrationEngine';
import { 
  getTemplateCapabilities, 
  getTemplateUseCases, 
  generateTemplateDocumentation,
  compareTemplates,
  validateTemplateConfig,
  searchTemplates,
  getTemplatesByCategory
} from '../src/utils/templateUtils';

/**
 * Advanced Agent Templates Demo
 * 
 * This example demonstrates advanced features including:
 * - Error handling and validation
 * - Template search and filtering
 * - Workflow orchestration
 * - Performance monitoring
 * - Custom configurations
 */

async function advancedTemplateUsageExample() {
  console.log('🚀 Advanced Agent Templates Demo\n');

  try {
    // Initialize orchestration engine with error handling
    const engine = new OrchestrationEngine();
    await engine.initialize();
    console.log('✅ Orchestration Engine initialized');

    // 1. Template Search and Discovery
    console.log('\n🔍 Template Discovery:');
    
    // Search for templates by keyword
    const searchResults = searchTemplates('assistant');
    console.log(`   Found ${searchResults.length} templates matching 'assistant':`);
    searchResults.forEach(template => {
      console.log(`     - ${template.name}: ${template.description}`);
    });

    // Get templates by category
    const businessTemplates = getTemplatesByCategory('business');
    console.log(`\n   Business templates: ${businessTemplates.length}`);
    businessTemplates.forEach(template => {
      console.log(`     - ${template.name}`);
    });

    // 2. Configuration Validation
    console.log('\n✅ Configuration Validation:');
    
    // Valid configuration
    const validConfig = {
      calendar: {
        provider: 'google',
        credentials: { apiKey: 'valid-key' }
      },
      email: {
        provider: 'gmail',
        credentials: { apiKey: 'valid-key' }
      }
    };

    const validation = validateTemplateConfig('personal-assistant', validConfig);
    console.log(`   Valid config: ${validation.isValid ? '✅' : '❌'}`);
    if (!validation.isValid) {
      console.log(`   Errors: ${validation.errors.join(', ')}`);
    }

    // Invalid configuration
    const invalidConfig = {
      calendar: {
        provider: 'invalid-provider'
      }
    };

    const invalidValidation = validateTemplateConfig('personal-assistant', invalidConfig);
    console.log(`   Invalid config: ${invalidValidation.isValid ? '✅' : '❌'}`);
    if (!invalidValidation.isValid) {
      console.log(`   Errors: ${invalidValidation.errors.join(', ')}`);
    }

    // 3. Create Agents with Custom Configurations
    console.log('\n🤖 Creating Custom Agents:');
    
    // Personal Assistant with minimal config
    const minimalPA = AgentTemplateFactory.createAgentTemplate('personal-assistant', {
      calendar: { provider: 'local' },
      email: { provider: 'local' }
    });
    engine.registerAgent(minimalPA);
    console.log(`   ✅ Minimal Personal Assistant: ${minimalPA.id}`);

    // Financial Agent with advanced config
    const advancedFinancial = AgentTemplateFactory.createAgentTemplate('financial', {
      marketData: {
        provider: 'yahoo',
        apiKey: 'demo-key',
        realTime: true,
        historical: true
      },
      portfolio: {
        provider: 'local',
        riskTolerance: 'moderate',
        rebalanceFrequency: 'monthly'
      },
      risk: {
        provider: 'internal',
        model: 'advanced',
        stressTest: true
      }
    });
    engine.registerAgent(advancedFinancial);
    console.log(`   ✅ Advanced Financial Agent: ${advancedFinancial.id}`);

    // Healthcare Agent with comprehensive config
    const comprehensiveHealthcare = AgentTemplateFactory.createAgentTemplate('healthcare', {
      patientManagement: {
        provider: 'epic',
        credentials: { apiKey: 'demo-key' },
        features: ['scheduling', 'billing', 'records']
      },
      appointments: {
        provider: 'epic',
        credentials: { apiKey: 'demo-key' },
        autoScheduling: true,
        reminders: true
      },
      medicalRecords: {
        provider: 'epic',
        credentials: { apiKey: 'demo-key' },
        encryption: true,
        auditTrail: true
      },
      analytics: {
        provider: 'internal',
        model: 'health-analytics',
        predictions: true,
        insights: true
      }
    });
    engine.registerAgent(comprehensiveHealthcare);
    console.log(`   ✅ Comprehensive Healthcare Agent: ${comprehensiveHealthcare.id}`);

    // 4. Advanced Capability Analysis
    console.log('\n🔧 Advanced Capability Analysis:');
    
    const allTemplates = AgentTemplateFactory.getAvailableTemplates();
    const capabilityMap = new Map<string, string[]>();
    
    allTemplates.forEach(template => {
      template.capabilities.forEach(capability => {
        if (!capabilityMap.has(capability)) {
          capabilityMap.set(capability, []);
        }
        capabilityMap.get(capability)!.push(template.name);
      });
    });

    console.log('   Capability Distribution:');
    capabilityMap.forEach((templates, capability) => {
      console.log(`     ${capability}: ${templates.join(', ')}`);
    });

    // 5. Performance Monitoring
    console.log('\n📊 Performance Monitoring:');
    
    const startTime = Date.now();
    
    // Simulate some workload
    for (let i = 0; i < 100; i++) {
      const tempAgent = AgentTemplateFactory.createAgentTemplate('personal-assistant', {
        calendar: { provider: 'local' },
        email: { provider: 'local' }
      });
    }
    
    const endTime = Date.now();
    const creationTime = endTime - startTime;
    
    console.log(`   Agent creation time: ${creationTime}ms for 100 agents`);
    console.log(`   Average per agent: ${(creationTime / 100).toFixed(2)}ms`);

    // 6. Workflow Orchestration Demo
    console.log('\n🔄 Workflow Orchestration Demo:');
    
    // Get all registered agents
    const registeredAgents = engine.getAgentRegistry().getAllAgents();
    console.log(`   Registered agents: ${registeredAgents.length}`);
    
    // Simulate a workflow
    console.log('   Simulating multi-agent workflow...');
    
    const workflowSteps = [
      { agent: 'personal-assistant', action: 'schedule_meeting' },
      { agent: 'financial', action: 'analyze_portfolio' },
      { agent: 'healthcare', action: 'check_appointments' }
    ];

    for (const step of workflowSteps) {
      const agent = registeredAgents.find(a => a.type === step.agent);
      if (agent) {
        console.log(`     ✅ ${step.agent}: ${step.action}`);
        // Simulate execution time
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        console.log(`     ❌ ${step.agent}: Agent not found`);
      }
    }

    // 7. Advanced Documentation Generation
    console.log('\n📚 Advanced Documentation:');
    
    allTemplates.forEach(template => {
      const doc = generateTemplateDocumentation(template.type);
      console.log(`   Generated docs for ${template.name}: ${doc.length} characters`);
    });

    // 8. Comprehensive Comparison
    console.log('\n📊 Comprehensive Template Comparison:');
    
    const comprehensiveComparison = compareTemplates(['personal-assistant', 'financial', 'healthcare']);
    
    console.log('   Template Statistics:');
    comprehensiveComparison.templates.forEach(template => {
      console.log(`     ${template.name}:`);
      console.log(`       - Capabilities: ${template.capabilityCount}`);
      console.log(`       - Use Cases: ${template.useCaseCount}`);
      console.log(`       - Integrations: ${template.integrationCount}`);
    });

    console.log(`\n   Common Capabilities (${comprehensiveComparison.commonCapabilities.length}):`);
    comprehensiveComparison.commonCapabilities.forEach(capability => {
      console.log(`     - ${capability}`);
    });

    // 9. Engine Health and Metrics
    console.log('\n🏥 Advanced Engine Health:');
    
    const health = engine.getHealth();
    const metrics = engine.getMetrics();
    
    console.log(`   Overall Status: ${health.status}`);
    console.log(`   Agent Health: ${(health.metrics.agentHealth * 100).toFixed(1)}%`);
    console.log(`   Success Rate: ${(health.metrics.executionSuccessRate * 100).toFixed(1)}%`);
    console.log(`   Error Rate: ${(metrics.performance.errorRate * 100).toFixed(1)}%`);
    console.log(`   Average Execution Time: ${metrics.workflows.averageExecutionTime.toFixed(2)}ms`);

    // 10. Cleanup and Shutdown
    console.log('\n🛑 Shutting down...');
    await engine.shutdown();
    console.log('✅ Shutdown complete');

    console.log('\n🎉 Advanced Agent Templates Demo completed successfully!');
    
    // Final Summary
    console.log('\n📋 Advanced Demo Summary:');
    console.log(`   - Templates discovered: ${allTemplates.length}`);
    console.log(`   - Agents created: ${registeredAgents.length}`);
    console.log(`   - Capabilities analyzed: ${capabilityMap.size}`);
    console.log(`   - Workflows orchestrated: ${workflowSteps.length}`);
    console.log(`   - Documentation generated: ${allTemplates.length} files`);
    console.log(`   - Performance: ${(creationTime / 100).toFixed(2)}ms per agent`);

  } catch (error) {
    console.error('❌ Error in advanced demo:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Error handling wrapper
async function runAdvancedDemo() {
  try {
    await advancedTemplateUsageExample();
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  runAdvancedDemo();
}

export { advancedTemplateUsageExample, runAdvancedDemo };
