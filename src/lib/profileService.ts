/**
 * Profile Service
 *
 * Gerencia dados do perfil e histórico de pontos
 * - getProfile: GET /api/profile
 * - getPointHistory: GET /api/profile/points
 * - updateProfile: PUT /api/profile
 */

import { httpGet, httpPut } from '@/lib/httpClient';

export interface PointEvent {
  id: string;
  type: 'POST_CREATED' | 'PROFILE_COMPLETED' | 'DAILY_CHECKIN';
  points: number;
  createdAt: string;
  meta?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  totalPoints: number;
  recentEvents: PointEvent[];
  createdAt: string;
}

export interface ProfileUpdateInput {
  name?: string;
  bio?: string;
}

/**
 * Obter perfil completo com saldo e histórico de eventos
 */
export async function getProfile(): Promise<UserProfile> {
  try {
    const profile = await httpGet<UserProfile>('/api/profile');
    return profile;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
}

/**
 * Obter histórico completo de pontos
 * Ordenado por data (mais recentes primeiro)
 */
export async function getPointHistory(limit: number = 50): Promise<PointEvent[]> {
  try {
    const events = await httpGet<PointEvent[]>(
      `/api/profile/points?limit=${limit}`
    );
    return events;
  } catch (error) {
    console.error('Erro ao buscar histórico de pontos:', error);
    return [];
  }
}

/**
 * Saldo total de pontos
 */
export async function getTotalPoints(): Promise<number> {
  try {
    const profile = await getProfile();
    return profile.totalPoints;
  } catch (error) {
    console.error('Erro ao buscar saldo:', error);
    return 0;
  }
}

/**
 * Atualizar perfil do usuário
 */
export async function updateProfile(
  input: ProfileUpdateInput
): Promise<UserProfile> {
  try {
    const profile = await httpPut<UserProfile>('/api/profile', input);
    return profile;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}

/**
 * Filtrar eventos por tipo
 */
export function filterEventsByType(
  events: PointEvent[],
  type: PointEvent['type']
): PointEvent[] {
  return events.filter((e) => e.type === type);
}

/**
 * Calcular pontos por tipo de evento
 */
export function getPointsByType(
  events: PointEvent[]
): Record<PointEvent['type'], number> {
  return events.reduce(
    (acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + event.points;
      return acc;
    },
    {} as Record<PointEvent['type'], number>
  );
}

export default {
  getProfile,
  getPointHistory,
  getTotalPoints,
  updateProfile,
  filterEventsByType,
  getPointsByType,
};
