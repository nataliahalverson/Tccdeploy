/**
 * Auth Service
 *
 * Gerencia autenticação via cookies (sem localStorage)
 * - login: POST /api/auth/login
 * - register: POST /api/auth/register
 * - logout: POST /api/auth/logout
 * - getCurrentUser: GET /api/auth/me
 *
 * Cookies são gerenciados automaticamente pelo navegador.
 * Nenhuma manipulação manual de tokens necessária.
 */

import { httpClient, httpGet, httpPost } from '@/lib/httpClient';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

/**
 * Login
 * Retorna cookie httpOnly automaticamente
 */
export async function login(input: LoginInput): Promise<AuthResponse> {
  try {
    const response = await httpPost<AuthResponse>('/api/auth/login', input);
    return response;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw new Error('Falha no login. Verifique suas credenciais.');
  }
}

/**
 * Registro
 * Cria novo usuário e retorna cookie
 */
export async function register(input: RegisterInput): Promise<AuthResponse> {
  try {
    const response = await httpPost<AuthResponse>('/api/auth/register', input);
    return response;
  } catch (error) {
    console.error('Erro ao registrar:', error);
    throw new Error('Falha no registro. Tente novamente.');
  }
}

/**
 * Obter usuário atual
 * Requer cookie válido no navegador
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await httpGet<User>('/api/auth/me');
    return user;
  } catch (error) {
    // 401 Unauthorized = sem cookie válido
    console.debug('Usuário não autenticado');
    return null;
  }
}

/**
 * Logout
 * Limpa cookie no servidor
 */
export async function logout(): Promise<void> {
  try {
    await httpPost('/api/auth/logout');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
}

/**
 * Verificar se usuário está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

export default {
  login,
  register,
  getCurrentUser,
  logout,
  isAuthenticated,
};
