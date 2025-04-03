import { useForm } from '@tanstack/react-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateRecipe } from '../api/create-recipe';
import { type } from 'arktype';
import { Loader } from 'lucide-react';

interface CreateRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const validator = type({
  title: 'string',
});

export const CreateRecipeDialog = ({ open, onOpenChange }: CreateRecipeDialogProps) => {
  const createRecipe = useCreateRecipe();

  const form = useForm({
    defaultValues: {
      title: '',
    },
    validators: {
        onChange: validator
    },
    onSubmit: async ({ value }) => {
      await createRecipe.mutateAsync({ title: value.title.trim() });
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create recipe</DialogTitle>
        </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="title"
            >
              {(field) => (
                <div className="space-y-2">
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Recipe title"
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={({canSubmit, isSubmitting}) => [canSubmit, isSubmitting]}
                children={([canSubmit, isSubmitting]) => 
                <Button
                    type="submit"
                    disabled={!canSubmit}
                  >
                    Submit
                    {isSubmitting && <Loader className="animate-spin" />}
                  </Button>}
              />
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}; 