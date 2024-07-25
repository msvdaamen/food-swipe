/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";

import App from "./App";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import AuthenticatedRoute from "./modules/auth/authenticated-route";

const SignIn = lazy(() => import("./pages/auth/sign-in/sign-in"));

render(
  () => (
    <Router root={App}>
      <Route path="/auth/sign-in" component={SignIn} />
      <AuthenticatedRoute path="/" component={SignIn} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
