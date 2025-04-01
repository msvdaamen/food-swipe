import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Search, PencilIcon, TrashIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import AppPagination from "@/common/components/app-pagination";
import {
  useDeleteIngredient,
  useIngredients,
} from "@/modules/ingredient/hooks/ingredient.hooks";
import { CreateIngredientDialog } from "@/modules/ingredient/components/create-ingredient.dialog";
import { UpdateIngredientDialog } from "@/modules/ingredient/components/update-ingredient.dialog copy";

export const Route = createFileRoute("/_layout/recipes/ingredients")({
  component: RouteComponent,
  context: () => ({
    breadcrumb: "Ingredients",
  }),
});

function RouteComponent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | null
  >(null);
  const [selectedIngredientName, setSelectedIngredientName] = useState("");

  const { data, isError, error, isPending } = useIngredients({
    page,
    search,
    amount: 10,
  });
  const deleteIngredient = useDeleteIngredient();

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  // These functions should be implemented with your API calls
  const openCreateIngredientDialog = () => {
    setIsCreateOpen(true);
  };

  const openUpdateIngredientDialog = (id: number, name: string) => {
    setIsUpdateOpen(true);
    setSelectedIngredientId(id);
    setSelectedIngredientName(name);
  };

  const closeUpdateIngredientDialog = () => {
    setIsUpdateOpen(false);
    setSelectedIngredientId(null);
    setSelectedIngredientName("");
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div>
        <div className="mb-4 w-64 relative">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            className="pr-8"
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        <div className="mb-2 flex justify-end">
          <Button size="sm" onClick={openCreateIngredientDialog}>
            Add ingredients
          </Button>
        </div>

        <div className="table-container rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-full">Name</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending
                ? [1, 2, 3, 4, 5].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4}>
                        <div className="h-6 animate-pulse rounded bg-muted"></div>
                      </TableCell>
                    </TableRow>
                  ))
                : data.data.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell>{ingredient.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              openUpdateIngredientDialog(
                                ingredient.id,
                                ingredient.name
                              )
                            }
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                              deleteIngredient.mutate(ingredient.id)
                            }
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-1">
          <AppPagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
      <CreateIngredientDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <UpdateIngredientDialog
        isOpen={isUpdateOpen}
        onClose={closeUpdateIngredientDialog}
        ingredientId={selectedIngredientId!}
        name={selectedIngredientName}
      />
    </>
  );
}
