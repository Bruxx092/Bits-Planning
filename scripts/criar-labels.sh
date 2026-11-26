#!/usr/bin/env bash
# Cria os rótulos e os marcos (milestones) do processo do Bits Planning.
# Requisitos: GitHub CLI instalado e autenticado (gh auth login), executado dentro do repositório.
# Se o /setup-matt-pocock-skills registrou outros nomes de rótulos de triagem em docs/agents/,
# ajuste os nomes abaixo para ficarem iguais.
set -euo pipefail

criar_rotulo() {
  gh label create "$1" --color "$2" --description "$3" --force
}

criar_rotulo needs-triage    "ededed" "Ticket novo, ainda não avaliado"
criar_rotulo needs-info      "fbca04" "Faltam informações para implementar"
criar_rotulo ready-for-agent "0e8a16" "AFK: a IA pode implementar sozinha e abrir PR"
criar_rotulo ready-for-human "1d76db" "HITL: eu implemento na mão (a IA pode ser tutora)"
criar_rotulo wontfix         "ffffff" "Não será feito"
criar_rotulo erro-da-ia      "d93f0b" "A IA errou: registrar no Diário"
criar_rotulo jules           "5319e7" "Dispara o agente Jules (só o dono aplica)"
criar_rotulo bug             "d73a4a" "Algo não funciona"
criar_rotulo docs            "0075ca" "Documentação"

# Marcos. Rode esta parte uma única vez: rodar de novo cria marcos duplicados.
criar_marco() {
  gh api "repos/{owner}/{repo}/milestones" \
    -f title="$1" -f due_on="$2" -f description="$3" > /dev/null
}

criar_marco "M1 — Tracer bullet no Mapa" "2026-11-25T23:59:59Z" "T01 e T02: fundação e primeiro objetivo com blocos no Mapa (canvas)"
criar_marco "M2 — Núcleo do plano, canvas e execução" "2026-11-30T23:59:59Z" "T03, T04, T07, T06, T08 e T26: plano, canvas interativo, replanejar, Hoje e timer"
criar_marco "M3 — Hierarquia, prioridade e recompensas" "2026-12-03T23:59:59Z" "T09, T30, T29, T31 e T15: recordação, prioridade, hierarquia no Mapa, recompensas e arquitetura (condicionais: T10 a T14)"
criar_marco "Extensão — IA no app" "2026-12-20T23:59:59Z" "T21, T27 e T28: delegação e IA por API (só se sobrar tempo ou depois da entrega; condicionais: T22 a T24)"
criar_marco "M4 — Entrega"            "2026-12-05T23:59:59Z" "T16 a T19: teste, qualidade, publicação, README e Diário"

echo "Rótulos e marcos criados."
