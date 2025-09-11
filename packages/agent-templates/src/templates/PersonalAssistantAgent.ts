import { Agent, AgentCapability } from '../types/Agent';
import { createAgent } from '../utils/factories';

/**
 * Personal Assistant Agent Template
 * 
 * Based on hackathon analysis showing Personal Assistant as the #1 use case
 * Provides calendar management, email handling, task scheduling, and note-taking
 */
export class PersonalAssistantAgent {
  private agent: Agent;
  private calendarService?: any;
  private emailService?: any;
  private taskService?: any;

  constructor(config: PersonalAssistantConfig) {
    this.agent = createAgent(
      'Personal Assistant',
      'personal-assistant',
      this.getCapabilities(),
      {
        author: 'Agent Labs',
        description: 'A comprehensive personal assistant for managing schedules, emails, tasks, and notes',
        tags: ['assistant', 'productivity', 'calendar', 'email', 'tasks'],
        category: 'productivity'
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
        name: 'schedule_meeting',
        description: 'Schedule a meeting in the calendar',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Meeting title' },
            date: { type: 'string', format: 'date-time', description: 'Meeting date and time' },
            duration: { type: 'number', description: 'Meeting duration in minutes', default: 60 },
            attendees: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'List of attendee email addresses'
            },
            location: { type: 'string', description: 'Meeting location or video link' },
            description: { type: 'string', description: 'Meeting description' }
          },
          required: ['title', 'date']
        },
        outputSchema: {
          type: 'object',
          properties: {
            meetingId: { type: 'string' },
            status: { type: 'string' },
            calendarLink: { type: 'string' }
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
            to: { type: 'string', description: 'Recipient email address' },
            subject: { type: 'string', description: 'Email subject' },
            body: { type: 'string', description: 'Email body content' },
            cc: { type: 'array', items: { type: 'string' }, description: 'CC recipients' },
            bcc: { type: 'array', items: { type: 'string' }, description: 'BCC recipients' },
            attachments: { type: 'array', items: { type: 'string' }, description: 'File attachments' }
          },
          required: ['to', 'subject', 'body']
        },
        outputSchema: {
          type: 'object',
          properties: {
            messageId: { type: 'string' },
            status: { type: 'string' },
            sentAt: { type: 'string', format: 'date-time' }
          }
        },
        required: true
      },
      {
        name: 'create_task',
        description: 'Create a new task or reminder',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Task title' },
            description: { type: 'string', description: 'Task description' },
            dueDate: { type: 'string', format: 'date-time', description: 'Task due date' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
            category: { type: 'string', description: 'Task category' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Task tags' }
          },
          required: ['title']
        },
        outputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            status: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        required: true
      },
      {
        name: 'get_schedule',
        description: 'Get calendar schedule for a date range',
        inputSchema: {
          type: 'object',
          properties: {
            startDate: { type: 'string', format: 'date-time', description: 'Start date' },
            endDate: { type: 'string', format: 'date-time', description: 'End date' },
            includeDetails: { type: 'boolean', default: true, description: 'Include meeting details' }
          },
          required: ['startDate', 'endDate']
        },
        outputSchema: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  start: { type: 'string', format: 'date-time' },
                  end: { type: 'string', format: 'date-time' },
                  location: { type: 'string' },
                  attendees: { type: 'array', items: { type: 'string' } }
                }
              }
            },
            totalEvents: { type: 'number' }
          }
        },
        required: true
      },
      {
        name: 'find_free_time',
        description: 'Find available time slots in calendar',
        inputSchema: {
          type: 'object',
          properties: {
            duration: { type: 'number', description: 'Required duration in minutes' },
            startDate: { type: 'string', format: 'date-time', description: 'Search start date' },
            endDate: { type: 'string', format: 'date-time', description: 'Search end date' },
            workingHours: {
              type: 'object',
              properties: {
                start: { type: 'string', description: 'Working hours start (e.g., "09:00")' },
                end: { type: 'string', description: 'Working hours end (e.g., "17:00")' }
              }
            }
          },
          required: ['duration', 'startDate', 'endDate']
        },
        outputSchema: {
          type: 'object',
          properties: {
            availableSlots: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  start: { type: 'string', format: 'date-time' },
                  end: { type: 'string', format: 'date-time' },
                  duration: { type: 'number' }
                }
              }
            },
            totalSlots: { type: 'number' }
          }
        },
        required: true
      },
      {
        name: 'take_note',
        description: 'Create and organize notes',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Note title' },
            content: { type: 'string', description: 'Note content' },
            category: { type: 'string', description: 'Note category' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Note tags' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' }
          },
          required: ['title', 'content']
        },
        outputSchema: {
          type: 'object',
          properties: {
            noteId: { type: 'string' },
            status: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        required: true
      }
    ];
  }

  /**
   * Initialize external services
   */
  private initializeServices(config: PersonalAssistantConfig): void {
    if (config.calendar) {
      this.calendarService = new CalendarService(config.calendar);
    }
    if (config.email) {
      this.emailService = new EmailService(config.email);
    }
    if (config.tasks) {
      this.taskService = new TaskService(config.tasks);
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
      case 'schedule_meeting':
        return this.scheduleMeeting(parameters);
      case 'send_email':
        return this.sendEmail(parameters);
      case 'create_task':
        return this.createTask(parameters);
      case 'get_schedule':
        return this.getSchedule(parameters);
      case 'find_free_time':
        return this.findFreeTime(parameters);
      case 'take_note':
        return this.takeNote(parameters);
      default:
        throw new Error(`Unknown capability: ${capabilityName}`);
    }
  }

  /**
   * Schedule a meeting
   */
  private async scheduleMeeting(params: any): Promise<any> {
    if (!this.calendarService) {
      throw new Error('Calendar service not configured');
    }

    const meeting = await this.calendarService.createEvent({
      title: params.title,
      start: new Date(params.date),
      end: new Date(new Date(params.date).getTime() + (params.duration || 60) * 60000),
      attendees: params.attendees || [],
      location: params.location,
      description: params.description
    });

    return {
      meetingId: meeting.id,
      status: 'scheduled',
      calendarLink: meeting.link
    };
  }

  /**
   * Send an email
   */
  private async sendEmail(params: any): Promise<any> {
    if (!this.emailService) {
      throw new Error('Email service not configured');
    }

    const result = await this.emailService.send({
      to: params.to,
      subject: params.subject,
      body: params.body,
      cc: params.cc,
      bcc: params.bcc,
      attachments: params.attachments
    });

    return {
      messageId: result.id,
      status: 'sent',
      sentAt: new Date().toISOString()
    };
  }

  /**
   * Create a task
   */
  private async createTask(params: any): Promise<any> {
    if (!this.taskService) {
      throw new Error('Task service not configured');
    }

    const task = await this.taskService.create({
      title: params.title,
      description: params.description,
      dueDate: params.dueDate ? new Date(params.dueDate) : undefined,
      priority: params.priority || 'medium',
      category: params.category,
      tags: params.tags || []
    });

    return {
      taskId: task.id,
      status: 'created',
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Get schedule
   */
  private async getSchedule(params: any): Promise<any> {
    if (!this.calendarService) {
      throw new Error('Calendar service not configured');
    }

    const events = await this.calendarService.getEvents(
      new Date(params.startDate),
      new Date(params.endDate),
      params.includeDetails
    );

    return {
      events: events.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        location: event.location,
        attendees: event.attendees
      })),
      totalEvents: events.length
    };
  }

  /**
   * Find free time
   */
  private async findFreeTime(params: any): Promise<any> {
    if (!this.calendarService) {
      throw new Error('Calendar service not configured');
    }

    const freeSlots = await this.calendarService.findFreeTime(
      new Date(params.startDate),
      new Date(params.endDate),
      params.duration,
      params.workingHours
    );

    return {
      availableSlots: freeSlots.map((slot: any) => ({
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        duration: slot.duration
      })),
      totalSlots: freeSlots.length
    };
  }

  /**
   * Take a note
   */
  private async takeNote(params: any): Promise<any> {
    // Simple in-memory note storage for demo
    const noteId = `note_${Date.now()}`;
    
    return {
      noteId,
      status: 'created',
      createdAt: new Date().toISOString()
    };
  }
}

/**
 * Configuration interface for Personal Assistant Agent
 */
export interface PersonalAssistantConfig {
  calendar?: {
    provider: 'google' | 'outlook' | 'apple';
    credentials: any;
  };
  email?: {
    provider: 'gmail' | 'outlook' | 'smtp';
    credentials: any;
  };
  tasks?: {
    provider: 'todoist' | 'asana' | 'trello' | 'local';
    credentials?: any;
  };
}

/**
 * Mock services for demonstration
 */
class CalendarService {
  constructor(private config: any) {}

  async createEvent(event: any): Promise<any> {
    // Mock implementation
    return {
      id: `event_${Date.now()}`,
      link: `https://calendar.example.com/event/${Date.now()}`
    };
  }

  async getEvents(start: Date, end: Date, includeDetails: boolean): Promise<any[]> {
    // Mock implementation
    return [];
  }

  async findFreeTime(start: Date, end: Date, duration: number, workingHours?: any): Promise<any[]> {
    // Mock implementation
    return [];
  }
}

class EmailService {
  constructor(private config: any) {}

  async send(email: any): Promise<any> {
    // Mock implementation
    return {
      id: `msg_${Date.now()}`
    };
  }
}

class TaskService {
  constructor(private config: any) {}

  async create(task: any): Promise<any> {
    // Mock implementation
    return {
      id: `task_${Date.now()}`
    };
  }
}
