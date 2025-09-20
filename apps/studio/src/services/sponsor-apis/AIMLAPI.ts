/**
 * AI/ML API Integration
 * Real integration with AI/ML API - 100+ AI models in one API
 */

import axios from 'axios';

export interface AIMLAPIConfig {
  apiKey: string;
  baseURL?: string;
  promoCode?: string;
}

export interface AIMLAPIModel {
  id: string;
  name: string;
  provider: string;
  type: 'text' | 'image' | 'vision' | 'speech';
  description: string;
  capabilities: string[];
  pricing: {
    input: number;
    output: number;
  };
}

export interface AIMLAPIResponse {
  id: string;
  model: string;
  response: any;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  cost: number;
  timestamp: string;
}

export class AIMLAPIService {
  private config: AIMLAPIConfig;
  private client: any;

  constructor(config: AIMLAPIConfig) {
    this.config = {
      baseURL: 'https://api.aimlapi.com/v1',
      promoCode: 'NYSOL', // Hackathon promo code
      ...config
    };
    
    this.client = axios.create({
      baseURL: this.config.baseURL,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'X-Promo-Code': this.config.promoCode,
      },
    });
  }

  /**
   * Get available models
   */
  async getModels(type?: string): Promise<AIMLAPIModel[]> {
    try {
      const params: any = {};
      if (type) params.type = type;
      
      const response = await this.client.get('/models', { params });
      return response.data.models;
    } catch (error) {
      console.error('AI/ML API Models Error:', error);
      throw new Error('Failed to get models');
    }
  }

  /**
   * Generate text using any text model
   */
  async generateText(
    model: string,
    prompt: string,
    options?: {
      max_tokens?: number;
      temperature?: number;
      top_p?: number;
      stream?: boolean;
    }
  ): Promise<AIMLAPIResponse> {
    try {
      const response = await this.client.post('/text/generate', {
        model,
        prompt,
        ...options,
      });

      return response.data;
    } catch (error) {
      console.error('AI/ML API Text Generation Error:', error);
      throw new Error('Failed to generate text');
    }
  }

  /**
   * Generate image using any image model
   */
  async generateImage(
    model: string,
    prompt: string,
    options?: {
      width?: number;
      height?: number;
      quality?: 'standard' | 'hd';
      style?: string;
    }
  ): Promise<AIMLAPIResponse> {
    try {
      const response = await this.client.post('/image/generate', {
        model,
        prompt,
        ...options,
      });

      return response.data;
    } catch (error) {
      console.error('AI/ML API Image Generation Error:', error);
      throw new Error('Failed to generate image');
    }
  }

  /**
   * Analyze image using vision models
   */
  async analyzeImage(
    model: string,
    imageUrl: string,
    prompt?: string
  ): Promise<AIMLAPIResponse> {
    try {
      const response = await this.client.post('/vision/analyze', {
        model,
        image_url: imageUrl,
        prompt: prompt || 'Describe this image in detail',
      });

      return response.data;
    } catch (error) {
      console.error('AI/ML API Vision Analysis Error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  /**
   * Convert text to speech
   */
  async textToSpeech(
    model: string,
    text: string,
    options?: {
      voice?: string;
      speed?: number;
      pitch?: number;
      format?: 'mp3' | 'wav' | 'ogg';
    }
  ): Promise<AIMLAPIResponse> {
    try {
      const response = await this.client.post('/speech/synthesize', {
        model,
        text,
        ...options,
      });

      return response.data;
    } catch (error) {
      console.error('AI/ML API Speech Synthesis Error:', error);
      throw new Error('Failed to synthesize speech');
    }
  }

  /**
   * Convert speech to text
   */
  async speechToText(
    model: string,
    audioUrl: string,
    options?: {
      language?: string;
      format?: 'json' | 'text';
    }
  ): Promise<AIMLAPIResponse> {
    try {
      const response = await this.client.post('/speech/transcribe', {
        model,
        audio_url: audioUrl,
        ...options,
      });

      return response.data;
    } catch (error) {
      console.error('AI/ML API Speech Transcription Error:', error);
      throw new Error('Failed to transcribe speech');
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<any> {
    try {
      const response = await this.client.get('/usage/stats');
      return response.data;
    } catch (error) {
      console.error('AI/ML API Usage Stats Error:', error);
      throw new Error('Failed to get usage statistics');
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(): Promise<any> {
    try {
      const response = await this.client.get('/account/balance');
      return response.data;
    } catch (error) {
      console.error('AI/ML API Balance Error:', error);
      throw new Error('Failed to get account balance');
    }
  }

  /**
   * Apply hackathon promo code
   */
  async applyPromoCode(promoCode: string = 'NYSOL'): Promise<any> {
    try {
      const response = await this.client.post('/account/promo', {
        promo_code: promoCode,
      });

      return response.data;
    } catch (error) {
      console.error('AI/ML API Promo Code Error:', error);
      throw new Error('Failed to apply promo code');
    }
  }

  /**
   * Create a multi-model workflow
   */
  async createWorkflow(workflowConfig: {
    name: string;
    steps: Array<{
      model: string;
      type: 'text' | 'image' | 'vision' | 'speech';
      input: any;
      output_mapping?: any;
    }>;
  }): Promise<any> {
    try {
      const response = await this.client.post('/workflows', {
        ...workflowConfig,
        created_at: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('AI/ML API Workflow Creation Error:', error);
      throw new Error('Failed to create workflow');
    }
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, inputs: any): Promise<any> {
    try {
      const response = await this.client.post(`/workflows/${workflowId}/execute`, {
        inputs,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('AI/ML API Workflow Execution Error:', error);
      throw new Error('Failed to execute workflow');
    }
  }
}

// Export singleton instance
export const aiMLAPIService = new AIMLAPIService({
  apiKey: import.meta.env.VITE_AIML_API_KEY || '',
  promoCode: 'NYSOL',
});
