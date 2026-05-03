import { apiRequest } from '@/services/apiClient';
import { shouldUseMockData, smokeRadarEndpoints } from '@/services/apiConfig';
import {
  askMockExpert,
  findMockNearbyButchers,
  generateMockRecipe,
  getMockTrendingCuts,
} from '@/services/smokeRadarMock';
import type { Butcher, ExpertAnswer, RadarCut, RecipeRequest, RecipeResult } from '@/services/smokeRadarTypes';

export type { Butcher, ExpertAnswer, RadarCut, RecipeRequest, RecipeResult } from '@/services/smokeRadarTypes';

export async function getTrendingCuts(): Promise<RadarCut[]> {
  if (shouldUseMockData()) {
    return getMockTrendingCuts();
  }

  return apiRequest<RadarCut[]>(smokeRadarEndpoints.trends);
}

export async function generateRecipe(req: RecipeRequest): Promise<RecipeResult> {
  if (shouldUseMockData()) {
    return generateMockRecipe(req);
  }

  return apiRequest<RecipeResult>(smokeRadarEndpoints.recipe, {
    method: 'POST',
    body: req,
  });
}

export async function askExpert(question: string): Promise<ExpertAnswer> {
  if (shouldUseMockData()) {
    return askMockExpert(question);
  }

  return apiRequest<ExpertAnswer>(smokeRadarEndpoints.expert, {
    method: 'POST',
    body: { question },
  });
}

export async function findNearbyButchers(): Promise<Butcher[]> {
  if (shouldUseMockData()) {
    return findMockNearbyButchers();
  }

  return apiRequest<Butcher[]>(smokeRadarEndpoints.butchers);
}
