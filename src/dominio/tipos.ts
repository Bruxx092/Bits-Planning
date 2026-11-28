export type DataLocal = string; // 'YYYY-MM-DD' em horário local

export type DiaDaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo ... 6 = sábado

export interface PosicaoMapa {
  readonly x: number;
  readonly y: number;
}

export type StatusObjetivo = 'ativo' | 'pausado' | 'concluido';

export interface Objetivo {
  readonly id: string;
  readonly titulo: string;
  readonly nomeUnidade: string | null;
  readonly primeiraUnidade: number | null;
  readonly ultimaUnidade: number | null;
  readonly tarefasPorUnidade: number;
  readonly prazo: DataLocal;
  readonly diasAtivos: readonly DiaDaSemana[];
  readonly status: StatusObjetivo;
  readonly criadoEm: string;
}

export type StatusTarefa = 'pendente' | 'feita';

export interface Tarefa {
  readonly id: string;
  readonly objetivoId: string | null;
  readonly unidade: number | null;
  readonly parte: number | null;
  readonly titulo: string;
  readonly dataPlanejada: DataLocal | null;
  readonly status: StatusTarefa;
  readonly concluidaEm: string | null;
}

export interface Configuracoes {
  readonly limiteDiarioTarefas: number;
}

export interface MapaEstado {
  readonly posicoes: Readonly<Record<string, PosicaoMapa>>;
}

export interface EstadoApp {
  readonly versao: 1;
  readonly objetivos: readonly Objetivo[];
  readonly tarefas: readonly Tarefa[];
  readonly mapa: MapaEstado;
  readonly configuracoes: Configuracoes;
}
