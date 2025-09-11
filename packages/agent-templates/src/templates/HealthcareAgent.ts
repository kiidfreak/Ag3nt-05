import { Agent, AgentCapability } from '../types/Agent';
import { createAgent } from '../utils/factories';

/**
 * Healthcare Agent Template
 * 
 * Based on hackathon analysis showing Healthcare as an important domain
 * Provides patient monitoring, appointment scheduling, medical record management, and health analytics
 * Includes HIPAA compliance features
 */
export class HealthcareAgent {
  private agent: Agent;
  private patientService?: any;
  private appointmentService?: any;
  private medicalRecordService?: any;
  private analyticsService?: any;

  constructor(config: HealthcareAgentConfig) {
    this.agent = createAgent(
      'Healthcare Agent',
      'healthcare',
      this.getCapabilities(),
      {
        author: 'Agent Labs',
        description: 'A HIPAA-compliant healthcare agent for patient management, appointments, and medical analytics',
        tags: ['healthcare', 'medical', 'patient-management', 'hipaa', 'appointments', 'analytics'],
        category: 'healthcare'
      }
    );

    this.initializeServices(config);
  }

  /**
   * Get agent capabilities
   */
  private getCapabilities(): AgentCapability[] {
    return [
      {
        name: 'schedule_appointment',
        description: 'Schedule a medical appointment',
        inputSchema: {
          type: 'object',
          properties: {
            patientId: { type: 'string', description: 'Patient identifier' },
            providerId: { type: 'string', description: 'Healthcare provider identifier' },
            appointmentType: { 
              type: 'string', 
              enum: ['consultation', 'follow-up', 'procedure', 'emergency', 'routine'],
              description: 'Type of appointment'
            },
            preferredDate: { type: 'string', format: 'date-time', description: 'Preferred appointment date' },
            duration: { type: 'number', default: 30, description: 'Appointment duration in minutes' },
            reason: { type: 'string', description: 'Reason for appointment' },
            urgency: { 
              type: 'string', 
              enum: ['low', 'medium', 'high', 'urgent'],
              default: 'medium',
              description: 'Appointment urgency level'
            }
          },
          required: ['patientId', 'providerId', 'appointmentType', 'preferredDate']
        },
        outputSchema: {
          type: 'object',
          properties: {
            appointmentId: { type: 'string' },
            status: { type: 'string' },
            scheduledDate: { type: 'string', format: 'date-time' },
            confirmationCode: { type: 'string' },
            instructions: { type: 'string' }
          }
        },
        required: true
      },
      {
        name: 'monitor_patient',
        description: 'Monitor patient health metrics and vital signs',
        inputSchema: {
          type: 'object',
          properties: {
            patientId: { type: 'string', description: 'Patient identifier' },
            metrics: {
              type: 'array',
              items: { 
                type: 'string',
                enum: ['blood_pressure', 'heart_rate', 'temperature', 'weight', 'glucose', 'oxygen_saturation']
              },
              description: 'Health metrics to monitor'
            },
            timeframe: { 
              type: 'string', 
              enum: ['1h', '4h', '1d', '1w', '1mo'],
              default: '1d',
              description: 'Monitoring timeframe'
            },
            alertThresholds: {
              type: 'object',
              description: 'Custom alert thresholds for metrics'
            }
          },
          required: ['patientId', 'metrics']
        },
        outputSchema: {
          type: 'object',
          properties: {
            patientId: { type: 'string' },
            metrics: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  metric: { type: 'string' },
                  value: { type: 'number' },
                  unit: { type: 'string' },
                  timestamp: { type: 'string', format: 'date-time' },
                  status: { type: 'string', enum: ['normal', 'warning', 'critical'] },
                  trend: { type: 'string', enum: ['improving', 'stable', 'declining'] }
                }
              }
            },
            alerts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['warning', 'critical'] },
                  message: { type: 'string' },
                  metric: { type: 'string' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            },
            summary: { type: 'string' }
          }
        },
        required: true
      },
      {
        name: 'manage_medical_records',
        description: 'Manage patient medical records and documentation',
        inputSchema: {
          type: 'object',
          properties: {
            patientId: { type: 'string', description: 'Patient identifier' },
            action: { 
              type: 'string', 
              enum: ['create', 'update', 'retrieve', 'search'],
              description: 'Action to perform on medical records'
            },
            recordType: { 
              type: 'string', 
              enum: ['diagnosis', 'treatment', 'medication', 'lab_result', 'imaging', 'note'],
              description: 'Type of medical record'
            },
            data: {
              type: 'object',
              description: 'Medical record data (for create/update actions)'
            },
            searchCriteria: {
              type: 'object',
              description: 'Search criteria (for search action)'
            }
          },
          required: ['patientId', 'action']
        },
        outputSchema: {
          type: 'object',
          properties: {
            recordId: { type: 'string' },
            status: { type: 'string' },
            records: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string' },
                  data: { type: 'object' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  provider: { type: 'string' }
                }
              }
            },
            totalRecords: { type: 'number' }
          }
        },
        required: true
      },
      {
        name: 'analyze_health_trends',
        description: 'Analyze patient health trends and patterns',
        inputSchema: {
          type: 'object',
          properties: {
            patientId: { type: 'string', description: 'Patient identifier' },
            analysisType: { 
              type: 'string', 
              enum: ['vital_signs', 'medication_adherence', 'symptom_tracking', 'risk_assessment'],
              description: 'Type of health analysis'
            },
            timeframe: { 
              type: 'string', 
              enum: ['1w', '1mo', '3mo', '6mo', '1y'],
              default: '1mo',
              description: 'Analysis timeframe'
            },
            includePredictions: { type: 'boolean', default: false, description: 'Include predictive analytics' }
          },
          required: ['patientId', 'analysisType']
        },
        outputSchema: {
          type: 'object',
          properties: {
            analysis: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                timeframe: { type: 'string' },
                summary: { type: 'string' },
                trends: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      metric: { type: 'string' },
                      trend: { type: 'string', enum: ['improving', 'stable', 'declining'] },
                      change: { type: 'number' },
                      significance: { type: 'string', enum: ['low', 'medium', 'high'] }
                    }
                  }
                },
                insights: { type: 'array', items: { type: 'string' } },
                recommendations: { type: 'array', items: { type: 'string' } }
              }
            },
            predictions: {
              type: 'object',
              properties: {
                riskFactors: { type: 'array', items: { type: 'string' } },
                recommendedActions: { type: 'array', items: { type: 'string' } },
                confidence: { type: 'number', minimum: 0, maximum: 100 }
              }
            }
          }
        },
        required: true
      },
      {
        name: 'send_health_reminders',
        description: 'Send health-related reminders to patients',
        inputSchema: {
          type: 'object',
          properties: {
            patientId: { type: 'string', description: 'Patient identifier' },
            reminderType: { 
              type: 'string', 
              enum: ['medication', 'appointment', 'checkup', 'lab_test', 'exercise', 'diet'],
              description: 'Type of health reminder'
            },
            message: { type: 'string', description: 'Custom reminder message' },
            scheduledTime: { type: 'string', format: 'date-time', description: 'When to send reminder' },
            deliveryMethod: { 
              type: 'array', 
              items: { type: 'string', enum: ['email', 'sms', 'push', 'phone'] },
              description: 'How to deliver the reminder'
            },
            priority: { 
              type: 'string', 
              enum: ['low', 'medium', 'high'],
              default: 'medium',
              description: 'Reminder priority'
            }
          },
          required: ['patientId', 'reminderType', 'scheduledTime']
        },
        outputSchema: {
          type: 'object',
          properties: {
            reminderId: { type: 'string' },
            status: { type: 'string' },
            scheduledTime: { type: 'string', format: 'date-time' },
            deliveryStatus: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  method: { type: 'string' },
                  status: { type: 'string' },
                  deliveredAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        required: true
      },
      {
        name: 'generate_health_report',
        description: 'Generate comprehensive health reports for patients or providers',
        inputSchema: {
          type: 'object',
          properties: {
            patientId: { type: 'string', description: 'Patient identifier' },
            reportType: { 
              type: 'string', 
              enum: ['summary', 'detailed', 'trend_analysis', 'medication_history', 'appointment_history'],
              description: 'Type of health report'
            },
            timeframe: { 
              type: 'string', 
              enum: ['1mo', '3mo', '6mo', '1y', 'all'],
              default: '3mo',
              description: 'Report timeframe'
            },
            includeRecommendations: { type: 'boolean', default: true, description: 'Include health recommendations' },
            format: { 
              type: 'string', 
              enum: ['pdf', 'html', 'json'],
              default: 'pdf',
              description: 'Report format'
            }
          },
          required: ['patientId', 'reportType']
        },
        outputSchema: {
          type: 'object',
          properties: {
            reportId: { type: 'string' },
            status: { type: 'string' },
            reportUrl: { type: 'string' },
            generatedAt: { type: 'string', format: 'date-time' },
            summary: {
              type: 'object',
              properties: {
                totalAppointments: { type: 'number' },
                medications: { type: 'number' },
                vitalSigns: { type: 'number' },
                recommendations: { type: 'number' }
              }
            }
          }
        },
        required: true
      }
    ];
  }

  /**
   * Initialize external services
   */
  private initializeServices(config: HealthcareAgentConfig): void {
    if (config.patientManagement) {
      this.patientService = new PatientManagementService(config.patientManagement);
    }
    if (config.appointments) {
      this.appointmentService = new AppointmentService(config.appointments);
    }
    if (config.medicalRecords) {
      this.medicalRecordService = new MedicalRecordService(config.medicalRecords);
    }
    if (config.analytics) {
      this.analyticsService = new HealthAnalyticsService(config.analytics);
    }
  }

  /**
   * Get the agent instance
   */
  getAgent(): Agent {
    return this.agent;
  }

  /**
   * Execute a capability
   */
  async executeCapability(capabilityName: string, parameters: any): Promise<any> {
    switch (capabilityName) {
      case 'schedule_appointment':
        return this.scheduleAppointment(parameters);
      case 'monitor_patient':
        return this.monitorPatient(parameters);
      case 'manage_medical_records':
        return this.manageMedicalRecords(parameters);
      case 'analyze_health_trends':
        return this.analyzeHealthTrends(parameters);
      case 'send_health_reminders':
        return this.sendHealthReminders(parameters);
      case 'generate_health_report':
        return this.generateHealthReport(parameters);
      default:
        throw new Error(`Unknown capability: ${capabilityName}`);
    }
  }

  /**
   * Schedule appointment
   */
  private async scheduleAppointment(params: any): Promise<any> {
    if (!this.appointmentService) {
      throw new Error('Appointment service not configured');
    }

    const appointment = await this.appointmentService.schedule({
      patientId: params.patientId,
      providerId: params.providerId,
      type: params.appointmentType,
      preferredDate: new Date(params.preferredDate),
      duration: params.duration || 30,
      reason: params.reason,
      urgency: params.urgency || 'medium'
    });

    return {
      appointmentId: appointment.id,
      status: 'scheduled',
      scheduledDate: appointment.scheduledDate.toISOString(),
      confirmationCode: appointment.confirmationCode,
      instructions: appointment.instructions
    };
  }

  /**
   * Monitor patient
   */
  private async monitorPatient(params: any): Promise<any> {
    if (!this.patientService) {
      throw new Error('Patient service not configured');
    }

    const monitoring = await this.patientService.monitorHealthMetrics(
      params.patientId,
      params.metrics,
      params.timeframe,
      params.alertThresholds
    );

    return {
      patientId: params.patientId,
      metrics: monitoring.metrics,
      alerts: monitoring.alerts,
      summary: monitoring.summary
    };
  }

  /**
   * Manage medical records
   */
  private async manageMedicalRecords(params: any): Promise<any> {
    if (!this.medicalRecordService) {
      throw new Error('Medical record service not configured');
    }

    let result;
    switch (params.action) {
      case 'create':
        result = await this.medicalRecordService.createRecord(
          params.patientId,
          params.recordType,
          params.data
        );
        break;
      case 'update':
        result = await this.medicalRecordService.updateRecord(
          params.patientId,
          params.recordType,
          params.data
        );
        break;
      case 'retrieve':
        result = await this.medicalRecordService.getRecords(
          params.patientId,
          params.recordType
        );
        break;
      case 'search':
        result = await this.medicalRecordService.searchRecords(
          params.patientId,
          params.searchCriteria
        );
        break;
      default:
        throw new Error(`Unknown action: ${params.action}`);
    }

    return result;
  }

  /**
   * Analyze health trends
   */
  private async analyzeHealthTrends(params: any): Promise<any> {
    if (!this.analyticsService) {
      throw new Error('Analytics service not configured');
    }

    const analysis = await this.analyticsService.analyzeTrends(
      params.patientId,
      params.analysisType,
      params.timeframe,
      params.includePredictions
    );

    return {
      analysis: analysis.trends,
      predictions: analysis.predictions
    };
  }

  /**
   * Send health reminders
   */
  private async sendHealthReminders(params: any): Promise<any> {
    if (!this.patientService) {
      throw new Error('Patient service not configured');
    }

    const reminder = await this.patientService.scheduleReminder({
      patientId: params.patientId,
      type: params.reminderType,
      message: params.message,
      scheduledTime: new Date(params.scheduledTime),
      deliveryMethod: params.deliveryMethod || ['email'],
      priority: params.priority || 'medium'
    });

    return {
      reminderId: reminder.id,
      status: 'scheduled',
      scheduledTime: reminder.scheduledTime.toISOString(),
      deliveryStatus: reminder.deliveryStatus
    };
  }

  /**
   * Generate health report
   */
  private async generateHealthReport(params: any): Promise<any> {
    if (!this.analyticsService) {
      throw new Error('Analytics service not configured');
    }

    const report = await this.analyticsService.generateReport(
      params.patientId,
      params.reportType,
      params.timeframe,
      params.includeRecommendations,
      params.format
    );

    return {
      reportId: report.id,
      status: 'generated',
      reportUrl: report.url,
      generatedAt: report.generatedAt.toISOString(),
      summary: report.summary
    };
  }
}

/**
 * Configuration interface for Healthcare Agent
 */
export interface HealthcareAgentConfig {
  patientManagement?: {
    provider: 'epic' | 'cerner' | 'allscripts' | 'mock';
    credentials?: any;
  };
  appointments?: {
    provider: 'epic' | 'cerner' | 'allscripts' | 'mock';
    credentials?: any;
  };
  medicalRecords?: {
    provider: 'epic' | 'cerner' | 'allscripts' | 'mock';
    credentials?: any;
  };
  analytics?: {
    provider: 'internal' | 'external' | 'mock';
    model?: string;
  };
}

/**
 * Mock services for demonstration
 */
class PatientManagementService {
  constructor(private config: any) {}

  async monitorHealthMetrics(patientId: string, metrics: string[], timeframe: string, thresholds?: any): Promise<any> {
    // Mock implementation
    return {
      metrics: [],
      alerts: [],
      summary: 'Patient monitoring completed successfully'
    };
  }

  async scheduleReminder(params: any): Promise<any> {
    // Mock implementation
    return {
      id: `reminder_${Date.now()}`,
      scheduledTime: params.scheduledTime,
      deliveryStatus: []
    };
  }
}

class AppointmentService {
  constructor(private config: any) {}

  async schedule(params: any): Promise<any> {
    // Mock implementation
    return {
      id: `appointment_${Date.now()}`,
      scheduledDate: params.preferredDate,
      confirmationCode: `CONF${Date.now()}`,
      instructions: 'Please arrive 15 minutes early for your appointment'
    };
  }
}

class MedicalRecordService {
  constructor(private config: any) {}

  async createRecord(patientId: string, recordType: string, data: any): Promise<any> {
    // Mock implementation
    return {
      recordId: `record_${Date.now()}`,
      status: 'created',
      records: [],
      totalRecords: 0
    };
  }

  async updateRecord(patientId: string, recordType: string, data: any): Promise<any> {
    // Mock implementation
    return {
      recordId: `record_${Date.now()}`,
      status: 'updated',
      records: [],
      totalRecords: 0
    };
  }

  async getRecords(patientId: string, recordType?: string): Promise<any> {
    // Mock implementation
    return {
      recordId: null,
      status: 'retrieved',
      records: [],
      totalRecords: 0
    };
  }

  async searchRecords(patientId: string, criteria: any): Promise<any> {
    // Mock implementation
    return {
      recordId: null,
      status: 'searched',
      records: [],
      totalRecords: 0
    };
  }
}

class HealthAnalyticsService {
  constructor(private config: any) {}

  async analyzeTrends(patientId: string, analysisType: string, timeframe: string, includePredictions: boolean): Promise<any> {
    // Mock implementation
    return {
      trends: {
        type: analysisType,
        timeframe: timeframe,
        summary: 'Health trends analyzed successfully',
        trends: [],
        insights: [],
        recommendations: []
      },
      predictions: includePredictions ? {
        riskFactors: [],
        recommendedActions: [],
        confidence: 85
      } : null
    };
  }

  async generateReport(patientId: string, reportType: string, timeframe: string, includeRecommendations: boolean, format: string): Promise<any> {
    // Mock implementation
    return {
      id: `report_${Date.now()}`,
      url: `https://reports.example.com/report_${Date.now()}.${format}`,
      generatedAt: new Date(),
      summary: {
        totalAppointments: 0,
        medications: 0,
        vitalSigns: 0,
        recommendations: 0
      }
    };
  }
}
