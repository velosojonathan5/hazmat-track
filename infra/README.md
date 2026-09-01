# Deploy do HazmatTrack

Infraestrutura como código (Terraform) para publicar o MVP com custo baixo e
deploy automático a cada push na `main`.

## Arquitetura

| Camada             | Provedor                        | Custo               |
| ------------------ | -------------------------------- | -------------------- |
| Frontend (React/Vite) | Vercel                         | Gratuito             |
| Backend (NestJS)     | Render (plano Starter)          | ~US$7/mês (always-on, sem cold start) |
| Banco (Postgres)     | Neon (serverless)               | Gratuito             |
| Storage (fotos)      | Cloudflare R2                   | Gratuito (10 GB)     |

Vercel e Render têm integração nativa com o GitHub: uma vez que o Terraform
conecta o repositório, cada push na `main` já dispara build + deploy sozinho
— esse é o "CD" do app em si. O workflow `.github/workflows/terraform.yml`
cuida do outro CD, o da própria infraestrutura: `terraform plan` em PRs que
mexem em `infra/`, `terraform apply` automático ao mergear na `main`.

O estado do Terraform fica no HCP Terraform (Terraform Cloud), plano
gratuito — evita gerenciar backend de estado (S3, locking, etc.) por conta
própria.

## Mudanças necessárias no código

Duas coisas no backend não funcionavam fora do docker-compose local e já
foram corrigidas neste PR/commit:

1. **SSL no Postgres** — Neon exige `sslmode=require`; foi adicionada a
   variável `DB_SSL` (`backend/src/config/typeorm.config.ts`).
2. **URL pública do storage** — o R2 não permite leitura anônima pelo
   endpoint S3 puro nem policy de bucket estilo AWS; acesso público só existe
   via "Public Development URL" ou domínio customizado, e nenhum dos dois
   aceita `/bucket/chave` no path, só `/chave`. O adapter
   (`s3-file-storage.adapter.ts`) e o `STORAGE_PUBLIC_ENDPOINT` passaram a
   assumir a base já "enraizada" no bucket (funciona igual para MinIO local:
   veja `backend/.env.example`).

## Pré-requisitos (contas e tokens)

1. **HCP Terraform**: crie uma conta e uma organização em
   [app.terraform.io](https://app.terraform.io) (grátis). Crie um workspace
   chamado `hazmat-track` do tipo "CLI-driven". Ajuste `organization` em
   [`versions.tf`](versions.tf).
2. **Vercel**: conta em [vercel.com](https://vercel.com), conecte o GitHub.
   Gere um token em Account Settings > Tokens.
3. **Render**: conta em [render.com](https://render.com), conecte o GitHub.
   Gere uma API key em Account Settings > API Keys. Pegue o `owner id` (URL
   do dashboard ou `render workspace current` via CLI).
4. **Neon**: conta em [neon.tech](https://neon.tech). Gere uma API key em
   Account Settings > API Keys.
5. **Cloudflare**: conta em [cloudflare.com](https://cloudflare.com).
   - API token com permissão de R2 (My Profile > API Tokens) — usado pelo
     provider Terraform para criar o bucket.
   - Access Key ID / Secret Access Key do R2 (R2 > Manage API Tokens) — são
     credenciais separadas, compatíveis com S3, usadas pelo backend para
     ler/escrever arquivos. Não confundir com o token acima.
   - `account_id` (barra lateral direita de qualquer página do dashboard).

## Passo a passo

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# preencha terraform.tfvars com os tokens acima (arquivo já está no .gitignore)

terraform login   # autentica com o HCP Terraform
terraform init
terraform plan
terraform apply
```

Depois do primeiro `apply`:

1. Vá em Cloudflare R2 > bucket `hazmat-track` > Settings > **Public
   Development URL** > Enable. Copie a URL `https://pub-xxxx.r2.dev` gerada
   para `r2_public_base_url` em `terraform.tfvars` e rode `terraform apply`
   de novo (isso não é gerenciável via Terraform ainda — ver comentário em
   [`cloudflare.tf`](cloudflare.tf)).
2. Rode as seeds de dados iniciais contra o Postgres do Neon (a
   `connection_uri` sai em `terraform output -raw database_connection_uri`):
   `npm run seed` a partir de `backend/`, apontando `DATABASE_URL`/as
   variáveis `DB_*` para o Neon.
3. Confira `terraform output frontend_url` e `backend_url` — é onde o app
   está publicado.

## CD contínuo (depois do setup inicial)

- **Push na `main`, mudou `frontend/` ou `backend/`**: Vercel/Render
  redeployam sozinhos, sem passar pelo Terraform.
- **Push na `main`, mudou `infra/`**: o workflow do GitHub Actions roda
  `terraform apply` automaticamente. Configure os secrets abaixo no repo
  (Settings > Secrets and variables > Actions):

  `TF_API_TOKEN` (token de usuário do HCP Terraform), `VERCEL_API_TOKEN`,
  `VERCEL_TEAM_ID`, `RENDER_API_KEY`, `RENDER_OWNER_ID`, `NEON_API_KEY`,
  `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
  `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BASE_URL` — os mesmos valores do seu
  `terraform.tfvars`.

  Recomendado: crie um "environment" `production` no repo (Settings >
  Environments) com um revisor obrigatório, já que o job `apply` do workflow
  roda nele — assim nada aplica infra sem alguém aprovar.

- **Pull request que mexe em `infra/`**: só roda `terraform plan` e comenta
  o resultado no PR, nada é aplicado.

## Verificação de schema dos providers

Vercel, Render, Neon e Cloudflare são providers menores que mudam schema com
mais frequência que os grandes (AWS/GCP/Azure). Se `terraform plan` reclamar
de algum atributo (ex. `neon_project.main.database_host`,
`render_web_service.backend.runtime_source`), confira a versão fixada em
[`versions.tf`](versions.tf) contra a documentação atual em
[registry.terraform.io](https://registry.terraform.io) antes de ajustar —
os comentários em `neon.tf` e `render.tf` já sinalizam os pontos mais
prováveis de mudar.

## Destruir tudo

```bash
cd infra
terraform destroy
```

Cuidado: derruba o banco (Neon), o bucket de fotos (R2) e os serviços
(Vercel/Render). Faça backup do Postgres antes se já houver dados reais.
