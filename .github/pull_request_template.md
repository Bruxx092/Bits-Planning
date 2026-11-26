## Ticket

Closes #

## Quem implementou

- [ ] IA (agente: ______ )
- [ ] Eu, na mão
- [ ] Misto (eu escrevi: ______ / a IA escreveu: ______ )

## O que mudou (com as minhas palavras)

<!-- 2 a 4 linhas. Se eu não consigo escrever isto sem a IA, ainda não entendi o suficiente para mesclar. -->

## Como testei

- [ ] `npm test`, `npm run lint` e `npm run build` passam
- [ ] Rodei o app e fiz o caminho principal do ticket
- [ ] Exemplo de resposta conhecida que conferi:

## Critérios de aceite do ticket

<!-- Copie da issue e marque. -->
- [ ] 

## Red → Green → Refactor

- [ ] Vi o teste falhar antes de implementar
- [ ] Refatorei com a suíte verde

## Onde a IA errou (para o Diário)

<!-- O que sugeriu, como percebi, como corrigi. Se não errou, o que eu conferi. Se errou, aplique o rótulo `erro-da-ia`. -->

## Perguntas para o Pedro

<!-- Se a IA implementou, ela escreve 3 perguntas sobre o código entregue. Eu respondo aqui antes do merge. -->
1. 
2. 
3. 

## Antes de mesclar

- [ ] Li cada arquivo alterado e consigo explicá-lo sem a IA
- [ ] Nenhuma dependência nova sem eu ter pedido
- [ ] Nada fora do escopo da issue foi alterado
- [ ] Princípios respeitados sem complicar o código: DRY de conhecimento, ortogonalidade/reversibilidade (sem `@xyflow/react`, `localStorage`, `fetch`, `import.meta.env` ou relógio implícito no domínio), configuração externa centralizada (zero segredos em `VITE_*`), desacoplamento e ETC
- [ ] Merge sem squash (merge commit ou rebase)
