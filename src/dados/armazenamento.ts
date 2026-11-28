import { ambiente } from '../config/ambiente';
import type {
  EstadoApp,
  Objetivo,
  PosicaoMapa,
  Tarefa,
} from '../dominio/tipos';

type StorageLeitura = Pick<Storage, 'getItem'>;
type StorageEscrita = Pick<Storage, 'setItem'>;

export function criarEstadoInicial(
  limiteDiarioTarefas: number = ambiente.limiteDiarioTarefasPadrao,
): EstadoApp {
  return {
    versao: 1,
    objetivos: [],
    tarefas: [],
    mapa: { posicoes: {} },
    configuracoes: {
      limiteDiarioTarefas,
    },
  };
}

function sanitizarPosicoes(bruto: unknown): Record<string, PosicaoMapa> {
  if (typeof bruto !== 'object' || bruto === null || Array.isArray(bruto)) {
    return {};
  }

  const posicoes: Record<string, PosicaoMapa> = {};
  for (const [chave, valor] of Object.entries(bruto)) {
    if (
      typeof valor === 'object' &&
      valor !== null &&
      typeof (valor as { x?: unknown }).x === 'number' &&
      Number.isFinite((valor as { x: number }).x) &&
      typeof (valor as { y?: unknown }).y === 'number' &&
      Number.isFinite((valor as { y: number }).y)
    ) {
      posicoes[chave] = {
        x: (valor as { x: number }).x,
        y: (valor as { y: number }).y,
      };
    }
  }

  return posicoes;
}

export function migrarEstado(bruto: unknown, fallback: EstadoApp): EstadoApp {
  if (typeof bruto !== 'object' || bruto === null) {
    return fallback;
  }

  const dados = bruto as Record<string, unknown>;
  if (
    dados.versao !== 1 ||
    !Array.isArray(dados.objetivos) ||
    !Array.isArray(dados.tarefas)
  ) {
    return fallback;
  }

  const mapaBruto =
    typeof dados.mapa === 'object' && dados.mapa !== null
      ? (dados.mapa as Record<string, unknown>)
      : {};

  const configBruta =
    typeof dados.configuracoes === 'object' && dados.configuracoes !== null
      ? (dados.configuracoes as Record<string, unknown>)
      : {};

  const limiteSalvo = configBruta.limiteDiarioTarefas;
  const limiteDiarioTarefas =
    typeof limiteSalvo === 'number' &&
    Number.isSafeInteger(limiteSalvo) &&
    limiteSalvo >= 1
      ? limiteSalvo
      : fallback.configuracoes.limiteDiarioTarefas;

  return {
    versao: 1,
    objetivos: dados.objetivos as Objetivo[],
    tarefas: dados.tarefas as Tarefa[],
    mapa: {
      posicoes: sanitizarPosicoes(mapaBruto.posicoes),
    },
    configuracoes: {
      limiteDiarioTarefas,
    },
  };
}

export function carregarEstado(
  chave: string = ambiente.storageKey,
  storage?: StorageLeitura,
): EstadoApp {
  const fallback = criarEstadoInicial();

  try {
    const alvo = storage ?? globalThis.localStorage;
    if (!alvo) {
      return fallback;
    }

    const texto = alvo.getItem(chave);
    if (texto === null) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(texto);
    return migrarEstado(parsed, fallback);
  } catch {
    return fallback;
  }
}

export function salvarEstado(
  estado: EstadoApp,
  chave: string = ambiente.storageKey,
  storage?: StorageEscrita,
): boolean {
  try {
    const alvo = storage ?? globalThis.localStorage;
    if (!alvo) {
      return false;
    }

    alvo.setItem(chave, JSON.stringify(estado));
    return true;
  } catch {
    return false;
  }
}
