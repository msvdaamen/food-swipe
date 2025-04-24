import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { PencilIcon } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader } from "@/components/ui/table";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import AppPagination from "@/components/app-pagination";
import { UpdateIngredientDialog } from "./update-ingredient.dialog";
import { useIngredients } from "../api/get-ingredients";
import { useDeleteIngredient } from "../api/delete-ingredient";

type Props  = {
  search: string;
}

export const IngredientsListView = ({search}: Props) => {
  const [page, setPage] = useState(1);
  const [prevSearch, setPrevSearch] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | null
  >(null);
  const [selectedIngredientName, setSelectedIngredientName] = useState("");
  
  if (prevSearch !== search) {
    setPage(1);
    setPrevSearch(search);
  }
  const { data, isPending, error } = useIngredients({
    page,
    search,
    amount: 10,
  });
  const deleteIngredient = useDeleteIngredient();

  const openUpdateIngredientDialog = (id: number, name: string) => {
    setIsModalOpen(true);
    setSelectedIngredientId(id);
    setSelectedIngredientName(name);
  };

  const closeUpdateIngredientDialog = () => {
    setIsModalOpen(false);
    setSelectedIngredientId(null);
    setSelectedIngredientName("");
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
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
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
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
                              deleteIngredient.mutate({ ingredientId: ingredient.id })
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
            totalPages={data?.pagination.totalPages ?? 0}
            onPageChange={setPage}
          />
        </div>
        <UpdateIngredientDialog
        isOpen={isModalOpen}
        onClose={closeUpdateIngredientDialog}
        ingredientId={selectedIngredientId!}
        name={selectedIngredientName}
      />
        </>
  )
};
