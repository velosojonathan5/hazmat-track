const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Falha na requisição para ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
