export type RecipeModel = {
    id: number,
    title: string,
    description: string | null,
    prepTime: number | null,
    servings: number | null,
    isPublished: boolean,
    coverImageUrl: string | null,
    createdAt: Date,
    updatedAt: Date
};
