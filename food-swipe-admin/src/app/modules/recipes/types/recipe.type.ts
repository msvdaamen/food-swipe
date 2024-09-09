export type Recipe = {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  prepTime: number;
  calories: number;
  servings: number;
  isPublished: boolean;
  createdAt: string;
};
