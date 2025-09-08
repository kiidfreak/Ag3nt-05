import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a default user
  const user = await prisma.user.upsert({
    where: { email: 'admin@agentlabs.io' },
    update: {},
    create: {
      email: 'admin@agentlabs.io',
      name: 'Admin User',
      avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create sample agents
  const agents = await Promise.all([
    prisma.agent.upsert({
      where: { id: 'agent-1' },
      update: {},
      create: {
        id: 'agent-1',
        name: 'Basic Chat Agent',
        description: 'A simple conversational agent for basic interactions',
        type: 'basic',
        config: {
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: 'You are a helpful assistant.',
        },
        status: 'active',
        userId: user.id,
      },
    }),
    prisma.agent.upsert({
      where: { id: 'agent-2' },
      update: {},
      create: {
        id: 'agent-2',
        name: 'Coral Protocol Agent',
        description: 'An agent specialized in Coral Protocol interactions',
        type: 'coral',
        config: {
          coralApiKey: 'demo-key',
          network: 'devnet',
          features: ['nft-minting', 'token-transfers'],
        },
        status: 'active',
        userId: user.id,
      },
    }),
    prisma.agent.upsert({
      where: { id: 'agent-3' },
      update: {},
      create: {
        id: 'agent-3',
        name: 'Solana DeFi Agent',
        description: 'An agent for Solana DeFi operations',
        type: 'solana',
        config: {
          rpcUrl: 'https://api.devnet.solana.com',
          walletAddress: 'demo-wallet-address',
          programs: ['serum', 'raydium'],
        },
        status: 'inactive',
        userId: user.id,
      },
    }),
  ]);

  console.log('✅ Created agents:', agents.map((a: any) => a.name));

  // Create sample sessions
  const sessions = await Promise.all([
    prisma.session.create({
      data: {
        name: 'Chat Session 1',
        status: 'active',
        config: {
          temperature: 0.7,
          maxMessages: 50,
        },
        metadata: {
          source: 'studio',
          tags: ['demo', 'chat'],
        },
        userId: user.id,
        agentId: agents[0].id,
      },
    }),
    prisma.session.create({
      data: {
        name: 'Coral NFT Session',
        status: 'completed',
        config: {
          network: 'devnet',
          autoApprove: false,
        },
        metadata: {
          source: 'studio',
          tags: ['nft', 'coral'],
        },
        userId: user.id,
        agentId: agents[1].id,
        endedAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Created sessions:', sessions.map((s: any) => s.name));

  // Create sample messages
  const messages = await Promise.all([
    prisma.message.create({
      data: {
        role: 'user',
        content: 'Hello! Can you help me create an NFT?',
        sessionId: sessions[0].id,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    }),
    prisma.message.create({
      data: {
        role: 'agent',
        content: 'Hello! I\'d be happy to help you create an NFT. What kind of NFT would you like to create?',
        sessionId: sessions[0].id,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    }),
    prisma.message.create({
      data: {
        role: 'user',
        content: 'I want to create a digital art NFT with my logo.',
        sessionId: sessions[0].id,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    }),
  ]);

  console.log('✅ Created messages:', messages.length);

  // Create sample events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        type: 'agent_started',
        data: {
          agentId: agents[0].id,
          timestamp: new Date().toISOString(),
        },
        sessionId: sessions[0].id,
      },
    }),
    prisma.event.create({
      data: {
        type: 'message_sent',
        data: {
          messageId: messages[0].id,
          timestamp: new Date().toISOString(),
        },
        sessionId: sessions[0].id,
      },
    }),
  ]);

  console.log('✅ Created events:', events.length);

  // Create sample flow
  const flow = await prisma.flow.create({
    data: {
      name: 'NFT Creation Flow',
      description: 'A complete flow for creating and minting NFTs',
      config: {
        version: '1.0.0',
        triggers: ['user_input'],
        steps: [
          {
            id: 'step-1',
            type: 'input',
            name: 'Get NFT Details',
          },
          {
            id: 'step-2',
            type: 'agent',
            name: 'Process Request',
            agentId: agents[1].id,
          },
          {
            id: 'step-3',
            type: 'action',
            name: 'Mint NFT',
          },
        ],
      },
      status: 'published',
      userId: user.id,
    },
  });

  console.log('✅ Created flow:', flow.name);

  // Create flow nodes
  const flowNodes = await Promise.all([
    prisma.flowNode.create({
      data: {
        type: 'input',
        config: {
          name: 'NFT Details Input',
          fields: ['name', 'description', 'image'],
        },
        position: { x: 100, y: 100 },
        flowId: flow.id,
      },
    }),
    prisma.flowNode.create({
      data: {
        type: 'agent',
        config: {
          name: 'Coral Agent',
          settings: {
            temperature: 0.7,
          },
        },
        position: { x: 300, y: 100 },
        flowId: flow.id,
        agentId: agents[1].id,
      },
    }),
    prisma.flowNode.create({
      data: {
        type: 'action',
        config: {
          name: 'Mint NFT',
          action: 'mint_nft',
          parameters: {
            network: 'devnet',
          },
        },
        position: { x: 500, y: 100 },
        flowId: flow.id,
      },
    }),
  ]);

  console.log('✅ Created flow nodes:', flowNodes.length);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
