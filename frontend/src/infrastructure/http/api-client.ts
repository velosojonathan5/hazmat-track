const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface RequestOptions {
  token?: string;
}

function buildHeaders(token?: string, hasBody = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function assertOk(response: Response, path: string): Promise<void> {
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
}

export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: buildHeaders(options.token) });
  await assertOk(response, path);
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(options.token, true),
    body: JSON.stringify(body),
  });
  await assertOk(response, path);
  return response.json() as Promise<T>;
}

export async function apiGetBlob(path: string, options: RequestOptions = {}): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: buildHeaders(options.token) });
  await assertOk(response, path);
  return response.blob();
}
