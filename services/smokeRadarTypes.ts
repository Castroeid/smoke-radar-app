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
};

export type RecipeResult = {
  title: string;
  prepTime: string;
  difficulty: string;
  ingredients: string[];
  steps: string[];
  sideDishes: string[];
  sauces: string[];
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
};
