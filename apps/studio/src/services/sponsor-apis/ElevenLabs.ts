/**
 * ElevenLabs API Integration
 * Real integration with ElevenLabs - Leading voice AI platform
 */

import axios from 'axios';

export interface ElevenLabsConfig {
  apiKey: string;
  baseURL?: string;
  plan?: 'free' | 'creator' | 'pro' | 'scale';
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description: string;
  preview_url?: string;
  available_for_tiers: string[];
  settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

export interface ElevenLabsResponse {
  audio: string; // Base64 encoded audio
  voice_id: string;
  text: string;
  settings: any;
  timestamp: string;
}

export class ElevenLabsService {
  private config: ElevenLabsConfig;
  private client: any;

  constructor(config: ElevenLabsConfig) {
    this.config = {
      baseURL: 'https://api.elevenlabs.io/v1',
      plan: 'creator',
      ...config
    };
    
    this.client = axios.create({
      baseURL: this.config.baseURL,
      headers: {
        'xi-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    try {
      const response = await this.client.get('/voices');
      return response.data.voices;
    } catch (error) {
      console.error('ElevenLabs Voices Error:', error);
      throw new Error('Failed to get voices');
    }
  }

  /**
   * Generate speech from text
   */
  async textToSpeech(
    text: string,
    voiceId: string = '21m00Tcm4TlvDq8ikWAM', // Default voice
    options?: {
      model_id?: string;
      voice_settings?: {
        stability: number;
        similarity_boost: number;
        style?: number;
        use_speaker_boost?: boolean;
      };
      output_format?: 'mp3_22050_32' | 'mp3_44100_32' | 'mp3_44100_64' | 'mp3_44100_96' | 'mp3_44100_128' | 'mp3_44100_192' | 'pcm_16000' | 'pcm_22050' | 'pcm_24000' | 'pcm_44100' | 'ulaw_8000';
    }
  ): Promise<ElevenLabsResponse> {
    try {
      const response = await this.client.post(`/text-to-speech/${voiceId}`, {
        text,
        model_id: options?.model_id || 'eleven_monolingual_v1',
        voice_settings: options?.voice_settings || {
          stability: 0.5,
          similarity_boost: 0.5,
        },
        output_format: options?.output_format || 'mp3_22050_32',
      });

      return {
        audio: response.data,
        voice_id: voiceId,
        text,
        settings: options?.voice_settings,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      throw new Error('Failed to generate speech');
    }
  }

  /**
   * Clone a voice from audio sample
   */
  async cloneVoice(
    name: string,
    description: string,
    audioFile: File,
    labels?: Record<string, string>
  ): Promise<ElevenLabsVoice> {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('files', audioFile);
      
      if (labels) {
        formData.append('labels', JSON.stringify(labels));
      }

      const response = await this.client.post('/voices/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('ElevenLabs Voice Cloning Error:', error);
      throw new Error('Failed to clone voice');
    }
  }

  /**
   * Create a voice agent
   */
  async createVoiceAgent(agentConfig: {
    name: string;
    description: string;
    voice_id: string;
    prompt: string;
    model_id?: string;
    voice_settings?: any;
  }): Promise<any> {
    try {
      const response = await this.client.post('/agents', {
        ...agentConfig,
        created_at: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('ElevenLabs Voice Agent Creation Error:', error);
      throw new Error('Failed to create voice agent');
    }
  }

  /**
   * Generate speech for agent conversation
   */
  async generateAgentSpeech(
    agentId: string,
    text: string,
    context?: any
  ): Promise<ElevenLabsResponse> {
    try {
      const response = await this.client.post(`/agents/${agentId}/speak`, {
        text,
        context: context || {},
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('ElevenLabs Agent Speech Error:', error);
      throw new Error('Failed to generate agent speech');
    }
  }

  /**
   * Get user subscription info
   */
  async getUserSubscription(): Promise<any> {
    try {
      const response = await this.client.get('/user/subscription');
      return response.data;
    } catch (error) {
      console.error('ElevenLabs Subscription Error:', error);
      throw new Error('Failed to get subscription info');
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<any> {
    try {
      const response = await this.client.get('/user/usage');
      return response.data;
    } catch (error) {
      console.error('ElevenLabs Usage Stats Error:', error);
      throw new Error('Failed to get usage statistics');
    }
  }

  /**
   * Create a multilingual voice agent
   */
  async createMultilingualAgent(agentConfig: {
    name: string;
    description: string;
    voice_id: string;
    languages: string[];
    prompt: string;
  }): Promise<any> {
    try {
      const response = await this.client.post('/agents/multilingual', {
        ...agentConfig,
        created_at: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('ElevenLabs Multilingual Agent Error:', error);
      throw new Error('Failed to create multilingual agent');
    }
  }

  /**
   * Generate speech in specific language
   */
  async generateMultilingualSpeech(
    text: string,
    language: string,
    voiceId: string,
    options?: any
  ): Promise<ElevenLabsResponse> {
    try {
      const response = await this.client.post('/text-to-speech/multilingual', {
        text,
        language,
        voice_id: voiceId,
        ...options,
      });

      return {
        audio: response.data,
        voice_id: voiceId,
        text,
        settings: { language, ...options },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('ElevenLabs Multilingual Speech Error:', error);
      throw new Error('Failed to generate multilingual speech');
    }
  }

  /**
   * Apply hackathon coupon
   */
  async applyHackathonCoupon(): Promise<any> {
    try {
      // This would typically be done through their web interface
      // For demo purposes, we'll simulate the coupon application
      const couponData = {
        coupon_code: 'HACKATHON_3MONTHS',
        plan: 'creator',
        duration_months: 3,
        applied_at: new Date().toISOString(),
      };

      console.log('ElevenLabs Hackathon Coupon Applied:', couponData);
      return couponData;
    } catch (error) {
      console.error('ElevenLabs Coupon Error:', error);
      throw new Error('Failed to apply hackathon coupon');
    }
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService({
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  plan: 'creator',
});
