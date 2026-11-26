# Bits Planning — planejamento de implementação

Documento de referência para o agente (Antigravity, Jules, Copilot ou outro) e para o Pedro. Nome do app: **Bits Planning**. Repositório: `bits-planning`.

Arquivos do kit: `AGENTS.md` (regras do agente), `docs/PROCESSO.md` (fluxo no GitHub, trilhos da IA e da mão), `docs/BACKLOG_INICIAL.md` (tickets propostos), `docs/DIARIO_LOG.md` (registro do Diário), `.github/` (templates de issue e PR, CI) e `scripts/criar-labels.sh`.

Prazo da atividade da mentoria: **06/12/2026** (entrega do link do repositório na Labs Learning + Diário da IA em PDF).

---

## 1. Contexto e objetivo

**Problema.** Objetivos grandes (terminar um livro, avançar num projeto, fazer candidaturas) ficam soltos. As tarefas do dia a dia não se ligam ao objetivo, o progresso não aparece e, sem saber por onde começar nem o que merece o tempo primeiro, é fácil procrastinar e gastar horas no que importa menos.

**Para quem.** Para o próprio Pedro (estudante de tecnologia que concilia faculdade, trabalho e estudos por conta própria) e para quem tem o mesmo problema.

**Solução em uma frase.** Um mapa visual em canvas onde eu conecto meus objetivos e blocos de 25 minutos, vejo quanto cada bloco contribui para o todo e qual é o melhor próximo uso do meu tempo, e recebo recompensas quando avanço.

**Mapa como meio central (visão global e gestão).** O **Mapa** é um canvas interativo onde o app abre e onde tudo se conecta: metas principais ligadas a objetivos filhos e blocos de 25 minutos ligados aos seus objetivos por linhas. Ele reúne num só lugar a visão global (progresso agregado, horas restantes, ritmo necessário e quanto cada bloco vale) e a gestão direta (criar, arrastar, ligar, organizar por dia e distribuir blocos). Todo gesto do canvas tem equivalente acessível por painel/formulário.

**Execução focada (Hoje) e prioridade.** Para agir sem distração, a visão **Hoje** mostra apenas os blocos do dia, com o **próximo melhor bloco** destacado no topo e o timer 25/5. O sistema de prioridade combina a importância que o Pedro dá a cada objetivo com a urgência calculada (prazo contra a capacidade diária), aparece nos selos do Mapa e no painel de resumo, e avisa quando o tempo não cabe em tudo.

**Recompensas.** Concluir blocos, marcos (25, 50 e 75%) e objetivos gera feedback positivo (animações curtas, um resumo da conquista e a recompensa que o próprio Pedro escolheu), sempre depois de esforço real e sem pressão.

**Extensão (só se sobrar tempo): IA no app.** Deixa o Pedro delegar blocos de projeto (por briefing copiado ou por API de um provedor da escolha dele — provedor, modelo e chave configurados por ele), com revisão obrigatória antes de concluir e a opção de fazer na mão sempre disponível. Objetivos de estudo nunca têm esse botão, porque delegar o aprendizado anularia o objetivo.

**O que a avaliação observa** (isso orienta como o agente deve trabalhar): 1) Funciona de ponta a ponta; 2) Entendimento: o Pedro explica qualquer trecho com as próprias palavras; 3) Uso crítico da IA: questionar, testar e corrigir; 4) Comunicação: README, commits e Diário claros; 5) Autonomia. Lema da atividade: **"A IA propõe. Você decide."**

---

## 2. Como trabalhamos: processo e regras do agente

O projeto segue o fluxo do AI Developer Workshop (material de Matt Pocock) sobre o GitHub: `/grill-me` → `/to-spec` → `/to-tickets` → `/tdd` (um ticket por vez) → `/improve-codebase-architecture`. Os detalhes ficam em `docs/PROCESSO.md` (fluxo, rótulos, trilhos, CI), `AGENTS.md` (regras que qualquer agente deve seguir) e `docs/BACKLOG_INICIAL.md` (tickets propostos).

**Dois trilhos, um contrato.** Cada pedaço de trabalho (chunk) é uma issue do GitHub. Com o rótulo `ready-for-agent` (AFK), uma IA implementa e abre um PR. Com `ready-for-human` (HITL), o Pedro implementa na mão. O contrato (a issue), o portão de qualidade (PR com template, CI verde, revisão e merge feitos pelo Pedro) e o histórico de commits são os mesmos nos dois trilhos, e o rótulo pode ser trocado a qualquer momento. A IA nunca faz merge.

**Técnicas do workshop e onde aparecem:**

| Técnica | Como aparece neste projeto |
|---|---|
| Zona inteligente x zona burra do contexto | Um ticket por sessão; `/clear` entre tickets; a continuidade vem das issues e dos documentos, não do chat |
| Conceito de design compartilhado (`/grill-me`) | O PLANNING.md é interrogado antes de virar spec; o Pedro discorda de pelo menos uma recomendação |
| Destino e jornada (`/to-spec`, `/to-tickets`) | Spec publicado como issue; tickets como issues, comparados com `docs/BACKLOG_INICIAL.md` |
| Tracer bullets e slices verticais | O ticket T02 já atravessa regra, dados e o Mapa (canvas) de ponta a ponta; nenhum ticket é "só o schema" ou "só a tela" |
| AFK x HITL | Rótulos `ready-for-agent` e `ready-for-human`; tickets AFK podem rodar em paralelo |
| Red → Green → Refactor, um comportamento por vez (`/tdd`) | Testes pela interface pública, com exemplos de resposta conhecida da seção 6 |
| Loops de feedback | Testes, ESLint, build, CI no GitHub Actions e QA manual a cada ticket |
| Sicofância | `AGENTS.md` manda discordar quando fizer sentido; o PR tem a seção "Onde a IA errou" |
| Agentes copiam o codebase | Os dois primeiros slices (T02 no canvas e T03 no domínio) são do Pedro, para fixar os padrões que a IA vai copiar |
| Entropia e módulos profundos | Rodada de `/improve-codebase-architecture` no T15; interfaces pequenas no domínio |

**Regras do agente (resumo).** Um ticket por sessão; slice vertical; TDD; domínio em funções puras; sem dependência nova sem pedir; só entrega por PR, nunca merge; 3 perguntas para o Pedro em cada PR. O texto completo está em `AGENTS.md`.

**Princípios de design (*O Programador Pragmático*):**

Aplicados de forma enxuta, sem burocracia, para manter o código fácil de entender e evoluir até a v2:

| Princípio | Como aparece no Bits Planning | Limite pragmático (o que evitar) |
|---|---|---|
| **ETC** (*Easier To Change*) | Critério-guia de toda decisão de código e da rodada de arquitetura (T15): "se essa regra mudar amanhã, quantos arquivos preciso tocar?" | Não criar abstrações especulativas para "possíveis necessidades futuras" |
| **DRY** (*Don't Repeat Yourself*) | Uma única fonte da verdade por **conhecimento**: estados derivados nunca são salvos (percentuais, urgência, nós e ligações do canvas); `replanejar` alimenta Hoje e Distribuir; datas locais vivem em `datas.js`; `PainelBloco` é compartilhado entre Mapa e Hoje; foco, pausa e capacidade vêm de `configuracoes` | DRY é sobre **conhecimento**, não sobre duplicação visual acidental entre dois componentes que evoluem separado |
| **Ortogonalidade** | Eixos independentes: domínio puro (`src/dominio/`), persistência (`src/dados/`), UI/Canvas (`src/componentes/`, `src/paginas/`) e rede/IA (`src/ia/cliente.js`). Timer, prioridade e recompensas não conhecem detalhes internos uns dos outros | Não misturar lógica de regra dentro de handlers do React Flow ou componentes de tela |
| **Reversibilidade** | Decisões de ferramenta ficam atrás de fronteiras pequenas: `localStorage` (com `versao` e `migrar`) só em `armazenamento.js`; `@xyflow/react` isolado na borda visual do Mapa; provedores de IA atrás de um formato único em `provedores.js`/`cliente.js`; `HashRouter` só em `App.jsx` | Não salvar formatos proprietários de bibliotecas (como `nodes`/`edges` do React Flow) no estado ou no JSON |
| **Desacoplamento** | Fluxo de dados em uma direção (`componentes → estado → domínio`), ações de intenção claras no reducer (*Tell, Don't Ask*) e injeção simples por parâmetro (`hoje`, `agoraMs`, `capacidade`) em funções puras | Sem EventBus genérico, sem containers de DI e sem camadas rasas que só repassam chamadas (mantendo módulos profundos) |
| **Configuração externa (Dica 55)** | Parâmetros de ambiente, endpoints públicos, versões de API, timeouts e limites padrão ficam fora do código principal (`.env` / `.env.example`), lidos e validados em um único módulo (`src/config/ambiente.js`); preferências do usuário ficam em runtime (`configuracoes` e `src/ia/chave.js`) | Nunca colocar chaves/segredos em `VITE_*` (vão para o bundle público), nunca espalhar `import.meta.env` pelo app e não inventar Docker/backend fora da stack |

---

## 3. Escopo

**Dentro da v1 (núcleo)**

1. **Mapa (canvas central — visão global e gestão):** tela principal em canvas (`@xyflow/react`) com metas, objetivos e blocos de 25 minutos conectados por linhas. Mostra progresso agregado, horas restantes, ritmo necessário e quanto cada bloco vale para o objetivo e para a meta principal; permite criar, editar, pausar, concluir e excluir objetivos, criar e conectar/desconectar blocos, **Organizar por dia** e **Distribuir**, sempre com equivalente acessível por painel/formulário.
2. **Plano automático:** cadastrar um objetivo com intervalo de unidades (opcional, ex.: capítulos 4 a 27), prazo e dias da semana ativos; o app divide em blocos de 25 minutos distribuídos até o prazo (*chunking*) e replaneja os atrasos (a mesma regra alimenta o **Distribuir** do Mapa).
3. **Hoje (execução focada):** visão enxuta dos blocos do dia, timer 25/5, recordação ativa (resumo de uma frase sem consultar) ao concluir e pausa de descanso.
4. **Prioridade:** importância dada pelo Pedro + urgência calculada + capacidade diária, com selos nos nós do Mapa, ranking explicado no painel de resumo, "próximo melhor bloco" no Hoje e aviso de sobrecarga.
5. **Recompensas:** feedback positivo ao concluir blocos, marcos e objetivos/metas (animações curtas, resumo da conquista, a recompensa escolhida pelo Pedro e histórico de conquistas no painel de resumo do Mapa).

**Extensão (só se sobrar tempo, nesta ordem)**

IA no app: delegação de blocos de projeto com briefing e revisão obrigatória (T21); IA por API de provedor à escolha (T27, T28).

**Condicionais (entram se sobrar tempo; ordem na seção 10)**

Prévia do plano com aviso de carga, gráfico semanal (no painel de resumo), página Amanhã (planejar na noite anterior), revisões espaçadas (D+1, D+3, D+7), fim do dia por limite diário, exportar e importar JSON, issue pré-preenchida no GitHub para um agente com acesso ao repositório, status da issue e do PR pela API pública do GitHub, registro mão × IA com exportação para o Diário e PWA.

**Fora da v1 (v2 em diante)**

Sincronização entre aparelhos (Samsung S25, MacBook, Windows), login, notificações push, edição colaborativa, importação de CSV do Notion, estatísticas avançadas, tema escuro, servidor próprio ou proxy de IA, respostas em streaming, qualquer agente rodando dentro do app, criação automática de issues ou PRs por token e sons.

---

## 4. Stack

Versões estáveis atuais; confirme no npm na hora de instalar.

| Peça | Escolha | Observação |
|---|---|---|
| Build | Vite | `npm create vite@latest` com template React |
| UI | React + JavaScript (JSX) | Decisão do Pedro: trocar por TypeScript se preferir |
| Estilo | Tailwind CSS | Use a instalação oficial atual para Vite |
| Rotas | React Router com `HashRouter` | Funciona em qualquer hospedagem estática |
| Canvas (núcleo) | `@xyflow/react` (React Flow) | Pan, zoom, nós e ligações prontos; entra já no T01/T02; importar `@xyflow/react/dist/style.css` |
| IA por API (extensão) | `fetch` direto, sem SDK | Funções puras montam a requisição e leem a resposta; só um módulo faz a chamada de rede |
| Testes | Vitest | Domínio, dados e IA (com respostas de exemplo); mais 2 ou 3 testes de fluxo com React Testing Library + jsdom (com polyfill simples de `ResizeObserver` para o canvas) |
| Lint | ESLint | Já vem no template do Vite |
| CI | GitHub Actions | `.github/workflows/ci.yml`: lint, testes e build em todo PR |
| Fonte | Atkinson Hyperlegible via `@fontsource` | Confirmar o nome do pacote no npm |
| Animações | CSS puro (keyframes) | Sem biblioteca; respeitar `prefers-reduced-motion` |
| Gráfico | SVG feito à mão | Condicional; sem biblioteca de gráficos |
| Persistência | `localStorage` atrás de `armazenamento.js` | A chave de storage vem de `src/config/ambiente.js`; a chave de IA fica à parte (seção 6) |
| Configuração externa | `.env` / `.env.example` + `src/config/ambiente.js` | Leitura e validação centralizadas de `import.meta.env` (sem segredos em `VITE_*`) |
| Deploy | **Vercel** (recomendado) ou GitHub Pages | No GitHub Pages todos os projetos de `usuario.github.io` compartilham a mesma origem e, portanto, o mesmo `localStorage`. Para um app que guarda chave de IA, prefira origem própria |

Scripts do `package.json` que o CI e os agentes esperam: `dev`, `build`, `lint`, `test` (= `vitest run`, uma execução) e `test:watch` (= `vitest`).

### Configuração externa (Dica 55 — variáveis de ambiente e perfis)

Todos os parâmetros que mudam por ambiente ou implantação ficam em `.env` (documentados em `.env.example`, com `.env` e `.env.*` ignorados no `.gitignore`). **Um único módulo (`src/config/ambiente.js`)** lê `import.meta.env`, aplica valores padrão seguros, valida tipos/intervalos/URLs e lança um erro descritivo se algum valor estiver inválido. Nenhum outro arquivo da aplicação acessa `import.meta.env` diretamente, e `src/dominio/` continua puro recebendo os valores necessários por parâmetro.

> **Segurança (Vite client-side):** como o Bits Planning v1 é uma SPA estática, **toda variável `VITE_*` é embutida em texto claro no bundle JS**. Por isso, **chaves de API de IA e segredos NUNCA vão em `.env`**. A chave do provedor é informada pelo usuário em runtime e gerenciada por `src/ia/chave.js`. Em uma futura v2 com backend/proxy, segredos de servidor ficam no gerenciador de segredos da plataforma (sem prefixo `VITE_`).

| Variável | Tipo / validação | Padrão seguro | Uso |
|---|---|---|---|
| `VITE_APP_BASE` | caminho começando com `/` | `/` | `base` do Vite (lida em `vite.config.js` via `loadEnv`): `/` em dev/Vercel, `/bits-planning/` no GitHub Pages |
| `VITE_STORAGE_KEY` | string não vazia | `bits-planning` | Chave do `localStorage` em `armazenamento.js` (ex.: `bits-planning-dev` em dev) |
| `VITE_LIMITE_DIARIO_BLOCOS_PADRAO` | inteiro ≥ 1 | `6` | Valor inicial de `configuracoes.limiteDiarioBlocos` |
| `VITE_MINUTOS_FOCO_PADRAO` | inteiro ≥ 1 | `25` | Valor inicial de `configuracoes.minutosFoco` |
| `VITE_MINUTOS_PAUSA_PADRAO` | inteiro ≥ 1 | `5` | Valor inicial de `configuracoes.minutosPausa` |
| `VITE_IA_TIMEOUT_MS` | inteiro ≥ 1000 | `60000` | Timeout das requisições HTTP em `src/ia/cliente.js` (extensão) |
| `VITE_IA_OPENAI_DEFAULT_BASE_URL` | URL `http(s)` válida | `https://api.openai.com/v1` | URL base sugerida para provedor tipo `openai` (em dev local pode apontar para Ollama `http://localhost:11434/v1`) |
| `VITE_IA_ANTHROPIC_URL` | URL `http(s)` válida | `https://api.anthropic.com/v1/messages` | Endpoint da API Anthropic em `src/ia/provedores.js` (extensão) |
| `VITE_IA_ANTHROPIC_VERSION` | string não vazia | `2023-06-01` | Cabeçalho `anthropic-version` (evita recompilar se a versão mudar) |
| `VITE_IA_GEMINI_BASE_URL` | URL `http(s)` válida | `https://generativelanguage.googleapis.com/v1beta/models` | Base URL da API Gemini em `src/ia/provedores.js` (extensão) |
| `VITE_GITHUB_API_BASE_URL` | URL `http(s)` válida | `https://api.github.com` | Base URL da API pública do GitHub em `src/integracoes/github.js` (T23) |
| `VITE_GITHUB_ISSUE_URL_LIMITE` | inteiro ≥ 1000 | `7500` | Limite conservador de caracteres na URL de nova issue (T22) |

**Como alternar ambientes sem alterar código-fonte:**
- **Desenvolvimento:** copie `.env.example` para `.env.local` (ignorado pelo Git) e ajuste o que precisar (ex.: `VITE_STORAGE_KEY=bits-planning-dev`, timeout menor ou URL local do Ollama).
- **Testes (Vitest):** `carregarAmbiente(env)` (função pura exportada por `src/config/ambiente.js`) aceita um objeto `env` explícito, permitindo testar padrões, sobrescritas e erros de validação sem depender do arquivo `.env` da máquina.
- **Produção:** configure as variáveis diretamente no painel da Vercel (ou no workflow de deploy do GitHub Pages com `VITE_APP_BASE=/bits-planning/`).

---

## 5. Modelo de dados

Chave no `localStorage`: definida em `ambiente.storageKey` (padrão `bits-planning`). Os valores iniciais de `configuracoes` também vêm de `src/config/ambiente.js` e podem ser alterados em tempo de execução nos Ajustes. Estrutura salva (com `versao` para permitir migrações):

```js
{
  versao: 1,
  objetivos: [Objetivo],
  tarefas: [Tarefa],
  mapa: { posicoes: { 'obj:ID': { x, y }, 'blo:ID': { x, y } } },   // só posições; nós e ligações vêm dos dados
  conquistas: [],              // { id, tipo: 'marco' | 'objetivo', objetivoId, marco, em, reflexao }
  configuracoes: { limiteDiarioBlocos: 6, minutosFoco: 25, minutosPausa: 5, animacoes: 'normal' },   // 'normal' | 'reduzida' | 'desligada'
  ia: { tipo: 'openai' | 'anthropic' | 'gemini', baseUrl, modelo, lembrarChave: false },            // extensão
  planosConfirmados: [],       // condicional (página Amanhã)
  timerAtivo: null | { tarefaId, inicioMs, fase: 'foco' | 'pausa' }
}
```

**A chave de IA não faz parte deste JSON.** Ela fica em `sessionStorage` (`bits-planning:ia-chave`) por padrão, ou em `localStorage` se o Pedro marcar "Lembrar neste navegador". Nunca entra em exportações, briefings, logs ou URLs.

```js
Objetivo = {
  id,                      // crypto.randomUUID()
  titulo,                  // "Fundamentos da Arquitetura de Software"
  paiId,                   // meta principal (outro objetivo) ou null
  importancia,             // 1 a 5 (padrão 3)
  recompensa,              // texto livre: "quando eu terminar, eu..." (opcional)
  tipo,                    // 'estudo' (sempre na mão) | 'projeto' (extensão: pode pedir ajuda à IA)
  repositorio,             // 'dono/repo' ou null; só para o canal do GitHub (condicional)
  nomeUnidade,             // "capítulo" (opcional)
  primeiraUnidade,         // 4  (opcional: sem intervalo, os blocos são criados livres no Mapa)
  ultimaUnidade,           // 27 -> 24 unidades
  blocosPorUnidade,        // 1 (padrão); cada bloco = 25 min
  prazo,                   // 'YYYY-MM-DD' (data local)
  diasAtivos,              // [1,2,3,4,5]  0 = domingo ... 6 = sábado
  status,                  // 'ativo' | 'pausado' | 'concluido'
  criadoEm                 // ISO
}

Tarefa = {                 // uma tarefa = um bloco de 25 minutos
  id,
  objetivoId,              // null = bloco solto (ainda sem objetivo)
  unidade, parte,          // 4 e 1..blocosPorUnidade; null em blocos criados livres no Mapa
  titulo,                  // "Capítulo 4" ou "Capítulo 4 (parte 1/2)"; editável
  dataPlanejada,           // 'YYYY-MM-DD' | null (sem data até Distribuir)
  status,                  // 'pendente' | 'delegada' | 'feita'
  concluidaEm,             // ISO | null
  resumo,                  // string | null  (recordação ativa)
  revisoes,                // [{ prevista: 'YYYY-MM-DD', feita: false, lembrou: null }]  (condicional)
  descricao,               // o que construir (blocos de projeto, extensão)
  criterios,               // critérios de aceite, um por linha (blocos de projeto, extensão)
  feitaPor,                // 'mao' | 'ia' | 'misto' | null  (preenchido ao concluir)
  delegacao,               // null | { canal, provedor, modelo, briefing, resposta, issueUrl, prUrl, delegadaEm, revisaoOk }
  erroIA                   // string | null  (o que a IA errou, para o Diário)
}
```

`delegacao.canal` é `'manual'` (briefing copiado para qualquer IA), `'api'` (IA configurada nos Ajustes) ou `'github'` (issue para um agente; condicional). `revisaoOk` só vira verdadeiro depois do checklist de revisão.

---

## 6. Regras de negócio (e os testes que as provam)

**Datas e parâmetros puros (DRY e desacoplamento).** Datas são sempre strings `'YYYY-MM-DD'` em horário local; nunca use `toISOString()` para obter a data local (veja a seção 11). Todas as funções de `src/dominio/` recebem o que precisam por parâmetro (`hoje`, `agoraMs`, `capacidadeDiaria`, `minutosPorBloco` lidos de `configuracoes`) — nunca chamam `Date.now()`, `localStorage` ou APIs de bibliotecas de UI internamente.

**Canvas (Mapa)** — funções puras em `src/dominio/mapa.js` (zero imports de `@xyflow/react`, garantindo ortogonalidade e reversibilidade)

1. Nós e ligações **derivam dos dados**: cada objetivo (ou meta) é o nó `obj:<id>`, cada bloco é o nó `blo:<id>`, existe uma ligação bloco → objetivo quando `objetivoId` está preenchido e existe uma ligação objetivo → meta principal quando `paiId` está preenchido. O canvas guarda por conta própria só as posições (`mapa.posicoes`).
2. Ligar um bloco a um objetivo define `objetivoId` (`conectarBloco`). Um bloco tem no máximo um objetivo: uma nova ligação substitui a anterior. Apagar a ligação (`desconectarBloco`) devolve o bloco a "solto" (`objetivoId` e `dataPlanejada` nulos). Um bloco `feita` não pode ser desligado.
3. **Distribuir** usa a mesma função do `replanejar`: todos os blocos pendentes do objetivo, inclusive os sem data, são redistribuídos a partir de hoje na ordem atual; os sem data entram no fim.
4. `organizarPorDia({ objetivos, tarefas })` devolve as posições. O nó do objetivo fica em `x = 0`; os blocos ficam em colunas por data (`x = 320 + 220 × índice da coluna`), empilhados (`y = 90 × posição na coluna`); os sem data formam a última coluna; os soltos ficam numa faixa própria no fim. Cada objetivo ocupa uma faixa, e a faixa seguinte começa abaixo (`altura da faixa = 90 × maior coluna + 60`). Quando existem metas principais (`paiId` preenchido nos filhos), cada meta pai posiciona-se à esquerda dos filhos (`x = -320` por nível acima), alinhada ao início da faixa do primeiro filho — mantendo a leitura esquerda → direita (Meta → Objetivos → Blocos por dia).
5. Todo gesto do canvas tem equivalente por formulário no painel lateral do bloco ou do objetivo (por exemplo, escolher o objetivo ou a meta principal em uma lista).

Testes obrigatórios (resposta conhecida):

| Entrada | Saída esperada |
|---|---|
| Objetivo A com 2 blocos em 24/11/2026 e 1 em 25/11 | A em `(0, 0)`; blocos do dia 24 em `(320, 0)` e `(320, 90)`; bloco do dia 25 em `(540, 0)` |
| Objetivo B com 1 bloco, depois de A | A tem faixa de altura 90 × 2 + 60 = 240; B em `(0, 240)` e seu bloco em `(320, 240)` |
| Meta Carreira pai de A e B | Carreira em `(-320, 0)`, A em `(0, 0)` e B em `(0, 240)` |
| A com 4 blocos (2 feitos) e um bloco solto pendente ligado a A | percentual de A passa de 50 para 40 |
| Desligar um bloco `feita` | recusado com erro |
| Ligar um bloco a B quando já estava em A | passa a ser só de B |
| Distribuir 6 blocos sem data em 3 dias ativos | 2 por dia |

**Distribuição** — `distribuirBlocos({ blocosRestantes, dataInicio, prazo, diasAtivos })` devolve `[{ data, quantidade }]`.

1. Datas candidatas: de `dataInicio` até `prazo`, inclusive, cujo dia da semana está em `diasAtivos`.
2. `base = floor(n / d)` e `resto = n % d`. Os **primeiros `resto` dias** recebem um bloco a mais.
3. Sem datas candidatas: lançar erro `SEM_DIAS_DISPONIVEIS`. Prazo anterior ao início: erro `PRAZO_INVALIDO`.
4. Se algum dia passar de `limiteDiarioBlocos`, a função continua normal; quem chama exibe o aviso "prazo apertado: este plano pede N blocos por dia".

Testes obrigatórios (resposta conhecida):

| Entrada | Saída esperada |
|---|---|
| 24 blocos, 12 dias ativos | 2 por dia em todos |
| 25 blocos, 12 dias ativos | 3 no primeiro dia, 2 nos outros 11 |
| 18 blocos, 8 dias ativos | `[3,3,2,2,2,2,2,2]` |
| 0 blocos | `[]` |
| 5 blocos, 1 dia | `[5]` (e o aviso de carga na UI) |
| 10 blocos, seg 23/11 a sex 27/11/2026, `[1,2,3,4,5]` | 2 por dia |
| 10 blocos, 23/11 a 06/12/2026, `[2,4]` (ter e qui) | datas 24/11, 26/11, 01/12, 03/12 com `[3,3,2,2]` |
| prazo anterior ao início | erro `PRAZO_INVALIDO` |
| `diasAtivos` sem nenhuma data no intervalo | erro `SEM_DIAS_DISPONIVEIS` |

**Geração de tarefas** — `gerarTarefas(objetivo, dataInicio)`: percorre as unidades de `primeiraUnidade` a `ultimaUnidade` e, em cada uma, as partes `1..blocosPorUnidade`, em ordem, atribuindo as datas da distribuição. Capítulos 4 a 27 com 1 bloco por unidade geram 24 tarefas.

**Replanejar** — `replanejar(objetivo, tarefas, hoje)`: mantém as tarefas feitas intactas e redistribui as pendentes (inclusive as atrasadas e as sem data, que entram no fim) a partir de `hoje`, preservando a ordem. Teste: 24 blocos em 12 dias, 6 feitos; ao replanejar no dia em que restam 8 dias ativos, sobram 18 blocos e o resultado é `[3,3,2,2,2,2,2,2]`. Atraso não é punido: o botão só reorganiza.

**Progresso** — `progressoDoObjetivo(tarefas)` devolve `{ feitos, total, percentual }`, com percentual arredondado. Objetivo vira `concluido` quando todas as tarefas estão feitas.

**Revisões** — ao concluir um bloco com `resumo`, agende revisões em D+1, D+3 e D+7. Na revisão, o usuário tenta lembrar primeiro, depois vê o resumo e marca "lembrei" ou "precisei olhar"; neste último caso, agenda mais uma revisão em D+1.

**Fim do dia** — ao concluir todos os blocos do dia ou atingir `limiteDiarioBlocos`, a tela Hoje mostra "Por hoje é isso. Descanse." e não oferece iniciar outro bloco sem ação explícita.

**Hierarquia, progresso e contribuição**

1. Um objetivo pode ter uma **meta principal** (`paiId`), em qualquer profundidade, sem ciclos (`podeSerFilho`). No Mapa, objetivos sem pai são raízes da árvore visual.
2. O progresso de um nó é calculado sobre toda a sua subárvore: `feitos ÷ total` de blocos do objetivo e de todos os descendentes (`progressoAgregado`). Pausar ou excluir um objetivo o tira do agregado dos pais. O percentual nunca é guardado: é sempre recalculado dos dados.
3. A contribuição de um bloco para um ancestral é `100 ÷ total de blocos desse ancestral` (`contribuicaoDoBloco`), com uma casa decimal. É o que liga cada tarefa pequena ao objetivo principal.
4. **Horas restantes** = blocos pendentes × 25 ÷ 60. **Ritmo necessário** = blocos pendentes ÷ dias ativos restantes até o prazo.

Testes obrigatórios (resposta conhecida):

| Entrada | Saída esperada |
|---|---|
| Meta Carreira com A (24 blocos, 6 feitos) e B (16 blocos, 10 feitos) | Carreira: 16 de 40 = 40% |
| Um bloco de A | vale 4,2% de A e 2,5% de Carreira |
| `podeSerFilho` de Carreira sob A, sendo A filho de Carreira | recusado (ciclo) |
| `podeSerFilho` de A sob A | recusado |
| 10 blocos pendentes | 4,2 horas restantes |
| 12 blocos pendentes e 6 dias ativos restantes | ritmo necessário 2 blocos por dia |

**Prioridade e orçamento de tempo**

Objetivo desta regra: não desperdiçar tempo. O app combina o que importa (escolhido pelo Pedro) com o que aperta (calculado) e respeita a capacidade diária (`limiteDiarioBlocos`, padrão 6).

1. **Urgência**, pela fração da capacidade diária que o objetivo sozinho exigiria (`ritmo ÷ capacidade`): `critica` se o prazo já venceu com blocos pendentes ou se o ritmo passa da capacidade; `alta` se a fração for ≥ 0,5; `media` se for ≥ 0,25; `baixa` nos demais casos.
2. **Pontuação** = `importancia × 10` + (`baixa` 0, `media` 10, `alta` 20, `critica` 30). Desempate: prazo mais próximo e depois menos blocos restantes. Cada posição do ranking mostra o motivo em uma frase ("importância 5, precisa de 2 blocos por dia").
3. **Alocação do dia** (`alocarBlocosDoDia`): em ordem de pontuação, cada objetivo recebe `ceil(ritmo)` blocos (0 se hoje não for dia ativo dele) enquanto houver capacidade; a sobra vai, um bloco por vez, para o objetivo de maior prioridade que ainda tem blocos. O que não coube vira "adiado" e liga o aviso de **sobrecarga**, com as saídas: pausar um objetivo, estender o prazo ou reduzir o escopo.
4. O **próximo melhor bloco** é o primeiro bloco pendente do objetivo de maior pontuação que ainda tem blocos alocados hoje.
5. Tudo é **sugestão**: o Pedro pode ignorar a ordem e escolher outro bloco.
6. Objetivos pausados, concluídos e metas sem blocos próprios ficam fora da alocação.

Testes obrigatórios:

| Entrada | Saída esperada |
|---|---|
| `urgencia`: 12 blocos, 6 dias ativos, capacidade 6 | `media` (ritmo 2; 2 ÷ 6 = 0,33) |
| `urgencia`: 9 blocos, 3 dias, capacidade 6 | `alta` (ritmo 3; 0,5) |
| `urgencia`: 30 blocos, 3 dias, capacidade 6 | `critica` (ritmo 10 passa de 6) |
| `urgencia`: 2 blocos, 20 dias, capacidade 6 | `baixa` |
| `urgencia`: 5 blocos pendentes e prazo vencido | `critica` |
| A (importância 5, `media`) e B (importância 2, `alta`) | pontuações 60 e 40; A vem antes |
| Capacidade 6; A precisa de 2 e B de 3 | A 3 e B 3 (a sobra vai para A) |
| Capacidade 4; A precisa de 3 e B de 3 | A 3 e B 1; B adiado com 2 blocos faltando; sobrecarga ligada |
| Hoje não é dia ativo de A | A recebe 0 e não conta como adiado |

**Recompensas e feedback positivo**

Princípio do livro: recompensar o **processo** (tempo dedicado e blocos feitos), não só o resultado, e fazê-lo sem pressão.

1. **Bloco concluído:** gesto curto (marca de check animada e "bloco 3 de 4 hoje").
2. **Marco:** ao cruzar 25%, 50% ou 75% de um objetivo ou meta (`marcosAtingidos(antes, depois)`), um aviso curto e o anel de progresso animando no nó/painel.
3. **Objetivo ou meta concluída:** celebração maior (partículas em CSS na paleta do app), o resumo da conquista (`resumoDaConquista`: blocos, horas, dias com blocos e ritmo médio), a **recompensa** que o Pedro escolheu para aquele objetivo e um campo opcional "o que quero lembrar desta conquista". Fica registrado em `conquistas`, e o histórico aparece no painel de resumo do Mapa.
4. **Sem sequência que zera** (streak): o app mostra horas dedicadas acumuladas, que só crescem.
5. **Só depois de esforço real:** um bloco delegado à IA (extensão) só gera feedback depois da revisão concluída.
6. **Só em transições:** o feedback dispara quando o percentual cruza um marco, nunca ao abrir o app, e o que já foi celebrado fica em `conquistas` para não repetir.
7. **Controle:** Ajustes tem `animacoes` (`normal`, `reduzida`, `desligada`); o padrão segue `prefers-reduced-motion`. Sem som. Até 1,2 s no bloco e 2,5 s no objetivo, sem bloquear a tela, com opção de dispensar.

Testes obrigatórios:

| Entrada | Saída esperada |
|---|---|
| `marcosAtingidos(20, 30)`, `(45, 80)`, `(95, 100)`, `(30, 30)` | `[25]`, `[50, 75]`, `[100]`, `[]` |
| `resumoDaConquista` com 24 blocos feitos em 12 datas diferentes | `{ blocos: 24, horas: 10, dias: 12, ritmoMedio: 2 }` |
| Concluir o último bloco do objetivo A, filho de Carreira, que passa de 90 para 100% | celebrações de A e de Carreira |
| Reabrir o app sem mudar o progresso | nenhuma celebração |

**Extensão: IA por API (provedor à escolha do Pedro)**

Configuração: `ia = { tipo, baseUrl, modelo, lembrarChave }`. O tipo `openai` cobre qualquer servidor compatível com a API de chat da OpenAI (a própria OpenAI, OpenRouter, servidores locais como Ollama ou LM Studio e outros), por isso aceita uma URL base. Os tipos `anthropic` e `gemini` usam as URLs dos próprios provedores.

1. **Nada é enviado sem mostrar antes** o provedor, o modelo e o texto completo, e esperar o clique em "Enviar".
2. Timeout de 60 s, com botão para cancelar.
3. Erros viram mensagens claras: 401 ou 403 (chave), 404 (modelo ou URL), 429 (limite), 5xx (provedor), falha de rede, que inclui bloqueio de CORS (o app explica que o navegador pode ter bloqueado), e tempo esgotado.
4. A resposta é texto não confiável: exibida como texto, nunca como HTML, e salva em `delegacao.resposta` com provedor, modelo e data.
5. A chave nunca entra no JSON principal, em exportações, no briefing, em logs ou em URLs. "Esquecer chave" apaga das duas formas de armazenamento.
6. Só blocos de objetivos `projeto` podem pedir proposta.

Funções puras em `src/ia/provedores.js` (recebem endpoints/versão de `src/config/ambiente.js` por parâmetro, com padrões seguros); só `src/ia/cliente.js` faz `fetch` (usando `ambiente.ia.timeoutMs`). Formatos padrão (parametrizáveis via `.env` sem editar código caso mudem na documentação de cada provedor):

| tipo | URL | Cabeçalhos | Corpo | Texto na resposta |
|---|---|---|---|---|
| `openai` | `{baseUrl}/chat/completions` | `Authorization: Bearer <chave>` (omitido se a chave estiver vazia) | `{ model, messages: [{ role: 'system', content }, { role: 'user', content }] }` | `choices[0].message.content` |
| `anthropic` | `https://api.anthropic.com/v1/messages` | `x-api-key`, `anthropic-version: 2023-06-01`, `anthropic-dangerous-direct-browser-access: true` | `{ model, max_tokens, system, messages: [{ role: 'user', content }] }` | blocos `type: 'text'` de `content`, concatenados |
| `gemini` | `https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent` | `x-goog-api-key` | `{ systemInstruction: { parts: [{ text }] }, contents: [{ role: 'user', parts: [{ text }] }] }` | `candidates[0].content.parts[]`, concatenados |

Testes obrigatórios (com respostas de exemplo, sem rede):

| Entrada | Saída esperada |
|---|---|
| `montarRequisicao` tipo `openai`, `baseUrl` `http://localhost:11434/v1`, chave vazia | URL `http://localhost:11434/v1/chat/completions` e nenhum cabeçalho `Authorization` |
| `montarRequisicao` tipo `anthropic` | os três cabeçalhos acima, `max_tokens` definido e `system` fora de `messages` |
| `montarRequisicao` tipo `gemini`, modelo `m` | URL terminando em `/models/m:generateContent`; a chave no cabeçalho, nunca na URL |
| `extrairTexto('openai', { choices: [{ message: { content: 'oi' } }] })` | `'oi'` |
| `extrairTexto('anthropic', { content: [{ type: 'text', text: 'a' }, { type: 'text', text: 'b' }] })` | `'ab'` |
| `extrairTexto('gemini', { candidates: [{ content: { parts: [{ text: 'x' }, { text: 'y' }] } }] })` | `'xy'` |
| `classificarErro` com status 401, 404, 429 e 503 | `chave`, `modelo_ou_url`, `limite` e `provedor` |
| `fetch` lançando `TypeError` | `rede` |

**Extensão: Delegação e revisão (blocos de projeto)**

1. Só objetivos do tipo `projeto` oferecem ajuda da IA. Objetivos de estudo nunca oferecem: delegar a leitura ou o exercício anularia o aprendizado que o objetivo quer.
2. **Fazer na mão é sempre possível**, inclusive em um bloco já delegado: "Retomar na mão" devolve o bloco para `pendente` e guarda o briefing.
3. Um bloco `delegada` **não conta no progresso**. Só `feita` conta.
4. Concluir um bloco delegado exige o checklist de revisão: li a proposta ou o diff por inteiro, rodei e testei o que ela sugere, conferi os critérios de aceite, consigo explicar o código. Sem os 4 itens marcados, "Concluir" fica desabilitado.
5. Ao concluir, `feitaPor` vira `'ia'`, `'misto'` ou `'mao'`. Blocos feitos pelo timer registram `'mao'`.
6. Canais: `manual` (copiar o briefing para qualquer IA), `api` (a IA dos Ajustes) e `github` (condicional: issue pré-preenchida para um agente com acesso ao repositório; o envio é um clique do Pedro no GitHub).

`montarBriefing({ objetivo, tarefa })` (`src/dominio/delegacao.js`) devolve markdown com título, objetivo, "O que construir", critérios de aceite em checklist e instruções (responder em português, propor em passos pequenos, mostrar como testar). O prompt de sistema fica em `src/ia/prompts.js`. No canal `github`, também `montarUrlNovaIssue({ repositorio, titulo, corpo, rotulos })`, que devolve `{ url, truncado }`, e `validarRepositorio(texto)`.

Testes obrigatórios:

| Entrada | Saída esperada |
|---|---|
| `montarBriefing` de um bloco com título, descrição e 2 critérios | o markdown contém o título, a descrição e os 2 critérios como checklist |
| 24 blocos, 1 `feita` e 1 `delegada` | percentual 4 (não 8) |
| 5 blocos feitos: 3 na mão, 1 por IA, 1 misto | contagem `{ mao: 3, ia: 1, misto: 1 }` |
| Concluir bloco delegado com 3 dos 4 itens marcados | recusado |
| `validarRepositorio('https://github.com/pedro/bits-planning')` (T22) | aceito e normalizado para `pedro/bits-planning` |
| `montarUrlNovaIssue` com título `Capítulo & teste #1` (T22) | `title=Cap%C3%ADtulo%20%26%20teste%20%231` na URL; decodificar devolve o original |
| `montarUrlNovaIssue` com corpo de 9.000 caracteres (T22) | `truncado: true` |

---

## 7. Telas e fluxos

**Desktop-first** para o **Mapa** (canvas em tela cheia com painel lateral recolhível), com a tela **Hoje** e os equivalentes por formulário/teclado funcionando confortavelmente em **380px** (celular). Navegação enxuta com **3 destinos** na barra superior (adaptada no mobile): **Mapa** (tela inicial), **Hoje** e **Ajustes**. Condicionais: **Amanhã** e **Revisão**.

**Mapa** (tela inicial — canvas central, absorve visão global e gestão de objetivos). Um canvas em tela cheia com pan e zoom.
- **Barra de ações no topo:** `+ Novo objetivo`, `+ Novo bloco`, **Organizar por dia** e o botão **Resumo** (abre o painel de resumo global).
- **Nós no canvas:** cada meta principal ou objetivo é um nó grande (título, progresso agregado %, selo de urgência/importância, prazo, blocos/horas restantes e ritmo necessário); cada bloco é um nó pequeno (título, data, cor do estado) ligado ao seu objetivo por uma linha; objetivos ligados à sua meta principal por outra linha. Blocos soltos ficam numa faixa própria.
- **Interações diretas:** arrastar nós (as posições ficam salvas), arrastar de um bloco até um objetivo para ligá-lo, arrastar de um objetivo até uma meta para definir `paiId` (bloqueando ciclos), apagar uma linha para desligá-lo, criar blocos clicando no fundo ou pelo botão do topo, usar **Organizar por dia** para alinhar tudo em colunas por data (Meta → Objetivos → Dias) e **Distribuir** no objetivo para dar datas aos blocos sem data.
- **Painel lateral do objetivo** (abre ao clicar num objetivo ou em `+ Novo objetivo`): formulário completo com título, importância (1 a 5), meta principal (lista acessível equivalente a ligar no canvas), intervalo de unidades (opcional), blocos por unidade, prazo, dias ativos e **recompensa** ("quando eu terminar, eu..."), além de **Distribuir**, **Pausar**, **Concluir** e **Excluir** (com confirmação). A prévia do plano com aviso de carga é condicional.
- **Painel lateral do bloco** (compartilhado entre Mapa e Hoje, abre ao clicar num bloco): título editável, objetivo (lista para trocar ou deixar solto — equivalente acessível de ligar no canvas), contribuição ("este bloco vale 4,2% do objetivo e 2,5% da meta"), data, estado, **Iniciar 25 min** e **Concluir**. Na extensão de IA (em blocos de projeto): o que construir, critérios de aceite, **Copiar briefing**, **Pedir ajuda à IA** (mostra o que será enviado e espera o clique em Enviar), proposta recebida como texto com botão de copiar, checklist de revisão, campo opcional "o que a IA errou" e **Retomar na mão**.
- **Painel lateral de Resumo** (visão consolidada acessível no Mapa, também útil por teclado e em 380px): **ranking de prioridade** com os motivos, carga de hoje contra a capacidade, aviso de **sobrecarga**, total de horas restantes, lista hierárquica rápida de metas/objetivos para navegar ou selecionar nós sem arrastar e, no fim, o histórico de **conquistas** (objetivos concluídos, marcos, o que o Pedro quis lembrar) e as horas dedicadas acumuladas. (O gráfico semanal é condicional aqui.)

**Hoje** (execução focada). Funciona como uma lousa calma para executar sem a distração do mapa inteiro: lista curta dos blocos do dia. No topo, o **próximo melhor bloco** (pela prioridade) com o motivo em uma frase. Mostra "blocos feitos hoje: 2 de 4" (o processo, não o produto). Se a capacidade do dia não cobre tudo, mostra o aviso de **sobrecarga** com o que vai atrasar e as saídas (pausar, estender prazo, reduzir). Seção "De dias anteriores" com o botão **Replanejar**. Cada bloco tem **Iniciar 25 min** e mostra, em uma linha, quanto vale para o objetivo e para a meta principal. O timer ocupa a tela durante o foco (também acessível ao clicar em **Iniciar 25 min** no painel do Mapa); ao fim, abre o fim de bloco: pergunta "Concluir este bloco?" e pede o resumo de uma frase sem consultar o material (pode pular). A conclusão dispara o feedback do bloco. Em seguida vem a pausa de 5 minutos com a mensagem "Levante, olhe para longe, não abra outro app" (modo difuso do livro).

**Ajustes.** Capacidade diária (blocos por dia), animações (normal, reduzida, desligada) e, na extensão, a configuração de IA (tipo de provedor, URL base só para `openai`, modelo, chave, "Lembrar neste navegador", **Testar conexão**, **Esquecer chave** e o aviso de onde a chave fica). Dados (condicional): exportar e importar JSON, sempre sem a chave.

**Celebração.** Cartão de resumo que aparece sobre o Mapa ou Hoje ao concluir um objetivo ou meta: partículas calmas por cerca de 2,5 s, o resumo (blocos, horas, dias, ritmo médio), o texto da recompensa escolhida, o campo opcional "o que quero lembrar" e um botão para dispensar.

**Amanhã** (condicional; planejar na noite anterior). Lista os blocos de amanhã; permite puxar blocos dos próximos dias, adiar e reordenar; o botão "Plano de amanhã pronto" grava a data em `planosConfirmados`.

**Revisão** (condicional). Cartões do dia: título do bloco, "tente lembrar antes de ver", botão para mostrar o resumo e depois lembrei ou precisei olhar.

---

## 8. Direção visual

Minimalista e calma. Quem usa quer menos distração, não mais.

- **Paleta:** névoa `#F4F6F8` (fundo), papel `#FFFFFF` (superfícies), tinta `#17212B` (texto), suave `#5B6773` (texto secundário), petróleo `#1D6E75` (ação e foco), âmbar `#B7791F` (atraso e avisos), verde-musgo `#5E8C6A` (pausa e concluído).
- **Tipografia:** uma família só, Atkinson Hyperlegible, pensada para legibilidade. Números do timer com `font-variant-numeric: tabular-nums`. Frases em caixa normal, sem rótulos em caixa-alta e sem emojis decorativos.
- **Elementos memoráveis:** o **Mapa em canvas** (calmo, legível, sem ruído visual) para planejar e enxergar o todo, e o **timer do bloco** (numerais grandes e anel fino de progresso) para executar. O resto fica quieto.
- **Canvas (Mapa):** mesma paleta e mesma tipografia. Fundo em pontos finos no tom suave; ligações de 1,5px na cor suave; nó de meta/objetivo maior, com borda petróleo, porcentagem em destaque e selo discreto de urgência; nó de bloco pequeno, sem sombra, com a cor do estado (pendente: papel com borda suave; feita: verde-musgo; com a IA: âmbar; atrasado: borda âmbar tracejada). O nó selecionado ganha um anel petróleo. Painéis laterais deslizam sem esconder o contexto no desktop e ocupam a tela com conforto em 380px.
- **Estrutura:** listas com divisores finos em vez de cartões idênticos em toda parte. Raio de borda pequeno e único (8px). Sem sombras decorativas e sem gradientes.
- **Textos da interface em português do Brasil**, verbos claros nos botões ("Iniciar 25 min", "Concluir bloco", "Organizar por dia", "Distribuir", "Replanejar"). Estados vazios dizem o que fazer: "Nenhum objetivo ainda. Crie o primeiro no Mapa."
- **Qualidade mínima:** alvos de toque de pelo menos 44px, foco de teclado visível, contraste adequado, `prefers-reduced-motion` respeitado, labels em todos os campos e equivalente por teclado/formulário para cada ação do canvas.
- **Feedback positivo:** calmo e na paleta do app, sem mascotes nem sons. Bloco: o check se desenha em cerca de 0,6 s. Marco: o anel de progresso preenche até o novo valor. Objetivo concluído: partículas em CSS (petróleo, verde-musgo e âmbar) sobem por cerca de 2,5 s sobre um cartão de resumo que o Pedro dispensa quando quiser. Com `prefers-reduced-motion` ou `animacoes` reduzida ou desligada, tudo vira um ícone estático com o mesmo texto.

---

## 9. Estrutura do repositório

```
bits-planning/
├─ .env.example                   # variáveis de ambiente públicas documentadas (sem segredos)
├─ .gitignore                     # ignora .env, .env.* (mantendo .env.example), node_modules e dist
├─ AGENTS.md                      # regras para qualquer agente de IA
├─ PLANNING.md
├─ README.md                      # Proposta primeiro; depois como rodar, prints, decisões
├─ .github/
│  ├─ ISSUE_TEMPLATE/ticket.md    # contrato de cada ticket (slice vertical)
│  ├─ pull_request_template.md
│  └─ workflows/ci.yml            # lint + testes + build em todo PR
├─ docs/
│  ├─ PROCESSO.md                 # fluxo no GitHub, trilhos da IA e da mão
│  ├─ BACKLOG_INICIAL.md          # tickets propostos (compare com o /to-tickets)
│  ├─ DIARIO_LOG.md               # registro contínuo para o Diário da IA
│  └─ agents/                     # gerado pelo /setup-matt-pocock-skills
├─ scripts/criar-labels.sh
└─ src/
   ├─ config/                     # configuração externa centralizada (Dica 55)
   │  └─ ambiente.js              # único ponto que lê e valida import.meta.env (+ ambiente.test.js)
   ├─ dominio/                    # funções puras + testes (*.test.js); zero React, React Flow, IO ou import.meta.env
   │  ├─ datas.js                 # única fonte da verdade para datas locais 'YYYY-MM-DD'
   │  ├─ distribuicao.js
   │  ├─ tarefas.js               # gerarTarefas, replanejar (também usado no Distribuir)
   │  ├─ progresso.js
   │  ├─ mapa.js                  # organizarPorDia, conectarBloco, desconectarBloco (agnóstico de lib)
   │  ├─ hierarquia.js            # progressoAgregado, contribuicaoDoBloco, podeSerFilho
   │  ├─ prioridade.js            # urgencia, pontuar, alocarBlocosDoDia
   │  ├─ conquistas.js            # marcosAtingidos, resumoDaConquista
   │  ├─ revisoes.js              # condicional (T11)
   │  └─ delegacao.js             # extensão: montarBriefing (e, no T22, montarUrlNovaIssue)
   ├─ ia/                         # extensão (T27, T28) — fronteira reversível de provedores
   │  ├─ provedores.js            # montarRequisicao, extrairTexto, classificarErro (puras)
   │  ├─ prompts.js               # prompt de sistema
   │  ├─ chave.js                 # fronteira única para guardar, ler e esquecer a chave
   │  └─ cliente.js               # único lugar com fetch para o provedor
   ├─ dados/                      # fronteira reversível de persistência
   │  ├─ armazenamento.js         # único acesso ao localStorage: carregar, salvar, migrar, exportar, importar
   │  └─ esquema.js               # validação do JSON importado
   ├─ integracoes/
   │  └─ github.js                # leitura pública da API (condicional, T23)
   ├─ estado/                     # ações de intenção (Tell, Don't Ask) em fluxo unidirecional
   │  ├─ reducer.js
   │  └─ AppContext.jsx
   ├─ componentes/                # NoObjetivo, NoBloco, adaptador do React Flow, PainelObjetivo, PainelBloco (compartilhado), PainelResumo, Timer, Celebracao, AnelDeProgresso, ...
   ├─ paginas/                    # Mapa (inicial), Hoje, Ajustes (condicionais: Amanha, Revisao)
   ├─ App.jsx                     # fronteira do roteador (HashRouter)
   └─ main.jsx
```

Os arquivos de `src/` nascem aos poucos, ticket a ticket, e não de uma vez. Nomes do domínio em português (Objetivo, Tarefa, Revisão), para refletir a linguagem do problema.

---

## 10. Marcos e tickets

A primeira versão deste plano dividia o trabalho por camada (primeiro o domínio inteiro, depois as telas). O workshop mostra o problema: muito código construído no escuro, sem feedback de ponta a ponta. Por isso o trabalho é dividido em **slices verticais** (tracer bullets). Como o **Mapa (canvas)** é o meio central da interface, o primeiro ticket útil (**T02**) já nasce no canvas (absorvendo o antigo T25), atravessando regra, dados e tela, e o resto cresce a partir dele.

A lista completa, com "o que construir", critérios de aceite, bloqueios e modo sugerido (AFK ou HITL), está em `docs/BACKLOG_INICIAL.md`. Os tickets finais viram issues do GitHub.

| Marco | Prazo | Núcleo | Condicionais | Esforço do núcleo |
|---|---|---|---|---|
| M1 Tracer bullet no Mapa | 25/11 | T01, T02 | — | 8 a 10 h (inclui grill, spec e tickets) |
| M2 Núcleo do plano, canvas e execução | 30/11 | T03, T04, T07, T06, T08, T26 | T05 | 11 a 14 h |
| M3 Hierarquia, prioridade e recompensas | 03/12 | T09, T30, T29, T31, T15 | T10 a T14 | 10 a 13 h |
| M4 Entrega | 05/12 | T16, T17, T18, T19 | T20 | 6 a 8 h |
| Extensão: IA no app | só se sobrar tempo | T21, T27, T28 (nesta ordem) | T22 a T24 | 9 a 10 h |

Entrega na Labs Learning em 06/12, sem funcionalidade nova nesse dia.

**Folga.** O núcleo (M1 a M4) soma de 35 a 45 horas contra cerca de 35 a 40 disponíveis entre 23/11 e 06/12 (4 a 5 h nos dias livres e cerca de 1h30 nos dias de trabalho). **Está no limite — o canvas coube no núcleo porque absorveu as telas separadas de Panorama e Objetivos, e a extensão de IA só entra se sobrar tempo.** Três regras:

1. **Checkpoint em 30/11**, no fim do M2. Some as horas gastas. Até 20 h: siga o plano normal no M3. Entre 20 e 24 h: mantenha o núcleo enxuto (sem condicionais nem extensão de IA). Acima de 24 h: corte antes de começar o M3, na ordem da seção 12.
2. **Tickets AFK em paralelo** com a IA enquanto você faz um ticket HITL na mão recuperam tempo.
3. **Escopo congelado.** A partir daqui, ideias novas vão para o roadmap do README, não para o backlog.

**Prioridade no M3**, da mais para a menos importante: T09, T30, T29, T31, T15. A prioridade (T30) é o centro da decisão de tempo e vem logo depois do fim de bloco (T09). **Na extensão de IA**, o T21 já entrega a delegação manual (copiar o briefing para qualquer IA e registrar a revisão) mesmo sem a API (T27, T28).

**Primeiros passos (hoje):**

1. Criar o repositório `bits-planning` e copiar este kit para a raiz (T01).
2. Seguir a configuração única de `docs/PROCESSO.md` (seção 2).
3. Rodar `/grill-me` sobre este PLANNING.md, depois `/to-spec` e `/to-tickets` (Anexo B).
4. Comparar os tickets gerados com `docs/BACKLOG_INICIAL.md` e decidir.
5. Começar o T02 (o tracer bullet no Mapa), na mão ou em par com a IA.

---

## 11. Armadilhas conhecidas (peça ao agente para evitá-las)

1. **Data local com `toISOString()`.** Ele devolve a data em UTC. Em Brasília (UTC−3), depois das 21h o resultado já é o dia seguinte, e planejar "amanhã" à noite é exatamente o caso de uso do app. Usar `formatarDataLocal` com `getFullYear/getMonth/getDate`.
2. **Timer com contagem em `setInterval`.** O navegador atrasa abas em segundo plano. Guardar `inicioMs` e calcular `restante = duracao - (Date.now() - inicioMs)` a cada tick.
3. **Efeitos duplicados no `StrictMode`** em desenvolvimento: todo `useEffect` com intervalo precisa de limpeza.
4. **`localStorage` pode falhar** (cota, JSON corrompido, modo privado). Envolver em `try/catch` e cair para dados vazios sem quebrar a tela.
5. **Mutação de estado no reducer.** Sempre devolver novos objetos e arrays.
6. **Deploy e origem:** no GitHub Pages sem `base` correto os arquivos não carregam, e `BrowserRouter` quebra ao recarregar uma rota (use `HashRouter`). Além disso, todos os projetos de `usuario.github.io` compartilham a mesma origem e o mesmo `localStorage`: quem guarda chave de IA no navegador deve publicar na Vercel (origem própria) ou não usar "Lembrar neste navegador".
7. **IDs:** `crypto.randomUUID()` exige contexto seguro (localhost e HTTPS funcionam).
8. **React Flow:** importar `@xyflow/react/dist/style.css`; o contêiner do canvas precisa de altura definida; `nodeTypes` e `edgeTypes` devem ser objetos estáveis (fora do componente ou memoizados), senão o canvas re-renderiza sem parar; salvar posições só ao soltar o nó (`onNodeDragStop`), não a cada movimento.
9. **Fonte da verdade do canvas:** nós e ligações são derivados dos dados. Nunca guarde as ligações como um estado separado; só as posições.
10. **React Flow nos testes (`jsdom`):** o `jsdom` não implementa `ResizeObserver` nem mede layout de viewport. Configure um polyfill simples de `ResizeObserver` no setup de testes e teste os fluxos pelo comportamento visível (nós renderizados, abertura do painel, atualização de progresso) sem depender de coordenadas de pixel do DOM.
11. **APIs de IA no navegador:** CORS bloqueia chamadas diretas em alguns provedores e aparece como "falha de rede" genérica. A Anthropic exige o cabeçalho `anthropic-dangerous-direct-browser-access: true` (e `anthropic-version`) para chamadas feitas do navegador; servidores locais podem exigir configurar a origem permitida. O app deve explicar a falha em vez de só mostrar "erro".
12. **A chave de IA** nunca vai para `console.log`, exportação, briefing, URL, commit ou mensagem de erro. Use `type="password"` no campo e limpe a chave ao trocar de provedor.
13. **Resposta da IA é texto não confiável:** exibir como texto, nunca com `dangerouslySetInnerHTML`, e nunca executar nada que venha dela.
14. **URL de issue pré-preenchida (T22):** codificar cada parâmetro com `encodeURIComponent`. O GitHub limita o tamanho da URL: use um corte conservador de cerca de 7.500 caracteres e, acima disso, ofereça copiar o briefing. Os rótulos da URL só são aplicados a quem tem permissão no repositório (o dono tem).
15. **API pública do GitHub (T23):** sem token o limite é de cerca de 60 requisições por hora; pode haver erro de rede, e repositório privado devolve 404. Sempre manter o caminho manual (colar o link do PR).
16. **Hierarquia:** impedir ciclos antes de salvar (`podeSerFilho`) e recalcular o agregado a partir dos dados; nunca guardar o percentual de uma meta.
17. **Animações:** disparar só em transições (o percentual cruza um marco), nunca ao carregar a página; guardar em `conquistas` o que já foi celebrado, senão o app comemora de novo toda vez que abre. Limpar timers e animações ao sair da tela.
18. **Prioridade:** arredondar com `Math.ceil` só na alocação, mostrar o ritmo com uma casa decimal e tratar a divisão por zero quando não restam dias ativos (prazo vencido).
19. **Vazar biblioteca para o domínio ou estado:** nunca importe `@xyflow/react` em `src/dominio/` nem salve objetos `nodes`/`edges` do React Flow no JSON. A conversão de dados do domínio para o formato do React Flow fica isolada na camada visual do Mapa, preservando ortogonalidade e reversibilidade.
20. **DRY errado e desacoplamento burocrático:** extrair abstrações prematuras só porque dois componentes JSX se parecem — ou criar EventBus, containers de DI e camadas que só repassam chamadas — complica o projeto e piora o ETC. Aplique DRY a regras, fórmulas e dados derivados; desacoplamento vem de funções puras com parâmetros explícitos, fronteiras finas de IO e ações claras no reducer.
21. **Segredos em `.env` do Vite (`VITE_*`) e `import.meta.env` espalhado:** qualquer variável `VITE_*` entra em texto claro no bundle enviado ao navegador — nunca coloque chaves de API de IA ou tokens em `.env`. Centralize toda leitura e validação em `src/config/ambiente.js` (e `loadEnv` só no `vite.config.js` para `VITE_APP_BASE`), mantendo `.env*` fora do Git.

---

## 12. Se o prazo apertar: ordem de corte

Corte nesta ordem, sem culpa: 1) a extensão de IA inteira (T28, T27, T21 e os condicionais T22 a T24); 2) os condicionais T20, T13, T11, T14, T10, T12 e T05; 3) o T15 encolhe para uma única melhoria; 4) dentro do T31, ficam só o gesto do bloco e a celebração do objetivo (os marcos saem); 5) dentro do T29, a meta principal (`paiId`) sai e ficam só horas restantes, ritmo e contribuição em cada objetivo/bloco no Mapa; 6) no limite extremo, o T26 encolhe (criar e ligar blocos fica só pelos botões e formulários do painel, sem arrastar linhas novas no canvas). **Nunca cortar:** T01 a T04, T06 a T09, T30 (a prioridade), T16, T18 e T19 — como o canvas já nasce no T02, o Mapa continua sendo o centro do produto mesmo nos cortes. O que sair vira roadmap no README.

---

## 13. Perguntas de entendimento (o Pedro deve saber responder sem a IA)

1. Como `distribuirBlocos` reparte o resto da divisão e por quê?
2. Por que o timer usa timestamp em vez de contar a cada segundo?
3. O que o `replanejar` altera e o que ele preserva?
4. Por que as datas são strings locais e não objetos `Date` salvos?
5. Por que os componentes não acessam o `localStorage` diretamente? O que muda na v2?
6. Como cada hábito do livro virou uma funcionalidade (chunking, planejar na noite anterior, recordação ativa, revisão espaçada, hora de parar)?
7. Por que os tickets são slices verticais e não "primeiro o banco, depois a tela"?
8. O que é a zona inteligente do contexto e por que se usa `/clear` entre tickets?
9. Qual a diferença entre AFK e HITL, e por que escolhi cada trilho em cada ticket?
10. O que um teste preso a detalhes internos faria no refactor, e como o meu teste evita isso?
11. O que o `/improve-codebase-architecture` encontrou e o que eu mudei?
12. Onde a IA errou neste projeto e como eu percebi?
13. Por que os nós e as ligações do canvas são derivados dos dados e só as posições são salvas à parte, e por que todo gesto tem equivalente por formulário?
14. Como o progresso de uma meta é calculado a partir dos objetivos filhos, e por que o percentual não é guardado?
15. Como a pontuação de prioridade combina importância e urgência, e por que o app só sugere e não impõe?
16. O que o app faz quando a capacidade do dia não cobre todos os objetivos?
17. Por que as animações só disparam em transições e como respeitam `prefers-reduced-motion`?
18. Por que recompensar o processo (horas dedicadas) e não manter uma sequência de dias seguidos?
19. Como o isolamento do `@xyflow/react`, do `localStorage` e do relógio (parâmetros puros) garante ortogonalidade, reversibilidade e desacoplamento sem criar camadas burocráticas?
20. Qual é a diferença entre aplicar DRY a uma regra/dado derivado e criar uma abstração prematura que piora o ETC?
21. Por que as configurações de ambiente ficam centralizadas e validadas em `src/config/ambiente.js`, e por que a chave de IA **nunca** deve ir para uma variável `VITE_*` em `.env`?

Se a extensão de IA existir:

22. Por que o app mostra o texto completo e espera o clique antes de enviar algo à IA?
23. Onde fica a chave de IA, por que ela não vai no JSON principal e qual o risco de publicar o app no GitHub Pages?
24. Por que a resposta da IA é exibida como texto e nunca como HTML?
25. Por que um bloco com proposta da IA não conta no progresso antes da revisão, e por que objetivos de estudo não têm esse botão?

---

## Anexo A — Rascunho da seção Proposta (cole no README e reescreva com suas palavras)

```markdown
# Proposta

**Qual é o problema?** Tenho objetivos grandes (livros, projetos, candidaturas), mas as tarefas do dia ficam soltas, sem ligação com o objetivo e sem eu ver o progresso. Sem saber por onde começar nem o que merece o meu tempo primeiro, é fácil procrastinar e gastar horas no que importa menos.

**Para quem é?** Para mim, estudante de tecnologia que concilia faculdade, trabalho e estudos por conta própria, e para quem tem o mesmo problema.

**Solução em uma frase.** Um mapa visual em canvas onde eu conecto meus objetivos e blocos de 25 minutos, vejo quanto cada bloco contribui para o todo e qual é o melhor próximo uso do meu tempo, e recebo recompensas quando avanço.

**O que a primeira versão faz?**
1. Mapa em canvas (interface central): mostra minhas metas, objetivos e blocos de 25 minutos conectados por linhas, com progresso agregado, horas restantes, ritmo necessário e quanto cada bloco vale — permitindo criar, arrastar, ligar, organizar por dia e distribuir blocos (tudo com equivalente acessível por painel).
2. Plano automático: cada objetivo (com intervalo de unidades opcional, prazo e dias ativos) é dividido em blocos de 25 minutos distribuídos até o prazo, com replanejamento dos atrasos.
3. Tela "Hoje" enxuta: lista calma dos blocos do dia, timer 25/5, recordação ativa de uma frase ao concluir e pausa de descanso.
4. Prioridade: eu dou a importância, o app calcula a urgência (prazo contra a minha capacidade diária), mostra o ranking no painel do Mapa, sugere o próximo melhor bloco no Hoje e avisa quando o tempo não cabe em tudo.
5. Recompensas: animações curtas, marcos, histórico de conquistas e uma recompensa escolhida por mim ao concluir blocos e objetivos.

**Como vou usar a IA?** Para planejar (interrogatório com `/grill-me`, spec e tickets com `/to-spec` e `/to-tickets`), gerar código um ticket por vez com TDD, pedir explicação do que eu não entender e testar com exemplos de resposta conhecida (24 capítulos em 12 dias dá 2 por dia). Cada ticket é uma issue do GitHub que a IA ou eu implementamos, sempre por pull request com CI; os tickets centrais eu faço na mão. Também vou anotar os erros da IA para o Diário.

**Depois da primeira versão (se sobrar tempo ou na v2):** pedir ajuda a uma IA da minha escolha, por API ou briefing, em blocos de código, sempre com revisão minha. Também sincronização entre aparelhos, login e notificações.
```

---

## Anexo B — Prompts

Os comandos com `/` vêm das skills do Matt Pocock. Se a sua ferramenta não tiver comandos `/`, peça em linguagem natural ("use a skill grill-me"). Para a IA na nuvem (Jules ou Copilot) não existe prompt: a issue é o prompt.

**Uma vez só, no agente:**

```
/setup-matt-pocock-skills
```

Escolha **GitHub** como issue tracker.

**1. Interrogatório do plano** (`/grill-me`):

```
/grill-me Quero revisar o PLANNING.md do app Bits Planning antes de virar spec. Me interrogue uma pergunta por vez, começando pelos pontos mais arriscados: o escopo da v1 com o Mapa em canvas no centro, a regra de distribuição de blocos e o tracer bullet no canvas. Dê sua recomendação em cada pergunta; eu vou discordar quando fizer sentido.
```

**2. Spec** (na mesma sessão): `/to-spec`

**3. Tickets:**

```
/to-tickets Quebre o spec em slices verticais (tracer bullets) usando o template de .github/ISSUE_TEMPLATE/ticket.md. Marque AFK ou HITL em cada um. Antes de publicar, compare com docs/BACKLOG_INICIAL.md, mostre as diferenças e me deixe aprovar a quebra numerada.
```

**4. Trilho da IA, um ticket por sessão:**

```
/clear
/tdd implemente a issue #N (leia com gh issue view N). Siga o AGENTS.md. Antes de implementar, proponha o plano e os pontos de teste e espere meu OK. No final, liste só os arquivos alterados e escreva 3 perguntas para eu responder.
```

**5. Trilho da mão** (a IA como tutora, sem escrever a solução):

```
Estou implementando a issue #N na mão. Não escreva a solução. Revise meu diff, aponte bugs e testes que faltam e me faça 3 perguntas para eu responder sem consultar nada.
```

**6. Revisão crítica do que a IA gerou:**

```
Revise o código que você acabou de gerar: liste as suposições que fez, o que pode estar errado e como eu testo cada ponto com um exemplo cuja resposta eu já conheça.
```

**7. Ao fim do ciclo (T15):**

```
/improve-codebase-architecture
```

Peça para mostrar as oportunidades antes de mudar qualquer coisa e escolha no máximo 3.

---

## Anexo C — Diário da IA

O modelo do registro contínuo está pronto em `docs/DIARIO_LOG.md`. Cada PR traz a seção "Onde a IA errou", e o rótulo `erro-da-ia` marca os PRs e issues para você reunir os erros na hora de escrever o Diário final (PDF de 1 página, com as suas palavras).
