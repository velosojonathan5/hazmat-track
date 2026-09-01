variable "project_name" {
  description = "Base name used for every provisioned resource (Vercel project, Render service, Neon project, R2 bucket)."
  type        = string
  default     = "hazmat-track"
}

variable "github_repo" {
  description = "GitHub repo in owner/name form that Vercel and Render pull from for auto-deploy."
  type        = string
  default     = "velosojonathan5/hazmat-track"
}

variable "github_branch" {
  description = "Branch that triggers an automatic deploy on both Vercel and Render."
  type        = string
  default     = "main"
}

# --- Vercel ---------------------------------------------------------------

variable "vercel_api_token" {
  description = "Vercel personal access token (Account Settings > Tokens)."
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "Vercel team ID, if the project lives under a team instead of a personal account. Leave null otherwise."
  type        = string
  default     = null
}

# --- Render ------------------------------------------------------------

variable "render_api_key" {
  description = "Render API key (Account Settings > API Keys)."
  type        = string
  sensitive   = true
}

variable "render_owner_id" {
  description = "Render owner/team ID that the service is created under (Dashboard > Account Settings, or `render workspace current` in the CLI)."
  type        = string
}

variable "render_region" {
  description = "Render region for the backend web service."
  type        = string
  default     = "oregon"
}

variable "render_plan" {
  description = "Render instance plan for the backend. 'starter' (~US$7/mo) keeps the service always-on, no cold starts."
  type        = string
  default     = "starter"
}

# --- Neon (Postgres) --------------------------------------------------

variable "neon_api_key" {
  description = "Neon API key (Account Settings > API Keys)."
  type        = string
  sensitive   = true
}

variable "neon_org_id" {
  description = "Neon organization ID. Neon now requires every new project to belong to an org (Organization Settings, or GET /users/me/organizations)."
  type        = string
}

variable "neon_region_id" {
  description = "Neon region ID. Pick one close to the Render region to keep query latency low."
  type        = string
  default     = "aws-us-east-1"
}

# --- Cloudflare R2 (object storage) ------------------------------------

variable "cloudflare_api_token" {
  description = "Cloudflare API token with R2 edit permission (My Profile > API Tokens)."
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID (right sidebar of any zone/dashboard overview page)."
  type        = string
}

variable "r2_access_key_id" {
  description = "S3-compatible Access Key ID for R2, created under R2 > Manage API Tokens. Not the same as the Cloudflare API token above."
  type        = string
  sensitive   = true
}

variable "r2_secret_access_key" {
  description = "S3-compatible Secret Access Key for R2, paired with r2_access_key_id."
  type        = string
  sensitive   = true
}

variable "r2_public_base_url" {
  description = <<-EOT
    Base URL objects are publicly reachable at, bucket-rooted (no bucket segment in the path).
    Use the R2 "Public Development URL" (https://pub-<hash>.r2.dev) for a quick MVP, or a custom
    domain (e.g. https://files.yourdomain.com) once you attach one via cloudflare_r2_custom_domain.
  EOT
  type        = string
}
