import { Agent, AgentConfig, AgentContext } from '@agent-labs/sdk';
import { z } from 'zod';

// Define input/output schemas
const InputSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  options: z.object({
    format: z.enum(['json', 'text', 'xml']).default('json'),
  }).optional(),
});

const OutputSchema = z.object({
  result: z.string(),
  metadata: z.object({
    processedAt: z.string(),
    processingTime: z.number(),
  }),
});

type Input = z.infer<typeof InputSchema>;
type Output = z.infer<typeof OutputSchema>;

// Agent configuration
const config: AgentConfig = {
  name: 'basic-agent',
  version: '1.0.0',
  description: 'A basic agent template for Agent Labs OS',
  capabilities: ['message-processing', 'data-transformation'],
  inputs: InputSchema,
  outputs: OutputSchema,
};

// Create the agent
const agent = new Agent(config);

// Define message handlers
agent.onMessage('process', async (input: Input, context: AgentContext): Promise<Output> => {
  const startTime = Date.now();
  
  try {
    // Validate input
    const validatedInput = InputSchema.parse(input);
    
    // Process the message
    const result = await processMessage(validatedInput.message, validatedInput.options);
    
    // Calculate processing time
    const processingTime = Date.now() - startTime;
    
    // Return result
    return {
      result,
      metadata: {
        processedAt: new Date().toISOString(),
        processingTime,
      },
    };
  } catch (error) {
    context.logger.error('Error processing message:', error);
    throw new Error(`Failed to process message: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

// Health check handler
agent.onMessage('health', async (): Promise<{ status: string; timestamp: string }> => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
  };
});

// Message processing function
async function processMessage(message: string, options?: { format: string }): Promise<string> {
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const format = options?.format || 'json';
  
  switch (format) {
    case 'json':
      return JSON.stringify({ 
        original: message, 
        processed: message.toUpperCase(),
        format: 'json'
      });
    case 'text':
      return `Processed: ${message.toUpperCase()}`;
    case 'xml':
      return `<result><original>${message}</original><processed>${message.toUpperCase()}</processed></result>`;
    default:
      return message.toUpperCase();
  }
}

// Error handling
agent.onError((error: Error, context: AgentContext) => {
  context.logger.error('Agent error:', error);
});

// Start the agent
async function start() {
  try {
    await agent.start();
    console.log('Basic agent started successfully');
  } catch (error) {
    console.error('Failed to start agent:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down agent...');
  await agent.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down agent...');
  await agent.stop();
  process.exit(0);
});

// Start the agent if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export { agent, config };
