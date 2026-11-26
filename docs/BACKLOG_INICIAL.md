# Backlog inicial — Bits Planning

Proposta de tickets feita pela IA, escrita como **slices verticais** (cada um atravessa regra, dados e tela e pode ser verificado sozinho). Use assim:

1. Rode `/grill-me` e `/to-spec` e depois `/to-tickets`.
2. Compare o que a skill gerou com esta lista. Onde divergirem, **você decide**: aceite, ajuste ou descarte.
3. Os tickets finais ficam como issues do GitHub, com o template `.github/ISSUE_TEMPLATE/ticket.md`.

O **modo** é só uma sugestão: **HITL** = você faz na mão (ou em par com a IA); **AFK** = pode ir para a IA. Troque à vontade. Detalhes dos trilhos em `docs/PROCESSO.md`.

O **Mapa (canvas)** é o meio central da interface desde o tracer bullet (**T02**, que absorveu o antigo T25) e substitui as antigas páginas separadas de Panorama e Objetivos. Os tickets **T26** (conectar e criar no canvas) e **T29 a T31** (hierarquia no Mapa, prioridade e recompensas) fazem parte do núcleo. Os marcados *condicional* só entram se sobrar tempo, e a **Extensão** (IA no app: T21, T27, T28) só entra se o núcleo terminar cedo.

| Marco | Prazo | Núcleo | Condicionais | Esforço do núcleo |
|---|---|---|---|---|
| M1 Tracer bullet no Mapa | 25/11 | T01, T02 | — | 8 a 10 h (inclui grill, spec e tickets) |
| M2 Núcleo do plano, canvas e execução | 30/11 | T03, T04, T07, T06, T08, T26 | T05 | 11 a 14 h |
| M3 Hierarquia, prioridade e recompensas | 03/12 | T09, T30, T29, T31, T15 | T10 a T14 | 10 a 13 h |
| M4 Entrega | 05/12 | T16, T17, T18, T19 | T20 | 6 a 8 h |
| Extensão: IA no app | só se sobrar tempo | T21, T27, T28 (nesta ordem) | T22 a T24 | 9 a 10 h |

O núcleo soma de 35 a 45 h contra cerca de 35 a 40 disponíveis: **no limite, e a extensão de IA não cabe sem sobrar tempo.** Faça o checkpoint de 30/11 (`PLANNING.md`, seção 10), congele o escopo e use a ordem de corte do fim deste arquivo.

Entrega na Labs Learning: 06/12 (sem funcionalidade nova neste dia).

---

## M1 — Tracer bullet no Mapa

### T01 — Fundação verificável (HITL)
**Bloqueado por:** nada.
**O que construir:** repositório público com Vite + React, Tailwind, React Router (`HashRouter`), `@xyflow/react`, Vitest (com setup `jsdom` + polyfill simples de `ResizeObserver`), ESLint e o CI do GitHub Actions; `.gitignore`, `.env.example`, `vite.config.js` lendo `VITE_APP_BASE`, e o módulo central `src/config/ambiente.js` (leitura e validação de `import.meta.env` com `carregarAmbiente(env)` testável); `AGENTS.md`, `PLANNING.md`, `docs/`, templates de issue e PR, rótulos e README com a seção Proposta.
**Critérios de aceite:**
- [ ] `npm run dev`, `npm test`, `npm run lint` e `npm run build` rodam localmente
- [ ] `@xyflow/react` instalado com `@xyflow/react/dist/style.css` pronto para uso
- [ ] `.env` e `.env.*` ignorados no `.gitignore`, mantendo `.env.example` versionado sem segredos
- [ ] `src/config/ambiente.js` centraliza e valida todas as variáveis `VITE_*` com padrões seguros e gera mensagem de erro clara para valores inválidos (coberto por `src/config/ambiente.test.js`)
- [ ] O CI fica verde no primeiro PR
- [ ] O README começa com `# Proposta` (Anexo A do `PLANNING.md`)
- [ ] Rótulos e marcos criados; squash merge desligado

### T02 — Tracer bullet: do objetivo ao bloco concluído no Mapa (HITL)
**Bloqueado por:** T01.
**O que construir:** o caminho mais fino de ponta a ponta já com o **Mapa (canvas)** como tela inicial (absorve o antigo T25). Criar um objetivo pelo botão do Mapa (título, total de blocos, prazo) usando distribuição uniforme simples (todos os dias valem). O canvas (`@xyflow/react`, pan, zoom, arrastar) mostra o objetivo como nó grande (título, porcentagem, prazo) e cada bloco como nó pequeno ligado ao objetivo por uma linha, posicionados por `organizarPorDia`. Arrastar nós salva as posições; o botão **Organizar por dia** rearruma o mapa. Clicar em um bloco abre o painel lateral mínimo do bloco para marcá-lo como feito — atualizando a cor do nó e a porcentagem no objetivo. Ao recarregar, dados e posições continuam.
**Critérios de aceite:**
- [ ] 1 objetivo com 24 blocos em 12 dias mostra 25 nós (1 objetivo + 24 blocos) e 24 linhas no Mapa, com 2 blocos na coluna de hoje
- [ ] `organizarPorDia` (função pura): objetivo A em `(0, 0)`; dois blocos de 24/11 em `(320, 0)` e `(320, 90)`; um bloco de 25/11 em `(540, 0)`; objetivo B seguinte em `(0, 240)`
- [ ] Marcar 1 bloco de 24 como feito pelo painel lateral atualiza a cor do nó e mostra 4% no nó do objetivo
- [ ] Arrastar um nó e recarregar a página mantém os dados e a nova posição
- [ ] Nós e ligações derivam dos dados (só `mapa.posicoes` é salvo à parte — DRY e reversibilidade)
- [ ] `src/dominio/` não importa React, `@xyflow/react` nem `localStorage`, e recebe datas por parâmetro (ortogonalidade e desacoplamento); a conversão para `nodes`/`edges` do React Flow fica isolada na camada visual do Mapa
- [ ] Teste automatizado do fluxo "criar objetivo → concluir bloco no Mapa" e das funções puras de domínio (`distribuicao`, `progresso`, `mapa`)
- [ ] CI verde

*Este slice define os padrões do canvas, do domínio puro e das fronteiras reversíveis que os agentes vão copiar. Revise com cuidado.*

---

## M2 — Núcleo do plano, canvas e execução

### T03 — Dias ativos e divisão do resto (HITL, na mão)
**Bloqueado por:** T02.
**O que construir:** escolher os dias da semana ativos no formulário de objetivo (no painel do Mapa); o plano só usa essas datas; o resto da divisão vai para os primeiros dias.
**Critérios de aceite:**
- [ ] 25 blocos em 12 dias: 3 no primeiro dia e 2 nos outros 11
- [ ] 18 blocos em 8 dias: `[3,3,2,2,2,2,2,2]`
- [ ] 10 blocos, 23/11 a 27/11/2026, segunda a sexta: 2 por dia
- [ ] 10 blocos, 23/11 a 06/12/2026, só terça e quinta: `[3,3,2,2]` em 24/11, 26/11, 01/12 e 03/12
- [ ] Prazo anterior ao início e nenhum dia disponível mostram erro claro no formulário

### T04 — Intervalo de unidades e blocos por unidade (AFK)
**Bloqueado por:** T02.
**O que construir:** cadastrar "capítulo 4 a 27" (o intervalo é opcional) e quantos blocos cada unidade pede no formulário de objetivo; as tarefas ganham título automático e aparecem no Mapa.
**Critérios de aceite:**
- [ ] Capítulos 4 a 27 com 1 bloco por unidade geram 24 tarefas, de "Capítulo 4" a "Capítulo 27"
- [ ] Com 2 blocos por unidade geram 48 tarefas ("Capítulo 4 (parte 1/2)")
- [ ] Última unidade menor que a primeira mostra erro de validação
- [ ] Sem intervalo, o objetivo nasce sem blocos (para criação e conexão livre no Mapa, T26)

### T07 — Tela Hoje e Timer 25/5 (AFK)
**Bloqueado por:** T02.
**O que construir:** navegação enxuta entre **Mapa** (inicial), **Hoje** e **Ajustes**. A tela **Hoje** lista de forma calma apenas os blocos planejados para hoje (com contador "blocos feitos hoje: X de Y"), funciona bem em 380px e permite iniciar o timer de 25 minutos calculado por timestamp. O mesmo botão **Iniciar 25 min** fica disponível no painel lateral do bloco no Mapa.
**Critérios de aceite:**
- [ ] Navegar entre Mapa, Hoje e Ajustes preserva o estado; recarregar em qualquer rota funciona (`HashRouter`)
- [ ] Iniciar um bloco (no Hoje ou pelo painel do Mapa) abre o timer de 25 min em tela cheia
- [ ] A contagem continua correta após recarregar a página e com a aba em segundo plano
- [ ] O título da aba mostra o tempo restante
- [ ] Só um timer ativo por vez
- [ ] Teste da função pura "(início, agora, duração) → restante"

### T06 — Replanejar atrasos e Distribuir no Mapa (HITL, na mão)
**Bloqueado por:** T03, T04, T07.
**O que construir:** função pura `replanejar` que redistribui blocos pendentes a partir de hoje. Na tela **Hoje**, blocos pendentes de dias anteriores aparecem em "De dias anteriores" com o botão **Replanejar** (e no Mapa ficam com borda âmbar tracejada). No **Mapa**, cada objetivo ganha o botão **Distribuir** (no nó/painel), que usa a mesma função para distribuir atrasados e blocos sem data.
**Critérios de aceite:**
- [ ] Blocos feitos não mudam; os pendentes mantêm a ordem
- [ ] 18 blocos em 8 dias ativos: `[3,3,2,2,2,2,2,2]`
- [ ] Blocos sem data entram no fim da fila; distribuir 6 blocos sem data em 3 dias ativos resulta em 2 por dia
- [ ] Nenhum bloco some nem se duplica
- [ ] Atraso não gera punição nem mensagem negativa

### T08 — Gerenciar objetivos no Mapa (AFK)
**Bloqueado por:** T02, T07.
**O que construir:** clicar em um nó de objetivo no Mapa abre o **painel lateral do objetivo** com edição (título, prazo, dias ativos), pausar, concluir e excluir com confirmação.
**Critérios de aceite:**
- [ ] Objetivo pausado aparece visualmente atenuado no Mapa e não gera blocos em Hoje
- [ ] Excluir pede confirmação e remove também as tarefas e suas posições no Mapa
- [ ] Objetivo com todos os blocos feitos vira "concluído"
- [ ] Todas as ações do painel funcionam por teclado e em 380px

### T26 — Conectar e criar blocos e objetivos no canvas (AFK, com revisão cuidadosa)
**Bloqueado por:** T02, T06.
**O que construir:** criar blocos soltos direto no Mapa (botão `+ Novo bloco` ou clicando no fundo, perto do ponto clicado); ligar um bloco a um objetivo arrastando uma linha (`conectarBloco`); desligar apagando a linha (`desconectarBloco`, voltando o bloco para "solto"). Todo gesto tem equivalente por formulário no painel lateral do bloco (lista para escolher ou remover o objetivo), para teclado e celular.
**Critérios de aceite:**
- [ ] Ligar um bloco solto a um objetivo define `objetivoId` e muda a porcentagem do objetivo (4 blocos, 2 feitos, mais 1 pendente ligado: de 50% para 40%)
- [ ] Desligar devolve o bloco para "solto" (sem objetivo e sem data); bloco `feita` não pode ser desligado (recusado com erro)
- [ ] Ligar a um novo objetivo substitui a ligação anterior
- [ ] Bloco novo aparece perto do ponto onde se clicou; blocos soltos vão para faixa própria em `organizarPorDia`
- [ ] Todos os gestos têm equivalente por formulário no painel do bloco

### T05 — Prévia do plano e aviso de carga (AFK) — *condicional*
**Bloqueado por:** T03, T04.
**O que construir:** antes de salvar no painel de novo objetivo, o formulário mostra blocos por dia e minutos; se algum dia passar do limite diário (padrão 6), avisa que o prazo está apertado.
**Critérios de aceite:**
- [ ] A prévia muda ao editar prazo, dias ativos e quantidades
- [ ] Aviso "prazo apertado: este plano pede N blocos por dia" quando passa do limite
- [ ] O usuário ainda pode salvar assim mesmo

---

## M3 — Hierarquia, prioridade e recompensas

### T09 — Fim de bloco: recordação ativa e pausa (AFK)
**Bloqueado por:** T07.
**O que construir:** ao fim do foco, concluir o bloco, pedir um resumo de uma frase sem consultar o material (pode pular) e iniciar a pausa de 5 minutos com a mensagem de descanso.
**Critérios de aceite:**
- [ ] O resumo fica salvo na tarefa
- [ ] Pular o resumo funciona
- [ ] A pausa mostra "Levante, olhe para longe, não abra outro app"
- [ ] Sem notificações

### T30 — Prioridade: importância, urgência e orçamento de tempo (HITL, na mão)
**Bloqueado por:** T06, T08.
**O que construir:** cada objetivo ganha **importância** (1 a 5), e Ajustes ganha o controle de capacidade diária (`limiteDiarioBlocos`, padrão 6). O app calcula a **urgência** pelo ritmo necessário contra a capacidade diária e ordena os objetivos por prioridade, com o motivo de cada posição. No **Mapa**, cada nó de objetivo mostra seu selo de urgência e o painel lateral **Resumo** mostra o ranking explicado e a carga de hoje contra a capacidade. Na tela **Hoje**, destaca o **próximo melhor bloco** e distribui a capacidade do dia entre os objetivos; quando não cabe tudo, avisa o que vai atrasar e sugere pausar, estender o prazo ou reduzir o escopo. É o centro da gestão do tempo.
**Critérios de aceite:**
- [ ] `urgencia`: 12 blocos em 6 dias com capacidade 6 = média; 9 em 3 = alta; 30 em 3 = crítica; 2 em 20 = baixa; prazo vencido com blocos pendentes = crítica
- [ ] Pontuação = importância × 10 + 0, 10, 20 ou 30 (baixa, média, alta, crítica): A (importância 5, média) = 60 e B (importância 2, alta) = 40; A vem antes
- [ ] Capacidade 6, A precisa de 2 e B de 3: plano A 3 e B 3 (a sobra vai para o de maior prioridade)
- [ ] Capacidade 4, A precisa de 3 e B de 3: A 3 e B 1; B aparece como adiado com 2 blocos faltando e o aviso de sobrecarga liga
- [ ] Objetivo que não tem hoje como dia ativo recebe 0 e não conta como adiado
- [ ] Cada posição do ranking mostra o motivo em uma frase ("importância 5, precisa de 2 blocos por dia")
- [ ] Tudo é sugestão: o usuário pode escolher outro bloco sem ser impedido

### T29 — Hierarquia e visão global no Mapa (funções puras na mão; tela AFK)
**Bloqueado por:** T04, T08, T26.
**O que construir:** objetivos podem ter uma **meta principal** (`paiId`), ligada visualmente por linha no **Mapa** (arrastando de um objetivo até uma meta ou escolhendo na lista do painel do objetivo, sem ciclos). Nós de meta e objetivo no Mapa exibem progresso agregado, blocos e horas restantes e ritmo necessário; `organizarPorDia` coloca metas pais à esquerda dos filhos (`x = -320`). O painel lateral **Resumo** do Mapa mostra o total de horas restantes e uma lista hierárquica rápida (navegável por teclado e confortável em 380px). Cada bloco (no painel do Mapa e na lista do Hoje) mostra quanto vale para o objetivo e para a meta principal ("este bloco vale 4,2% do objetivo e 2,5% da meta").
**Critérios de aceite:**
- [ ] Meta "Carreira" com A (24 blocos, 6 feitos) e B (16 blocos, 10 feitos) mostra 40% (16 de 40)
- [ ] Um bloco de A vale 4,2% de A e 2,5% de Carreira (`contribuicaoDoBloco`)
- [ ] Um objetivo não pode ser filho de si mesmo nem de um descendente (`podeSerFilho`), tanto arrastando linha quanto pelo formulário
- [ ] Cada objetivo mostra blocos restantes, horas restantes (blocos × 25 min) e ritmo necessário em blocos por dia (10 blocos = 4,2 h; 12 blocos em 6 dias = 2 por dia)
- [ ] Pausar ou excluir um objetivo atualiza o agregado dos pais; o percentual nunca é guardado
- [ ] `organizarPorDia` posiciona a meta Carreira em `(-320, 0)`, A em `(0, 0)` e B em `(0, 240)`
- [ ] Lista hierárquica no painel Resumo funciona em 380px e por teclado

### T31 — Recompensas: feedback positivo ao concluir (AFK, com revisão)
**Bloqueado por:** T09, T29.
**O que construir:** três níveis de feedback, sempre depois de esforço real. Ao concluir um bloco (no Hoje ou no Mapa), um gesto curto (marca de check animada e "bloco 3 de 4 hoje"). Ao cruzar 25%, 50% e 75% de um objetivo ou meta, um aviso de marco com o anel de progresso animando. Ao concluir um objetivo ou meta, uma celebração maior (partículas em CSS na paleta do app) com o resumo (blocos, horas, dias e ritmo médio), o texto da **recompensa** que o Pedro escolheu para aquele objetivo e um campo opcional "o que quero lembrar desta conquista". As conquistas ficam num histórico no painel **Resumo** do Mapa, junto das horas dedicadas acumuladas.
**Critérios de aceite:**
- [ ] `marcosAtingidos(antes, depois)`: 20 → 30 = [25]; 45 → 80 = [50, 75]; 95 → 100 = [100]; 30 → 30 = []
- [ ] `resumoDaConquista`: 24 blocos feitos em 12 datas diferentes = `{ blocos: 24, horas: 10, dias: 12, ritmoMedio: 2 }`
- [ ] Concluir o último bloco de um objetivo que fecha uma meta celebra os dois
- [ ] Reabrir o app sem mudar o progresso não repete nenhuma celebração
- [ ] As animações respeitam `prefers-reduced-motion` e a opção dos Ajustes (normal, reduzida, desligada); sem som
- [ ] Duram até 1,2 s no bloco e 2,5 s no objetivo, não bloqueiam a tela e podem ser dispensadas
- [ ] Sem sequência que zera (streak): o app mostra horas dedicadas, não dias seguidos
- [ ] Na extensão de IA, um bloco delegado só gera feedback depois da revisão concluída

*Os marcos (25, 50, 75%) são a primeira coisa a sair deste ticket se o tempo apertar.*

### T15 — Rodada de arquitetura (HITL; pode encolher a uma melhoria)
**Bloqueado por:** o que estiver pronto entre T03 e T14, T26 e T29 a T31 (e a extensão de IA, se existir).
**O que construir:** rodar `/improve-codebase-architecture`, avaliar violações reais de **ETC**, **DRY** (regras/constantes duplicadas), **ortogonalidade**, **reversibilidade**, **desacoplamento** e módulos rasos que só repassam chamadas; escolher de 1 a 3 melhorias que simplifiquem o código e aplicá-las com a suíte verde.
**Critérios de aceite:**
- [ ] A lista de oportunidades fica registrada no PR
- [ ] Você explica por que escolheu cada melhoria e por que descartou as outras
- [ ] Testes e CI verdes antes e depois

### T10 — Planejar amanhã (AFK) — *condicional*
**Bloqueado por:** T03, T07.
**O que construir:** tela Amanhã para puxar ou adiar blocos e confirmar o plano da noite anterior.
**Critérios de aceite:**
- [ ] Teste simulando 22h30 de Brasília: "amanhã" é o dia certo
- [ ] "Plano de amanhã pronto" grava a data confirmada
- [ ] Mover um bloco não altera blocos já feitos

### T11 — Revisões espaçadas (AFK) — *condicional*
**Bloqueado por:** T09.
**O que construir:** blocos com resumo ganham revisões em D+1, D+3 e D+7; tela Revisão com "tente lembrar antes de ver".
**Critérios de aceite:**
- [ ] Bloco concluído em 01/12 agenda revisões em 02/12, 04/12 e 08/12
- [ ] "Precisei olhar" agenda mais uma revisão no dia seguinte
- [ ] Só aparecem revisões com data até hoje

### T12 — Fim do dia (AFK) — *condicional*
**Bloqueado por:** T07.
**O que construir:** ao concluir os blocos do dia ou atingir o limite diário, a tela Hoje diz que acabou.
**Critérios de aceite:**
- [ ] Mensagem "Por hoje é isso. Descanse."
- [ ] Iniciar outro bloco exige ação explícita

### T13 — Gráfico semanal (AFK) — *condicional*
**Bloqueado por:** T08.
**O que construir:** gráfico em SVG no painel Resumo do Mapa com os blocos concluídos nos últimos 7 dias.
**Critérios de aceite:**
- [ ] Legível em 380px
- [ ] Sem biblioteca de gráficos
- [ ] Dia sem blocos aparece como zero

### T14 — Exportar e importar JSON (AFK) — *condicional*
**Bloqueado por:** T02, T07.
**O que construir:** em Ajustes, baixar os dados em JSON e restaurá-los, com validação.
**Critérios de aceite:**
- [ ] O arquivo exportado leva a `versao`
- [ ] **A chave de IA nunca entra no arquivo exportado**
- [ ] Importar pede confirmação antes de sobrescrever
- [ ] JSON inválido ou de versão desconhecida mostra erro e não quebra o app
- [ ] Testes da validação do esquema

---

## Extensão — IA no app (só se sobrar tempo)

Ordem sugerida: T21, T27, T28. O T21 já entrega a delegação manual (copiar o briefing para qualquer IA e registrar a revisão) mesmo sem a API.

### T21 — Delegar um bloco e revisar antes de concluir (HITL, na mão)
**Bloqueado por:** T04, T08.
**O que construir:** objetivos ganham o tipo **estudo** (sempre na mão) ou **projeto**. Em blocos de projeto, o painel do bloco (no Mapa e no Hoje) oferece **Na mão** (o timer normal) ou **Delegar**: o app monta o briefing (título, o que construir, critérios de aceite) para **copiar para qualquer IA**, e o bloco passa para "Com a IA" (cor âmbar no Mapa). Concluir um bloco delegado exige o checklist de revisão (4 itens). **Retomar na mão** devolve o bloco para pendente a qualquer momento. Este ticket é a base dos canais de IA (T27, T28 e T22).
**Critérios de aceite:**
- [ ] Objetivo de estudo não mostra "Delegar"
- [ ] O briefing de um bloco com título, descrição e 2 critérios contém os três (teste da função pura `montarBriefing`)
- [ ] Bloco delegado não conta no progresso: 24 blocos, 1 feito e 1 delegado mostram 4%, não 8%
- [ ] "Concluir" fica desabilitado até os 4 itens da revisão estarem marcados
- [ ] Ao concluir, registra quem fez (`feitaPor`): ia, misto ou mão; blocos feitos pelo timer registram mão
- [ ] Retomar na mão devolve o bloco para pendente sem perder o briefing

*Primeiro slice da extensão de IA: define os padrões. Faça na mão ou em par.*

### T27 — IA por API: configurar o provedor e testar a conexão (AFK; funções puras na mão)
**Bloqueado por:** T07. Pode rodar em paralelo com o M2/M3.
**O que construir:** em Ajustes → IA, escolher o tipo de provedor (compatível com OpenAI, Anthropic ou Gemini), a URL base (só para o compatível com OpenAI, com padrão vindo de `src/config/ambiente.js`), o modelo e a chave; botão **Testar conexão**; **Esquecer chave**. Endpoints públicos, versão da Anthropic e timeout vêm de `src/config/ambiente.js` (passados por parâmetro às funções puras), sem URLs/timeouts hardcoded. Entregue primeiro o tipo compatível com OpenAI e o Anthropic; o Gemini é o último.
**Critérios de aceite:**
- [ ] `montarRequisicao`, `extrairTexto` e `classificarErro` com os testes da seção 6 do `PLANNING.md`, sem rede
- [ ] A chave fica no `sessionStorage` por padrão; "Lembrar neste navegador" usa `localStorage` com aviso; a chave nunca entra no JSON principal, em exportações, briefings, logs ou URLs
- [ ] Erros viram mensagens claras: chave inválida (401 ou 403), modelo ou URL errados (404), limite (429), erro do provedor (5xx), falha de rede ou CORS e tempo esgotado
- [ ] Servidor local sem chave (URL de um servidor compatível com OpenAI) funciona com o campo da chave vazio
- [ ] Timeout de 60 s com cancelamento
- [ ] Aviso visível de que a chave fica só neste navegador

### T28 — Pedir proposta à IA configurada para um bloco (HITL, em par)
**Bloqueado por:** T21, T27.
**O que construir:** no painel do bloco (Mapa ou Hoje), **Pedir ajuda à IA**: mostra o que será enviado (provedor, modelo e o texto completo), pede confirmação, chama a API e mostra a resposta como texto com botão de copiar. A resposta fica salva no bloco como proposta; concluir exige a revisão do T21; descartar ou fazer na mão a qualquer momento.
**Critérios de aceite:**
- [ ] Nada é enviado sem o clique em "Enviar" depois de ver o texto completo
- [ ] Sem IA configurada, o botão leva aos Ajustes e "Copiar briefing" continua funcionando
- [ ] A resposta é mostrada como texto simples (nunca HTML) e fica salva com provedor, modelo e data
- [ ] Erro de rede, de chave ou de limite mostra a mensagem do T27 e não perde o briefing
- [ ] Objetivo de estudo não oferece "Pedir ajuda à IA"
- [ ] Teste com `fetch` falso: sucesso, 401 e rede caída

### T22 — Canal GitHub: criar a issue para um agente (AFK) — *condicional*
**Bloqueado por:** T21.
**O que construir:** para objetivos de projeto com repositório (`dono/repo`), abrir uma issue **pré-preenchida** no GitHub (título, corpo com o briefing e rótulos do agente: Jules, Copilot ou agente local), usando o limite de URL vindo de `src/config/ambiente.js`. O envio é feito por você, na página do GitHub. Depois, colar o link da issue no bloco. É o canal para agentes com acesso ao repositório.
**Critérios de aceite:**
- [ ] A URL (`https://github.com/dono/repo/issues/new?...`) tem título, corpo e rótulos codificados corretamente, inclusive com acentos, `#`, `&` e quebras de linha (teste da função pura `montarUrlNovaIssue`)
- [ ] Jules aplica os rótulos `jules` e `ready-for-agent`; Copilot e agente local aplicam `ready-for-agent`, e para o Copilot a tela lembra de atribuir a issue ao Copilot
- [ ] Briefing grande demais para a URL (corte conservador de cerca de 7.500 caracteres) cai em "Copiar briefing" com aviso
- [ ] Repositório fora do formato `dono/repo` mostra erro; o link colado precisa ser desse repositório
- [ ] Aviso visível: em repositório público a issue é pública, então nada de segredos

### T23 — Status da issue e do PR pela API pública do GitHub (AFK) — *condicional*
**Bloqueado por:** T22.
**O que construir:** botão "Atualizar status" que consulta a API pública do GitHub (base URL vinda de `src/config/ambiente.js`), sem token, e mostra se a issue está aberta ou fechada e se há PR ligado.
**Critérios de aceite:**
- [ ] Funciona sem token em repositório público
- [ ] Limite de requisições, falta de rede e repositório privado mostram mensagem clara e não quebram o app
- [ ] Colar o link do PR à mão continua funcionando

### T24 — Registro mão × IA e exportação para o Diário (AFK) — *condicional*
**Bloqueado por:** T21, T08.
**O que construir:** o painel do objetivo no Mapa mostra quantos blocos foram feitos na mão, por IA ou mistos; os Ajustes exportam um markdown com os blocos feitos com IA (briefing, canal, provedor e modelo, resposta, erro da IA e quem fez) para colar no `docs/DIARIO_LOG.md`.
**Critérios de aceite:**
- [ ] Contagem correta por `feitaPor` (5 blocos feitos: 3 na mão, 1 por IA, 1 misto)
- [ ] Campo opcional "o que a IA errou" em cada bloco delegado
- [ ] O markdown exportado traz o briefing exatamente como foi enviado
- [ ] **A chave de IA nunca aparece na exportação**

---

## M4 — Entrega

### T16 — Teste com outra pessoa (HITL)
**Bloqueado por:** T15.
**O que construir:** alguém usa o app sem nenhuma explicação (cobrindo o **Mapa** em canvas, os painéis laterais e a tela **Hoje**); você anota onde travou e corrige de 2 a 3 atritos.
**Critérios de aceite:**
- [ ] Anotações do teste registradas (README ou Diário)
- [ ] Atritos corrigidos em PRs próprios

### T17 — Qualidade, acessibilidade do canvas e uso em 380px (AFK)
**Bloqueado por:** T16.
**O que construir:** passada em desktop e em 380px (celular): foco visível, alvos de toque de 44px, contraste, movimento reduzido, labels e equivalente por teclado/formulário para cada gesto do canvas (criar, ligar, desligar, organizar e distribuir).
**Critérios de aceite:**
- [ ] Tudo navegável por teclado, incluindo ligar/desligar um bloco de um objetivo e um objetivo de uma meta sem arrastar
- [ ] As animações de recompensa respeitam `prefers-reduced-motion` e a opção dos Ajustes
- [ ] Nada corta ou rola para o lado em 380px (especialmente Hoje e os painéis laterais)

### T18 — Publicar (HITL)
**Bloqueado por:** T17.
**O que construir:** publicar na Vercel (origem própria, recomendada por causa da chave de IA no navegador) ou no GitHub Pages, com `HashRouter` e variáveis de ambiente configuradas por plataforma (`VITE_APP_BASE`, etc.); abrir no desktop e no celular e pôr o link no README.
**Critérios de aceite:**
- [ ] O app abre pelo link público e recarrega qualquer rota sem quebrar
- [ ] Os dados e posições do Mapa persistem ao recarregar
- [ ] Alternar dev/produção funciona via variáveis de ambiente, sem editar código-fonte
- [ ] Nenhuma chave ou segredo aparece no repositório, em `.env*`, no build ou nos logs

### T19 — README final e Diário (HITL)
**Bloqueado por:** T18.
**O que construir:** README completo (Proposta, como rodar, prints do **Mapa** em canvas e da tela **Hoje**, decisões, limitações e roadmap do que ficou para a v2) e o Diário da IA em PDF de 1 página.
**Critérios de aceite:**
- [ ] Verificação em janela anônima: repositório público, README renderizando, commits aparecendo
- [ ] O README explica por que o Mapa em canvas é o centro da interface (com nós derivados dos dados), como a prioridade é calculada e por que o feedback não usa sequências de dias; se a extensão de IA existir, também a segurança da chave; o que não entrou aparece como roadmap
- [ ] Diário com melhor prompt, erro da IA (o que errou, como percebi, como corrigi) e reflexão, com as suas palavras
- [ ] Link enviado na Labs Learning e PDF na atividade DIÁRIO DA IA

### T20 — PWA instalável (AFK) — *condicional*
**Bloqueado por:** T18.
**O que construir:** manifesto e service worker para instalar o app no celular.
**Critérios de aceite:**
- [ ] Instalável e abre offline

---

## Ordem de corte se o prazo apertar

Corte nesta ordem: a extensão de IA inteira (T28, T27, T21 e os condicionais T22 a T24); depois T20, T13, T11, T14, T10, T12 e T05; o T15 encolhe para uma única melhoria; dentro do T31 ficam só o gesto do bloco e a celebração do objetivo; dentro do T29 a meta principal (`paiId`) sai e ficam só horas restantes, ritmo e contribuição no Mapa; no limite extremo, o T26 encolhe (criar e ligar blocos fica só pelos botões e formulários do painel). **Nunca corte:** T01 a T04, T06 a T09, T30 (a prioridade), T16, T18 e T19 — como o canvas já nasce no T02, o Mapa continua no centro do produto. O que sair vira roadmap no README.
