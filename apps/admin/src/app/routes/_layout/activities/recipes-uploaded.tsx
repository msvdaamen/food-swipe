import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useNavigate } from "@tanstack/react-router";
import { useRecipes } from "@/features/recipes/api/get-recipes";

export const Route = createFileRoute("/_layout/activities/recipes-uploaded")({
  component: RouteComponent,
  context: () => ({
    breadcrumb: "Recipes Uploaded",
    path: "/activities/recipes-uploaded",
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { data: recipes, isLoading } = useRecipes({ isPublished: false });
  const loadingArr = Array(5).fill(null);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium">Uploaded recipes</h1>
        <p className="text-sm text-muted-foreground">
          Recipes that are uploaded from the app
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? loadingArr.map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4}>
                      <div className="h-6 animate-pulse rounded bg-muted"></div>
                    </TableCell>
                  </TableRow>
                ))
              : recipes?.map((recipe) => (
                  <TableRow
                    key={recipe.id}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate({
                        to: "/recipes/$recipeId",
                        params: { recipeId: recipe.id },
                      })
                    }
                  >
                    <TableCell>{recipe.title}</TableCell>
                    <TableCell>UNKNOWN</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(recipe.createdAt), "PPP")}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
