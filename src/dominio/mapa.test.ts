import { describe, expect, it } from 'vitest';
import {
  chaveNoObjetivo,
  chaveNoTarefa,
  organizarPorDia,
} from './mapa';
import type { Objetivo, Tarefa } from './tipos';

function criarObjetivo(id: string, titulo: string): Objetivo {
  return {
    id,
    titulo,
    nomeUnidade: 'Tarefa',
    primeiraUnidade: 1,
    ultimaUnidade: 1,
    tarefasPorUnidade: 1,
    prazo: '2026-11-30',
    diasAtivos: [0, 1, 2, 3, 4, 5, 6],
    status: 'ativo',
    criadoEm: '2026-11-24T12:00:00.000Z',
  };
}

function criarTarefa(
  id: string,
  objetivoId: string | null,
  dataPlanejada: string | null,
): Tarefa {
  return {
    id,
    objetivoId,
    unidade: null,
    parte: null,
    titulo: `Tarefa ${id}`,
    dataPlanejada,
    status: 'pendente',
    concluidaEm: null,
  };
}

describe('organizarPorDia', () => {
  it('posiciona objetivos A e B e suas tarefas nas coordenadas exatas do contrato', () => {
    const objetivos = [criarObjetivo('A', 'Objetivo A'), criarObjetivo('B', 'Objetivo B')];
    const tarefas = [
      criarTarefa('a1', 'A', '2026-11-24'),
      criarTarefa('a2', 'A', '2026-11-24'),
      criarTarefa('a3', 'A', '2026-11-25'),
      criarTarefa('b1', 'B', '2026-11-24'),
    ];

    const posicoes = organizarPorDia({ objetivos, tarefas });

    expect(posicoes).toEqual({
      [chaveNoObjetivo('A')]: { x: 0, y: 0 },
      [chaveNoTarefa('a1')]: { x: 320, y: 0 },
      [chaveNoTarefa('a2')]: { x: 320, y: 90 },
      [chaveNoTarefa('a3')]: { x: 540, y: 0 },
      [chaveNoObjetivo('B')]: { x: 0, y: 240 },
      [chaveNoTarefa('b1')]: { x: 320, y: 240 },
    });
    expect(chaveNoObjetivo('A')).toBe('obj:A');
    expect(chaveNoTarefa('a1')).toBe('tar:a1');
  });

  it('ordena colunas cronologicamente mesmo com tarefas fora de ordem e coloca sem data na última coluna', () => {
    const objetivos = [criarObjetivo('A', 'Objetivo A')];
    const tarefas = [
      criarTarefa('sem-data', 'A', null),
      criarTarefa('dia-25', 'A', '2026-11-25'),
      criarTarefa('dia-24', 'A', '2026-11-24'),
    ];

    const posicoes = organizarPorDia({ objetivos, tarefas });

    expect(posicoes['tar:dia-24']).toEqual({ x: 320, y: 0 });
    expect(posicoes['tar:dia-25']).toEqual({ x: 540, y: 0 });
    expect(posicoes['tar:sem-data']).toEqual({ x: 760, y: 0 });
  });

  it('reserva altura mínima para objetivo sem tarefas e posiciona tarefas soltas em faixa própria no fim', () => {
    const objetivos = [criarObjetivo('vazio', 'Sem tarefas')];
    const tarefas = [
      criarTarefa('solta-1', null, null),
      criarTarefa('solta-2', null, null),
    ];

    const posicoes = organizarPorDia({ objetivos, tarefas });

    expect(posicoes['obj:vazio']).toEqual({ x: 0, y: 0 });
    expect(posicoes['tar:solta-1']).toEqual({ x: 320, y: 150 });
    expect(posicoes['tar:solta-2']).toEqual({ x: 320, y: 240 });
  });
});
