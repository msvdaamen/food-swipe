import { JSX, ParentComponent, Show, splitProps } from "solid-js";

type Props = JSX.InputHTMLAttributes<HTMLInputElement>;

export const Input: ParentComponent<Props> = (props) => {
  const iconPrefix = false;
  const [, inputProps] = splitProps(props, ["value"]);
  return (
    <label>
      <p>{props.children}</p>
      <div class="flex rounded border border-gray-300 px-1.5 py-1 outline-0 transition-colors invalid:border-danger-600 focus-within:border-primary-500 disabled:bg-gray-200 dark:border-dark-700 dark:bg-dark-800">
        <div class="grow">
          <input
            {...inputProps}
            value={props.value}
            class="w-full bg-transparent outline-none"
          />
        </div>
        <Show when={iconPrefix}>
          <div class="px-2">
            {/* <fa-icon [icon]="iconSuffix"></fa-icon> */}
          </div>
        </Show>
      </div>
    </label>
  );
};
