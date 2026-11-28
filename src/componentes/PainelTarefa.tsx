import { Calendar, Check, CheckCircle2, Circle, Target, X } from 'lucide-react';
import { formatarDataExibicao } from '../dominio/datas';
import type { Objetivo, Tarefa } from '../dominio/tipos';

interface PainelTarefaProps {
  readonly tarefa: Tarefa;
  readonly objetivo: Objetivo | null;
  readonly aoConcluir: (tarefaId: string) => void;
  readonly aoFechar: () => void;
}

export function PainelTarefa({
  tarefa,
  objetivo,
  aoConcluir,
  aoFechar,
}: PainelTarefaProps) {
  const feita = tarefa.status === 'feita';

  return (
    <aside
      aria-label="Detalhes da tarefa"
      className="absolute inset-y-0 right-0 z-20 flex w-full max-w-sm flex-col border-l-[length:var(--hairline)] border-border bg-surface shadow-sm"
    >
      <div className="flex items-center justify-between border-b-[length:var(--hairline)] border-border px-5 py-4">
        <h2 className="text-base font-semibold tracking-[-0.015em] text-text">
          Detalhes da tarefa
        </h2>
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar painel da tarefa"
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill text-text-2 transition-colors hover:bg-fill-subtle hover:text-text"
        >
          <X size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
        <div>
          <h3 className="text-base font-semibold tracking-[-0.015em] text-text">
            {tarefa.titulo}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {feita ? (
              <span className="inline-flex items-center gap-[5px] rounded-pill border border-done-border bg-done-bg px-[10px] py-[3px] text-xs font-medium text-done-text">
                <CheckCircle2
                  size={14}
                  strokeWidth={1.5}
                  className="shrink-0 text-done-icon"
                  aria-hidden="true"
                />
                Concluída
              </span>
            ) : (
              <span className="inline-flex items-center gap-[5px] rounded-pill bg-fill-subtle px-[10px] py-[3px] text-xs font-medium text-text-2">
                <Circle size={14} strokeWidth={1.5} aria-hidden="true" />
                Pendente
              </span>
            )}
          </div>
        </div>

        <dl className="flex flex-col gap-3 rounded-card border-[length:var(--hairline)] border-border bg-canvas p-4 text-sm">
          {objetivo && (
            <div className="flex items-center gap-2.5">
              <Target
                size={15}
                strokeWidth={1.5}
                className="shrink-0 text-text-2"
                aria-hidden="true"
              />
              <dt className="sr-only">Objetivo</dt>
              <dd className="truncate text-text">{objetivo.titulo}</dd>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <Calendar
              size={15}
              strokeWidth={1.5}
              className="shrink-0 text-text-2"
              aria-hidden="true"
            />
            <dt className="sr-only">Data planejada</dt>
            <dd className="text-text-2 tabular-nums">
              {tarefa.dataPlanejada
                ? `Planejada para ${formatarDataExibicao(tarefa.dataPlanejada)}`
                : 'Sem data planejada'}
            </dd>
          </div>
        </dl>

        <div className="mt-auto pt-2">
          {feita ? (
            <p className="rounded-row border border-done-border bg-done-bg px-4 py-3 text-center text-sm font-medium text-done-text">
              Tarefa concluída.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => aoConcluir(tarefa.id)}
              className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-pill bg-btn-primary-bg px-5 text-sm font-medium text-btn-primary-text transition-opacity hover:opacity-90"
            >
              <Check size={16} strokeWidth={1.5} aria-hidden="true" />
              Concluir tarefa
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
