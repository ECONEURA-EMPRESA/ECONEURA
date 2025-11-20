/**
 * Tests unitarios para componentes críticos del Cockpit
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CockpitHeader } from '../components/CockpitHeader';
import { CockpitSidebar } from '../components/CockpitSidebar';
import { useErrorHandler } from '../hooks/useErrorHandler';

// Mock de componentes
vi.mock('../components/LogoEconeura', () => ({
  LogoEconeura: () => <div data-testid="logo">Logo</div>
}));

describe('CockpitHeader', () => {
  it('debería renderizar correctamente', () => {
    const mockProps = {
      darkMode: false,
      setDarkMode: vi.fn(),
      sidebarOpen: false,
      setSidebarOpen: vi.fn(),
      settingsOpen: false,
      setSettingsOpen: vi.fn(),
      onLogout: vi.fn()
    };

    render(<CockpitHeader {...mockProps} />);
    
    expect(screen.getByText('ECONEURA')).toBeInTheDocument();
    expect(screen.getByText('Cockpit Premium')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('debería cambiar modo oscuro al hacer clic', () => {
    const setDarkMode = vi.fn();
    const mockProps = {
      darkMode: false,
      setDarkMode,
      sidebarOpen: false,
      setSidebarOpen: vi.fn(),
      settingsOpen: false,
      setSettingsOpen: vi.fn(),
      onLogout: vi.fn()
    };

    render(<CockpitHeader {...mockProps} />);
    
    const darkModeButton = screen.getByTitle('Modo oscuro');
    fireEvent.click(darkModeButton);
    
    expect(setDarkMode).toHaveBeenCalledWith(true);
  });
});

describe('CockpitSidebar', () => {
  const mockDepartments = [
    {
      id: 'ceo',
      name: 'CEO',
      chips: ['Estrategia', 'Liderazgo'],
      neura: {
        title: 'NEURA CEO',
        subtitle: 'Estrategia Ejecutiva',
        tags: ['Visión', 'Decisión']
      },
      agents: [
        { id: 'a-ceo-01', title: 'Agente CEO', desc: 'Descripción' }
      ]
    }
  ];

  it('debería renderizar cuando sidebarOpen es true', () => {
    const mockProps = {
      darkMode: false,
      sidebarOpen: true,
      activeDept: 'ceo',
      setActiveDept: vi.fn(),
      departments: mockDepartments
    };

    render(<CockpitSidebar {...mockProps} />);
    
    expect(screen.getByText('Departamentos')).toBeInTheDocument();
    expect(screen.getByText('CEO')).toBeInTheDocument();
  });

  it('no debería renderizar cuando sidebarOpen es false', () => {
    const mockProps = {
      darkMode: false,
      sidebarOpen: false,
      activeDept: 'ceo',
      setActiveDept: vi.fn(),
      departments: mockDepartments
    };

    const { container } = render(<CockpitSidebar {...mockProps} />);
    
    expect(container.firstChild).toBeNull();
  });
});

describe('useErrorHandler', () => {
  it('debería manejar errores correctamente', () => {
    const TestComponent = () => {
      const { errorState, handleError, clearError } = useErrorHandler();
      
      return (
        <div>
          <button onClick={() => handleError(new Error('Test error'), 'Test context')}>
            Trigger Error
          </button>
          <button onClick={clearError}>Clear Error</button>
          {errorState.hasError && <div data-testid="error">{errorState.error}</div>}
        </div>
      );
    };

    render(<TestComponent />);
    
    const triggerButton = screen.getByText('Trigger Error');
    fireEvent.click(triggerButton);
    
    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent('Test context: Test error');
  });
});
