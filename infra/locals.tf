locals {
  # Both hostnames are derived from var.project_name, so they're known before
  # apply and each provider config can reference the other with no dependency
  # cycle (Render's onrender.com naming and the vercel_project_domain claimed
  # in vercel.tf are both deterministic from the name we choose).
  backend_service_name = "${var.project_name}-api"
  backend_url           = "https://${local.backend_service_name}.onrender.com"
}
