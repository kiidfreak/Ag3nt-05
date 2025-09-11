import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentStatus, AgentCapability, AgentMetadata } from '../types/Agent';

/**
 * Create a new agent
 */
export function createAgent(
  name: string,
  type: string,
  capabilities: AgentCapability[],
  metadata: Partial<AgentMetadata> = {}
): Agent {
  return {
    id: uuidv4(),
    name,
    type,
    version: '1.0.0',
    status: AgentStatus.ACTIVE,
    capabilities,
    metadata: {
      author: 'system',
      description: '',
      tags: [],
      category: 'general',
      ...metadata
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
