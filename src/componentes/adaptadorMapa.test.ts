import { describe, expect, it } from 'vitest';
import { criarEstadoInicial } from '../dados/armazenamento';
import { estadoReducer } from '../estado/reducer';
import { construirElementosMapa } from './adaptadorMapa';

describe('construirElementosMapa', () => {
  it('deriva 25 nós (1 objetivo + 24 tarefas) e 24 arestas dos dados sem salvar nodes/edges no estado', () => {
    let sequencia = 0;
    const estado = estadoReducer(criarEstadoInicial(), {
      type: 'CRIAR_OBJETIVO',
      payload: {
        idObjetivo: 'obj-1',
        titulo: 'Fundamentos de Arquitetura',
        quantidadeTarefas: 24,
        prazo: '2026-12-05',
        hoje: '2026-11-24',
        criadoEm: '2026-11-24T12:00:00.000Z',
        criarIdTarefa: () => `tar-${++sequencia}`,
      },
    });

    const { nodes, edges } = construirElementosMapa({
      estado,
      posicoesArrasto: {},
      tarefaSelecionadaId: null,
      aoSelecionarTarefa: () => {},
    });

    expect(nodes).toHaveLength(25);
    expect(edges).toHaveLength(24);
    expect(nodes[0]?.id).toBe('obj:obj-1');
    expect(edges[0]).toMatchObject({
      source: 'obj:obj-1',
      target: 'tar:tar-1',
    });
    expect(edges[23]).toMatchObject({
      source: 'obj:obj-1',
      target: 'tar:tar-24',
    });
  });
});
