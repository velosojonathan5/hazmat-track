# React/Vite SPA. Vercel builds straight from the repo (it ignores
# frontend/Dockerfile, which is dev-only) and redeploys on every push to
# github_branch once the git connection below is in place — that's the CD
# for the frontend, no extra pipeline needed.
resource "vercel_project" "frontend" {
  name      = var.project_name
  framework = "vite"

  git_repository = {
    type = "github"
    repo = var.github_repo
  }

  root_directory   = "frontend"
  install_command  = "npm ci"
  build_command    = "npm run build"
  output_directory = "dist"
}

# Claims the free <project_name>.vercel.app domain explicitly so the URL is
# known at plan time (needed for CORS_ORIGIN on the backend, see render.tf).
resource "vercel_project_domain" "frontend" {
  project_id = vercel_project.frontend.id
  domain     = "${local.public_slug}.vercel.app"
}

resource "vercel_project_environment_variable" "api_url" {
  project_id = vercel_project.frontend.id
  key        = "VITE_API_URL"
  value      = local.backend_url
  target     = ["production", "preview"]
}
