import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import EconeuraCockpit from '../EconeuraCockpit';

global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 'mock-token', user: { name: 'Test User' } }) })) as any;

beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); });
afterEach(() => { vi.restoreAllMocks(); });

test.skip('full interaction flows: change dept, filter, open org chart and run agents', async () => {
  render(<BrowserRouter><EconeuraCockpit /></BrowserRouter>);
  
  // Verificar que el cockpit se renderiza correctamente
  expect(screen.getByPlaceholderText('Buscar agentes... (Ctrl+K)')).toBeInTheDocument();
  
  // Cambiar departamento
  const deptButtons = Array.from(document.querySelectorAll('aside button'));
  fireEvent.click(deptButtons[1]);
  await waitFor(() => expect(screen.getByText('Plataforma IA')).toBeInTheDocument());
  
  // Filtrar agentes
  const searchInput = screen.getByPlaceholderText('Buscar agentes... (Ctrl+K)');
  fireEvent.change(searchInput, { target: { value: 'ejecutivo' } });
  expect(screen.getAllByText('Ejecutivo (CEO)')).toHaveLength(6);
  expect(screen.getByText('Marketing y Ventas (CMO/CRO)')).toBeInTheDocument();
  
  // Abrir organigrama
  const orgChartButton = screen.getByText('Organigrama');
  fireEvent.click(orgChartButton);
  await waitFor(() => expect(screen.getAllByText('Ejecutivo (CEO)')).toHaveLength(6));
  
  // Ejecutar agente
  const agentBtns = screen.getAllByText('Ejecutivo (CEO)'); const agentBtn = agentBtns[0];
  fireEvent.click(agentBtn);
  await waitFor(() => expect(screen.getByText('NEURA-CEO')).toBeInTheDocument());
  
  // Abrir chat
  const chatBtn = screen.getByText('Abrir chat');
  fireEvent.click(chatBtn);
  await waitFor(() => expect(screen.getByPlaceholderText('Escribe tu mensaje...')).toBeInTheDocument());
});
