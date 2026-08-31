# HazmatTrack — Backend

API em NestJS (Node 24, TypeScript ESM) para a POC do HazmatTrack. Escopo funcional detalhado em [`../spec/escopo-mvp.md`](../spec/escopo-mvp.md).

## Arquitetura

Cada módulo de negócio segue Clean Architecture com repository/port pattern, isolando regra de negócio de infraestrutura:

```
src/modules/<modulo>/
  domain/           # entidades e ports (interfaces) — sem dependência de framework/infra
    ports/
  application/      # casos de uso — orquestram o domínio, dependem só de ports
    use-cases/
  infrastructure/    # implementações concretas dos ports
    persistence/      # adapters de banco (TypeORM)
    http/              # controllers e DTOs (Swagger)
  <modulo>.module.ts  # wiring: liga o port à implementação via injeção de dependência
```

O módulo `health` (`src/modules/health`) é a referência mais simples dessa convenção: define um port (`DatabasePingPort`), um caso de uso que depende só do port, um adapter TypeORM que o implementa, e um controller HTTP. O módulo `auth` (`src/modules/auth`) estende o mesmo padrão com múltiplos ports (repositório de usuário, hasher de senha, emissor de token) e guards HTTP (`JwtAuthGuard`, `RolesGuard`) reutilizáveis pelos próximos módulos (`checklist`, `fiscalizacao`, `dashboard` — ver `spec/escopo-mvp.md`).

Regra prática: código em `domain/` e `application/` não importa nada de `infrastructure/`, `@nestjs/typeorm`, `@nestjs/jwt` ou `bcryptjs` — a dependência sempre aponta para dentro (infra → application → domain).

## Autenticação

Login mínimo (RF01–RF03 do escopo do MVP): `POST /auth/login` recebe e-mail/senha e retorna um JWT; `GET /auth/me` (protegido por `JwtAuthGuard` + `RolesGuard`) demonstra como restringir rotas por perfil (`inspector` | `manager`). Não há autocadastro — usuários são criados via seed:

```bash
npm run seed
```

Cria dois usuários de demonstração: `inspector@hazmattrack.demo` / `inspector123` e `manager@hazmattrack.demo` / `manager123`.

## Rodando localmente

```bash
cp .env.example .env   # ajuste se necessário
npm install
npm run start:dev
```

Requer um Postgres acessível (ver `docker-compose.yml` na raiz do projeto para subir tudo junto).

- API: http://localhost:3000
- Swagger: http://localhost:3000/docs

## Testes

```bash
npm test          # testes unitários (não dependem de infraestrutura externa)
npm run test:e2e  # testes e2e — requerem Postgres rodando
```
