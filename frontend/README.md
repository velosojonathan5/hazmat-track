# HazmatTrack — Frontend

Interface web em React (Vite, Node 24, TypeScript) para a POC do HazmatTrack. Escopo funcional detalhado em [`../spec/escopo-mvp.md`](../spec/escopo-mvp.md).

## Arquitetura

O `src` é organizado em camadas para manter a regra de negócio/apresentação isolada de como os dados são obtidos, espelhando a convenção do backend:

```
src/
  domain/            # tipos e ports (interfaces) — sem dependência de HTTP ou React
    <feature>/
  application/       # casos de uso — orquestram o domínio via um port
    <feature>/
  infrastructure/
    http/              # cliente HTTP genérico (fetch)
    <feature>/          # implementação do port da feature usando o cliente HTTP
  presentation/
    pages/              # componentes React que consomem os casos de uso
```

A feature `health` é a referência dessa convenção: `domain/health` define o port, `application/health` tem o caso de uso, `infrastructure/health` implementa o port via HTTP, e `presentation/pages/HealthPage.tsx` consome o caso de uso e renderiza o resultado. As próximas telas (checklist, fiscalização, dashboard — ver `spec/escopo-mvp.md`) devem seguir o mesmo padrão.

## Rodando localmente

```bash
cp .env.example .env   # ajuste VITE_API_URL se necessário
npm install
npm run dev
```

Requer a API rodando (ver `docker-compose.yml` na raiz do projeto para subir tudo junto).
