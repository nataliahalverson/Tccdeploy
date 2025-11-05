/**
 * Serviço de pontuação reaproveitado na migração do backend dedicado.
 */

import { createHash } from 'crypto';
import { prisma } from '../lib/prisma';

function normalizeMeta(meta: unknown): Record<string, any> {
  if (!meta || typeof meta !== 'object') return {};
  const obj = meta as Record<string, any>;
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value != null));
}

function getMetaHash(meta: unknown): string {
  const normalized = normalizeMeta(meta);
  const sorted = Object.keys(normalized).sort();
  const stringified = JSON.stringify(sorted.map((key) => [key, normalized[key]]));
  return createHash('sha256').update(stringified).digest('hex');
}

export interface AwardPointsParams {
  userId: string;
  type: 'POST_CREATED' | 'PROFILE_COMPLETED' | 'DAILY_CHECKIN';
  points: number;
  meta?: Record<string, any>;
}

export interface PointsResponse {
  balance: number;
  activities: any[];
}

export async function awardPoints(params: AwardPointsParams): Promise<PointsResponse> {
  if (!params.userId || typeof params.userId !== 'string') {
    throw new Error('Invalid userId');
  }
  if (!params.type || typeof params.type !== 'string') {
    throw new Error('Invalid type');
  }
  if (typeof params.points !== 'number' || params.points < 0) {
    throw new Error('Invalid points (must be number >= 0)');
  }

  const metaHash = getMetaHash(params.meta);
  const normalizedMeta = normalizeMeta(params.meta);

  try {
    await prisma.pointEvent.create({
      data: {
        userId: params.userId,
        type: params.type,
        points: params.points,
        meta: normalizedMeta,
        metaHash,
      },
    });
  } catch (error: any) {
    if (error?.code !== 'P2002') {
      console.error('❌ PointEvent creation error:', error);
      throw error;
    }
    console.log(`⚠️  PointEvent duplicado: userId=${params.userId} type=${params.type} metaHash=${metaHash}`);
  }

  const [balance, activities] = await Promise.all([
    prisma.pointEvent.aggregate({
      _sum: { points: true },
      where: { userId: params.userId },
    }),
    prisma.pointEvent.findMany({
      where: { userId: params.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  return {
    balance: balance._sum.points ?? 0,
    activities: activities.map((activity) => ({
      ...activity,
      meta: activity.meta ?? {},
    })),
  };
}

export async function getUserProfile(userId: string) {
  const [user, balance, activities] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    }),
    prisma.pointEvent.aggregate({
      _sum: { points: true },
      where: { userId },
    }),
    prisma.pointEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  return {
    user,
    balance: balance._sum.points ?? 0,
    activities: activities.map((activity) => ({
      ...activity,
      meta: activity.meta ?? {},
    })),
  };
}
