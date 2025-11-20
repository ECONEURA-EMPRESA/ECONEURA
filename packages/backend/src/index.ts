/**
 * ECONEURA Backend - Entry Point
 * Inicializa servicios de infraestructura antes de arrancar el servidor
 */
// Cargar variables de entorno desde .env PRIMERO
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener el directorio actual (compatible con ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env desde el directorio del backend
const envPath = resolve(__dirname, '../.env');
const dotenvResult = config({ path: envPath }); // Carga .env desde el directorio del backend

import { createServer } from './api/http/server';
import { getValidatedEnv, clearEnvCache } from './config/env';
import { logger } from './shared/logger';

// Limpiar cache de entorno para forzar recarga después de cargar .env
clearEnvCache();

// Validar variables de entorno PRIMERO (falla rápido si faltan)
let env: ReturnType<typeof getValidatedEnv>;
try {
  env = getValidatedEnv();
  logger.info('[Startup] Variables de entorno validadas correctamente');
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('❌ ERROR: Validación de variables de entorno falló:', error instanceof Error ? error.message : String(error));
  // eslint-disable-next-line no-console
  console.error('Por favor, revisa tu archivo .env o variables de entorno');
  process.exit(1);
}

// Inicializar DI Container (debe ser lo primero)
import { initializeServices } from './infra/di';

// Inicializar Application Insights (debe ser lo primero)
import './infra/observability/applicationInsights';

// Inicializar Redis (para rate limiting distribuido)
import './infra/cache/redisClient';

// Inicializar servicios en DI Container
try {
  initializeServices();
  logger.info('[Startup] Servicios inicializados correctamente');
} catch (error) {
  logger.error('[Startup] Error inicializando servicios', {
    error: error instanceof Error ? error.message : String(error)
  });
  if (env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Función async para inicializar el servidor
async function startServer() {
  const app = await createServer();

  const port = Number(env.PORT ?? 3001); // Backend en puerto 3001, frontend en 3000

  app.listen(port, () => {
    logger.info(`✅ ECONEURA backend escuchando en el puerto ${port}`, {
      environment: env.NODE_ENV,
      port,
      healthCheck: `http://localhost:${port}/api/health`
    });
  });
}

// Iniciar servidor
startServer().catch((error) => {
  logger.error('[Startup] Error fatal iniciando servidor', {
    error: error instanceof Error ? error.message : String(error)
  });
  process.exit(1);
});


