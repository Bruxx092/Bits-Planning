import { Handle, Position, type NodeProps } from '@xyflow/react';
import { CheckCircle2 } from 'lucide-react';
import { formatarDataExibicao } from '../dominio/datas';
import type { NoTarefaFlow } from './adaptadorMapa';

export function NoTarefa({ data, selected }: NodeProps<NoTarefaFlow>) {
  const { tarefa, selecionada, aoSelecionar } = data;
  const feita = tarefa.status === 'feita';
  const ativo = selecionada || selected;

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border !border-border !bg-surface"
      />

      <button
        type="button"
        onClick={() => aoSelecionar(tarefa.id)}
        className={`block w-[196px] cursor-pointer rounded-row border bg-surface px-3.5 py-2.5 text-left transition-shadow ${
          ativo
            ? 'border-focus shadow-[0_0_0_3px_var(--focus-halo)]'
            : 'border-border hover:border-text-3'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={`truncate text-sm font-medium leading-snug ${
              feita ? 'text-text-2' : 'text-text'
            }`}
          >
            {tarefa.titulo}
          </span>
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="text-xs text-text-2 tabular-nums">
            {tarefa.dataPlanejada
              ? formatarDataExibicao(tarefa.dataPlanejada)
              : 'Sem data'}
          </span>

          {feita && (
            <span className="inline-flex items-center gap-[5px] rounded-pill border border-done-border bg-done-bg px-[10px] py-[3px] text-xs font-medium text-done-text">
              <CheckCircle2
                size={14}
                strokeWidth={1.5}
                className="shrink-0 text-done-icon"
                aria-hidden="true"
              />
              Concluída
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
