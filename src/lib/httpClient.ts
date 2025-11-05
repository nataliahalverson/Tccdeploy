/**
 * HTTP Client Padronizado com Autenticação via Cookies
 *
 * Features:
 * - credentials: 'include' para enviar cookies em todas as requisições
 * - Content-Type automático (JSON)
 * - Tratamento de erro padrão
 * - Sem localStorage; autenticação apenas via httpOnly cookies
 *
 * Uso:
 *   const res = await httpClient('/api/posts', {
 *     method: 'POST',
 *     body: JSON.stringify({ title: '...', content: '...' })
 *   });
 *   if (!res.ok) throw new Error(await res.text());
 *   return res.json();
 */

interface HttpClientInit extends RequestInit {
  headers?: Record<string, string>;
}

export async function httpClient(
  path: string,
  init: HttpClientInit = {}
): Promise<Response> {
  const base =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    '';
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const isAbsolutePath = /^https?:\/\//i.test(path);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = isAbsolutePath
    ? path
    : trimmedBase
    ? `${trimmedBase}${normalizedPath}`
    : normalizedPath;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };

  const response = await fetch(url, {
    credentials: 'include', // ✅ Envia cookies httpOnly
    headers,
    ...init,
  });

  return response;
}

/**
 * GET wrapper
 */
export async function httpGet<T = any>(path: string): Promise<T> {
  const res = await httpClient(path, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`GET ${path}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * POST wrapper
 */
export async function httpPost<T = any>(
  path: string,
  body?: any
): Promise<T> {
  const res = await httpClient(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`POST ${path}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * PUT wrapper
 */
export async function httpPut<T = any>(
  path: string,
  body?: any
): Promise<T> {
  const res = await httpClient(path, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`PUT ${path}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * DELETE wrapper
 */
export async function httpDelete<T = any>(path: string): Promise<T> {
  const res = await httpClient(path, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`DELETE ${path}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Logout: limpa cookie no servidor
 */
export async function logout(): Promise<void> {
  await httpClient('/api/auth/logout', { method: 'POST' });
}

export default httpClient;
