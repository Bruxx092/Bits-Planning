import { describe, expect, it } from 'vitest';
import { carregarAmbiente } from './ambiente';

describe('carregarAmbiente', () => {
  it('aplica padrões seguros quando variáveis são omitidas', () => {
    expect(carregarAmbiente({})).toEqual({
      storageKey: 'bits-planning',
      limiteDiarioTarefasPadrao: 6,
    });
  });

  it('usa valores válidos informados no ambiente e remove espaços extras', () => {
    expect(
      carregarAmbiente({
        VITE_STORAGE_KEY: '  bits-planning-dev  ',
        VITE_LIMITE_DIARIO_TAREFAS_PADRAO: '10',
      }),
    ).toEqual({
      storageKey: 'bits-planning-dev',
      limiteDiarioTarefasPadrao: 10,
    });
  });

  it('lança erro claro quando VITE_STORAGE_KEY está vazia ou só com espaços', () => {
    expect(() => carregarAmbiente({ VITE_STORAGE_KEY: '' })).toThrow(
      /VITE_STORAGE_KEY/,
    );
    expect(() => carregarAmbiente({ VITE_STORAGE_KEY: '   ' })).toThrow(
      /VITE_STORAGE_KEY/,
    );
  });

  it.each(['', '   ', '0', '-3', '2.5', 'seis'])(
    'lança erro claro quando VITE_LIMITE_DIARIO_TAREFAS_PADRAO é inválido (%j)',
    (valorInvalido) => {
      expect(() =>
        carregarAmbiente({
          VITE_LIMITE_DIARIO_TAREFAS_PADRAO: valorInvalido,
        }),
      ).toThrow(/VITE_LIMITE_DIARIO_TAREFAS_PADRAO/);
    },
  );
});
