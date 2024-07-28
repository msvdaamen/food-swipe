import { Route, RouteProps } from "@solidjs/router";

export default <S extends string, T = unknown>(props: RouteProps<S, T>) => {
  return <Route {...props}></Route>;
};
