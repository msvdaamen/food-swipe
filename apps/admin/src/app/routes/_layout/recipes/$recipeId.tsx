import { createFileRoute } from "@tanstack/react-router";
import { recipeApi } from "@/modules/recipes/recipe.api";
import { useQuery } from "@tanstack/react-query";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CircleHelp, Loader, Pencil, Trash } from "lucide-react";
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

export const Route = createFileRoute("/_layout/recipes/$recipeId")({
  component: RouteComponent,
});

interface Recipe {
  id: number;
  title: string;
  description: string;
  coverImageUrl?: string;
  prepTime?: number;
  servings?: number;
  isPublished: boolean;
  ingredients?: Array<{
    ingredientId: number;
    ingredient: string;
    amount: number;
    measurement: string;
  }>;
  steps?: Array<{
    id: number;
    stepNumber: number;
    description: string;
  }>;
  nutritions?: Array<{
    name: string;
    value: number;
    unit: string;
  }>;
  nutritionUnits?: string[];
}

function RouteComponent() {
  const { recipeId } = Route.useParams();
  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => recipeApi.getById(Number(recipeId)),
  });

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  const { data: ingredients, isLoading } = useQuery({
    queryKey: ["recipe", recipeId, "ingredients"],
    queryFn: () => recipeApi.getIngredients(Number(recipeId)),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8">
      <div className="mb-1 flex gap-2">
        <h2 className="grow text-2xl font-bold">Ingredients</h2>
        <Button size="sm" onClick={() => {}}>
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
                <Button variant="ghost" size="sm" onClick={() => {}}>
                  <Pencil />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => {}}>
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Steps({ recipeId }: { recipeId: number }) {
  const { data: steps, isLoading } = useQuery({
    queryKey: ["recipe", recipeId, "steps"],
    queryFn: () => recipeApi.getSteps(Number(recipeId)),
  });
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
    console.log("closeModal");
  }

  function openModal(stepId?: number) {
    setActiveStepId(stepId);
    setIsModalOpen(true);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(event);

    if (active.id !== over?.id) {
      // TODO: Implement step reordering
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
              <div className="description">Description</div>
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
                      remove={() => {}}
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

function Nutritions({ recipeId }: { recipeId: number }) {
  const nutritions = useMemo(() => {
    const nutritions: RecipeNutrition[] = [];
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
  }, [recipeId]);

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
    recipeApi.updateNutrition(recipeId, name, {
      value: value,
      unit,
    });
  };

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
      {...attributes}
      {...listeners}
      className="t-row flex items-center"
    >
      <div className="step min-w-20 flex-shrink">{step.stepNumber}</div>
      <div className="description">{step.description}</div>
      <div className="flex min-w-28 flex-shrink gap-1">
        <Button variant="ghost" size="sm" onClick={() => update(step.id)}>
          <Pencil />
        </Button>
        <Button variant="destructive" size="sm" onClick={() => remove(step.id)}>
          <Trash />
        </Button>
      </div>
    </div>
  );
}
