import express from 'express';
import { z } from 'zod';
import prisma from '../services/database.js';

const router = express.Router();

// Validation schemas
const createSessionSchema = z.object({
  name: z.string().optional(),
  agentId: z.string(),
  config: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

const updateSessionSchema = z.object({
  name: z.string().optional(),
  status: z.enum(['active', 'completed', 'error', 'paused']).optional(),
  config: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

// GET /api/sessions - Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        _count: {
          select: {
            messages: true,
            events: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions',
    });
  }
});

// GET /api/sessions/:id - Get session by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            type: true,
            config: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        events: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session',
    });
  }
});

// POST /api/sessions - Create new session
router.post('/', async (req, res) => {
  try {
    const validatedData = createSessionSchema.parse(req.body);

    // For now, we'll use a default user ID
    const defaultUserId = 'default-user-id';

    const session = await prisma.session.create({
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
        agent: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create session',
    });
  }
});

// PUT /api/sessions/:id - Update session
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateSessionSchema.parse(req.body);

    const session = await prisma.session.update({
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
        agent: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error updating session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update session',
    });
  }
});

// DELETE /api/sessions/:id - Delete session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.session.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete session',
    });
  }
});

// POST /api/sessions/:id/messages - Add message to session
router.post('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, content, metadata } = req.body;

    if (!role || !content) {
      return res.status(400).json({
        success: false,
        error: 'Role and content are required',
      });
    }

    const message = await prisma.message.create({
      data: {
        sessionId: id,
        role,
        content,
        metadata: metadata || {},
      },
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add message',
    });
  }
});

export default router;
