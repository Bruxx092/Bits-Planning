# Processo de desenvolvimento — Bits Planning

Como o trabalho flui no GitHub, e como a IA entra nele sem tirar o controle do Pedro. É a aplicação do fluxo do AI Developer Workshop (material de Matt Pocock) a este repositório.

Lema da atividade: **a IA propõe, o Pedro decide.**

---

## 1. Visão geral

```
PLANNING.md
   │
   ▼
/grill-me        interrogatório até existir um conceito de design compartilhado
   │
   ▼
/to-spec         vira o spec (destino) e é publicado como issue
   │
   ▼
/to-tickets      quebra em tickets: slices verticais (jornada), cada um uma issue
   │
   ▼
Para cada ticket, em ordem de dependência:
   escolher o trilho ──► IA (ready-for-agent)  ou  Mão (ready-for-human)
   implementar com /tdd (Red → Green → Refactor)
   PR + CI verde + revisão e QA do Pedro + merge feito pelo Pedro
   /clear
   │
   ▼
/improve-codebase-architecture    ao fim de cada ciclo (T15)
   │
   ▼
Entrega: README, Diário da IA, link do repositório
```

Os comandos com `/` são das skills do Matt Pocock. As skills evoluem (nomes e passos mudaram desde o workshop), então rode `npx skills@latest update` de vez em quando e, se algum comando não existir, peça em linguagem natural ("use a skill grill-me"). Nem toda ferramenta tem comandos `/`.

---

## 2. Configuração única (uma vez, hoje)

1. **Repositório público** `bits-planning` com README. Copie o conteúdo deste kit para a raiz e faça o commit (ticket T01).
2. **GitHub CLI.** Instale o `gh` e rode `gh auth login`. As skills usam o `gh` para criar issues.
3. **Skills.** `npx skills@latest add mattpocock/skills -a antigravity -g -y` (instala globalmente, como no workshop; o instalador mostra o caminho usado). Para outros agentes, troque o `-a`.
4. **Configurar as skills no repositório.** No agente, rode `/setup-matt-pocock-skills` e escolha **GitHub** como issue tracker (a opção "Local markdown" do workshop servia porque aquele repositório não aceitava escrita; use uma ou outra, nunca as duas). Ela grava a escolha em `docs/agents/`. Confira lá os nomes dos rótulos de triagem e, se forem diferentes dos de `scripts/criar-labels.sh`, ajuste o script.
5. **Rótulos e marcos.** `bash scripts/criar-labels.sh` (cria rótulos e os 4 marcos com prazo).
6. **Regras do repositório** (Settings do GitHub):
   - Em *General → Pull Requests*: deixe **merge commit** e **rebase merge** ligados e **desligue squash merge**. A atividade avalia o histórico de commits, e squash apaga a evolução.
   - Em *Rules → Rulesets* (ou Branches): proteger `main` exigindo pull request e o check de CI verde; bloquear force push. **Não exija aprovação de review**: você é o único autor e não poderia aprovar um PR pedido por você a um agente.
7. **GitHub Actions** ligado (o `ci.yml` do kit roda lint, testes e build em todo PR).
8. *(Opcional, para o trilho da IA na nuvem)* Instalar o app do Jules no repositório e/ou habilitar o Copilot coding agent. Veja a seção 5.

---

## 3. Rótulos

| Rótulo | Significado |
|---|---|
| `needs-triage` | Ticket novo, ainda não avaliado |
| `needs-info` | Faltam informações para implementar |
| `ready-for-agent` | **AFK.** A IA pode implementar sozinha e abrir um PR |
| `ready-for-human` | **HITL.** O Pedro implementa na mão (a IA pode ser tutora ou revisora) |
| `wontfix` | Não será feito |
| `erro-da-ia` | A IA errou: marque o PR ou a issue e anote no Diário |
| `jules` | Dispara o agente Jules. **Só o Pedro aplica** |
| `bug`, `docs` | Tipos de trabalho |

Marcos (milestones): M1 Tracer bullet no Mapa (até 25/11), M2 Núcleo do plano, canvas e execução (até 30/11), M3 Hierarquia, prioridade e recompensas (até 03/12), M4 Entrega (até 05/12) e, se sobrar tempo, a Extensão de IA no app. A entrega na Labs Learning é em 06/12.

---

## 4. Dois trilhos, um contrato

**O contrato é a issue**, escrita com o template `.github/ISSUE_TEMPLATE/ticket.md`: o que construir, critérios de aceite verificáveis, bloqueios e contexto. Qualquer pessoa ou IA que ler só a issue, o `AGENTS.md` e o `PLANNING.md` consegue implementar. Quem implementa muda; o contrato e o portão de qualidade não mudam.

### Trilho da IA (`ready-for-agent`)

1. Confirme que os bloqueios (`Blocked by`) já foram mesclados.
2. Escolha **como** a IA roda (seção 5): agente local, Jules ou Copilot.
3. A IA trabalha numa branch e abre um PR com o template, incluindo as 3 perguntas para o Pedro.
4. O CI roda sozinho.
5. O Pedro revisa o diff (checklist abaixo), roda o app, responde as 3 perguntas e só então faz o merge.

### Trilho da mão (`ready-for-human`)

1. Crie a branch: `git switch -c feat/<n>-<slug>`.
2. Faça o ciclo Red → Green → Refactor você mesmo: escreva o teste que falha, veja falhar, implemente, refatore.
3. A IA pode ajudar sem escrever a solução. Prompt sugerido: "Estou implementando a issue #N na mão. Não escreva a solução. Revise meu diff, aponte bugs e testes que faltam e me faça 3 perguntas."
4. Abra o PR com o mesmo template e o mesmo CI. Marque "Eu, na mão" no PR.

### Trocar de trilho

Vale a qualquer momento, trocando o rótulo. Se um PR da IA ficou ruim, feche-o, anote o erro (rótulo `erro-da-ia` e a seção "Onde a IA errou" do PR) e refaça na mão. Esse registro é matéria-prima do Diário.

### Qual trilho para qual ticket

| Tipo de ticket | Trilho sugerido | Por quê |
|---|---|---|
| Os dois primeiros slices (T02, T03) | Mão ou par | Os agentes copiam o código existente mais do que seguem instruções. Os padrões iniciais precisam ser seus |
| Algoritmos do domínio (distribuição, replanejar) | Mão (ou IA escrevendo só a implementação depois do seu primeiro teste) | É o que você mais precisa explicar sem a IA |
| CRUD, telas, exportar/importar, acessibilidade | IA | Trabalho previsível, com critérios claros, bom para paralelizar |
| Teste com outra pessoa, deploy, README, Diário | Mão | Só você pode fazer ou deve fazer |

Os tickets AFK são independentes entre si e permitem paralelizar: enquanto você faz um ticket na mão, outro pode estar com a IA. Faça o merge **um de cada vez** e atualize a branch (rebase ou merge da `main`) antes de mesclar o seguinte, porque eles mexem em arquivos compartilhados (rotas, estado).

---

## 5. Como a IA roda (trilho da IA)

| Opção | Como disparar | Bom para | Cuidados |
|---|---|---|---|
| **A. Agente local** (Antigravity, com as skills instaladas) | Na sessão do agente: `/clear` e depois "/tdd implemente a issue #N" (ou "use a skill tdd na issue #N") | Controle total: você acompanha, faz QA no meio e dá feedback na mesma janela (ciclo Explorar → Implementar → Revisar → Iterar → Limpar) | Ocupa seu tempo ao vivo. É a melhor opção para tickets em que você quer aprender |
| **B. Jules** (agente assíncrono do Google, na nuvem) | Adicione o rótulo `jules` à issue. O app do Jules precisa ter acesso ao repositório | Rodar tickets AFK em paralelo enquanto você faz outro à mão. Lê o `AGENTS.md`, planeja, roda testes e abre PR | Só o dono aplica o rótulo. Limites variam por plano; confira no site do Jules |
| **C. Copilot coding agent** (GitHub) | Atribua a issue ao **Copilot** (campo Assignees) | Tudo dentro do GitHub: branch `copilot/…`, PR em rascunho ligado à issue, pedido de revisão para você | Exige um plano elegível (estudantes do GitHub Education costumam ter acesso; confira em `github.com/settings/copilot`). Consome minutos do Actions e requisições premium. **Comentários novos na issue não chegam ao agente: comente no PR** |

Em qualquer opção, o agente só entrega por PR. Nenhuma delas faz merge: isso é seu.

Dica de escrita: para as opções B e C a issue precisa se bastar, porque o agente só vê a issue e o repositório. Por isso o template tem a seção "Contexto" apontando para o `AGENTS.md` e para as seções certas do `PLANNING.md`.

---

## 6. Rotina de uma sessão (por ticket)

1. **Explorar:** o agente lê a issue, o `AGENTS.md` e os arquivos relevantes e propõe o plano e os "seams" de teste. Você aprova ou corrige.
2. **Implementar:** Red → Green → Refactor, um comportamento por vez.
3. **Revisar:** você roda o app (`npm run dev`), percorre o caminho principal e confere os critérios de aceite.
4. **Iterar:** feedback na mesma janela, em pedidos pequenos.
5. **Limpar:** abra o PR, anote erros da IA, mescle e use `/clear`. O próximo ticket começa do zero, na zona inteligente do contexto.

Regra prática do workshop: `/compact` dentro da mesma atividade, `/clear` entre atividades.

### Checklist de revisão de um PR (sua parte)

- Os testes descrevem comportamento visto de fora, ou estão presos a detalhes internos?
- Eu vi o teste falhar antes de passar (Red)?
- Entrou dependência nova que ninguém pediu?
- Algum arquivo fora do escopo da issue foi alterado?
- Há `toISOString()` para data local, `localStorage` fora de `armazenamento.js`, `import.meta.env` fora de `src/config/ambiente.js`, `@xyflow/react` ou `Date.now()` vazando em `src/dominio/`, regra de negócio duplicada (DRY) ou módulos que só repassam chamadas?
- A mudança ficou fácil de alterar e reversível (ETC, ortogonalidade, configuração externa e desacoplamento sem abstrações desnecessárias)?
- Nenhum segredo/chave entrou em `.env*` ou em variáveis `VITE_*`?
- Eu consigo explicar cada arquivo alterado sem a IA?
- As 3 perguntas para o Pedro foram respondidas?

---

## 7. Convenções

- **Branches:** `feat/12-timer`, `fix/20-data-local`, `docs/19-readme`.
- **Commits** em português, no imperativo, com prefixo: `feat: adiciona timer de 25 minutos`.
- **PR:** título igual ao do ticket, `Closes #<n>`, template preenchido.
- **Merge:** merge commit ou rebase, nunca squash. Quem mescla é o Pedro.

---

## 8. Como o processo alimenta a avaliação e o Diário

| Critério da atividade | Onde o processo gera evidência |
|---|---|
| Funciona | Critérios de aceite verificáveis em cada issue; CI verde; README com prints |
| Entendimento | Perguntas para o Pedro em cada PR; checklist "consigo explicar sem a IA"; trilho da mão nos tickets centrais |
| Uso crítico da IA | Rótulo `erro-da-ia`, seção "Onde a IA errou" do PR, revisão do diff antes do merge |
| Comunicação | Issues claras, commits objetivos, PRs descritos com as suas palavras |
| Autonomia | Histórico de branches e PRs mostrando a evolução; decisões registradas no README |

Para o Diário: o melhor prompt, o erro da IA (o que errou, como você percebeu e como corrigiu) e a reflexão saem do `docs/DIARIO_LOG.md` e dos PRs marcados com `erro-da-ia`.

---

## 9. Higiene e segurança

- O repositório é público: só o Pedro aplica `ready-for-agent` e `jules`. Nunca marque uma issue aberta por outra pessoa.
- Não cole segredos, chaves ou tokens em issues, PRs ou prompts.
- Revise dependências novas em todo PR de IA.
- O agente nunca faz merge nem push na `main`.

---

## 10. O app espelha este processo

A IA aparece em dois lugares, e vale não confundir. **No desenvolvimento**, ela ajuda a construir o Bits Planning (as seções acima). **No produto** (extensão, só se sobrar tempo), o app deixa o Pedro pedir ajuda a uma IA da escolha dele em blocos de código, por três canais: copiar o briefing para qualquer IA (T21), chamar a IA configurada nos Ajustes por API (T27 e T28) ou abrir uma issue no GitHub para um agente com acesso ao repositório (T22, condicional). Em todos vale o mesmo desenho deste processo: a IA propõe, o Pedro revisa com um checklist parecido com o do PR e só então conclui. Fazer na mão continua sendo o padrão e está sempre disponível.

O app nunca envia nada sem mostrar o texto e esperar o clique do Pedro, e a chave de API fica só no navegador dele.
