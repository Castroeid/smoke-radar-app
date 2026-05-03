export type ApiMode = 'mock' | 'real';

const env = globalThis as typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

function readEnv(key: string) {
  return env.process?.env?.[key];
}

function cleanBaseUrl(url?: string) {
  return url?.trim().replace(/\/+$/, '') ?? '';
}

export const smokeRadarApiConfig = {
  mode: readEnv('EXPO_PUBLIC_SMOKE_RADAR_API_MODE') === 'real' ? 'real' : 'mock',
  baseUrl: cleanBaseUrl(readEnv('EXPO_PUBLIC_SMOKE_RADAR_API_URL')),
  timeoutMs: 12000,
} satisfies {
  mode: ApiMode;
  baseUrl: string;
  timeoutMs: number;
};

export function shouldUseMockData() {
  return smokeRadarApiConfig.mode !== 'real' || smokeRadarApiConfig.baseUrl.length === 0;
}

export const smokeRadarEndpoints = {
  trends: '/trends',
  recipe: '/recipes/generate',
  expert: '/expert/ask',
  butchers: '/butchers/nearby',
};
