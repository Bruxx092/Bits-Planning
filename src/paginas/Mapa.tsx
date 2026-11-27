import { useCallback, useMemo, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeTypes,
  type OnNodeDrag,
  type OnNodesChange,
} from '@xyflow/react';
import { LayoutGrid, Map as IconeMapa, Plus } from 'lucide-react';
import {
  construirElementosMapa,
  type NoMapa,
} from '../componentes/adaptadorMapa';
import {
  FormularioObjetivo,
  type DadosFormularioObjetivo,
} from '../componentes/FormularioObjetivo';
import { NoObjetivo } from '../componentes/NoObjetivo';
import { NoTarefa } from '../componentes/NoTarefa';
import { PainelTarefa } from '../componentes/PainelTarefa';
import type { PosicaoMapa } from '../dominio/tipos';
import { useAppEstado } from '../estado/contexto';

const nodeTypes: NodeTypes = {
  objetivo: NoObjetivo,
  tarefa: NoTarefa,
};

function CanvasMapa() {
  const {
    estado,
    criarObjetivo,
    concluirTarefa,
    moverNo,
    organizarMapaPorDia,
  } = useAppEstado();
  const { fitView } = useReactFlow();

  const [formularioAberto, setFormularioAberto] = useState(false);
  const [tarefaSelecionadaId, setTarefaSelecionadaId] = useState<string | null>(
    null,
  );
  const [posicoesArrasto, setPosicoesArrasto] = useState<
    Record<string, PosicaoMapa>
  >({});

  const selecionarTarefa = useCallback((tarefaId: string) => {
    setFormularioAberto(false);
    setTarefaSelecionadaId(tarefaId);
  }, []);

  const { nodes, edges } = useMemo(
    () =>
      construirElementosMapa({
        estado,
        posicoesArrasto,
        tarefaSelecionadaId,
        aoSelecionarTarefa: selecionarTarefa,
      }),
    [estado, posicoesArrasto, tarefaSelecionadaId, selecionarTarefa],
  );

  const aoAlterarNos = useCallback<OnNodesChange<NoMapa>>((changes) => {
    const alteracoesPosicao = changes.getByType('position');
    if (alteracoesPosicao.length === 0) {
      return;
    }

    setPosicoesArrasto((atual) => {
      let mudou = false;
      const proximo = { ...atual };

      for (const mudanca of alteracoesPosicao) {
        if (mudanca.dragging && mudanca.position) {
          proximo[mudanca.id] = mudanca.position;
          mudou = true;
        } else if (!mudanca.dragging && mudanca.id in proximo) {
          delete proximo[mudanca.id];
          mudou = true;
        }
      }

      return mudou ? proximo : atual;
    });
  }, []);

  const aoSoltarNo = useCallback<OnNodeDrag<NoMapa>>(
    (_evento, no) => {
      setPosicoesArrasto((atual) => {
        if (!(no.id in atual)) {
          return atual;
        }
        const proximo = { ...atual };
        delete proximo[no.id];
        return proximo;
      });

      moverNo(no.id, {
        x: Math.round(no.position.x),
        y: Math.round(no.position.y),
      });
    },
    [moverNo],
  );

  const aoClicarNo = useCallback(
    (_evento: React.MouseEvent, no: NoMapa) => {
      if (no.type === 'tarefa') {
        selecionarTarefa(no.data.tarefa.id);
      }
    },
    [selecionarTarefa],
  );

  const aoClicarFundo = useCallback(() => {
    setTarefaSelecionadaId(null);
  }, []);

  const abrirFormulario = useCallback(() => {
    setTarefaSelecionadaId(null);
    setFormularioAberto(true);
  }, []);

  const aoCriarObjetivo = useCallback(
    (dados: DadosFormularioObjetivo) => {
      criarObjetivo(dados);
      setFormularioAberto(false);
      requestAnimationFrame(() => {
        void fitView({ padding: 0.2, duration: 250 });
      });
    },
    [criarObjetivo, fitView],
  );

  const aoOrganizarPorDia = useCallback(() => {
    setPosicoesArrasto({});
    organizarMapaPorDia();
    requestAnimationFrame(() => {
      void fitView({ padding: 0.2, duration: 250 });
    });
  }, [organizarMapaPorDia, fitView]);

  const tarefaSelecionada = useMemo(
    () =>
      tarefaSelecionadaId
        ? (estado.tarefas.find((t) => t.id === tarefaSelecionadaId) ?? null)
        : null,
    [estado.tarefas, tarefaSelecionadaId],
  );

  const objetivoDaTarefa = useMemo(
    () =>
      tarefaSelecionada?.objetivoId
        ? (estado.objetivos.find(
            (o) => o.id === tarefaSelecionada.objetivoId,
          ) ?? null)
        : null,
    [estado.objetivos, tarefaSelecionada],
  );

  const mapaVazio = estado.objetivos.length === 0 && estado.tarefas.length === 0;

  return (
    <div className="flex h-full flex-col bg-canvas text-text">
      <header className="flex items-center justify-between border-b-[length:var(--hairline)] border-border bg-surface px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-fill-subtle text-text-2"
            aria-hidden="true"
          >
            <IconeMapa size={16} strokeWidth={1.5} />
          </span>
          <h1 className="text-base font-semibold tracking-[-0.015em] text-text">
            Bits Planning
          </h1>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center px-4">
          <div
            role="toolbar"
            aria-label="Ações do Mapa"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-pill border-[length:var(--hairline)] border-border bg-surface/90 p-1.5 shadow-sm backdrop-blur-md"
          >
            <button
              type="button"
              onClick={abrirFormulario}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-pill bg-btn-primary-bg px-4 text-sm font-medium text-btn-primary-text transition-opacity hover:opacity-90"
            >
              <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
              Novo objetivo
            </button>

            <button
              type="button"
              onClick={aoOrganizarPorDia}
              disabled={mapaVazio}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-pill border-[length:var(--hairline)] border-border bg-surface px-4 text-sm font-medium text-text transition-colors hover:bg-fill-subtle disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LayoutGrid size={16} strokeWidth={1.5} aria-hidden="true" />
              Organizar por dia
            </button>
          </div>
        </div>

        <div className="h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={aoAlterarNos}
            onNodeDragStop={aoSoltarNo}
            onNodeClick={aoClicarNo}
            onPaneClick={aoClicarFundo}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.2}
            maxZoom={1.8}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1.5}
              color="var(--border)"
            />
            <Controls position="bottom-right" showInteractive={false} />
          </ReactFlow>
        </div>

        {mapaVazio && !formularioAberto && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <section className="pointer-events-auto w-full max-w-md rounded-card border-[length:var(--hairline)] border-border bg-surface p-6 text-center shadow-sm">
              <span
                className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-pill bg-fill-subtle text-text-2"
                aria-hidden="true"
              >
                <IconeMapa size={18} strokeWidth={1.5} />
              </span>
              <h2 className="mt-3 text-base font-semibold tracking-[-0.015em] text-text">
                Mapa
              </h2>
              <p className="mt-1.5 text-sm text-text-2">
                Nenhum objetivo ainda. Crie o primeiro no Mapa.
              </p>
              <button
                type="button"
                onClick={abrirFormulario}
                className="mt-5 inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-pill bg-btn-primary-bg px-5 text-sm font-medium text-btn-primary-text transition-opacity hover:opacity-90"
              >
                <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
                Criar primeiro objetivo
              </button>
            </section>
          </div>
        )}

        {formularioAberto && (
          <FormularioObjetivo
            aoCriar={aoCriarObjetivo}
            aoFechar={() => setFormularioAberto(false)}
          />
        )}

        {tarefaSelecionada && (
          <PainelTarefa
            tarefa={tarefaSelecionada}
            objetivo={objetivoDaTarefa}
            aoConcluir={concluirTarefa}
            aoFechar={() => setTarefaSelecionadaId(null)}
          />
        )}
      </main>
    </div>
  );
}

export function Mapa() {
  return (
    <ReactFlowProvider>
      <CanvasMapa />
    </ReactFlowProvider>
  );
}
