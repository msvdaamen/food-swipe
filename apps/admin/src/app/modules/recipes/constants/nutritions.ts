export const nutritions = [
  'carbohydrates',
  'energy',
  'fat',
  'fibers',
  'protein',
  'saturatedFat',
  'sodium',
  'sugar',
] as const;

export type Nutrition = (typeof nutritions)[number];

export const nutritionOrder: Nutrition[] = [
  'energy',
  'carbohydrates',
  'sugar',
  'sodium',
  'protein',
  'fat',
  'saturatedFat',
  'fibers',
] as const;

export const nutritionUnits = ['g', 'mg', 'kcal'] as const;

export type NutritionUnit = (typeof nutritionUnits)[number];
