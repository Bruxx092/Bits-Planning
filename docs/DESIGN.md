# Bits Planning — Direção visual (`DESIGN.md`)

Contrato visual oficial da v1 do **Bits Planning**. **Prevalece sobre a seção 8 do `PLANNING.md`** (paleta antiga névoa/petróleo/âmbar/musgo, raio de `8px` e partículas) em todos os tickets da v1 (`T02` em diante).

Vocabulário obrigatório em toda a UI: **Meta → Objetivo → Tarefa** (sem "bloco de 25 min" e sem Pomodoro na v1).

---

## 1. Intenção e princípios

Sensação de app nativo minimalista (referência: Maestri para macOS): **quase tudo é neutro, e a cor só aparece quando carrega significado.**

| Princípio | Regra prática |
|---|---|
| **Neutro primeiro** | ~90% da interface é neutra (canvas, superfícies, bordas, texto). Cor viva é exceção. |
| **Cor é significado** | Cada acento tem papel semântico fixo; nunca use cor viva só como decoração. |
| **Botão primário neutro** | Fundo `--btn-primary-bg` e texto `--btn-primary-text` (preto no claro, branco no escuro). Azul não é cor de botão. |
| **Azul só para seleção e foco** | `--focus` + `--focus-halo` aparecem apenas no anel de foco por teclado e na seleção do item ativo no canvas. |
| **Pílula pastel** | Status usam pílulas arredondadas: fundo pastel quase branco (ou translúcido 16–18% no escuro), ícone fino na cor viva e texto na mesma família com contraste WCAG AA. Sem blocos sólidos coloridos. |
| **Bordas finas, sem sombra pesada** | Separação por bordas finas (`--hairline` em `--border`). Sombra usada apenas para anel de foco/seleção ou leve separação de controles flutuantes. |
| **Cantos grandes** | Cards (`16px`), linhas/tarefas (`14px`) e pílulas/botões primários (`999px`). |
| **Nunca só cor** | Todo status combina ícone + rótulo textual + cor (acessibilidade). |

---

## 2. Tokens de cor (definidos em `src/index.css`)

Todos os tokens vivem como CSS custom properties em `src/index.css` e são expostos ao Tailwind v4 via `@theme inline` (`bg-canvas`, `bg-surface`, `border-border`, `text-text`, `text-text-2`, `bg-btn-primary-bg`, `rounded-card`, etc.). **Nunca use valores hexadecimais hardcoded nos componentes.**

### Neutros

| Token | Papel | Claro | Escuro |
|---|---|---|---|
| `--canvas` | Fundo do canvas e página | `#FDFDFD` | `#18181A` |
| `--surface` | Cards, painéis e superfícies | `#FFFFFF` | `#222225` |
| `--border` | Bordas e grade do canvas | `#E5E5E5` | `#2F2F2F` |
| `--fill-subtle` | Chips neutros, trilho de progresso, hover | `#F0F0F0` | `#2A2A2D` |
| `--text` | Texto principal | `#1D1D1F` | `#F5F5F7` |
| `--text-2` | Texto secundário, datas, ícones neutros | `#737373` | `#A1A1A6` |
| `--text-3` | Apenas decorativo ou desabilitado *(nunca para texto informativo — contraste < 4,5:1)* | `#A1A1A1` | `#6E6E73` |
| `--btn-primary-bg` | Fundo do botão primário | `#1D1D1F` | `#F5F5F7` |
| `--btn-primary-text` | Texto do botão primário | `#FFFFFF` | `#1D1D1F` |
| `--focus` | Anel de seleção e foco (único uso de azul) | `#2263E5` | `#2777F9` |
| `--focus-halo` | Halo de 3px na seleção e foco | `#D9EAFE` | `rgba(39, 119, 249, 0.28)` |

### Acentos com significado

| Significado | Ticket | Fundo claro (`--*-bg`) | Fundo escuro (`--*-bg`) | Ícone/traço (`--*-icon`) | Texto claro (`--*-text`)* | Texto escuro (`--*-text`) |
|---|---|---|---|---|---|---|
| **Concluído** | `T02+` | `#F0FAF9` | `rgba(42, 184, 165, 0.16)` | `#2AB8A5` | `#117A6D` | `#3CC8B5` |
| **Prioridade** | `T30` | `#FEF8F0` | `rgba(242, 159, 38, 0.16)` | `#F29F26` | `#9A5B00` | `#F5AE45` |
| **Atrasado** | `T06` | `#FEF2F2` | `rgba(235, 69, 74, 0.16)` | `#EB454A` | `#D12F35` | `#F5666B` |
| **IA** *(reservado)* | fora da v1 | `#F7F3FE` | `rgba(140, 91, 244, 0.18)` | `#8C5BF4` | `#6B3FD4` | `#A583F8` |

> \* `--done-text` (`#117A6D`) e `--priority-text` (`#9A5B00`) foram ajustados para garantir contraste **WCAG AA (≥ 4,5:1)** em pílulas de `12px` no modo claro.

### Tokens reservados (não criar funcionalidade na v1)

Os tokens abaixo existem apenas como reserva em `src/index.css` para evolução futura — **não adicione campos no modelo de dados nem funcionalidades para eles na v1**:

- `--ai-bg`, `--ai-icon`, `--ai-text` (extensão de IA — fora da v1).
- `--cat-indigo-bg` / `--cat-indigo`, `--cat-pink-bg` / `--cat-pink`, `--cat-yellow-bg` / `--cat-yellow` (categorias de objetivo — `Objetivo` na v1 não possui campo de cor/categoria).
- `--note` (`#FEF9C6`, texto sempre `#1D1D1F` — nota adesiva não faz parte da v1).

---

## 3. Tema, bordas e geometria

- **Claro e escuro:** segue automaticamente o sistema via `@media (prefers-color-scheme: dark)` e já oferece o hook `:root[data-theme="light"]` / `:root[data-theme="dark"]` no CSS. Na v1 não há seletor manual de tema nos Ajustes.
- **Raios:** `--radius-card: 16px`, `--radius-row: 14px`, `--radius-pill: 999px`.
- **Bordas (`--hairline`):** `1px` por padrão (para nitidez em telas Windows 1x/125% e legibilidade ao dar zoom out no canvas), afinando para `0.5px` em telas HiDPI (`@media (min-resolution: 2dppx)`). Dentro do canvas (`@xyflow/react`), mantenha `1px` nos nós para não sumir com zoom.

---

## 4. Tipografia e ícones

- **Tipografia:** `Inter` via `@fontsource/inter` (pesos `400`, `500`, `600`, `700`), com fallback `system-ui, -apple-system, sans-serif`.
  - Títulos em `font-semibold` (`600`) com `letter-spacing: -0.015em` (`tracking-tight`).
  - Números de contadores e percentuais com `font-variant-numeric: tabular-nums`.
  - Frases em caixa normal, sem rótulos em caixa-alta e sem emojis decorativos.
- **Ícones:** biblioteca única **`lucide-react`** (MIT), sempre com `strokeWidth={1.5}` (traço fino e pontas arredondadas), usando a cor semântica do papel (`--*-icon`) ou `--text-2`. Não use SF Symbols.

---

## 5. Especificação de componentes (referência para `T02`–`T31`)

- **Card de Meta / Objetivo (`NoObjetivo`):** fundo `--surface`, borda `1px` em `--border`, raio `--radius-card` (`16px`). Avatar circular neutro padrão (`--fill-subtle` com ícone fino em `--text-2` ou inicial do título — sem cores aleatórias), título em peso médio/semibold, barra de progresso fina (`4px`, trilho `--fill-subtle`, preenchimento `--done-icon` ou `--text`).
- **Linha/Nó de Tarefa (`NoTarefa`):** mesmo estilo de superfície com raio `--radius-row` (`14px`), ligada ao objetivo por aresta de `1.5px` em `--border`. Título à esquerda e pílulas de status à direita. Tarefa concluída usa texto em `--text-2` + pílula "Concluída".
- **Pílula de status:** `inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-pill text-xs`, fundo `--*-bg`, texto `--*-text`, ícone Lucide `14px` (`strokeWidth={1.5}`) em `--*-icon`, borda fina na cor viva com ~35% de opacidade no modo claro.
- **Botão primário:** fundo `--btn-primary-bg`, texto `--btn-primary-text`, `rounded-pill`, altura/alvo de toque ≥ `44px` em mobile e controles interativos confortáveis.
- **Item selecionado / foco:** borda em `--focus` + anel externo de `3px` em `--focus-halo`.
- **Canvas e controles flutuantes:** fundo `--canvas` com grade discreta (`20px`–`24px`) em `--border` com baixa opacidade; barra de ferramentas no topo centralizada em pílula flutuante com leve translucidez (`backdrop-blur`); controles de zoom em pílula no canto inferior direito.
- **Feedback de conclusão (`T31`):** verde `--done-icon` + destaque suave atrás do card (no claro, degradê sutil `#DAD7F6`, `#CFD3F1`, `#F5E7F8`; no escuro, brilho discreto `#3A1E3F`) em pulso curto — **sem confete/partículas**, sem som e respeitando `prefers-reduced-motion` e `configuracoes.animacoes`.
- **Acessibilidade:** alvos de toque ≥ `44px`, foco de teclado visível, labels em todos os campos e equivalente por teclado/formulário para todo gesto do canvas.
