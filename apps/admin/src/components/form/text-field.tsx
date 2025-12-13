import { useFieldContext } from '../../hooks/form-context.ts'
import { Field, FieldError, FieldLabel } from '../ui/field.tsx'
import { Input } from '../ui/input.tsx'


type Props = {
  label: string;
  placeholder?: string;
  type?: HTMLInputElement['type'];
}

export default function TextField({ label, placeholder, type }: Props) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        type={type}
        placeholder={placeholder}
      />
      {isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  )
}
