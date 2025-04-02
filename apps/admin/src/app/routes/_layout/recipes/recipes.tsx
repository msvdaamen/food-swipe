import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Import } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import styles from "./recipes.module.css";
import { useRecipes } from "@/features/recipes/hooks/recipe.hooks";
import { ImportRecipeDialog } from "@/features/recipes/components/import-recipe.dialog";

export const Route = createFileRoute("/_layout/recipes/recipes")({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: recipes, isPending, error } = useRecipes();
  const [importRecipeDialogOpen, setImportRecipeDialogOpen] = useState(false);
  const openCreateRecipeDialog = () => {
    // TODO: Implement create recipe dialog
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <ImportRecipeDialog
        isOpen={importRecipeDialogOpen}
        onClose={() => setImportRecipeDialogOpen(false)}
      />
      <div className="p-4">
        <div className="mb-4 flex justify-between">
          <div className="w-64">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={openCreateRecipeDialog}>
              <Plus className="size-4" />
              Create
            </Button>
            <Button onClick={() => setImportRecipeDialogOpen(true)}>
              <Import className="size-4" />
              Import
            </Button>
          </div>
        </div>

        <div className={`${styles.content} gap-4`}>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="cursor-pointer rounded border transition-transform hover:scale-105 hover:shadow bg-primary-foreground"
              onClick={() =>
                navigate({
                  to: "/recipes/$recipeId",
                  params: { recipeId: recipe.id },
                })
              }
            >
              {recipe.coverImageUrl ? (
                <div>
                  <img
                    src={recipe.coverImageUrl}
                    width={5120}
                    height={1440}
                    alt="Recipe Image"
                    className="rounded-t"
                  />
                </div>
              ) : (
                <div className="flex h-48 w-full cursor-pointer items-center justify-center bg-gray-100">
                  <Search className="size-10 text-gray-400" />
                </div>
              )}
              <div className="p-2">
                <h3 className="font-bold">{recipe.title}</h3>
                <div className="description">
                  <p className="line-clamp-2">{recipe.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
