import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    ...prefix("teams", [
        route("", "routes/teams/teams-dashboard.tsx")
    ])
] satisfies RouteConfig;
