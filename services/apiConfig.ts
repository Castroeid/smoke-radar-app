export type ApiMode = 'mock' | 'real';

const fallbackApiUrl = 'https://smoke-radar-app.onrender.com';
const apiMode = process.env.EXPO_PUBLIC_SMOKE_RADAR_API_MODE;
const apiUrl = process.env.EXPO_PUBLIC_SMOKE_RADAR_API_URL;

function cleanBaseUrl(url?: string) {
  return url?.trim().replace(/\/+$/, '') ?? '';
}

export const smokeRadarApiConfig = {
  mode: apiMode === 'mock' ? 'mock' : 'real',
  baseUrl: cleanBaseUrl(apiUrl || fallbackApiUrl),
  timeoutMs: 90000,
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
