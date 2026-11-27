export interface EnvEntrada {
  readonly VITE_STORAGE_KEY?: string;
  readonly VITE_LIMITE_DIARIO_TAREFAS_PADRAO?: string;
}

export interface Ambiente {
  readonly storageKey: string;
  readonly limiteDiarioTarefasPadrao: number;
}

function lerStringNaoVazia(
  nome: string,
  valorBruto: string | undefined,
  padrao: string,
): string {
  if (valorBruto === undefined) {
    return padrao;
  }

  const valor = valorBruto.trim();
  if (valor.length === 0) {
    throw new Error(
      `Variável de ambiente ${nome} inválida: informe um texto não vazio.`,
    );
  }

  return valor;
}

function lerInteiroMinimo(
  nome: string,
  valorBruto: string | undefined,
  padrao: number,
  minimo: number,
): number {
  if (valorBruto === undefined) {
    return padrao;
  }

  const texto = valorBruto.trim();
  const numero = /^\d+$/.test(texto) ? Number(texto) : Number.NaN;
  if (!Number.isSafeInteger(numero) || numero < minimo) {
    throw new Error(
      `Variável de ambiente ${nome} inválida ("${valorBruto}"): informe um inteiro maior ou igual a ${minimo}.`,
    );
  }

  return numero;
}

export function carregarAmbiente(env: EnvEntrada): Ambiente {
  const storageKey = lerStringNaoVazia(
    'VITE_STORAGE_KEY',
    env.VITE_STORAGE_KEY,
    'bits-planning',
  );

  const limiteDiarioTarefasPadrao = lerInteiroMinimo(
    'VITE_LIMITE_DIARIO_TAREFAS_PADRAO',
    env.VITE_LIMITE_DIARIO_TAREFAS_PADRAO,
    6,
    1,
  );

  return {
    storageKey,
    limiteDiarioTarefasPadrao,
  };
}

export const ambiente: Ambiente = carregarAmbiente(import.meta.env);
