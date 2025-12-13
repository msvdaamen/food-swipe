import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Import } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import styles from "./recipes.module.css";
import { ImportRecipeDialog } from "@/features/recipes/components/import-recipe.dialog";
import { getRecipesQueryOptions, useRecipes } from "@/features/recipes/api/get-recipes";
import { CreateRecipeDialog } from "@/features/recipes/components/create-recipe-dialog";
import { useWebsocket } from "@/lib/websocket";
import { toast } from "sonner";
import { RecipeImportStatus, recipeImportStatusses, useImportingRecipeStore } from "@/features/recipes/stores/importing-recipe.store";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_layout/recipes/recipes")({
  component: RouteComponent,
  context: () => ({
    breadcrumb: "Recipes",
  }),
});

function RouteComponent() {
  const websocket = useWebsocket();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: recipes, isPending, error } = useRecipes();
  const [importRecipeDialogOpen, setImportRecipeDialogOpen] = useState(false);
  const [createRecipeDialogOpen, setCreateRecipeDialogOpen] = useState(false);

  const importingRecipeStore = useImportingRecipeStore();

  useEffect(() => {
    websocket.addEventListener('recipe-import-updated', recipeImportUpdated);
    return () => {
      websocket.removeEventListener('recipe-import-updated', recipeImportUpdated);
    };
  }, [websocket]);

  function recipeImportUpdated({ recipeId, status }: { recipeId: string; status: RecipeImportStatus}) {
    importingRecipeStore.updateStatus(recipeId, status);
  }

  function recipeImportClosed(recipeId?: string) {
    setImportRecipeDialogOpen(false)
    if (recipeId) {
      importingRecipeStore.addStatus(recipeId, 'importing');
      toast(() => <ImportRecipeToast recipeId={recipeId}/>, {
        duration: Infinity,
        id: recipeId
      });
    }
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <CreateRecipeDialog
        open={createRecipeDialogOpen}
        onOpenChange={setCreateRecipeDialogOpen}
      />
      <ImportRecipeDialog
        isOpen={importRecipeDialogOpen}
        onClose={recipeImportClosed}
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
            <Button onClick={() => setCreateRecipeDialogOpen(true)}>
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


function ImportRecipeToast({ recipeId }: { recipeId: string }) {
   const store = useImportingRecipeStore();
  const status = useImportingRecipeStore(state => state.recipesStatus[recipeId]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status && status === 'done') {
      setTimeout(() => {
        toast.dismiss(recipeId);
        store.removeStatus(recipeId);
        queryClient.invalidateQueries(getRecipesQueryOptions());
      }, 3000);
    }
  }, [status]);

  if (!status) return null;

  const index = recipeImportStatusses.indexOf(status);
  const progress = index === recipeImportStatusses.length - 1 ? 100 : Math.floor((index + 1) / recipeImportStatusses.length * 100);

  return (
    <div className="flex flex-col gap-2 w-[324px]">
      <span>Importing recipe</span>
      <Progress value={progress} className="w-full" />
      <div className="flex gap-2 items-center">
        { status !== 'done' && <Spinner /> } <span className="text-sm text-gray-400">{status}</span>
      </div>
  </div>
  )
}
