import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { formatarDataLocal } from '../dominio/datas';
import type { DataLocal } from '../dominio/tipos';

export interface DadosFormularioObjetivo {
  readonly titulo: string;
  readonly quantidadeTarefas: number;
  readonly prazo: DataLocal;
}

interface FormularioObjetivoProps {
  readonly aoCriar: (dados: DadosFormularioObjetivo) => void;
  readonly aoFechar: () => void;
}

function sugerirPrazoPadrao(hoje: Date): DataLocal {
  return formatarDataLocal(
    new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 11, 12),
  );
}

export function FormularioObjetivo({
  aoCriar,
  aoFechar,
}: FormularioObjetivoProps) {
  const agora = new Date();
  const hoje = formatarDataLocal(agora);

  const [titulo, setTitulo] = useState('');
  const [quantidadeTexto, setQuantidadeTexto] = useState('12');
  const [prazo, setPrazo] = useState<DataLocal>(() =>
    sugerirPrazoPadrao(agora),
  );
  const [erro, setErro] = useState<string | null>(null);

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const tituloLimpo = titulo.trim();
    if (tituloLimpo.length === 0) {
      setErro('Informe um título para o objetivo.');
      return;
    }

    const quantidade = Number(quantidadeTexto);
    if (!Number.isSafeInteger(quantidade) || quantidade < 1) {
      setErro('Informe uma quantidade inteira de pelo menos 1 tarefa.');
      return;
    }

    if (!prazo || prazo < hoje) {
      setErro('Escolha um prazo igual ou posterior a hoje.');
      return;
    }

    setErro(null);
    aoCriar({
      titulo: tituloLimpo,
      quantidadeTarefas: quantidade,
      prazo,
    });
  }

  return (
    <aside
      aria-label="Novo objetivo"
      className="absolute inset-y-0 right-0 z-20 flex w-full max-w-sm flex-col border-l-[length:var(--hairline)] border-border bg-surface shadow-sm"
    >
      <div className="flex items-center justify-between border-b-[length:var(--hairline)] border-border px-5 py-4">
        <h2 className="text-base font-semibold tracking-[-0.015em] text-text">
          Novo objetivo
        </h2>
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar formulário"
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill text-text-2 transition-colors hover:bg-fill-subtle hover:text-text"
        >
          <X size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <form
        onSubmit={aoEnviar}
        noValidate
        className="flex flex-1 flex-col gap-5 overflow-y-auto p-5"
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="objetivo-titulo"
            className="text-sm font-medium text-text"
          >
            Título do objetivo
          </label>
          <input
            id="objetivo-titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Fundamentos de Arquitetura"
            autoFocus
            className="min-h-[44px] rounded-row border-[length:var(--hairline)] border-border bg-canvas px-3.5 text-sm text-text placeholder:text-text-3"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="objetivo-quantidade"
            className="text-sm font-medium text-text"
          >
            Quantidade de tarefas
          </label>
          <input
            id="objetivo-quantidade"
            type="number"
            min={1}
            step={1}
            value={quantidadeTexto}
            onChange={(e) => setQuantidadeTexto(e.target.value)}
            className="min-h-[44px] rounded-row border-[length:var(--hairline)] border-border bg-canvas px-3.5 text-sm text-text tabular-nums"
          />
          <p className="text-xs text-text-2">
            Cria tarefas numeradas distribuídas uniformemente até o prazo.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="objetivo-prazo"
            className="text-sm font-medium text-text"
          >
            Prazo
          </label>
          <input
            id="objetivo-prazo"
            type="date"
            min={hoje}
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
            className="min-h-[44px] rounded-row border-[length:var(--hairline)] border-border bg-canvas px-3.5 text-sm text-text tabular-nums"
          />
        </div>

        {erro && (
          <p
            role="alert"
            className="rounded-row border border-late-border bg-late-bg px-3.5 py-2.5 text-xs font-medium text-late-text"
          >
            {erro}
          </p>
        )}

        <div className="mt-auto flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={aoFechar}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-pill border-[length:var(--hairline)] border-border bg-surface px-4 text-sm font-medium text-text transition-colors hover:bg-fill-subtle"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-pill bg-btn-primary-bg px-5 text-sm font-medium text-btn-primary-text transition-opacity hover:opacity-90"
          >
            Criar objetivo
          </button>
        </div>
      </form>
    </aside>
  );
}
