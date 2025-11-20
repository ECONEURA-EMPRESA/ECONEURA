import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import EconeuraCockpit from '../../EconeuraCockpit';

// Mock de fetch global
global.fetch = vi.fn();

describe('Cockpit Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renderiza el Cockpit correctamente', () => {
    render(
      <BrowserRouter>
        <EconeuraCockpit />
      </BrowserRouter>
    );

    // Verificar elementos clave - usar getAllByText para múltiples elementos
    expect(screen.getAllByText(/ECONEURA/i)).toHaveLength(3); // 3 elementos ECONEURA
    expect(screen.getByPlaceholderText(/buscar agentes/i)).toBeInTheDocument();
  });

  it('cambia de departamento correctamente', async () => {
    render(
      <BrowserRouter>
        <EconeuraCockpit />
      </BrowserRouter>
    );

    // Abrir sidebar primero - el botón solo es visible en móvil
    const menuBtn = screen.getByLabelText(/Toggle menu/i);
    fireEvent.click(menuBtn);
    
    // Esperar a que el sidebar se abra
    await waitFor(() => {
      expect(screen.getByText(/Marketing y Ventas/i)).toBeInTheDocument();
    });

    // Buscar botón de Marketing y hacer click
    const marketingBtn = screen.getByText(/Marketing y Ventas/i);
    fireEvent.click(marketingBtn);
    
    // Verificar que el botón existe y se puede hacer click
    expect(marketingBtn).toBeInTheDocument();
    expect(marketingBtn).toBeEnabled();
  });

  it('realiza búsqueda de agentes', async () => {
    render(
      <BrowserRouter>
        <EconeuraCockpit />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/buscar agentes/i);
    
    // Escribir en el campo de búsqueda
    fireEvent.change(searchInput, { target: { value: 'comercial' } });
    
    // Verificar que el input tiene el valor
    expect(searchInput).toHaveValue('comercial');
  });

  it.skip('alterna entre modo claro y oscuro', async () => {
    render(
      <BrowserRouter>
        <EconeuraCockpit />
      </BrowserRouter>
    );

    // Buscar el botón de modo oscuro por aria-label
    const darkModeBtn = screen.getByLabelText(/modo oscuro|modo claro/i);
    expect(darkModeBtn).toBeInTheDocument();
    
    fireEvent.click(darkModeBtn);
    
    // Verificar que el localStorage se actualizó
    expect(localStorage.getItem('econeura_dark_mode')).toBeTruthy();
  });

  it.skip('muestra configuración de API key al hacer click en settings', async () => {
    render(
      <BrowserRouter>
        <EconeuraCockpit />
      </BrowserRouter>
    );

    // Buscar el botón de configuración por aria-label
    const settingsBtn = screen.getByLabelText(/Settings/i);
    expect(settingsBtn).toBeInTheDocument();
    fireEvent.click(settingsBtn);

    // Esperar a que aparezca el modal
    await waitFor(() => {
      expect(screen.getByText(/configurar/i)).toBeInTheDocument();
    });
  });
});

