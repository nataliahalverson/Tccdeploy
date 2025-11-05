/**
 * Rotas de posts migradas para o backend dedicado.
 */

import type { Request, Response, Router } from 'express';
import sanitize from 'sanitize-html';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { awardPoints } from '../services/pointsService';

const CreatePostSchema = z.object({
  title: z.string().min(3).max(120).trim(),
  content: z.string().min(3).max(10_000).trim(),
});

export function setupPostsRoutes(router: Router) {
  router.post('/posts', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;

      const parsed = CreatePostSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Invalid input',
          details: parsed.error.flatten(),
        });
      }

      const { title, content } = parsed.data;

      const cleanContent = sanitize(content, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'br'],
        allowedAttributes: { a: ['href', 'title'] },
      });

      const post = await prisma.post.create({
        data: {
          title: title.trim(),
          content: cleanContent,
          userId,
        },
      });

      awardPoints({
        userId,
        type: 'POST_CREATED',
        points: 10,
        meta: { postId: post.id },
      }).catch((error) => {
        console.error('Failed to award points:', error);
      });

      res.status(201).json(post);
    } catch (error: any) {
      console.error('Create post error:', error);
      res.status(500).json({ error: error.message || 'internal server error' });
    }
  });

  router.get('/posts', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const posts = await prisma.post.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ posts });
    } catch (error) {
      console.error('List posts error:', error);
      res.status(500).json({ message: 'internal server error' });
    }
  });

  router.get('/posts/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const post = await prisma.post.findUnique({ where: { id } });
      if (!post || post.userId !== userId) {
        return res.status(404).json({ message: 'not found' });
      }

      res.json({ post });
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({ message: 'internal server error' });
    }
  });

  router.delete('/posts/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const post = await prisma.post.findUnique({ where: { id } });
      if (!post || post.userId !== userId) {
        return res.status(404).json({ message: 'not found' });
      }

      await prisma.post.delete({ where: { id } });
      res.json({ ok: true });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ message: 'internal server error' });
    }
  });
}
