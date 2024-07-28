export type FormTypes = string | number | boolean;
export type RegisterOnToucheFn = () => void;
export type RegisterOnChangeFn<T extends FormTypes = FormTypes> = (
  _: T,
) => void;
