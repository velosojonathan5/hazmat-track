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

A feature `checklist` é um bom exemplo dessa convenção: `domain/checklist` define os tipos e o port, `application/checklist` tem os casos de uso, `infrastructure/checklist` implementa o port via HTTP, e `presentation/pages/ChecklistFormPage.tsx` consome os casos de uso e renderiza o resultado. As features `auth`, `inspection` e `dashboard` seguem o mesmo padrão.

## Rodando localmente

```bash
cp .env.example .env   # ajuste VITE_API_URL se necessário
npm install
npm run dev
```

Requer a API rodando (ver `docker-compose.yml` na raiz do projeto para subir tudo junto).
