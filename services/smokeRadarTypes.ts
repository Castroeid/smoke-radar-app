export type RadarCut = {
  id: string;
  title: string;
  description: string;
  momentum: string;
  heatScore: string;
};

export type RecipeRequest = {
  cut: string;
  method: string;
  effort: string;
  kosherPreference: string;
  seasoningStyle: string;
};

export type RecipeSideDish = {
  title: string;
  description: string;
  steps: string[];
};

export type RecipeSauce = {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
};

export type RecipeResult = {
  title: string;
  prepTime: string;
  difficulty: string;
  ingredients: string[];
  methodGuide: string[];
  steps: string[];
  sideDishes: RecipeSideDish[];
  sauces: RecipeSauce[] | string[];
};

export type ExpertAnswer = {
  question: string;
  answer: string;
  tips: string[];
};

export type Butcher = {
  id: string;
  name: string;
  rating: string;
  address: string;
  reviewHighlight: string;
  mapsUrl?: string;
};
