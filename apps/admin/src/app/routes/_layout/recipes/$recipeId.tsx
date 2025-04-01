import { createFileRoute } from "@tanstack/react-router";
import { recipeApi } from "@/modules/recipes/recipe.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { useMemo, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CircleHelp, GripVertical, Loader, Pencil, Trash } from "lucide-react";
import { Textarea } from "@/common/components/ui/textarea";
import { Checkbox } from "@/common/components/ui/checkbox";
import {
  Nutrition,
  nutritionOrder,
  NutritionUnit,
  nutritionUnits,
} from "@/modules/recipes/constants/nutritions";
import { RecipeNutrition } from "@/modules/recipes/types/recipe-nutrition.type";
import { SelectTrigger, SelectValue } from "@/common/components/ui/select";
import { Select, SelectItem } from "@/common/components/ui/select";
import { SelectContent } from "@/common/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { ManageRecipeStepDialog } from "@/modules/recipes/components/manage-recipe-step-dialog";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { RecipeStep } from "@/modules/recipes/types/recipe-step.type";
import {
  useRecipeStepDelete,
  useRecipeSteps,
  useRecipeStepsReorder,
} from "@/modules/recipes/hooks/recipe-step.hooks";
import { useRecipe } from "@/modules/recipes/hooks/recipe.hooks";
import {
  useRecipeNutrition,
  useRecipeNutritionUpdate,
} from "@/modules/recipes/hooks/recipe-nutrition.hooks";
import { CreateRecipeIngredientDialog } from "@/modules/recipes/components/create-recipe-ingredient.dialog";
import { UpdateRecipeIngredientDialog } from "@/modules/recipes/components/update-recipe-ingredient.dialog";
import { useRecipeIngredients } from "@/modules/recipes/hooks/recipe-ingredient.hooks";
import { RecipeIngredient } from "@/modules/recipes/types/recipe-ingredient.type";

export const Route = createFileRoute("/_layout/recipes/$recipeId")({
  component: RouteComponent,
  params: {
    parse: (params) => ({
      recipeId: Number(params.recipeId),
    }),
  },
});

function RouteComponent() {
  const { recipeId } = Route.useParams();
  const { data: recipe, isLoading } = useRecipe({ recipeId });

  const [isChangingImage, setIsChangingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteRecipe = (id: number) => {
    // TODO: Implement delete recipe
    recipeApi.deleteRecipe(id);
  };

  const handleUpdateRecipe = async (
    field: string,
    value: string | number | boolean
  ) => {
    await recipeApi.updateRecipe(Number(recipeId), {
      [field]: value,
    });
  };

  const handleFileUpload = () => {
    setIsChangingImage(true);
    // TODO: Implement file upload
    setTimeout(() => setIsChangingImage(false), 1000);
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
          <Button
            variant="destructive"
            onClick={() => handleDeleteRecipe(recipe.id)}
          >
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
                  <img src={recipe.coverImageUrl} alt="" />
                </div>
              ) : (
                <div className="flex aspect-video w-full cursor-pointer items-center justify-center bg-gray-100">
                  <CircleHelp />
                </div>
              )}
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
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
                defaultValue={recipe.description}
                onBlur={(e) =>
                  handleUpdateRecipe("description", e.target.value)
                }
              />
            </p>
            <div className="mt-1 flex gap-2">
              <Checkbox
                id="is-published"
                defaultChecked={recipe.isPublished}
                onCheckedChange={(checked) =>
                  handleUpdateRecipe("isPublished", !!checked)
                }
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

function Ingredients({ recipeId }: { recipeId: number }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<RecipeIngredient | null>(null);
  const { data: ingredients, isLoading } = useRecipeIngredients(recipeId);
  const queryClient = useQueryClient();
  const deleteIngredient = useMutation({
    mutationFn: () =>
      recipeApi.deleteIngredient(recipeId, selectedIngredient!.ingredientId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipe", recipeId, "ingredients"],
      });
    },
  });

  const openCreateDialog = () => {
    setIsCreateOpen(true);
  };

  const openUpdateDialog = (ingredient: RecipeIngredient) => {
    setSelectedIngredient(ingredient);
    setIsUpdateOpen(true);
  };

  const closeUpdateDialog = () => {
    setSelectedIngredient(null);
    setIsUpdateOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8">
      <div className="mb-1 flex gap-2">
        <h2 className="grow text-2xl font-bold">Ingredients</h2>
        <Button size="sm" onClick={openCreateDialog}>
          Add ingredient
        </Button>
      </div>
      <div className="table-container">
        <div className="ingredients">
          <div className="t-row ingredient">
            <div className="name">Ingredient</div>
            <div className="amount min-w-20 flex-shrink">Amount</div>
            <div className="min-w-28 flex-shrink"></div>
          </div>
          {ingredients?.map((ingredient) => (
            <div
              key={ingredient.ingredientId}
              className="t-row flex items-center"
            >
              <div className="name">{ingredient.ingredient}</div>
              <div className="amount min-w-20 flex-shrink">
                {ingredient.amount}
                {ingredient.measurement}
              </div>
              <div className="flex min-w-28 flex-shrink gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openUpdateDialog(ingredient)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteIngredient.mutate()}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CreateRecipeIngredientDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        recipeId={recipeId}
      />
      {selectedIngredient && (
        <UpdateRecipeIngredientDialog
          isOpen={isUpdateOpen}
          onClose={closeUpdateDialog}
          recipeId={recipeId}
          ingredient={selectedIngredient}
        />
      )}
    </div>
  );
}

function Steps({ recipeId }: { recipeId: number }) {
  const { data: steps, isLoading } = useRecipeSteps({ recipeId });
  const reorderSteps = useRecipeStepsReorder({ recipeId });
  const deleteStep = useRecipeStepDelete({ recipeId });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStepId, setActiveStepId] = useState<number | undefined>(
    undefined
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function closeModal() {
    setIsModalOpen(false);
    setActiveStepId(undefined);
  }

  function openModal(stepId?: number) {
    setActiveStepId(stepId);
    setIsModalOpen(true);
  }

  function removeStep(stepId: number) {
    deleteStep.mutate(stepId);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const oldIndex = steps?.findIndex((step) => step.id === Number(active.id));
    const newIndex = steps?.findIndex((step) => step.id === Number(over?.id));

    if (
      active.id !== over?.id &&
      oldIndex !== undefined &&
      newIndex !== undefined
    ) {
      reorderSteps.mutate({
        stepId: Number(active.id),
        orderFrom: oldIndex + 1,
        orderTo: newIndex + 1,
      });
    }
  };
  return (
    <>
      <div className="mt-8">
        <div className="mb-1 flex gap-2">
          <h2 className="grow text-2xl font-bold">Steps</h2>
          <Button size="sm" onClick={() => openModal()}>
            Add Step
          </Button>
        </div>
        <div className="table-container">
          <div className="ingredients">
            <div className="flex">
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
                    <SortableStep
                      key={step.id}
                      step={step}
                      update={openModal}
                      remove={removeStep}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>
      </div>
      <ManageRecipeStepDialog
        recipeId={recipeId}
        onClose={closeModal}
        stepId={activeStepId}
        isOpen={isModalOpen}
      />
    </>
  );
}

function SortableStep({
  step,
  update,
  remove,
}: {
  step: RecipeStep;
  update: (id: number) => void;
  remove: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="t-row flex items-center px-2 py-1"
    >
      <div className="step min-w-20 flex-shrink">{step.stepNumber}</div>
      <div className="description flex-grow">{step.description}</div>
      <div className="flex min-w-28 flex-shrink gap-1">
        <Button variant="outline" size="sm" onClick={() => update(step.id)}>
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

function Nutritions({ recipeId }: { recipeId: number }) {
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
          unit: "g",
        });
      }
    }
    return orderedNutritions;
  }, [data, recipeId]);

  const updateNutritionMutation = useRecipeNutritionUpdate(recipeId);

  const updateNutritionValue = (
    name: Nutrition,
    unit: NutritionUnit,
    value: number
  ) => {
    updateNutrition(name, unit, Number(value));
  };

  const updateNutrition = (
    name: Nutrition,
    unit: NutritionUnit,
    value: number
  ) => {
    updateNutritionMutation.mutate({
      name,
      unit,
      value,
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
                        nutrition.name,
                        nutrition.unit,
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
                        nutrition.name,
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
