import { AgentTemplateType, AgentTemplateConfig } from '../factory/AgentTemplateFactory';
import { AgentTemplateFactory } from '../factory/AgentTemplateFactory';

/**
 * Validate template configuration
 */
export function validateTemplateConfig(
  type: AgentTemplateType,
  config: AgentTemplateConfig
): { isValid: boolean; errors: string[] } {
  return AgentTemplateFactory.validateTemplateConfig(type, config);
}

/**
 * Create template from configuration
 */
export function createTemplateFromConfig(
  type: AgentTemplateType,
  config: AgentTemplateConfig
): any {
  const validation = validateTemplateConfig(type, config);
  
  if (!validation.isValid) {
    throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
  }

  return AgentTemplateFactory.createAgentTemplate(type, config);
}

/**
 * Get template capabilities
 */
export function getTemplateCapabilities(type: AgentTemplateType): string[] {
  const templates = AgentTemplateFactory.getAvailableTemplates();
  const template = templates.find(t => t.type === type);
  
  if (!template) {
    throw new Error(`Unknown template type: ${type}`);
  }

  return template.capabilities;
}

/**
 * Get template use cases
 */
export function getTemplateUseCases(type: AgentTemplateType): string[] {
  const templates = AgentTemplateFactory.getAvailableTemplates();
  const template = templates.find(t => t.type === type);
  
  if (!template) {
    throw new Error(`Unknown template type: ${type}`);
  }

  return template.useCases;
}

/**
 * Get template integrations
 */
export function getTemplateIntegrations(type: AgentTemplateType): string[] {
  const templates = AgentTemplateFactory.getAvailableTemplates();
  const template = templates.find(t => t.type === type);
  
  if (!template) {
    throw new Error(`Unknown template type: ${type}`);
  }

  return template.integrations;
}

/**
 * Check if template supports a capability
 */
export function templateSupportsCapability(
  type: AgentTemplateType,
  capability: string
): boolean {
  const capabilities = getTemplateCapabilities(type);
  return capabilities.includes(capability);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): any[] {
  const templates = AgentTemplateFactory.getAvailableTemplates();
  return templates.filter(template => template.category === category);
}

/**
 * Search templates by keyword
 */
export function searchTemplates(keyword: string): any[] {
  const templates = AgentTemplateFactory.getAvailableTemplates();
  const lowerKeyword = keyword.toLowerCase();
  
  return templates.filter(template => 
    template.name.toLowerCase().includes(lowerKeyword) ||
    template.description.toLowerCase().includes(lowerKeyword) ||
    template.capabilities.some((cap: string) => cap.toLowerCase().includes(lowerKeyword)) ||
    template.useCases.some((useCase: string) => useCase.toLowerCase().includes(lowerKeyword))
  );
}

/**
 * Generate template documentation
 */
export function generateTemplateDocumentation(type: AgentTemplateType): string {
  const templates = AgentTemplateFactory.getAvailableTemplates();
  const template = templates.find(t => t.type === type);
  
  if (!template) {
    throw new Error(`Unknown template type: ${type}`);
  }

  const capabilities = template.capabilities.map(cap => `- ${cap}`).join('\n');
  const useCases = template.useCases.map(useCase => `- ${useCase}`).join('\n');
  const integrations = template.integrations.map(integration => `- ${integration}`).join('\n');

  return `# ${template.name}

## Description
${template.description}

## Category
${template.category}

## Capabilities
${capabilities}

## Use Cases
${useCases}

## Integrations
${integrations}

## Configuration Schema
\`\`\`json
${JSON.stringify(AgentTemplateFactory.getTemplateConfigSchema(type), null, 2)}
\`\`\`

## Example Usage
\`\`\`typescript
import { AgentTemplateFactory } from '@agent-labs/agent-templates';

const agent = AgentTemplateFactory.createAgentTemplate('${type}', {
  // Add your configuration here
});
\`\`\`
`;
}

/**
 * Create template comparison
 */
export function compareTemplates(types: AgentTemplateType[]): any {
  const templates = AgentTemplateFactory.getAvailableTemplates();
  const selectedTemplates = templates.filter(t => types.includes(t.type));

  const comparison = {
    templates: selectedTemplates.map(template => ({
      type: template.type,
      name: template.name,
      category: template.category,
      capabilityCount: template.capabilities.length,
      useCaseCount: template.useCases.length,
      integrationCount: template.integrations.length
    })),
    commonCapabilities: findCommonCapabilities(selectedTemplates),
    uniqueCapabilities: findUniqueCapabilities(selectedTemplates),
    categories: [...new Set(selectedTemplates.map(t => t.category))]
  };

  return comparison;
}

/**
 * Find common capabilities across templates
 */
function findCommonCapabilities(templates: any[]): string[] {
  if (templates.length === 0) return [];
  
  const firstTemplateCapabilities = new Set(templates[0].capabilities);
  
  for (let i = 1; i < templates.length; i++) {
    const currentCapabilities = new Set(templates[i].capabilities);
    firstTemplateCapabilities.forEach(capability => {
      if (!currentCapabilities.has(capability)) {
        firstTemplateCapabilities.delete(capability);
      }
    });
  }
  
  return Array.from(firstTemplateCapabilities) as string[];
}

/**
 * Find unique capabilities for each template
 */
function findUniqueCapabilities(templates: any[]): Record<string, string[]> {
  const uniqueCapabilities: Record<string, string[]> = {};
  
  templates.forEach(template => {
    const otherTemplates = templates.filter(t => t.type !== template.type);
    const otherCapabilities = new Set(
      otherTemplates.flatMap(t => t.capabilities)
    );
    
    uniqueCapabilities[template.type] = template.capabilities.filter(
      (capability: string) => !otherCapabilities.has(capability)
    );
  });
  
  return uniqueCapabilities;
}
