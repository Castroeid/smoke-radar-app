import { smokeRadarApiConfig } from '@/services/apiConfig';

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (smokeRadarApiConfig.baseUrl.length === 0) {
    throw new ApiError('Missing Smoke Radar API base URL');
  }

  const response = await fetch(`${smokeRadarApiConfig.baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(`Smoke Radar API request failed with status ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}
