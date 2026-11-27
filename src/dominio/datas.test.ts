import { describe, expect, it } from 'vitest';
import {
  formatarDataExibicao,
  formatarDataLocal,
  listarDatasNoIntervalo,
} from './datas';

describe('datas locais', () => {
  it('formata uma data local como YYYY-MM-DD com zeros à esquerda', () => {
    const data = new Date(2026, 0, 5, 9, 15);
    expect(formatarDataLocal(data)).toBe('2026-01-05');
  });

  it('mantém o dia local mesmo após as 21h (evita virada de dia em UTC)', () => {
    const dataNoite = new Date(2026, 10, 24, 23, 30);
    expect(formatarDataLocal(dataNoite)).toBe('2026-11-24');
  });

  it('lista todas as datas no intervalo inclusivo atravessando virada de mês', () => {
    expect(listarDatasNoIntervalo('2026-11-29', '2026-12-02')).toEqual([
      '2026-11-29',
      '2026-11-30',
      '2026-12-01',
      '2026-12-02',
    ]);
  });

  it('retorna um único dia quando início e fim são iguais', () => {
    expect(listarDatasNoIntervalo('2026-11-24', '2026-11-24')).toEqual([
      '2026-11-24',
    ]);
  });

  it('retorna lista vazia quando o fim é anterior ao início', () => {
    expect(listarDatasNoIntervalo('2026-11-25', '2026-11-24')).toEqual([]);
  });

  it('formata DataLocal para exibição brasileira DD/MM/YYYY', () => {
    expect(formatarDataExibicao('2026-11-24')).toBe('24/11/2026');
    expect(formatarDataExibicao('2026-01-05')).toBe('05/01/2026');
  });
});
