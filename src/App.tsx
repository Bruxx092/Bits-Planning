import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

function PaginaMapaInicial() {
  return (
    <div className="flex min-h-full flex-col bg-nevoa text-tinta">
      <header className="border-b border-suave/20 bg-papel px-6 py-4">
        <h1 className="text-lg font-bold tracking-tight text-tinta">
          Bits Planning
        </h1>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center p-6">
        <section className="w-full rounded-lg border border-suave/20 bg-papel p-6">
          <p className="text-base font-bold text-tinta">Mapa</p>
          <p className="mt-2 text-sm text-suave">
            Fundação pronta. O Mapa interativo em canvas entra no próximo ticket
            (T02).
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
