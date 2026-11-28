import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { ambiente } from '../config/ambiente';
import { formatarDataExibicao, formatarDataLocal } from '../dominio/datas';

function dataDaquiADias(dias: number): string {
  const agora = new Date();
  return formatarDataLocal(
    new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate() + dias,
      12,
    ),
  );
}

describe('Fluxo ponta a ponta no Mapa (T02)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('cria objetivo com 24 tarefas em 12 dias, conclui 1 tarefa em 1 clique (4%) e persiste ao recarregar', async () => {
    const user = userEvent.setup();
    const hoje = dataDaquiADias(0);
    const prazo12Dias = dataDaquiADias(11);

    const { unmount } = render(<App />);

    expect(screen.getByText(/Nenhum objetivo ainda/i)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /Novo objetivo/i }));

    await user.type(
      screen.getByLabelText(/Título do objetivo/i),
      'Fundamentos de Arquitetura',
    );
    const campoQuantidade = screen.getByLabelText(/Quantidade de tarefas/i);
    await user.clear(campoQuantidade);
    await user.type(campoQuantidade, '24');

    const campoPrazo = screen.getByLabelText(/Prazo/i);
    await user.clear(campoPrazo);
    await user.type(campoPrazo, prazo12Dias);

    await user.click(screen.getByRole('button', { name: /Criar objetivo/i }));

    expect(screen.getByText('Fundamentos de Arquitetura')).toBeTruthy();
    expect(screen.getByText('0%')).toBeTruthy();
    expect(screen.getByText('Tarefa 1')).toBeTruthy();
    expect(screen.getByText('Tarefa 24')).toBeTruthy();
    expect(document.querySelectorAll('.react-flow__node')).toHaveLength(25);

    const hojeExibicao = formatarDataExibicao(hoje);
    expect(screen.getAllByText(hojeExibicao)).toHaveLength(2);

    // fireEvent evita mousedown com view=null do user-event que quebra o d3-drag no jsdom
    fireEvent.click(screen.getByRole('button', { name: /Tarefa 1\b/i }));

    const painelTarefa = screen.getByRole('complementary', {
      name: /Detalhes da tarefa/i,
    });
    expect(within(painelTarefa).getByText('Tarefa 1')).toBeTruthy();

    await user.click(
      within(painelTarefa).getByRole('button', { name: /Concluir tarefa/i }),
    );

    expect(screen.getByText('4%')).toBeTruthy();
    expect(screen.getAllByText('Concluída').length).toBeGreaterThanOrEqual(1);

    const salvoBruto = window.localStorage.getItem(ambiente.storageKey);
    expect(salvoBruto).not.toBeNull();
    const salvo = JSON.parse(salvoBruto ?? '{}');
    expect(salvo.versao).toBe(1);
    expect(salvo.objetivos).toHaveLength(1);
    expect(salvo.tarefas).toHaveLength(24);
    expect(salvo.nodes).toBeUndefined();
    expect(salvo.edges).toBeUndefined();
    expect(Object.keys(salvo.mapa.posicoes)).toHaveLength(25);

    unmount();
    render(<App />);

    expect(screen.getByText('Fundamentos de Arquitetura')).toBeTruthy();
    expect(screen.getByText('4%')).toBeTruthy();
    expect(screen.getAllByText('Concluída').length).toBeGreaterThanOrEqual(1);
  });

  it('reorganiza posições personalizadas ao clicar em Organizar por dia', async () => {
    const user = userEvent.setup();
    const hoje = dataDaquiADias(0);

    window.localStorage.setItem(
      ambiente.storageKey,
      JSON.stringify({
        versao: 1,
        objetivos: [
          {
            id: 'obj-1',
            titulo: 'Objetivo de teste',
            nomeUnidade: 'Tarefa',
            primeiraUnidade: 1,
            ultimaUnidade: 1,
            tarefasPorUnidade: 1,
            prazo: hoje,
            diasAtivos: [0, 1, 2, 3, 4, 5, 6],
            status: 'ativo',
            criadoEm: '2026-11-24T12:00:00.000Z',
          },
        ],
        tarefas: [
          {
            id: 'tar-1',
            objetivoId: 'obj-1',
            unidade: 1,
            parte: 1,
            titulo: 'Tarefa 1',
            dataPlanejada: hoje,
            status: 'pendente',
            concluidaEm: null,
          },
        ],
        mapa: {
          posicoes: {
            'obj:obj-1': { x: 999, y: 777 },
            'tar:tar-1': { x: 1200, y: 888 },
          },
        },
        configuracoes: {
          limiteDiarioTarefas: 6,
        },
      }),
    );

    render(<App />);

    await user.click(
      screen.getByRole('button', { name: /Organizar por dia/i }),
    );

    const salvo = JSON.parse(
      window.localStorage.getItem(ambiente.storageKey) ?? '{}',
    );
    expect(salvo.mapa.posicoes).toEqual({
      'obj:obj-1': { x: 0, y: 0 },
      'tar:tar-1': { x: 320, y: 0 },
    });
  });
});
