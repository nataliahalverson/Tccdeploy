/**
 * Post Service
 *
 * Exemplos de uso com httpClient (sem localStorage):
 * - createPost: POST /api/posts
 * - getPosts: GET /api/posts
 * - getPostById: GET /api/posts/:id
 */

import { httpClient, httpGet, httpPost } from '@/lib/httpClient';

export interface PostInput {
  title: string;
  content: string;
}

export interface Post extends PostInput {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostResponse {
  post: Post;
  pointsEarned?: number;
}

/**
 * Criar novo post
 * Dispara evento PointEvent (POST_CREATED, 10 pts) automaticamente
 */
export async function createPost(input: PostInput): Promise<PostResponse> {
  try {
    const response = await httpPost<PostResponse>('/api/posts', input);
    return response;
  } catch (error) {
    console.error('Erro ao criar post:', error);
    throw error;
  }
}

/**
 * Listar posts do usuário
 */
export async function getUserPosts(): Promise<Post[]> {
  try {
    const posts = await httpGet<Post[]>('/api/posts');
    return posts;
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return [];
  }
}

/**
 * Obter post por ID
 */
export async function getPostById(postId: string): Promise<Post> {
  try {
    const post = await httpGet<Post>(`/api/posts/${postId}`);
    return post;
  } catch (error) {
    console.error(`Erro ao buscar post ${postId}:`, error);
    throw error;
  }
}

/**
 * Listar todos os posts (público)
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    const posts = await httpGet<Post[]>('/api/posts/public');
    return posts;
  } catch (error) {
    console.error('Erro ao buscar posts públicos:', error);
    return [];
  }
}

export default {
  createPost,
  getUserPosts,
  getPostById,
  getAllPosts,
};
