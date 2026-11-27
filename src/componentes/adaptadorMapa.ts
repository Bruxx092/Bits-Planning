import type { Edge, Node } from '@xyflow/react';
import {
  chaveNoObjetivo,
  chaveNoTarefa,
  organizarPorDia,
} from '../dominio/mapa';
import { progressoDoObjetivo, type Progresso } from '../dominio/progresso';
import type {
  EstadoApp,
  Objetivo,
  PosicaoMapa,
  Tarefa,
} from '../dominio/tipos';

export interface DadosNoObjetivo extends Record<string, unknown> {
  readonly objetivo: Objetivo;
  readonly progresso: Progresso;
}

export interface DadosNoTarefa extends Record<string, unknown> {
  readonly tarefa: Tarefa;
  readonly selecionada: boolean;
  readonly aoSelecionar: (tarefaId: string) => void;
}

export type NoObjetivoFlow = Node<DadosNoObjetivo, 'objetivo'>;
export type NoTarefaFlow = Node<DadosNoTarefa, 'tarefa'>;
export type NoMapa = NoObjetivoFlow | NoTarefaFlow;

export interface EntradaElementosMapa {
  readonly estado: EstadoApp;
  readonly posicoesArrasto: Readonly<Record<string, PosicaoMapa>>;
  readonly tarefaSelecionadaId: string | null;
  readonly aoSelecionarTarefa: (tarefaId: string) => void;
}

export interface ElementosMapa {
  readonly nodes: NoMapa[];
  readonly edges: Edge[];
}

export function construirElementosMapa({
  estado,
  posicoesArrasto,
  tarefaSelecionadaId,
  aoSelecionarTarefa,
}: EntradaElementosMapa): ElementosMapa {
  const posicoesFallback = organizarPorDia({
    objetivos: estado.objetivos,
    tarefas: estado.tarefas,
  });

  const nodes: NoMapa[] = [];
  const edges: Edge[] = [];

  for (const objetivo of estado.objetivos) {
    const chave = chaveNoObjetivo(objetivo.id);
    const tarefasDoObjetivo = estado.tarefas.filter(
      (tarefa) => tarefa.objetivoId === objetivo.id,
    );
    const progresso = progressoDoObjetivo(tarefasDoObjetivo);
    const position =
      posicoesArrasto[chave] ??
      estado.mapa.posicoes[chave] ??
      posicoesFallback[chave] ?? { x: 0, y: 0 };

    nodes.push({
      id: chave,
      type: 'objetivo',
      position,
      initialWidth: 260,
      initialHeight: 118,
      data: {
        objetivo,
        progresso,
      },
    });
  }

  for (const tarefa of estado.tarefas) {
    const chave = chaveNoTarefa(tarefa.id);
    const position =
      posicoesArrasto[chave] ??
      estado.mapa.posicoes[chave] ??
      posicoesFallback[chave] ?? { x: 320, y: 0 };

    const selecionada = tarefa.id === tarefaSelecionadaId;

    nodes.push({
      id: chave,
      type: 'tarefa',
      position,
      selected: selecionada,
      initialWidth: 196,
      initialHeight: 72,
      data: {
        tarefa,
        selecionada,
        aoSelecionar: aoSelecionarTarefa,
      },
    });

    if (tarefa.objetivoId !== null) {
      const origem = chaveNoObjetivo(tarefa.objetivoId);
      edges.push({
        id: `aresta:${origem}->${chave}`,
        source: origem,
        target: chave,
        style: {
          stroke: 'var(--border)',
          strokeWidth: 1.5,
        },
      });
    }
  }

  return { nodes, edges };
}
