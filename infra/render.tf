# Generated once and stored in Terraform state (HCP Terraform encrypts state
# at rest). Rotate by tainting this resource and re-applying.
resource "random_password" "jwt_secret" {
  length  = 48
  special = false
}

# NestJS API, deployed from source (no Docker) so we don't have to touch
# backend/Dockerfile, which is a dev-only hot-reload image. `starter` plan
# keeps it always-on; `auto_deploy = true` is what turns every push to
# github_branch into a deploy — that's the CD for the backend.
resource "render_web_service" "backend" {
  name     = local.backend_service_name
  owner_id = var.render_owner_id
  plan     = var.render_plan
  region   = var.render_region

  runtime_source = {
    native_runtime = {
      repo_url       = "https://github.com/${var.github_repo}"
      branch         = var.github_branch
      auto_deploy    = true
      root_directory = "backend"
      build_command  = "npm ci && npm run build"
      start_command  = "npm run start:prod"
      runtime        = "node"
    }
  }

  env_vars = {
    NODE_ENV                  = { value = "production" }
    PORT                      = { value = "3000" }
    DB_HOST                   = { value = neon_project.main.database_host }
    DB_PORT                   = { value = "5432" }
    DB_USER                   = { value = neon_project.main.database_user }
    DB_PASSWORD               = { value = neon_project.main.database_password }
    DB_NAME                   = { value = neon_project.main.database_name }
    DB_SSL                    = { value = "true" }
    CORS_ORIGIN               = { value = "https://${vercel_project_domain.frontend.domain}" }
    JWT_SECRET                = { value = random_password.jwt_secret.result }
    JWT_EXPIRES_IN             = { value = "1d" }
    STORAGE_INTERNAL_ENDPOINT = { value = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com" }
    STORAGE_PUBLIC_ENDPOINT   = { value = var.r2_public_base_url }
    STORAGE_ACCESS_KEY        = { value = var.r2_access_key_id }
    STORAGE_SECRET_KEY        = { value = var.r2_secret_access_key }
    STORAGE_BUCKET             = { value = cloudflare_r2_bucket.uploads.name }
  }
}
