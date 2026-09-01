terraform {
  required_version = ">= 1.9"

  # Remote state + locking on HCP Terraform (Terraform Cloud), free tier.
  # Create the org/workspace once in app.terraform.io, then update the values below.
  cloud {
    organization = "REPLACE_WITH_YOUR_TFC_ORG"

    workspaces {
      name = "hazmat-track"
    }
  }

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
    render = {
      source  = "render-oss/render"
      version = "~> 1.6"
    }
    neon = {
      source  = "kislerdm/neon"
      version = "~> 0.13"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id
}

provider "render" {
  api_key = var.render_api_key
}

provider "neon" {
  api_key = var.neon_api_key
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
