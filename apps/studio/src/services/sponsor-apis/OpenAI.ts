/**
 * OpenAI API Integration
 * Real integration with OpenAI's GPT-4, DALL-E, and Whisper APIs
 */

import axios from 'axios';

export interface OpenAIConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIService {
  private config: OpenAIConfig;
  private client: any;

  constructor(config: OpenAIConfig) {
    this.config = {
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-4',
      ...config
    };
    
    this.client = axios.create({
      baseURL: this.config.baseURL,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generate workflow from natural language description
   */
  async generateWorkflow(description: string): Promise<any> {
    const systemPrompt = `You are an expert workflow designer for Agent OS. 
    Convert natural language descriptions into structured agent workflows.
    
    Return a JSON object with this structure:
    {
      "name": "Workflow Name",
      "description": "Workflow description",
      "agents": [
        {
          "id": "agent1",
          "name": "Agent Name",
          "type": "agent|condition|action|input|output",
          "category": "ai|data|security|integration|processing",
          "description": "Agent description",
          "config": {}
        }
      ],
      "connections": [
        {
          "from": "agent1",
          "to": "agent2",
          "type": "data|control|event"
        }
      ]
    }`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: description }
    ];

    try {
      const response = await this.client.post('/chat/completions', {
        model: this.config.model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate workflow');
    }
  }

  /**
   * Generate agent code from specification
   */
  async generateAgentCode(specification: string): Promise<string> {
    const systemPrompt = `You are an expert developer. Generate TypeScript code for an Agent OS agent based on the specification.
    
    Return only the code, no explanations. The code should:
    - Extend BaseAgent class
    - Implement required methods
    - Include proper error handling
    - Follow TypeScript best practices`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: specification }
    ];

    try {
      const response = await this.client.post('/chat/completions', {
        model: this.config.model,
        messages,
        temperature: 0.3,
        max_tokens: 1500,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate agent code');
    }
  }

  /**
   * Transcribe audio using Whisper
   */
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    try {
      const response = await this.client.post('/audio/transcriptions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.text;
    } catch (error) {
      console.error('OpenAI Whisper Error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  /**
   * Generate image using DALL-E
   */
  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await this.client.post('/images/generations', {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      });

      return response.data.data[0].url;
    } catch (error) {
      console.error('OpenAI DALL-E Error:', error);
      throw new Error('Failed to generate image');
    }
  }

  /**
   * Get embeddings for text
   */
  async getEmbeddings(text: string): Promise<number[]> {
    try {
      const response = await this.client.post('/embeddings', {
        model: 'text-embedding-ada-002',
        input: text,
      });

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('OpenAI Embeddings Error:', error);
      throw new Error('Failed to get embeddings');
    }
  }
}

// Export singleton instance
export const openAIService = new OpenAIService({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
});
