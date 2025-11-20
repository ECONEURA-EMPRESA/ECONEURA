/**
 * ECONEURA - API Configuration
 * Centralized API URL and correlation ID generation
 */

const getApiUrl = () => {
  // Backend corre en puerto 3001, frontend en puerto 3000
  return 'http://localhost:3001/api';
};

export const API_URL = getApiUrl();

export function generateCorrelationId(prefix = 'web'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

