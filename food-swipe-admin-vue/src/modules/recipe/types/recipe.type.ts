export type Recipe = {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  prepTime: number | null;
  calories: number | null;
  servings: number | null;
  isPublished: boolean;
  createdAt: string;
};
