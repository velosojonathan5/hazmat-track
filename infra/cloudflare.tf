# R2 storage for checklist/inspection photos. 10 GB storage + zero egress fees
# on the free tier, S3-compatible so the existing @aws-sdk/client-s3 adapter
# works unchanged (see backend/src/shared/storage).
resource "cloudflare_r2_bucket" "uploads" {
  account_id = var.cloudflare_account_id
  name       = var.project_name
  location   = "ENAM"
}

# Manual one-time steps Terraform does not cover yet (the Cloudflare
# provider has no stable resource for either, at the time of writing — verify
# against current docs before assuming otherwise):
#
# 1. Enable the bucket's public dev URL via the REST API (no dashboard click
#    needed, but not something the Terraform provider exposes as a resource):
#      curl -X PUT \
#        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
#        -H "Content-Type: application/json" -d '{"enabled": true}' \
#        "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/r2/buckets/$BUCKET/domains/managed"
#    The response's `domain` field (pub-<hash>.r2.dev) goes into
#    r2_public_base_url in terraform.tfvars. (Swap for a custom domain later
#    via cloudflare_r2_custom_domain once the project has a real domain — R2
#    does not support anonymous reads through the raw S3 API endpoint at all.)
# 2. R2 dashboard > Manage API Tokens > create a token scoped to this bucket.
#    That flow hands you an Access Key ID + Secret Access Key pair — put those
#    into r2_access_key_id / r2_secret_access_key. This is a different
#    credential from the Cloudflare API token used by the provider itself.
