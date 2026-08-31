# HazmatTrack — Escopo Técnico do MVP (POC para Investidores)

**Versão:** 1.0
**Data:** 2026-08-31
**Autor:** Análise de Sistemas (elaborado em conjunto com o time do produto)
**Fontes:** `spec/features.txt`, `spec/stack.txt`, `spec/forms/Lista de Verificação - Transporte de Carga Perigosa.xls`

---

## 1. Objetivo do documento

Definir, antes do início do desenvolvimento, o escopo técnico do MVP do HazmatTrack a ser usado como POC para apresentação a investidores. O objetivo não é cobrir as 8 áreas funcionais do produto completo, e sim demonstrar **um fluxo de valor fim-a-fim, profundo e funcional**, apoiado em regulamentação real de transporte de carga perigosa.

Este documento assume, sem repetir a justificativa em cada seção, a recomendação já validada com o time: priorizar **Checklist de Veículo (item 5)** + **Fiscalização Ambiental com Registro Fotográfico, sem classificação automática de Ringelmann (item 3)** + **Dashboard básico (item 7)**.

---

## 2. Objetivo do MVP

O MVP precisa provar, na frente de um investidor, que o sistema:

1. Digitaliza um processo de compliance hoje feito em papel (a planilha de verificação legal anexada em `spec/forms/`), sem perder rigor regulatório;
2. Gera evidência (foto + geolocalização + laudo) de forma mais rápida e auditável que o processo manual;
3. Transforma essas evidências em indicadores de gestão (dashboard) automaticamente, sem trabalho manual de consolidação.

Não é objetivo do MVP demonstrar todo o produto — é objetivo demonstrar profundidade em uma fatia vertical.

---

## 3. Escopo

### 3.1 Dentro do escopo

| # | Módulo (ref. `features.txt`) | Cobertura no MVP |
|---|---|---|
| A | Autenticação mínima (parte do item 1) | Login simples (e-mail/senha), 2 perfis |
| B | Checklist de Veículo — Carga Perigosa (item 5) | Completo, com base na planilha legal anexada |
| C | Fiscalização Ambiental e Registro Fotográfico (item 3) | Completo, exceto classificação automática por IA |
| D | Relatórios, Indicadores e Dashboard (item 7) | Versão básica, sem customização pelo usuário |

### 3.2 Fora do escopo (e por quê)

| Fora do escopo | Onde estava no `features.txt` | Motivo |
|---|---|---|
| Cadastro público, biometria, recuperação de senha, controle de sessões/dispositivos, políticas de senha | Item 1 (restante) | Não agrega à demonstração do valor central; usuários serão pré-cadastrados (seed) |
| Homologação de Fornecedor (cadastro de transportadores, documentos, alertas de vencimento) | Item 2 | Módulo de gestão de terceiros, não faz parte do fluxo de campo que queremos provar |
| Gestão Documental (upload/validade de FDS, CNH, MOPP) | Item 4 | Depende de um motor de alertas próprio; CNH do motorista entra apenas como campo de texto no MVP |
| Classificação automática (IA/visão computacional) da Escala de Ringelmann | Dentro do item 3 | Componente de ML é um projeto à parte; no MVP a classificação é manual, feita pelo inspetor a partir de uma referência visual em tela |
| Checklist dinâmico por número ONU (regras variam por tipo de produto) | Dentro do item 5 | A planilha de referência é um formulário único, válido para qualquer carga perigosa; motor de regras variável por ONU é evolução futura |
| Integrações e APIs com terceiros (ERP, órgãos ambientais) | Item 6 | Sem valor demonstrável sem um parceiro real integrado |
| Configurações e Customização (parâmetros, templates, permissões por tela) | Item 8 | Necessário apenas em produto multiusuário maduro |
| Notificação por e-mail/push de vencimentos e pendências | Dentro dos itens 2, 4 e 7 | Pendências ficam visíveis como indicador dentro do sistema; sem disparo externo |
| Exportação customizável (Excel, relatórios configuráveis) | Dentro do item 7 | MVP exporta um PDF fixo (checklist e laudo de vistoria) |
| App mobile nativo / PWA offline | Implícito nas menções a "app" no `features.txt` | Front-end único, web responsivo; funciona em navegador mobile, sem instalação nem modo offline |
| Multi-tenancy (múltiplas empresas/unidades) | Item 1 | MVP roda com uma única empresa fixa nos dados de demonstração |

> **Observação de revisão:** o `features.txt` original tem duas referências cruzadas que parecem inconsistentes — item 2 aponta "conversa com o item 06" (Integrações) quando o conteúdo (não conformidade/plano de ação) sugere relação com o item 3 (Fiscalização); e o item 5 cita "(vide item 04)" duas vezes, sendo que a segunda menção (geração de relatórios operacionais) parece relacionar-se ao item 7 (Relatórios/Dashboard). Não corrigido no arquivo original — registrado aqui para revisão futura do documento fonte.

---

## 4. Perfis de usuário do MVP

| Perfil | Permissões no MVP |
|---|---|
| **Inspetor** | Cria checklists de veículo, cria registros de fiscalização/vistoria, faz upload de fotos, consulta seu próprio histórico |
| **Gestor** | Acesso ao dashboard, visualiza todos os checklists e vistorias, acompanha e trata não-conformidades |

Usuários são criados via seed de banco (sem tela de auto-cadastro no MVP).

---

## 5. Requisitos Funcionais

### 5.1 Acesso (mínimo)

| ID | Descrição |
|---|---|
| RF01 | O sistema deve permitir login com e-mail e senha |
| RF02 | O sistema deve reconhecer os perfis Inspetor e Gestor, restringindo telas/ações por perfil |
| RF03 | A sessão deve ser controlada por token (JWT), sem gestão de múltiplos dispositivos |

### 5.2 Checklist de Veículo (Carga Perigosa)

| ID | Descrição |
|---|---|
| RF04 | Selecionar/cadastrar veículo (placa) e vincular motorista (nome, CNH), fornecedor/expedidor e número ONU do produto |
| RF05 | Exibir checklist estruturado nas 5 categorias da lista legal de referência: Documentação, Pessoal, Veículo, Equipamentos, Carga (~40 itens conforme `spec/forms/`) |
| RF06 | Registrar resposta por item: SIM / NÃO / N.A., com campo de observação livre |
| RF07 | Permitir anexar foto por item (opcional) |
| RF08 | Registrar automaticamente inspetor responsável, data e hora |
| RF09 | Calcular status geral do checklist (Conforme / Não conforme) a partir dos itens marcados "NÃO" |
| RF10 | Gerar automaticamente uma não conformidade para cada item respondido "NÃO", visível na fila de pendências |
| RF11 | Consultar histórico de checklists filtrando por veículo, motorista e período |
| RF12 | Exportar o checklist preenchido em PDF (itens, respostas, fotos anexadas, identificação do inspetor) |

### 5.3 Fiscalização Ambiental e Registro Fotográfico

| ID | Descrição |
|---|---|
| RF13 | Registrar vistoria vinculada a veículo/carga, com geolocalização e data/hora capturadas automaticamente pelo navegador |
| RF14 | Permitir upload de fotos (e opcionalmente vídeo) via navegador, incluindo câmera do dispositivo em acesso mobile |
| RF15 | Permitir classificação manual da Escala de Ringelmann (seleção de 0 a 5), com referência visual da escala exibida na tela — sem classificação automática nesta fase |
| RF16 | Permitir comentários/observações na vistoria |
| RF17 | Consultar/filtrar histórico de vistorias por período, veículo, local e tipo de carga |
| RF18 | Exportar laudo/relatório fotográfico da vistoria em PDF |

### 5.4 Dashboard e Relatórios

| ID | Descrição |
|---|---|
| RF19 | Exibir indicadores: nº de checklists realizados, % de conformidade, não conformidades abertas, nº de vistorias por período, distribuição de não conformidades por categoria |
| RF20 | Permitir filtro dos indicadores por período, veículo e tipo de carga |
| RF21 | Exibir lista de não conformidades pendentes com indicador visual (badge/cor), sem disparo de notificação externa |
| RF22 | Permitir drilldown de um indicador até o registro de origem (checklist ou vistoria) |

---

## 6. Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| RNF01 | Aplicação web responsiva — funciona em navegador desktop e mobile, sem necessidade de instalação |
| RNF02 | Backend em NestJS seguindo Clean Architecture, com camada de domínio isolada da camada de dados via repository pattern |
| RNF03 | Frontend em React com separação entre regra de apresentação/negócio e chamadas HTTP (camada de infraestrutura isolada) |
| RNF04 | API documentada via Swagger/OpenAPI |
| RNF05 | Persistência em PostgreSQL |
| RNF06 | Ambiente reproduzível via Docker/docker-compose — stack completa sobe com um único comando |
| RNF07 | Senhas armazenadas com hash (bcrypt/argon2); comunicação via HTTPS mesmo em ambiente de demonstração |
| RNF08 | Sem requisito de alta disponibilidade ou escala — ambiente único com dados de demonstração, não é ambiente produtivo |
| RNF09 | Armazenamento de fotos/vídeos em storage compatível com S3 (ex.: MinIO via docker-compose, viável localmente) |
| RNF10 | Geração de PDF feita no backend (ex.: biblioteca de renderização server-side no Node) |
| RNF11 | Dados usados na demonstração devem ser fictícios — evitar dados pessoais reais de motoristas/veículos durante a apresentação a investidores (cuidado de LGPD mesmo em POC) |

---

## 7. Modelo de domínio (entidades principais)

```
Usuario (id, nome, email, senha_hash, perfil[Inspetor|Gestor])

Veiculo (id, placa, tipo)
Motorista (id, nome, cnh)

ChecklistTemplate (id, nome, versao)
ChecklistItemDef (id, template_id, categoria, codigo, descricao)
  -- categorias: Documentação, Pessoal, Veículo, Equipamentos, Carga

Checklist (id, veiculo_id, motorista_id, numero_onu, inspetor_id,
           data_hora, status_geral[conforme|nao_conforme])
ChecklistResposta (id, checklist_id, item_def_id,
                    resposta[SIM|NAO|NA], observacao, foto_url)

Vistoria (id, veiculo_id, numero_onu, inspetor_id, data_hora,
          latitude, longitude, ringelmann[0-5|NA], observacoes)
Evidencia (id, vistoria_id, tipo[foto|video], url)

NaoConformidade (id, origem_tipo[checklist|vistoria], origem_id,
                 descricao, status[aberta|resolvida], criado_em)
```

Observações:
- `NaoConformidade` é derivada automaticamente (RF10) — não há tela de cadastro manual no MVP.
- Não há entidade `Empresa`/`Unidade` no MVP (single-tenant); o modelo já reserva os relacionamentos (`veiculo_id`, `inspetor_id`) de forma que multi-tenancy possa ser adicionado depois sem redesenho.
- `Documento` (FDS, licenças, CNH com validade) não existe como entidade própria no MVP — CNH é apenas um campo de texto em `Motorista`.

---

## 8. Fluxos principais

**Fluxo 1 — Checklist de veículo**
1. Inspetor faz login → seleciona "Novo Checklist"
2. Informa placa do veículo, motorista, CNH, fornecedor e número ONU
3. Sistema carrega o template de checklist com os itens das 5 categorias
4. Inspetor responde item a item (SIM/NÃO/N.A.), anexando foto quando necessário
5. Ao finalizar, sistema calcula status geral e gera não conformidades para os itens "NÃO"
6. Inspetor exporta o PDF do checklist preenchido

**Fluxo 2 — Fiscalização ambiental**
1. Inspetor seleciona "Nova Vistoria", vincula veículo/carga
2. Sistema captura geolocalização e data/hora automaticamente
3. Inspetor faz upload de fotos/vídeo, seleciona grau da Escala de Ringelmann manualmente (com referência visual em tela) e adiciona observações
4. Inspetor exporta o laudo em PDF

**Fluxo 3 — Gestão pelo Gestor**
1. Gestor acessa o dashboard e visualiza indicadores consolidados
2. Filtra por período/veículo/tipo de carga
3. Abre a lista de não conformidades pendentes
4. Faz drilldown até o checklist ou vistoria de origem

---

## 9. Arquitetura técnica (alto nível)

Baseado nas decisões já fixadas em `spec/stack.txt`:

- **Backend (NestJS):** módulos por contexto — `auth`, `checklist`, `fiscalizacao`, `dashboard` — cada um com camada de domínio (entidades + casos de uso) desacoplada da camada de infraestrutura (TypeORM/Prisma + repositórios), conforme Clean Architecture já definida.
- **Frontend (React):** camadas de `pages/`, `domain` (regras de apresentação/validação) e `infra/api` (chamadas HTTP), mantendo a UI isolada da forma como os dados são obtidos.
- **Banco de dados:** PostgreSQL único.
- **Storage de mídia:** serviço compatível com S3 (MinIO em container), para fotos de checklist e vistoria.
- **Geração de PDF:** serviço no backend, chamado a partir dos casos de uso de checklist e vistoria.
- **Orquestração local:** `docker-compose` com serviços `api`, `web`, `db`, `storage`.
- **Documentação de API:** Swagger acoplado ao NestJS (`/docs`).

---

## 10. Decisões assumidas nesta fase

- Suporte mobile via **web responsivo**, sem PWA nem app nativo.
- Exportação de checklist/vistoria em **PDF real**, gerado pelo backend.
- Alertas de não conformidade exibidos como **indicador visual no sistema**, sem envio de e-mail.
- Checklist **estático** (um único template, igual ao documento legal de referência), sem variação por número ONU nesta fase.
- Autenticação **mínima**, sem biometria, autoatendimento de cadastro ou recuperação de senha.
- Ambiente **single-tenant** para a demonstração.

---

## 11. Critérios de aceite do MVP (Definition of Done)

A demonstração é considerada pronta quando, a partir de dados semeados (seed):

1. É possível logar com os dois perfis (Inspetor, Gestor);
2. Um Inspetor completa um checklist de veículo do início ao fim — incluindo foto em item e exportação de PDF;
3. Um Inspetor registra uma vistoria com foto, geolocalização, classificação manual de Ringelmann e exporta o laudo em PDF;
4. Um item marcado "NÃO" no checklist gera automaticamente uma não conformidade, visível ao Gestor;
5. O dashboard reflete, sem intervenção manual, os dados criados nos passos acima (contadores e drilldown funcionando);
6. Toda a stack sobe com `docker-compose up`;
7. O Swagger está acessível e lista os principais endpoints dos módulos incluídos.

---

## 12. Roadmap pós-MVP (para o pitch)

Itens deliberadamente fora do MVP, mas que compõem a visão de produto completo a apresentar como próximos passos:

- Gestão de Usuários completa (biometria mobile, políticas de senha, multi-dispositivo)
- Homologação de Fornecedores com alertas de vencimento de documentos
- Gestão Documental (FDS, licenças, MOPP) com alertas automáticos
- Checklist dinâmico por número ONU (regras variáveis por tipo de produto)
- Classificação automática da Escala de Ringelmann via visão computacional
- Notificações reais (e-mail/push) de vencimentos e pendências
- Integrações via API pública com ERPs e órgãos ambientais
- App mobile nativo ou PWA offline-first
- Multi-tenancy (múltiplas empresas/unidades operacionais)
- Relatórios customizáveis e exportação em Excel
- Adequação formal à LGPD (retenção, consentimento, anonimização) para uso com dados reais
