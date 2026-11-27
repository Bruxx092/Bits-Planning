import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { ReactNode } from 'react';
import { carregarEstado, salvarEstado } from '../dados/armazenamento';
import { formatarDataLocal } from '../dominio/datas';
import type { PosicaoMapa } from '../dominio/tipos';
import { AppContext, type EntradaCriarObjetivo } from './contexto';
import { estadoReducer } from './reducer';

export function AppProvider({ children }: { readonly children: ReactNode }) {
  const [estado, dispatch] = useReducer(estadoReducer, undefined, () =>
    carregarEstado(),
  );
  const estadoAnteriorRef = useRef(estado);

  useEffect(() => {
    if (estadoAnteriorRef.current === estado) {
      return;
    }

    estadoAnteriorRef.current = estado;
    salvarEstado(estado);
  }, [estado]);

  const criarObjetivo = useCallback((entrada: EntradaCriarObjetivo) => {
    const agora = new Date();
    dispatch({
      type: 'CRIAR_OBJETIVO',
      payload: {
        idObjetivo: crypto.randomUUID(),
        titulo: entrada.titulo,
        quantidadeTarefas: entrada.quantidadeTarefas,
        prazo: entrada.prazo,
        hoje: formatarDataLocal(agora),
        criadoEm: agora.toISOString(),
      },
    });
  }, []);

  const concluirTarefa = useCallback((tarefaId: string) => {
    dispatch({
      type: 'CONCLUIR_TAREFA',
      payload: {
        tarefaId,
        concluidaEm: new Date().toISOString(),
      },
    });
  }, []);

  const moverNo = useCallback((chaveNo: string, posicao: PosicaoMapa) => {
    dispatch({
      type: 'MOVER_NO',
      payload: {
        chaveNo,
        posicao,
      },
    });
  }, []);

  const organizarMapaPorDia = useCallback(() => {
    dispatch({ type: 'ORGANIZAR_POR_DIA' });
  }, []);

  const valor = useMemo(
    () => ({
      estado,
      criarObjetivo,
      concluirTarefa,
      moverNo,
      organizarMapaPorDia,
    }),
    [estado, criarObjetivo, concluirTarefa, moverNo, organizarMapaPorDia],
  );

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}
