import { organizarPorDia } from '../dominio/mapa';
import { progressoDoObjetivo } from '../dominio/progresso';
import { gerarTarefas } from '../dominio/tarefas';
import type {
  DataLocal,
  DiaDaSemana,
  EstadoApp,
  Objetivo,
  PosicaoMapa,
} from '../dominio/tipos';

const TODOS_OS_DIAS: readonly DiaDaSemana[] = [0, 1, 2, 3, 4, 5, 6];

export interface PayloadCriarObjetivo {
  readonly idObjetivo: string;
  readonly titulo: string;
  readonly quantidadeTarefas: number;
  readonly prazo: DataLocal;
  readonly hoje: DataLocal;
  readonly criadoEm: string;
  readonly criarIdTarefa?: () => string;
}

export type AcaoApp =
  | {
      readonly type: 'CRIAR_OBJETIVO';
      readonly payload: PayloadCriarObjetivo;
    }
  | {
      readonly type: 'CONCLUIR_TAREFA';
      readonly payload: {
        readonly tarefaId: string;
        readonly concluidaEm: string;
      };
    }
  | {
      readonly type: 'MOVER_NO';
      readonly payload: {
        readonly chaveNo: string;
        readonly posicao: PosicaoMapa;
      };
    }
  | {
      readonly type: 'ORGANIZAR_POR_DIA';
    };

export function estadoReducer(estado: EstadoApp, acao: AcaoApp): EstadoApp {
  switch (acao.type) {
    case 'CRIAR_OBJETIVO': {
      const {
        idObjetivo,
        titulo,
        quantidadeTarefas,
        prazo,
        hoje,
        criadoEm,
        criarIdTarefa,
      } = acao.payload;

      const temTarefas = quantidadeTarefas > 0;
      const novoObjetivo: Objetivo = {
        id: idObjetivo,
        titulo: titulo.trim(),
        nomeUnidade: 'Tarefa',
        primeiraUnidade: temTarefas ? 1 : null,
        ultimaUnidade: temTarefas ? quantidadeTarefas : null,
        tarefasPorUnidade: 1,
        prazo,
        diasAtivos: TODOS_OS_DIAS,
        status: 'ativo',
        criadoEm,
      };

      const tarefasGeradas = gerarTarefas(novoObjetivo, hoje, criarIdTarefa);
      const novosObjetivos = [...estado.objetivos, novoObjetivo];
      const novasTarefas = [...estado.tarefas, ...tarefasGeradas];
      const posicoesOrganizadas = organizarPorDia({
        objetivos: novosObjetivos,
        tarefas: novasTarefas,
      });

      return {
        ...estado,
        objetivos: novosObjetivos,
        tarefas: novasTarefas,
        mapa: {
          posicoes: {
            ...posicoesOrganizadas,
            ...estado.mapa.posicoes,
          },
        },
      };
    }

    case 'CONCLUIR_TAREFA': {
      const { tarefaId, concluidaEm } = acao.payload;
      const tarefaAlvo = estado.tarefas.find(
        (tarefa) => tarefa.id === tarefaId,
      );
      if (!tarefaAlvo || tarefaAlvo.status === 'feita') {
        return estado;
      }

      const novasTarefas = estado.tarefas.map((tarefa) =>
        tarefa.id === tarefaId
          ? {
              ...tarefa,
              status: 'feita' as const,
              concluidaEm,
            }
          : tarefa,
      );

      let novosObjetivos = estado.objetivos;
      if (tarefaAlvo.objetivoId !== null) {
        const tarefasDoObjetivo = novasTarefas.filter(
          (tarefa) => tarefa.objetivoId === tarefaAlvo.objetivoId,
        );
        const progresso = progressoDoObjetivo(tarefasDoObjetivo);
        if (progresso.total > 0 && progresso.feitos === progresso.total) {
          novosObjetivos = estado.objetivos.map((objetivo) =>
            objetivo.id === tarefaAlvo.objetivoId
              ? { ...objetivo, status: 'concluido' as const }
              : objetivo,
          );
        }
      }

      return {
        ...estado,
        objetivos: novosObjetivos,
        tarefas: novasTarefas,
      };
    }

    case 'MOVER_NO': {
      const { chaveNo, posicao } = acao.payload;
      return {
        ...estado,
        mapa: {
          posicoes: {
            ...estado.mapa.posicoes,
            [chaveNo]: posicao,
          },
        },
      };
    }

    case 'ORGANIZAR_POR_DIA': {
      return {
        ...estado,
        mapa: {
          posicoes: organizarPorDia({
            objetivos: estado.objetivos,
            tarefas: estado.tarefas,
          }),
        },
      };
    }
  }
}
