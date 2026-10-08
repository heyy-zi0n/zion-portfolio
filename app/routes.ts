import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Admin Routes
  route("admin/login", "admin/login.tsx"),
  layout("admin/layout.tsx", [
    route("admin", "admin/dashboard.tsx"),
    route("admin/projects", "admin/projects/index.tsx"),
    route("admin/projects/new", "admin/projects/editor.tsx", { id: "admin/projects/new" }),
    route("admin/projects/:id/edit", "admin/projects/editor.tsx", { id: "admin/projects/edit" }),
    route("admin/projects/:id/preview", "admin/projects/preview.tsx"),
    route("admin/experience", "admin/experience/index.tsx"),
    route("admin/experience/new", "admin/experience/editor.tsx", { id: "admin/experience/new" }),
    route("admin/experience/:id/edit", "admin/experience/editor.tsx", { id: "admin/experience/edit" }),
    route("admin/media", "admin/media.tsx"),
    route("admin/settings", "admin/settings.tsx"),
  ]),
  
  // Public Portfolio Routes
  layout("portfolio/layout.tsx", { id: "portfolio" }, [
    index("portfolio/home.tsx"),
    route("about", "portfolio/about.tsx"),
    route("experience", "portfolio/experience.tsx"),
    route("projects", "portfolio/projects.tsx"),
    route("projects/:slug", "portfolio/project.tsx"),
    route("contact", "portfolio/contact.tsx"),
    route("*", "portfolio/not-found.tsx"),
  ]),
] satisfies RouteConfig;
