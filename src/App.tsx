import { Map } from 'lucide-react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

function PaginaMapaInicial() {
  return (
    <div className="flex min-h-full flex-col bg-canvas text-text">
      <header className="border-b-[length:var(--hairline)] border-border bg-surface px-6 py-4">
        <h1 className="text-base font-semibold tracking-[-0.015em] text-text">
          Bits Planning
        </h1>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center p-6">
        <section className="w-full rounded-card border-[length:var(--hairline)] border-border bg-surface p-6">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-fill-subtle text-text-2"
              aria-hidden="true"
            >
              <Map size={16} strokeWidth={1.5} />
            </span>
            <h2 className="text-base font-semibold tracking-[-0.015em] text-text">
              Mapa
            </h2>
          </div>
          <p className="mt-3 text-sm text-text-2">
            Fundação pronta com os novos tokens visuais. O Mapa interativo em
            canvas entra no próximo ticket (T02).
          </p>
        </section>
      </main>
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PaginaMapaInicial />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
