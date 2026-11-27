import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renderiza a rota inicial do Mapa com HashRouter', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Bits Planning/i }),
    ).toBeTruthy();
    expect(screen.getByRole('main')).toBeTruthy();
  });

  it('disponibiliza ResizeObserver no ambiente de testes jsdom', () => {
    expect(typeof globalThis.ResizeObserver).toBe('function');

    const observer = new globalThis.ResizeObserver(() => {});
    expect(() => {
      observer.observe(document.body);
      observer.unobserve(document.body);
      observer.disconnect();
    }).not.toThrow();
  });
});
