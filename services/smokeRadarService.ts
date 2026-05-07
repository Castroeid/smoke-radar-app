import { apiRequest } from '@/services/apiClient';
import { shouldUseMockData, smokeRadarEndpoints } from '@/services/apiConfig';
import {
  askMockExpert,
  findMockNearbyButchers,
  generateMockRecipe,
  getMockTrendingCuts,
} from '@/services/smokeRadarMock';
import { normalizeCutName } from '@/services/cutUtils';
import type { Butcher, ExpertAnswer, RadarCut, RecipeRequest, RecipeResult } from '@/services/smokeRadarTypes';

export type { Butcher, ExpertAnswer, RadarCut, RecipeRequest, RecipeResult } from '@/services/smokeRadarTypes';

export async function getTrendingCuts(): Promise<RadarCut[]> {
  if (shouldUseMockData()) {
    return getMockTrendingCuts();
  }

  try {
    return await apiRequest<RadarCut[]>(smokeRadarEndpoints.trends);
  } catch (error) {
    console.warn('Using mock trends after API failure:', error);
    return getMockTrendingCuts();
  }
}

export async function generateRecipe(req: RecipeRequest): Promise<RecipeResult> {
  const normalizedRequest = { ...req, cut: normalizeCutName(req.cut) };

  if (shouldUseMockData()) {
    return generateMockRecipe(normalizedRequest);
  }

  try {
    return await apiRequest<RecipeResult>(smokeRadarEndpoints.recipe, {
      method: 'POST',
      body: normalizedRequest,
    });
  } catch (error) {
    console.warn('Using mock recipe after API failure:', error);
    return generateMockRecipe(normalizedRequest);
  }
}

export async function askExpert(question: string): Promise<ExpertAnswer> {
  if (shouldUseMockData()) {
    return askMockExpert(question);
  }

  try {
    return await apiRequest<ExpertAnswer>(smokeRadarEndpoints.expert, {
      method: 'POST',
      body: { question },
    });
  } catch (error) {
    console.warn('Using mock expert answer after API failure:', error);
    return askMockExpert(question);
  }
}

export async function findNearbyButchers(location?: { lat: number; lng: number } | null): Promise<Butcher[]> {
  if (shouldUseMockData()) {
    return findMockNearbyButchers();
  }

  try {
    const query = location ? `?lat=${encodeURIComponent(location.lat)}&lng=${encodeURIComponent(location.lng)}` : '';
    return await apiRequest<Butcher[]>(`${smokeRadarEndpoints.butchers}${query}`);
  } catch (error) {
    console.warn('Using mock butchers after API failure:', error);
    return findMockNearbyButchers();
  }
}
