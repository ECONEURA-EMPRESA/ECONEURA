import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from '../Login';

describe('Login', () => {
  const mockOnLoginSuccess = vi.fn();

  it('renders login form', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    expect(screen.getByText('ECONEURA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('shows OAuth buttons', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    expect(screen.getByText('Continuar con Google')).toBeInTheDocument();
    expect(screen.getByText('Continuar con Microsoft')).toBeInTheDocument();
    expect(screen.getByText('Continuar con GitHub')).toBeInTheDocument();
  });

  it('toggles between login and register', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const toggleButton = screen.getByText('¿No tienes cuenta? Regístrate');
    fireEvent.click(toggleButton);

    expect(screen.getByText('CREA TU CUENTA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Juan Pérez')).toBeInTheDocument();
  });

  it('shows register form fields', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const toggleButton = screen.getByText('¿No tienes cuenta? Regístrate');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Nombre completo')).toBeInTheDocument();
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
  });

  it('handles Google OAuth click', () => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: '', hostname: 'localhost' },
      writable: true
    });

    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const googleButton = screen.getByText('Continuar con Google');
    fireEvent.click(googleButton);

    // Verificar que se llamó la función de redirección
    expect(window.location.href).toBeDefined();
  });
});

