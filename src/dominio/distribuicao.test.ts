import { describe, expect, it } from 'vitest';
import { distribuirTarefas } from './distribuicao';

describe('distribuirTarefas (T02)', () => {
  it('distribui 24 tarefas uniformemente em 12 dias (2 por dia)', () => {
    const resultado = distribuirTarefas({
      tarefasRestantes: 24,
      dataInicio: '2026-11-24',
      prazo: '2026-12-05',
      diasAtivos: [0, 1, 2, 3, 4, 5, 6],
    });

    expect(resultado).toHaveLength(12);
    expect(resultado[0]).toEqual({ data: '2026-11-24', quantidade: 2 });
    expect(resultado[11]).toEqual({ data: '2026-12-05', quantidade: 2 });
    expect(resultado.every((dia) => dia.quantidade === 2)).toBe(true);
  });

  it('retorna lista vazia quando não há tarefas restantes', () => {
    expect(
      distribuirTarefas({
        tarefasRestantes: 0,
        dataInicio: '2026-11-24',
        prazo: '2026-12-05',
        diasAtivos: [0, 1, 2, 3, 4, 5, 6],
      }),
    ).toEqual([]);
  });

  it('lança PRAZO_INVALIDO quando o prazo é anterior à data de início', () => {
    expect(() =>
      distribuirTarefas({
        tarefasRestantes: 6,
        dataInicio: '2026-11-24',
        prazo: '2026-11-23',
        diasAtivos: [0, 1, 2, 3, 4, 5, 6],
      }),
    ).toThrow('PRAZO_INVALIDO');
  });

  it('mantém o total exato de tarefas mesmo quando a divisão não é exata', () => {
    const resultado = distribuirTarefas({
      tarefasRestantes: 5,
      dataInicio: '2026-11-24',
      prazo: '2026-11-25',
      diasAtivos: [0, 1, 2, 3, 4, 5, 6],
    });

    const totalAlocado = resultado.reduce(
      (soma, item) => soma + item.quantidade,
      0,
    );
    expect(totalAlocado).toBe(5);
  });
});
