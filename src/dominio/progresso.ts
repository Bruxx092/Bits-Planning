import type { Tarefa } from './tipos';

export interface Progresso {
  readonly feitos: number;
  readonly total: number;
  readonly percentual: number;
}

export function progressoDoObjetivo(tarefas: readonly Tarefa[]): Progresso {
  const total = tarefas.length;
  const feitos = tarefas.filter((tarefa) => tarefa.status === 'feita').length;
  const percentual = total === 0 ? 0 : Math.round((feitos / total) * 100);

  return {
    feitos,
    total,
    percentual,
  };
}
