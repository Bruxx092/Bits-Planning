import { describe, expect, it } from 'vitest';
import { gerarTarefas } from './tarefas';
import type { Objetivo } from './tipos';

function criarObjetivoBase(sobrescritas: Partial<Objetivo> = {}): Objetivo {
  return {
    id: 'obj-1',
    titulo: 'Ler livro de arquitetura',
    nomeUnidade: 'Tarefa',
    primeiraUnidade: 1,
    ultimaUnidade: 24,
    tarefasPorUnidade: 1,
    prazo: '2026-12-05',
    diasAtivos: [0, 1, 2, 3, 4, 5, 6],
    status: 'ativo',
    criadoEm: '2026-11-24T12:00:00.000Z',
    ...sobrescritas,
  };
}

describe('gerarTarefas', () => {
  it('gera 24 tarefas numeradas de Tarefa 1 a Tarefa 24 com 2 tarefas no dia inicial', () => {
    let sequencia = 0;
    const tarefas = gerarTarefas(
      criarObjetivoBase(),
      '2026-11-24',
      () => `tar-${++sequencia}`,
    );

    expect(tarefas).toHaveLength(24);
    expect(tarefas[0]).toEqual({
      id: 'tar-1',
      objetivoId: 'obj-1',
      unidade: 1,
      parte: 1,
      titulo: 'Tarefa 1',
      dataPlanejada: '2026-11-24',
      status: 'pendente',
      concluidaEm: null,
    });
    expect(tarefas[23]).toEqual({
      id: 'tar-24',
      objetivoId: 'obj-1',
      unidade: 24,
      parte: 1,
      titulo: 'Tarefa 24',
      dataPlanejada: '2026-12-05',
      status: 'pendente',
      concluidaEm: null,
    });

    const tarefasDeHoje = tarefas.filter(
      (tarefa) => tarefa.dataPlanejada === '2026-11-24',
    );
    expect(tarefasDeHoje).toHaveLength(2);
  });

  it('retorna lista vazia quando o objetivo não tem intervalo de unidades', () => {
    const tarefas = gerarTarefas(
      criarObjetivoBase({ primeiraUnidade: null, ultimaUnidade: null }),
      '2026-11-24',
      () => 'tar-x',
    );

    expect(tarefas).toEqual([]);
  });
});
