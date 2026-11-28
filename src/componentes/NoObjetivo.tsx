import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Calendar, CheckCircle2, Target } from 'lucide-react';
import { formatarDataExibicao } from '../dominio/datas';
import type { NoObjetivoFlow } from './adaptadorMapa';

export function NoObjetivo({ data, selected }: NodeProps<NoObjetivoFlow>) {
  const { objetivo, progresso } = data;
  const concluido = objetivo.status === 'concluido';

  return (
    <article
      className={`relative w-[260px] rounded-card border bg-surface p-4 text-left transition-shadow ${
        selected
          ? 'border-focus shadow-[0_0_0_3px_var(--focus-halo)]'
          : 'border-border'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-fill-subtle text-text-2"
          aria-hidden="true"
        >
          <Target size={16} strokeWidth={1.5} />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold tracking-[-0.015em] text-text">
            {objetivo.titulo}
          </h2>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-text-2 tabular-nums">
            <Calendar size={13} strokeWidth={1.5} aria-hidden="true" />
            <span>Prazo {formatarDataExibicao(objetivo.prazo)}</span>
          </p>
        </div>
      </div>

      <div className="mt-3.5">
        <div className="flex items-center justify-between text-xs tabular-nums">
          <span className="text-text-2">
            {progresso.feitos}/{progresso.total} tarefas
          </span>
          <span className="font-semibold text-text">{progresso.percentual}%</span>
        </div>

        <div
          className="mt-1.5 h-1 w-full overflow-hidden rounded-pill bg-fill-subtle"
          role="progressbar"
          aria-valuenow={progresso.percentual}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso de ${objetivo.titulo}`}
        >
          <div
            className="h-full rounded-pill bg-done-icon transition-all"
            style={{ width: `${progresso.percentual}%` }}
          />
        </div>

        {concluido && (
          <div className="mt-2.5">
            <span className="inline-flex items-center gap-[5px] rounded-pill border border-done-border bg-done-bg px-[10px] py-[3px] text-xs font-medium text-done-text">
              <CheckCircle2
                size={14}
                strokeWidth={1.5}
                className="shrink-0 text-done-icon"
                aria-hidden="true"
              />
              Concluído
            </span>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border !border-border !bg-surface"
      />
    </article>
  );
}
