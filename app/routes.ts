import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("tournaments", "routes/tournaments._index.tsx"),
  route("skins", "routes/skins._index.tsx"),
  route("objectives/:seasonId", "routes/objectives.$seasonId.tsx"),
  route("tournaments/:id", "routes/tournaments.$id.tsx", [
    index("routes/tournaments.$id._index.tsx"),
    route("players", "routes/tournaments.$id.players.tsx"),
    route("duels", "routes/tournaments.$id.duels.tsx"),
    route("ranking", "routes/tournaments.$id.ranking.tsx"),
    route("cosmetics", "routes/tournaments.$id.cosmetics.tsx"),
    route("duels/:duelId/replay", "routes/tournaments.$id.duels.$duelId.replay.tsx"),
  ]),
] satisfies RouteConfig;
