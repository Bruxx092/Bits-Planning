/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORAGE_KEY?: string;
  readonly VITE_LIMITE_DIARIO_TAREFAS_PADRAO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
