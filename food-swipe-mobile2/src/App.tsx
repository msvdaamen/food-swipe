import type { Component, ParentProps } from "solid-js";

const App: Component = (props: ParentProps) => {
  return <>{props.children}</>;
};

export default App;
