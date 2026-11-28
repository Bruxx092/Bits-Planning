import { beforeEach, describe, expect, it } from 'vitest';
import { ambiente } from '../config/ambiente';
import type { EstadoApp } from '../dominio/tipos';
import {
  carregarEstado,
  criarEstadoInicial,
  salvarEstado,
} from './armazenamento';

describe('armazenamento (localStorage)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('retorna estado inicial seguro com versao 1 quando não há dados salvos', () => {
    const estado = carregarEstado();

    expect(estado).toEqual({
      versao: 1,
      objetivos: [],
      tarefas: [],
      mapa: { posicoes: {} },
      configuracoes: {
        limiteDiarioTarefas: ambiente.limiteDiarioTarefasPadrao,
      },
    });
  });

  it('salva e recarrega estado com versao 1 usando ambiente.storageKey', () => {
    const estadoSalvo: EstadoApp = {
      ...criarEstadoInicial(),
      objetivos: [
        {
          id: 'obj-1',
          titulo: 'Aprender TypeScript',
          nomeUnidade: 'Tarefa',
          primeiraUnidade: 1,
          ultimaUnidade: 2,
          tarefasPorUnidade: 1,
          prazo: '2026-11-30',
          diasAtivos: [0, 1, 2, 3, 4, 5, 6],
          status: 'ativo',
          criadoEm: '2026-11-24T12:00:00.000Z',
        },
      ],
      mapa: {
        posicoes: {
          'obj:obj-1': { x: 120, y: 45 },
        },
      },
    };

    const salvou = salvarEstado(estadoSalvo);
    expect(salvou).toBe(true);

    const bruto = window.localStorage.getItem(ambiente.storageKey);
    expect(bruto).not.toBeNull();
    expect(JSON.parse(bruto ?? '{}').versao).toBe(1);
    expect(carregarEstado()).toEqual(estadoSalvo);
  });

  it('cai para estado inicial seguro quando o JSON salvo está corrompido ou incompatível', () => {
    window.localStorage.setItem(ambiente.storageKey, '{json-quebrado');
    expect(carregarEstado()).toEqual(criarEstadoInicial());

    window.localStorage.setItem(
      ambiente.storageKey,
      JSON.stringify({ versao: 999, inesperado: true }),
    );
    expect(carregarEstado()).toEqual(criarEstadoInicial());
  });

  it('protege leitura e escrita contra falhas do storage sem lançar exceção', () => {
    const storageComErro = {
      getItem: () => {
        throw new Error('Modo privado bloqueado');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };

    expect(carregarEstado('chave-teste', storageComErro)).toEqual(
      criarEstadoInicial(),
    );
    expect(
      salvarEstado(criarEstadoInicial(), 'chave-teste', storageComErro),
    ).toBe(false);
  });
});
