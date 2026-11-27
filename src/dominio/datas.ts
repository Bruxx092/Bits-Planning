import type { DataLocal } from './tipos';

export function formatarDataLocal(data: Date): DataLocal {
  const ano = String(data.getFullYear()).padStart(4, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function listarDatasNoIntervalo(
  inicio: DataLocal,
  fim: DataLocal,
): DataLocal[] {
  if (inicio > fim) {
    return [];
  }

  const [ano, mes, dia] = inicio.split('-').map(Number);
  const datas: DataLocal[] = [];

  for (let deslocamento = 0; ; deslocamento += 1) {
    const atual = formatarDataLocal(
      new Date(ano, mes - 1, dia + deslocamento, 12),
    );
    if (atual > fim) {
      break;
    }
    datas.push(atual);
  }

  return datas;
}

export function formatarDataExibicao(data: DataLocal): string {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}
