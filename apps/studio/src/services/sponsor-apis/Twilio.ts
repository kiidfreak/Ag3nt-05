/**
 * Twilio API Integration
 * Real integration with Twilio's Voice, SMS, and Video APIs
 */

import axios from 'axios';

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber?: string;
}

export interface TwilioCall {
  sid: string;
  from: string;
  to: string;
  status: string;
  duration?: number;
  price?: string;
}

export interface TwilioMessage {
  sid: string;
  from: string;
  to: string;
  body: string;
  status: string;
  dateCreated: string;
}

export class TwilioService {
  private config: TwilioConfig;
  private baseURL: string;

  constructor(config: TwilioConfig) {
    this.config = config;
    this.baseURL = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}`;
  }

  /**
   * Make a voice call with AI agent
   */
  async makeCall(to: string, agentPrompt: string): Promise<TwilioCall> {
    const twiml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="alice">Hello! I'm your AI agent assistant. How can I help you today?</Say>
        <Gather numDigits="1" action="/handle-input" method="POST">
          <Say voice="alice">Press 1 for support, 2 for sales, or 3 to speak with a human.</Say>
        </Gather>
        <Say voice="alice">Thank you for calling. Goodbye!</Say>
      </Response>
    `;

    try {
      const response = await axios.post(
        `${this.baseURL}/Calls.json`,
        new URLSearchParams({
          To: to,
          From: this.config.phoneNumber || '+1234567890',
          Twiml: twiml,
          StatusCallback: `${window.location.origin}/api/twilio/call-status`,
        }),
        {
          auth: {
            username: this.config.accountSid,
            password: this.config.authToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Twilio Call Error:', error);
      throw new Error('Failed to make call');
    }
  }

  /**
   * Send SMS message
   */
  async sendSMS(to: string, message: string): Promise<TwilioMessage> {
    try {
      const response = await axios.post(
        `${this.baseURL}/Messages.json`,
        new URLSearchParams({
          To: to,
          From: this.config.phoneNumber || '+1234567890',
          Body: message,
        }),
        {
          auth: {
            username: this.config.accountSid,
            password: this.config.authToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Twilio SMS Error:', error);
      throw new Error('Failed to send SMS');
    }
  }

  /**
   * Create video room for agent collaboration
   */
  async createVideoRoom(roomName: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseURL}/Rooms.json`,
        new URLSearchParams({
          UniqueName: roomName,
          Type: 'group',
          StatusCallback: `${window.location.origin}/api/twilio/room-status`,
        }),
        {
          auth: {
            username: this.config.accountSid,
            password: this.config.authToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Twilio Video Error:', error);
      throw new Error('Failed to create video room');
    }
  }

  /**
   * Generate TwiML for voice agent
   */
  generateVoiceAgentTwiML(agentConfig: any): string {
    return `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="alice">${agentConfig.greeting || 'Hello! I\'m your AI assistant.'}</Say>
        <Gather numDigits="1" action="/handle-input" method="POST">
          <Say voice="alice">${agentConfig.options || 'How can I help you today?'}</Say>
        </Gather>
        <Say voice="alice">Thank you for calling. Goodbye!</Say>
      </Response>
    `;
  }

  /**
   * Get call logs
   */
  async getCallLogs(limit: number = 50): Promise<TwilioCall[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/Calls.json?PageSize=${limit}`,
        {
          auth: {
            username: this.config.accountSid,
            password: this.config.authToken,
          },
        }
      );

      return response.data.calls;
    } catch (error) {
      console.error('Twilio Call Logs Error:', error);
      throw new Error('Failed to get call logs');
    }
  }

  /**
   * Get message logs
   */
  async getMessageLogs(limit: number = 50): Promise<TwilioMessage[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/Messages.json?PageSize=${limit}`,
        {
          auth: {
            username: this.config.accountSid,
            password: this.config.authToken,
          },
        }
      );

      return response.data.messages;
    } catch (error) {
      console.error('Twilio Message Logs Error:', error);
      throw new Error('Failed to get message logs');
    }
  }
}

// Export singleton instance
export const twilioService = new TwilioService({
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
  phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '',
});
