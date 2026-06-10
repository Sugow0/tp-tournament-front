import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("tournaments", "routes/tournaments._index.tsx"),
  route("tournaments/:id", "routes/tournaments.$id.tsx", [
    index("routes/tournaments.$id._index.tsx"),
  ]),
] satisfies RouteConfig;
