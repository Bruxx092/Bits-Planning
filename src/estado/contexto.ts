import { createContext, useContext } from 'react';
import type { DataLocal, EstadoApp, PosicaoMapa } from '../dominio/tipos';

export interface EntradaCriarObjetivo {
  readonly titulo: string;
  readonly quantidadeTarefas: number;
  readonly prazo: DataLocal;
}

export interface ValorAppContext {
  readonly estado: EstadoApp;
  readonly criarObjetivo: (entrada: EntradaCriarObjetivo) => void;
  readonly concluirTarefa: (tarefaId: string) => void;
  readonly moverNo: (chaveNo: string, posicao: PosicaoMapa) => void;
  readonly organizarMapaPorDia: () => void;
}

export const AppContext = createContext<ValorAppContext | null>(null);

export function useAppEstado(): ValorAppContext {
  const contexto = useContext(AppContext);
  if (!contexto) {
    throw new Error('useAppEstado deve ser usado dentro de <AppProvider>.');
  }

  return contexto;
}
