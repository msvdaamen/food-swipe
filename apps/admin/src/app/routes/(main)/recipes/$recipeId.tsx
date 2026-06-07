import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CircleHelp, GripVertical, Loader, Pencil, Trash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  type Nutrition,
  nutritionOrder,
  type NutritionUnit,
  nutritionUnits,
  type RecipeNutrition
} from "@food-swipe/types";
import { SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select, SelectItem } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  ManageRecipeStepDialog,
  useManageRecipeStepDialog
} from "@/features/recipes/components/manage-recipe-step-dialog";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import type { RecipeStep } from "@food-swipe/types";
import {
  CreateRecipeIngredientDialog,
  useCreateRecipeIngredientDialog
} from "@/features/recipes/components/create-recipe-ingredient.dialog";
import {
  UpdateRecipeIngredientDialog,
  useUpdateRecipeIngredientDialog
} from "@/features/recipes/components/update-recipe-ingredient.dialog";
import { useDeleteRecipe } from "@/features/recipes/api/delete-recipe";
import { useRecipe } from "@/features/recipes/api/get-recipe";
import { useRecipeIngredientDelete } from "@/features/recipes/api/ingredients/delete-recipe-ingredient";
import { useRecipeIngredients } from "@/features/recipes/api/ingredients/get-recipe-ingredients";
import { useRecipeNutrition } from "@/features/recipes/api/nutritions/get-recipe-nutrition";
import { useRecipeNutritionUpdate } from "@/features/recipes/api/nutritions/update-recipe-nutrition";
import { useRecipeStepDelete } from "@/features/recipes/api/steps/delete-recipe-step";
import { useRecipeSteps } from "@/features/recipes/api/steps/get-recipe-steps";
import { useRecipeStepsReorder } from "@/features/recipes/api/steps/reorder-recipe-steps";
import { useUpdateRecipe } from "@/features/recipes/api/update-recipe";
import { useUpdateRecipeImage } from "@/features/recipes/api/update-recipe-image";

export const Route = createFileRoute("/(main)/recipes/$recipeId")({
  component: RouteComponent,
  context: () => ({
    breadcrumb: "Recipes"
  })
});

function RouteComponent() {
  const navigate = useNavigate();
  const { recipeId } = Route.useParams();
  const { data: recipe, isLoading } = useRecipe({ recipeId });
  const deleteRecipe = useDeleteRecipe({
    onSuccess: () => {
      navigate({ to: "/recipes/recipes" });
    }
  });
  const updateRecipeImage = useUpdateRecipeImage({ recipeId });

  const updateRecipe = useUpdateRecipe();

  const [isChangingImage, setIsChangingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteRecipe = (id: string) => {
    deleteRecipe.mutate(id);
  };

  const handleUpdateRecipe = async (field: string, value: string | number | boolean) => {
    updateRecipe.mutate({
      recipeId,
      data: {
        [field]: value
      }
    });
  };

  const handleFileUpload = async () => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      const file = fileInput.files?.[0];
      if (file) {
        setIsChangingImage(true);
        try {
          await updateRecipeImage.mutateAsync(file);
        } finally {
          setIsChangingImage(false);
          fileInput.value = "";
        }
      }
    }
  };

  const openFileUploader = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <>
      <div className="p-4">
        <div className="flex justify-end">
          <Button variant="destructive" onClick={() => handleDeleteRecipe(recipe.id)}>
            Delete
          </Button>
        </div>

        <div className="flex">
          <div className="w-1/3">
            <div onClick={openFileUploader}>
              {isChangingImage ? (
                <div className="flex aspect-video w-full cursor-pointer items-center justify-center">
                  <Loader className="h-10 w-10 animate-spin" />
                </div>
              ) : recipe.coverImageUrl ? (
                <div className="cursor-pointer">
                  <img
                    src={recipe.coverImageUrl}
                    className="min-w-10 min-h-10 bg-amber-500"
                    alt=""
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full cursor-pointer items-center justify-center bg-gray-100">
                  <CircleHelp />
                </div>
              )}
              <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} />
            </div>

            <div className="mt-4 flex gap-2">
              <div>
                <Label>Time</Label>
                <Input
                  type="number"
                  defaultValue={recipe.prepTime?.toString()}
                  onBlur={(e) => handleUpdateRecipe("prepTime", e.target.value)}
                />
              </div>
              <div>
                <Label>Servings</Label>
                <Input
                  type="number"
                  defaultValue={recipe.servings?.toString()}
                  onBlur={(e) => handleUpdateRecipe("servings", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="w-2/3 p-8 pt-0">
            <h1 className="font-bold">
              <Label>Title</Label>
              <Input
                defaultValue={recipe.title}
                onBlur={(e) => handleUpdateRecipe("title", e.target.value)}
              />
            </h1>
            <p className="mt-1">
              <Label>Description</Label>
              <Textarea
                className="w-full rounded-md border p-2"
                defaultValue={recipe.description ?? ""}
                onBlur={(e) => handleUpdateRecipe("description", e.target.value)}
              />
            </p>
            <div className="mt-1 flex gap-2">
              <Checkbox
                id="is-published"
                defaultChecked={recipe.isPublished}
                onCheckedChange={(checked) => handleUpdateRecipe("isPublished", !!checked)}
              />
              <Label htmlFor="is-published">Is published</Label>
            </div>
          </div>
        </div>

        <Ingredients recipeId={recipe.id} />

        <Steps recipeId={recipe.id} />

        <Nutritions recipeId={recipe.id} />
      </div>
    </>
  );
}

function Ingredients({ recipeId }: { recipeId: string }) {
  const createRecipeDialog = useCreateRecipeIngredientDialog();
  const updateRecipeIngredientDialog = useUpdateRecipeIngredientDialog();
  const { data: ingredients, isLoading } = useRecipeIngredients(recipeId);
  const deleteIngredient = useRecipeIngredientDelete();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8">
      <div className="mb-1 flex gap-2">
        <h2 className="grow text-2xl font-bold">Ingredients</h2>
        <Button size="sm" onClick={createRecipeDialog.open}>
          Add ingredient
        </Button>
      </div>
      <div className="table-container mt-2">
        <div className="ingredients border rounded">
          <div className="flex px-2 py-2 bg-muted">
            <div className="name flex-grow">Ingredient</div>
            <div className="amount min-w-20 flex-shrink">Amount</div>
            <div className="min-w-28 flex-shrink"></div>
          </div>
          {ingredients?.map((ingredient) => (
            <div
              key={ingredient.ingredientId}
              className="t-row flex items-center px-2 py-1 border-t"
            >
              <div className="name flex-grow">{ingredient.ingredient}</div>
              <div className="amount min-w-20 flex-shrink">
                {ingredient.amount}
                {ingredient.measurement}
              </div>
              <div className="flex min-w-28 flex-shrink gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateRecipeIngredientDialog.open(ingredient)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    deleteIngredient.mutate({
                      recipeId,
                      ingredientId: ingredient.ingredientId
                    })
                  }
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CreateRecipeIngredientDialog recipeId={recipeId} />
      <UpdateRecipeIngredientDialog recipeId={recipeId} />
    </div>
  );
}

function Steps({ recipeId }: { recipeId: string }) {
  const { data: steps, isLoading } = useRecipeSteps(recipeId);
  const manageRecipeStepDialog = useManageRecipeStepDialog();
  const reorderSteps = useRecipeStepsReorder(recipeId);
  const deleteStep = useRecipeStepDelete(recipeId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function removeStep(stepId: number) {
    deleteStep.mutate({ recipeId, stepId });
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const oldIndex = steps?.findIndex((step) => step.id === Number(active.id));
    const newIndex = steps?.findIndex((step) => step.id === Number(over?.id));

    if (active.id !== over?.id && oldIndex !== undefined && newIndex !== undefined) {
      reorderSteps.mutate({
        recipeId,
        stepId: Number(active.id),
        data: {
          orderFrom: oldIndex + 1,
          orderTo: newIndex + 1
        }
      });
    }
  };
  return (
    <>
      <div className="mt-8">
        <div className="mb-1 flex gap-2">
          <h2 className="grow text-2xl font-bold">Steps</h2>
          <Button size="sm" onClick={() => manageRecipeStepDialog.open(null)}>
            Add Step
          </Button>
        </div>
        <div className="table-container">
          <div className="ingredients mt-2 rounded border">
            <div className="flex px-2 py-2 bg-muted">
              <div className="step min-w-20 flex-shrink">Step</div>
              <div className="description flex-grow">Description</div>
              <div className="min-w-28 flex-shrink"></div>
            </div>
            <div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              >
                <SortableContext
                  items={steps?.map((step) => step.id) ?? []}
                  strategy={verticalListSortingStrategy}
                >
                  {steps?.map((step) => (
                    <SortableStep key={step.id} step={step} remove={removeStep} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>
      </div>
      <ManageRecipeStepDialog recipeId={recipeId} />
    </>
  );
}

function SortableStep({ step, remove }: { step: RecipeStep; remove: (id: number) => void }) {
  const manageRecipeStepDialog = useManageRecipeStepDialog();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} className="t-row flex items-center px-2 py-1 border-t">
      <div className="step min-w-20 flex-shrink">{step.stepNumber}</div>
      <div className="description flex-grow">{step.description}</div>
      <div className="flex min-w-28 flex-shrink gap-1">
        <Button variant="outline" size="sm" onClick={() => manageRecipeStepDialog.open(step.id)}>
          <Pencil />
        </Button>
        <Button variant="destructive" size="sm" onClick={() => remove(step.id)}>
          <Trash />
        </Button>
        <Button variant="ghost" {...listeners} {...attributes}>
          <GripVertical />
        </Button>
      </div>
    </div>
  );
}

function Nutritions({ recipeId }: { recipeId: string }) {
  const { data, isFetching } = useRecipeNutrition(recipeId);

  const nutritions = useMemo(() => {
    const nutritions: RecipeNutrition[] = data || [];
    const nutritionMap = new Map<string, RecipeNutrition>();
    for (const nutrition of nutritions) {
      nutritionMap.set(nutrition.name, nutrition);
    }
    const orderedNutritions: RecipeNutrition[] = [];
    for (const name of nutritionOrder) {
      const nutrition = nutritionMap.get(name);
      if (nutrition) {
        orderedNutritions.push(nutrition);
      } else {
        orderedNutritions.push({
          id: -1,
          recipeId,
          name,
          value: 0,
          unit: "g"
        });
      }
    }
    return orderedNutritions;
  }, [data, recipeId]);

  const updateNutritionMutation = useRecipeNutritionUpdate();

  const updateNutritionValue = (name: Nutrition, unit: NutritionUnit, value: number) => {
    updateNutrition(name, unit, Number(value));
  };

  const updateNutrition = (name: Nutrition, unit: NutritionUnit, value: number) => {
    updateNutritionMutation.mutate({
      recipeId,
      name,
      data: {
        unit,
        value
      }
    });
  };

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8">
      <div className="mb-1 flex gap-2">
        <h2 className="grow text-2xl font-bold">Nutrition's</h2>
      </div>
      <div className="table-container rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nutritions?.map((nutrition) => (
              <TableRow key={nutrition.name}>
                <TableCell className="w-1/3">{nutrition.name}</TableCell>
                <TableCell className="w-1/3">
                  <Input
                    defaultValue={nutrition.value}
                    type="number"
                    min={0}
                    onBlur={(e) =>
                      updateNutritionValue(
                        nutrition.name as Nutrition,
                        nutrition.unit as NutritionUnit,
                        e.target.valueAsNumber
                      )
                    }
                  />
                </TableCell>
                <TableCell className="w-1/3">
                  <Select
                    defaultValue={nutrition.unit}
                    onValueChange={(value) =>
                      updateNutritionValue(
                        nutrition.name as Nutrition,
                        value as NutritionUnit,
                        nutrition.value
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {nutritionUnits?.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
