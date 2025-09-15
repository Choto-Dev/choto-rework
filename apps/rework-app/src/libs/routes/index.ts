import { createRouter } from "@swan-io/chicane";

const routes = {
  home: "/",
};

export const router = Object.entries(routes).map(([name, path]) => ({
  name,
  path,
}));

export const Router = createRouter(routes);
