import { distribuirTarefas } from './distribuicao';
import type { DataLocal, Objetivo, Tarefa } from './tipos';

export function gerarTarefas(
  objetivo: Objetivo,
  dataInicio: DataLocal,
  criarId: () => string = () => crypto.randomUUID(),
): Tarefa[] {
  if (
    objetivo.primeiraUnidade === null ||
    objetivo.ultimaUnidade === null ||
    objetivo.ultimaUnidade < objetivo.primeiraUnidade
  ) {
    return [];
  }

  const unidades = objetivo.ultimaUnidade - objetivo.primeiraUnidade + 1;
  const totalTarefas = unidades * objetivo.tarefasPorUnidade;

  const distribuicao = distribuirTarefas({
    tarefasRestantes: totalTarefas,
    dataInicio,
    prazo: objetivo.prazo,
    diasAtivos: objetivo.diasAtivos,
  });

  const datasExpandidas: DataLocal[] = [];
  for (const item of distribuicao) {
    for (let i = 0; i < item.quantidade; i += 1) {
      datasExpandidas.push(item.data);
    }
  }

  const prefixo = objetivo.nomeUnidade ?? 'Tarefa';
  const tarefas: Tarefa[] = [];
  let indiceData = 0;

  for (
    let unidade = objetivo.primeiraUnidade;
    unidade <= objetivo.ultimaUnidade;
    unidade += 1
  ) {
    for (let parte = 1; parte <= objetivo.tarefasPorUnidade; parte += 1) {
      const titulo =
        objetivo.tarefasPorUnidade > 1
          ? `${prefixo} ${unidade} (parte ${parte}/${objetivo.tarefasPorUnidade})`
          : `${prefixo} ${unidade}`;

      tarefas.push({
        id: criarId(),
        objetivoId: objetivo.id,
        unidade,
        parte,
        titulo,
        dataPlanejada: datasExpandidas[indiceData] ?? null,
        status: 'pendente',
        concluidaEm: null,
      });

      indiceData += 1;
    }
  }

  return tarefas;
}
