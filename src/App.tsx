import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './estado/AppContext';
import { Mapa } from './paginas/Mapa';

export function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Mapa />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
