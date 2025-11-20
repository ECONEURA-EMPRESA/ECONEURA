import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFuzzySearch } from '../../hooks/useFuzzySearch';

describe('useFuzzySearch', () => {
  const mockAgents = [
    { id: '1', title: 'Comercio', desc: 'Análisis comercial', deptId: 'retail', deptName: 'Retail' },
    { id: '2', title: 'Marketing', desc: 'Campañas digitales', deptId: 'marketing', deptName: 'Marketing' },
    { id: '3', title: 'Finanzas', desc: 'Control presupuestario', deptId: 'finance', deptName: 'Finanzas' }
  ];

  const currentDept = [mockAgents[0]];

  it('retorna todos si query vacío', () => {
    const { result } = renderHook(() => 
      useFuzzySearch(mockAgents, '', currentDept)
    );
    
    expect(result.current).toEqual(currentDept);
  });

  it('encuentra resultados con query exacto', () => {
    const { result } = renderHook(() => 
      useFuzzySearch(mockAgents, 'Comercio', currentDept)
    );
    
    expect(result.current.length).toBeGreaterThan(0);
    expect(result.current[0].title).toBe('Comercio');
  });

  it('encuentra resultados con errores tipográficos (fuzzy)', () => {
    const { result } = renderHook(() => 
      useFuzzySearch(mockAgents, 'comrsio', currentDept)
    );
    
    // Fuzzy search debería encontrar "Comercio"
    expect(result.current.length).toBeGreaterThan(0);
  });

  it('busca en descripción también', () => {
    const { result } = renderHook(() => 
      useFuzzySearch(mockAgents, 'campañas', currentDept)
    );
    
    expect(result.current.some(a => a.title === 'Marketing')).toBe(true);
  });

  it('busca en nombre del departamento', () => {
    const { result } = renderHook(() => 
      useFuzzySearch(mockAgents, 'retail', currentDept)
    );
    
    expect(result.current.some(a => a.deptName === 'Retail')).toBe(true);
  });
});


