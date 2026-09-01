locals {
  # .vercel.app and .onrender.com subdomains are global across every user of
  # each platform (unlike Neon project names or R2 bucket names, which are
  # only scoped to our own account) — plain "hazmat-track" already collided
  # with someone else's Vercel project. Suffixing with the GitHub owner keeps
  # both public hostnames unique while staying deterministic before apply, so
  # Render and Vercel can still reference each other with no dependency cycle.
  public_slug           = "${var.project_name}-${split("/", var.github_repo)[0]}"
  backend_service_name  = "${local.public_slug}-api"
  backend_url           = "https://${local.backend_service_name}.onrender.com"
  frontend_url          = "https://${local.public_slug}.vercel.app"
}
