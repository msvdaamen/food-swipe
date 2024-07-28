import { mergeProps, ParentProps, Show } from "solid-js";
import "./button.scss";


type Color = "primary" | "secondary" | "default";
type Size = "auto" | "small" | "medium" | "large" | "full";

type Props = {
  color?: Color;
  size?: Size;
  disabled?: boolean;
  icon?: string;
  mobileText?: boolean;
};

export default (_props: ParentProps<Props>) => {
  const props = mergeProps(
    {
      color: "primary",
      size: "auto",
      disabled: false,
      icon: "",
      mobileText: false,
    },
    _props,
  );

  
  return (
    <button
      classList={{
        primary: props.color === "primary",
        secondary: props.color === "secondary",
        default: props.color === "default",
        "w-full": props.size === "full",
      }}
      class="select-none rounded px-3 py-2 text-white outline-none transition-colors"
    >
      <Show when={}>

      </When>
      {props.children}
    </button>
  );
};
