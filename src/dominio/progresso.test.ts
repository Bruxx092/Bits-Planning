import { describe, expect, it } from 'vitest';
import { progressoDoObjetivo } from './progresso';
import type { Tarefa } from './tipos';

function criarTarefa(id: string, status: Tarefa['status']): Tarefa {
  return {
    id,
    objetivoId: 'obj-1',
    unidade: 1,
    parte: 1,
    titulo: `Tarefa ${id}`,
    dataPlanejada: '2026-11-24',
    status,
    concluidaEm: status === 'feita' ? '2026-11-24T15:00:00.000Z' : null,
  };
}

describe('progressoDoObjetivo', () => {
  it('calcula 4% arredondado ao concluir 1 de 24 tarefas', () => {
    const tarefas: Tarefa[] = [
      criarTarefa('1', 'feita'),
      ...Array.from({ length: 23 }, (_, i) =>
        criarTarefa(String(i + 2), 'pendente'),
      ),
    ];

    expect(progressoDoObjetivo(tarefas)).toEqual({
      feitos: 1,
      total: 24,
      percentual: 4,
    });
  });

  it('retorna 0% quando não há tarefas', () => {
    expect(progressoDoObjetivo([])).toEqual({
      feitos: 0,
      total: 0,
      percentual: 0,
    });
  });

  it('retorna 100% quando todas as tarefas estão feitas', () => {
    const tarefas = [
      criarTarefa('1', 'feita'),
      criarTarefa('2', 'feita'),
      criarTarefa('3', 'feita'),
    ];

    expect(progressoDoObjetivo(tarefas)).toEqual({
      feitos: 3,
      total: 3,
      percentual: 100,
    });
  });
});
