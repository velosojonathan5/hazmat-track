output "frontend_url" {
  value = "https://${vercel_project_domain.frontend.domain}"
}

output "backend_url" {
  value = local.backend_url
}

output "database_connection_uri" {
  value     = neon_project.main.connection_uri
  sensitive = true
}

output "jwt_secret" {
  value     = random_password.jwt_secret.result
  sensitive = true
}
