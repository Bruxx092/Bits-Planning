import type { Objetivo, PosicaoMapa, Tarefa } from './tipos';

const X_OBJETIVO = 0;
const X_PRIMEIRA_COLUNA_TAREFAS = 320;
const LARGURA_COLUNA_TAREFAS = 220;
const ALTURA_LINHA_TAREFA = 90;
const ESPACAMENTO_FAIXAS = 60;

export function chaveNoObjetivo(id: string): string {
  return `obj:${id}`;
}

export function chaveNoTarefa(id: string): string {
  return `tar:${id}`;
}

export interface EntradaOrganizarPorDia {
  readonly objetivos: readonly Objetivo[];
  readonly tarefas: readonly Tarefa[];
}

function posicionarTarefasNaFaixa(
  tarefas: readonly Tarefa[],
  faixaY: number,
  posicoes: Record<string, PosicaoMapa>,
): number {
  const porData = new Map<string, Tarefa[]>();
  const semData: Tarefa[] = [];

  for (const tarefa of tarefas) {
    if (tarefa.dataPlanejada === null) {
      semData.push(tarefa);
      continue;
    }

    const lista = porData.get(tarefa.dataPlanejada) ?? [];
    lista.push(tarefa);
    porData.set(tarefa.dataPlanejada, lista);
  }

  const datasOrdenadas = [...porData.keys()].sort();
  const colunas: Tarefa[][] = datasOrdenadas.map(
    (data) => porData.get(data) ?? [],
  );
  if (semData.length > 0) {
    colunas.push(semData);
  }

  let maiorColuna = 0;
  colunas.forEach((coluna, indiceColuna) => {
    maiorColuna = Math.max(maiorColuna, coluna.length);
    const x = X_PRIMEIRA_COLUNA_TAREFAS + LARGURA_COLUNA_TAREFAS * indiceColuna;

    coluna.forEach((tarefa, indiceLinha) => {
      posicoes[chaveNoTarefa(tarefa.id)] = {
        x,
        y: faixaY + ALTURA_LINHA_TAREFA * indiceLinha,
      };
    });
  });

  return maiorColuna;
}

export function organizarPorDia({
  objetivos,
  tarefas,
}: EntradaOrganizarPorDia): Record<string, PosicaoMapa> {
  const posicoes: Record<string, PosicaoMapa> = {};
  const idsObjetivos = new Set(objetivos.map((objetivo) => objetivo.id));
  let faixaY = 0;

  for (const objetivo of objetivos) {
    posicoes[chaveNoObjetivo(objetivo.id)] = { x: X_OBJETIVO, y: faixaY };

    const tarefasDoObjetivo = tarefas.filter(
      (tarefa) => tarefa.objetivoId === objetivo.id,
    );
    const maiorColuna = posicionarTarefasNaFaixa(
      tarefasDoObjetivo,
      faixaY,
      posicoes,
    );

    faixaY += ALTURA_LINHA_TAREFA * Math.max(1, maiorColuna) + ESPACAMENTO_FAIXAS;
  }

  const tarefasSoltas = tarefas.filter(
    (tarefa) =>
      tarefa.objetivoId === null || !idsObjetivos.has(tarefa.objetivoId),
  );
  if (tarefasSoltas.length > 0) {
    posicionarTarefasNaFaixa(tarefasSoltas, faixaY, posicoes);
  }

  return posicoes;
}
