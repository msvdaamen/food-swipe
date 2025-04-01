import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faQuestion,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { FormCheckbox } from "./FormCheckbox";
import { FormSelect } from "./FormSelect";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface Recipe {
  id: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  prepTime?: number;
  servings?: number;
  isPublished: boolean;
}

interface Ingredient {
  ingredientId: string;
  ingredient: string;
  amount: number;
  measurement: string;
}

interface Step {
  id: string;
  stepNumber: number;
  description: string;
}

interface Nutrition {
  name: string;
  value: number;
  unit: string;
}

interface RecipeFormProps {
  recipe: Recipe;
  ingredients: Ingredient[];
  steps: Step[];
  nutritions: Nutrition[];
  nutritionUnits: string[];
  onDeleteRecipe: (id: string) => void;
  onUpdateRecipe: (field: keyof Recipe, value: string | number) => void;
  onUpdateIsPublished: (value: boolean) => void;
  onUploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteIngredient: (id: string) => void;
  onDeleteStep: (id: string) => void;
  onUpdateNutrition: (name: string, unit: string, value: number) => void;
  onOpenManageIngredientDialog: (
    recipeId: string,
    ingredientId?: string
  ) => void;
  onOpenManageStepDialog: (recipeId: string, stepId?: string) => void;
  onStepsDrop: (result: DropResult) => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  recipe,
  ingredients,
  steps,
  nutritions,
  nutritionUnits,
  onDeleteRecipe,
  onUpdateRecipe,
  onUpdateIsPublished,
  onUploadFile,
  onDeleteIngredient,
  onDeleteStep,
  onUpdateNutrition,
  onOpenManageIngredientDialog,
  onOpenManageStepDialog,
  onStepsDrop,
}) => {
  const [isChangingImage, setIsChangingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileUploader = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChangingImage(true);
    onUploadFile(event);
    // Reset the loading state after a delay (you might want to handle this in the parent component)
    setTimeout(() => setIsChangingImage(false), 1000);
  };

  if (!recipe) return null;

  return (
    <div>
      <div className="flex justify-end">
        <Button onClick={() => onDeleteRecipe(recipe.id)} color="danger">
          Delete
        </Button>
      </div>

      <div className="flex">
        <div className="w-1/3">
          <div onClick={openFileUploader}>
            {isChangingImage ? (
              <div className="flex aspect-video w-full cursor-pointer items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} size="10x" spin />
              </div>
            ) : recipe.coverImageUrl ? (
              <div className="cursor-pointer">
                <img src={recipe.coverImageUrl} alt="" />
              </div>
            ) : (
              <div className="flex aspect-video w-full cursor-pointer items-center justify-center bg-gray-100">
                <FontAwesomeIcon icon={faQuestion} size="10x" />
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
              <FormInput
                type="number"
                value={recipe.prepTime?.toString() ?? ""}
                onBlur={(e) => onUpdateRecipe("prepTime", e.target.value)}
                label="Time"
              />
            </div>
            <div>
              <FormInput
                type="number"
                value={recipe.servings?.toString() ?? ""}
                onBlur={(e) => onUpdateRecipe("servings", e.target.value)}
                label="Servings"
              />
            </div>
          </div>
        </div>

        <div className="w-2/3 p-8 pt-0">
          <h1 className="font-bold">
            <FormInput
              value={recipe.title}
              onBlur={(e) => onUpdateRecipe("title", e.target.value)}
              label={<span className="font-normal">Title</span>}
            />
          </h1>
          <p className="mt-1 text-gray-600">
            <FormTextarea
              value={recipe.description}
              onBlur={(e) => onUpdateRecipe("description", e.target.value)}
              label="Description"
            />
          </p>
          <div>
            <FormCheckbox
              checked={recipe.isPublished}
              onChange={(e) => onUpdateIsPublished(e.target.checked)}
              label="Is publish"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-1 flex gap-2">
          <h2 className="grow text-2xl font-bold">Ingredients</h2>
          <Button
            size="small"
            onClick={() => onOpenManageIngredientDialog(recipe.id)}
          >
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
            {ingredients.map((ingredient) => (
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
                    type="icon"
                    size="small"
                    onClick={() =>
                      onOpenManageIngredientDialog(
                        recipe.id,
                        ingredient.ingredientId
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </Button>
                  <Button
                    type="icon"
                    size="small"
                    color="danger"
                    onClick={() => onDeleteIngredient(ingredient.ingredientId)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-1 flex gap-2">
          <h2 className="grow text-2xl font-bold">Steps</h2>
          <Button
            size="small"
            onClick={() => onOpenManageStepDialog(recipe.id)}
          >
            Add Step
          </Button>
        </div>
        <div className="table-container">
          <DragDropContext onDragEnd={onStepsDrop}>
            <Droppable droppableId="steps">
              {(provided) => (
                <div
                  className="ingredients"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className="t-row ingredient">
                    <div className="step min-w-20 flex-shrink">Step</div>
                    <div className="description">Description</div>
                    <div className="min-w-28 flex-shrink"></div>
                  </div>
                  {steps.map((step, index) => (
                    <Draggable
                      key={step.id}
                      draggableId={step.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="t-row flex items-center"
                        >
                          <div className="step min-w-20 flex-shrink">
                            {step.stepNumber}
                          </div>
                          <div className="description">{step.description}</div>
                          <div className="flex min-w-28 flex-shrink gap-1">
                            <Button
                              type="icon"
                              size="small"
                              onClick={() =>
                                onOpenManageStepDialog(recipe.id, step.id)
                              }
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </Button>
                            <Button
                              type="icon"
                              size="small"
                              color="danger"
                              onClick={() => onDeleteStep(step.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-1 flex gap-2">
          <h2 className="grow text-2xl font-bold">Nutrition's</h2>
        </div>
        <div className="table-container">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {nutritions.map((nutrition) => (
                <tr key={nutrition.name}>
                  <td>{nutrition.name}</td>
                  <td>
                    <FormInput
                      value={nutrition.value}
                      onBlur={(e) =>
                        onUpdateNutrition(
                          nutrition.name,
                          nutrition.unit,
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>
                    <FormSelect
                      value={nutrition.unit}
                      onChange={(e) =>
                        onUpdateNutrition(
                          nutrition.name,
                          e.target.value,
                          nutrition.value
                        )
                      }
                    >
                      {nutritionUnits.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </FormSelect>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
