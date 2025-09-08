import express from 'express';
import { z } from 'zod';
import prisma from '../services/database.js';

const router = express.Router();

// Validation schemas
const createAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['basic', 'coral', 'solana', 'custom']),
  config: z.record(z.any()),
});

const updateAgentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  config: z.record(z.any()).optional(),
  status: z.enum(['active', 'inactive', 'error']).optional(),
});

// GET /api/agents - Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: agents,
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents',
    });
  }
});

// GET /api/agents/:id - Get agent by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sessions: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found',
      });
    }

    res.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent',
    });
  }
});

// POST /api/agents - Create new agent
router.post('/', async (req, res) => {
  try {
    const validatedData = createAgentSchema.parse(req.body);

    // For now, we'll use a default user ID
    // In a real app, this would come from authentication
    const defaultUserId = 'default-user-id';

    const agent = await prisma.agent.create({
      data: {
        ...validatedData,
        userId: defaultUserId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: agent,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error creating agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create agent',
    });
  }
});

// PUT /api/agents/:id - Update agent
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateAgentSchema.parse(req.body);

    const agent = await prisma.agent.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error updating agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update agent',
    });
  }
});

// DELETE /api/agents/:id - Delete agent
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.agent.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Agent deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete agent',
    });
  }
});

export default router;
