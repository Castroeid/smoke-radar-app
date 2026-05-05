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

  try {
    return await apiRequest<RadarCut[]>(smokeRadarEndpoints.trends);
  } catch (error) {
    console.warn('Using mock trends after API failure:', error);
    return getMockTrendingCuts();
  }
}

export async function generateRecipe(req: RecipeRequest): Promise<RecipeResult> {
  if (shouldUseMockData()) {
    return generateMockRecipe(req);
  }

  try {
    return await apiRequest<RecipeResult>(smokeRadarEndpoints.recipe, {
      method: 'POST',
      body: req,
    });
  } catch (error) {
    console.warn('Using mock recipe after API failure:', error);
    return generateMockRecipe(req);
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

export async function findNearbyButchers(): Promise<Butcher[]> {
  if (shouldUseMockData()) {
    return findMockNearbyButchers();
  }

  try {
    return await apiRequest<Butcher[]>(smokeRadarEndpoints.butchers);
  } catch (error) {
    console.warn('Using mock butchers after API failure:', error);
    return findMockNearbyButchers();
  }
}
