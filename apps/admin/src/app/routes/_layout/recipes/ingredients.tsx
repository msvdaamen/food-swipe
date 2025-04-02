import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CreateIngredientDialog } from "@/features/ingredient/components/create-ingredient.dialog";
import { IngredientsListView } from "@/features/ingredient/components/ingredients-list.view";
import { useDebounce } from "@uidotdev/usehooks";
export const Route = createFileRoute("/_layout/recipes/ingredients")({
  component: RouteComponent,
  context: () => ({
    breadcrumb: "Ingredients",
  }),
});

function RouteComponent() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <div>
        <div className="mb-4 w-64 relative">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-8"
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        <div className="mb-2 flex justify-end">
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            Add ingredients
          </Button>
        </div>

        <IngredientsListView search={debouncedSearch} />
      </div>
      <CreateIngredientDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
}
