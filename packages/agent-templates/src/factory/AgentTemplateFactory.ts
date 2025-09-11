import { PersonalAssistantAgent, PersonalAssistantConfig } from '../templates/PersonalAssistantAgent';
import { FinancialAgent, FinancialAgentConfig } from '../templates/FinancialAgent';
import { HealthcareAgent, HealthcareAgentConfig } from '../templates/HealthcareAgent';



import { Agent } from '../types/Agent';

/**
 * Agent Template Factory
 * 
 * Factory class for creating agent templates based on configuration
 */
export class AgentTemplateFactory {
  /**
   * Create an agent template by type
   */
  static createAgentTemplate(
    type: AgentTemplateType,
    config: AgentTemplateConfig
  ): Agent {
    switch (type) {
      case 'personal-assistant':
        return this.createPersonalAssistantAgent(config as PersonalAssistantConfig);
      case 'financial':
        return this.createFinancialAgent(config as FinancialAgentConfig);
      case 'healthcare':
        return this.createHealthcareAgent(config as HealthcareAgentConfig);
      default:
        throw new Error(`Unknown agent template type: ${type}`);
    }
  }

  /**
   * Create Personal Assistant Agent
   */
  private static createPersonalAssistantAgent(config: PersonalAssistantConfig): Agent {
    const agent = new PersonalAssistantAgent(config);
    return agent.getAgent();
  }

  /**
   * Create Financial Agent
   */
  private static createFinancialAgent(config: FinancialAgentConfig): Agent {
    const agent = new FinancialAgent(config);
    return agent.getAgent();
  }

  /**
   * Create Healthcare Agent
   */
  private static createHealthcareAgent(config: HealthcareAgentConfig): Agent {
    const agent = new HealthcareAgent(config);
    return agent.getAgent();
  }

  /**
   * Get available agent template types
   */
  static getAvailableTemplates(): AgentTemplateInfo[] {
    return [
      {
        type: 'personal-assistant',
        name: 'Personal Assistant',
        description: 'Comprehensive personal assistant for managing schedules, emails, tasks, and notes',
        category: 'productivity',
        capabilities: [
          'schedule_meeting',
          'send_email',
          'create_task',
          'get_schedule',
          'find_free_time',
          'take_note'
        ],
        useCases: [
          'Calendar management',
          'Email automation',
          'Task scheduling',
          'Note taking',
          'Meeting coordination'
        ],
        integrations: ['Google Calendar', 'Outlook', 'Gmail', 'Todoist', 'Asana']
      },
      {
        type: 'financial',
        name: 'Financial Agent',
        description: 'Financial agent for market analysis, portfolio tracking, risk assessment, and investment recommendations',
        category: 'finance',
        capabilities: [
          'analyze_market',
          'track_portfolio',
          'assess_risk',
          'get_investment_recommendations',
          'monitor_news',
          'calculate_metrics'
        ],
        useCases: [
          'Portfolio management',
          'Market analysis',
          'Risk assessment',
          'Investment recommendations',
          'Financial news monitoring'
        ],
        integrations: ['Yahoo Finance', 'Alpha Vantage', 'Polygon', 'Brokerage APIs']
      },
      {
        type: 'healthcare',
        name: 'Healthcare Agent',
        description: 'HIPAA-compliant healthcare agent for patient management, appointments, and medical analytics',
        category: 'healthcare',
        capabilities: [
          'schedule_appointment',
          'monitor_patient',
          'manage_medical_records',
          'analyze_health_trends',
          'send_health_reminders',
          'generate_health_report'
        ],
        useCases: [
          'Patient monitoring',
          'Appointment scheduling',
          'Medical record management',
          'Health trend analysis',
          'Health reminders'
        ],
        integrations: ['Epic', 'Cerner', 'Allscripts', 'EMR Systems']
      }
    ];
  }

  /**
   * Get template configuration schema
   */
  static getTemplateConfigSchema(type: AgentTemplateType): any {
    switch (type) {
      case 'personal-assistant':
        return {
          type: 'object',
          properties: {
            calendar: {
              type: 'object',
              properties: {
                provider: { type: 'string', enum: ['google', 'outlook', 'apple'] },
                credentials: { type: 'object' }
              }
            },
            email: {
              type: 'object',
              properties: {
                provider: { type: 'string', enum: ['gmail', 'outlook', 'smtp'] },
                credentials: { type: 'object' }
              }
            },
            tasks: {
              type: 'object',
              properties: {
                provider: { type: 'string', enum: ['todoist', 'asana', 'trello', 'local'] },
                credentials: { type: 'object' }
              }
            }
          }
        };
      case 'financial':
        return {
          type: 'object',
          properties: {
            marketData: {
              type: 'object',
              properties: {
                provider: { type: 'string', enum: ['yahoo', 'alpha_vantage', 'polygon', 'mock'] },
                apiKey: { type: 'string' }
              }
            },
            portfolio: {
              type: 'object',
              properties: {
                provider: { type: 'string', enum: ['brokerage', 'local', 'mock'] },
                credentials: { type: 'object' }
              }
            },
            risk: {
              type: 'object',
              properties: {
                provider: { type: 'string', enum: ['internal', 'external', 'mock'] },
                model: { type: 'string' }
              }
            }
          }
        };
      case 'healthcare':
        return {
          type: 'object',
          properties: {
            patientManagement: {
              type: 'object',
              properties: {
                provider: { type: 'string', enum: ['epic', 'cerner', 'allscripts', 'mock'] },
                credentials: { type: 'object' }
              }
            },
            appointments: {
              type: 'object',
              properties: {
                provider: { type: 'string', enum: ['epic', 'cerner', 'allscripts', 'mock'] },
                credentials: { type: 'object' }
              }
            },
            medicalRecords: {
              type: 'object',
              properties: {
                provider: { type: 'string', enum: ['epic', 'cerner', 'allscripts', 'mock'] },
                credentials: { type: 'object' }
              }
            },
            analytics: {
              type: 'object',
              properties: {
                provider: { type: 'string', enum: ['internal', 'external', 'mock'] },
                model: { type: 'string' }
              }
            }
          }
        };
      default:
        throw new Error(`Unknown agent template type: ${type}`);
    }
  }

  /**
   * Validate template configuration
   */
  static validateTemplateConfig(type: AgentTemplateType, config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      const schema = this.getTemplateConfigSchema(type);
      // In a real implementation, you would use a JSON schema validator like ajv
      // For now, we'll do basic validation
      
      if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object');
        return { isValid: false, errors };
      }

      // Template-specific validation
      switch (type) {
        case 'personal-assistant':
          if (config.calendar && !config.calendar.provider) {
            errors.push('Calendar provider is required when calendar is configured');
          }
          if (config.email && !config.email.provider) {
            errors.push('Email provider is required when email is configured');
          }
          break;
        case 'financial':
          if (config.marketData && !config.marketData.provider) {
            errors.push('Market data provider is required when market data is configured');
          }
          break;
        case 'healthcare':
          if (config.patientManagement && !config.patientManagement.provider) {
            errors.push('Patient management provider is required when patient management is configured');
          }
          break;
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      errors.push(`Configuration validation error: ${error}`);
      return { isValid: false, errors };
    }
  }
}

/**
 * Agent template types
 */
export type AgentTemplateType = 'personal-assistant' | 'financial' | 'healthcare';

/**
 * Agent template configuration union type
 */
export type AgentTemplateConfig = PersonalAssistantConfig | FinancialAgentConfig | HealthcareAgentConfig;

/**
 * Agent template information
 */
export interface AgentTemplateInfo {
  type: AgentTemplateType;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  useCases: string[];
  integrations: string[];
}
