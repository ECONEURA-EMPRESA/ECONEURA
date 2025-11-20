import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App', () => {
  it('renders EconeuraCockpit via App', () => {
    render(<App />);
    // Verificar que el componente principal se renderiza
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });
});
