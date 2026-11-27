import { listarDatasNoIntervalo } from './datas';
import type { DataLocal, DiaDaSemana } from './tipos';

export interface ParametrosDistribuicao {
  readonly tarefasRestantes: number;
  readonly dataInicio: DataLocal;
  readonly prazo: DataLocal;
  readonly diasAtivos?: readonly DiaDaSemana[];
}

export interface DistribuicaoDia {
  readonly data: DataLocal;
  readonly quantidade: number;
}

export function distribuirTarefas({
  tarefasRestantes,
  dataInicio,
  prazo,
}: ParametrosDistribuicao): DistribuicaoDia[] {
  if (prazo < dataInicio) {
    throw new Error('PRAZO_INVALIDO');
  }

  if (tarefasRestantes <= 0) {
    return [];
  }

  const datas = listarDatasNoIntervalo(dataInicio, prazo);
  const base = Math.floor(tarefasRestantes / datas.length);
  const resto = tarefasRestantes % datas.length;

  return datas
    .map((data, indice) => ({
      data,
      quantidade: indice === datas.length - 1 ? base + resto : base,
    }))
    .filter((item) => item.quantidade > 0);
}
