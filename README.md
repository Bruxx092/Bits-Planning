# Proposta

**Qual é o problema?** Objetivos grandes (terminar um livro, avançar num projeto, fazer candidaturas) costumam ficar soltos: as tarefas do dia a dia não se ligam à meta maior, o progresso fica invisível e, sem saber o que merece atenção primeiro, é fácil procrastinar ou gastar energia no que importa menos.

**Para quem é?** Para estudantes e pessoas que conciliam faculdade, trabalho e estudos por conta própria e querem enxergar como cada tarefa diária contribui para objetivos maiores.

**Solução em uma frase.** Um gerenciador visual de metas com um **Mapa em canvas** no centro da interface onde **Metas → Objetivos → Tarefas** ficam conectados por linhas, com distribuição automática até o prazo, priorização diária explicada dentro da capacidade configurada e recompensas sem pressão.

**O que a primeira versão (v1) faz?**

1. **Mapa em canvas (tela inicial):** conecta metas, objetivos e tarefas por linhas, exibindo progresso agregado, tarefas restantes, ritmo necessário e quanto cada tarefa contribui para o objetivo e para a meta — permitindo criar, arrastar, conectar, organizar por dia e distribuir tarefas, sempre com equivalente acessível por formulário e teclado.
2. **Plano automático:** cadastra objetivos por quantidade de tarefas, por intervalo de unidades (ex.: capítulos 4 a 27) ou em modo livre, escolhe prazo e dias ativos da semana e distribui automaticamente as tarefas até o prazo, com replanejamento de atrasos sem punição.
3. **Tela "Hoje" enxuta:** mostra apenas as tarefas planejadas para o dia (e eventuais pendências de dias anteriores), com conclusão direta em 1 clique e conforto em telas de 380px.
4. **Prioridade explicada:** combina a importância escolhida (1 a 5) com a urgência calculada (ritmo necessário contra a capacidade diária configurada), destaca a próxima melhor tarefa e avisa quando há sobrecarga.
5. **Recompensas sem streaks:** feedback positivo curto ao concluir tarefas, marcos (25%, 50% e 75%) e objetivos/metas, com histórico de conquistas e respeito a `prefers-reduced-motion`.

**Como a IA é usada neste projeto?** Para planejar (`/grill-me`, spec e quebra em slices verticais), implementar tickets em par ou no trilho AFK com TDD (Red → Green → Refactor), revisar código e testar regras de negócio com exemplos de resposta conhecida. Todo trabalho entra por pull request com CI verde, revisão manual e perguntas de entendimento antes do merge. Erros da IA ficam registrados para o Diário da IA.

**Fora da v1 (Roadmap v2):** timer Pomodoro 25/5 e recordação ativa pós-bloco, estimativa em minutos/horas, tela Amanhã, revisões espaçadas, exportar/importar JSON, PWA, extensão de delegação para IA no app, backend com login e sincronização entre dispositivos, seletor manual de tema, notificações e sons.

---

## Como rodar localmente

Requisitos: Node.js 22+ e npm.

```bash
npm ci
cp .env.example .env.local # opcional: ajuste VITE_STORAGE_KEY ou limite padrão
npm run dev
```

Comandos de verificação:

```bash
npm run lint   # ESLint
npm test       # Vitest (execução única)
npm run build  # checagem de tipos (tsc -b) + build de produção
```
