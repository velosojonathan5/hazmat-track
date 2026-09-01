# Free-tier serverless Postgres. A project ships with one default branch,
# database and role, whose connection details are exposed as resource attributes.
#
# NOTE: the kislerdm/neon provider's attribute names have moved between minor
# versions before. If `terraform plan` complains about any of the
# `neon_project.main.*` references below, run `terraform providers schema -json`
# (or check the registry page for the pinned version) and adjust.
resource "neon_project" "main" {
  name       = var.project_name
  org_id     = var.neon_org_id
  region_id  = var.neon_region_id
  pg_version = 18

  # Free plan caps this at 6h regardless of what's requested.
  history_retention_seconds = 21600
}
