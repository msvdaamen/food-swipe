
export type RecipeBook = {
    id: number;
    userId: string;
    coverImage: string | null;
    title: string;
    isLiked: boolean;
    createdAt: Date;
    updatedAt: Date;
}