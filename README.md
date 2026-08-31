# HazmatTrack

POC de gestão ambiental e compliance para transporte de carga perigosa — checklist veicular, fiscalização com registro fotográfico e dashboard de indicadores, fundamentados na legislação brasileira (ANTT 5.998/22, NBR 7.500/7.503, normas Contran/IBAMA/INMETRO).

## Documentação

- [`spec/escopo-mvp.md`](spec/escopo-mvp.md) — escopo técnico do MVP: requisitos funcionais e não funcionais, modelo de domínio, fluxos e critérios de aceite
- [`spec/features.txt`](spec/features.txt) — visão funcional completa do produto (além do MVP)
- [`spec/forms/`](spec/forms/) — checklist legal de referência usado para modelar o módulo de inspeção veicular

## Estrutura do repositório

```
backend/    API NestJS (Clean Architecture, TypeORM, Swagger) — ver backend/README.md
frontend/   Interface React (Vite, camadas isoladas) — ver frontend/README.md
spec/       Levantamento de requisitos e escopo do MVP
```

## Rodando o projeto (Docker)

```bash
docker compose up --build
```

- API: http://localhost:3000 (Swagger em `/docs`)
- Web: http://localhost:5173
- Postgres: `localhost:5432` (usuário/senha/banco: `hazmat` / `hazmat` / `hazmat_track`)

## Rodando sem Docker

Ver instruções específicas em [`backend/README.md`](backend/README.md) e [`frontend/README.md`](frontend/README.md). Requer Node.js 24 e um Postgres acessível.

## Stack

Node 24, NestJS, React, PostgreSQL, Docker/docker-compose — decisões registradas em [`spec/stack.txt`](spec/stack.txt).
