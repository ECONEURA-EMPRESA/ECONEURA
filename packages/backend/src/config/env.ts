import { envSchema, type Env } from './envSchema';
import { ok, err, type Result } from '../shared/Result';
import { logger } from '../shared/logger';

let cachedEnv: Env | null = null;

/**
 * Limpiar cache de entorno (útil para tests o recarga de .env)
 */
export function clearEnvCache(): void {
  cachedEnv = null;
}

/**
 * Variables de entorno requeridas en producción
 */
const REQUIRED_IN_PRODUCTION = [
  'DATABASE_URL'
] as const;

/**
 * Variables de entorno recomendadas (warnings en producción)
 */
const RECOMMENDED_IN_PRODUCTION = [
  'APPLICATIONINSIGHTS_CONNECTION_STRING',
  'REDIS_URL',
  'OPENAI_API_KEY'
] as const;

export function validateEnv(rawEnv: NodeJS.ProcessEnv = process.env): Result<Env, Error> {
  const parsed = envSchema.safeParse(rawEnv);

  if (!parsed.success) {
    const error = new Error('Invalid environment variables');

    logger.error('Error validando variables de entorno', {
      issues: parsed.error.issues
    });

    return err(error);
  }

  return ok(parsed.data);
}

export function getValidatedEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = validateEnv();

  if (!result.success) {
    logger.error('Configuración inválida de entorno. Abortando arranque del backend.');
    throw result.error;
  }

  const env = result.data;
  const isProduction = env.NODE_ENV === 'production';

  // Validar variables requeridas en producción
  if (isProduction) {
    const missing: string[] = [];
    for (const key of REQUIRED_IN_PRODUCTION) {
      if (!env[key as keyof Env] || String(env[key as keyof Env]).trim() === '') {
        missing.push(key);
      }
    }

    if (missing.length > 0) {
      const error = new Error(
        `Missing required environment variables in production: ${missing.join(', ')}\n` +
        `Please set these variables before starting the application.`
      );
      logger.error('Variables de entorno requeridas faltantes en producción', { missing });
      throw error;
    }

    // Advertir sobre variables recomendadas faltantes
    const missingRecommended: string[] = [];
    for (const key of RECOMMENDED_IN_PRODUCTION) {
      if (!env[key as keyof Env] || String(env[key as keyof Env]).trim() === '') {
        missingRecommended.push(key);
      }
    }

    if (missingRecommended.length > 0) {
      logger.warn('Variables de entorno recomendadas no configuradas en producción', {
        missing: missingRecommended,
        message: 'La aplicación funcionará pero algunas características pueden estar deshabilitadas.'
      });
    }
  }

  cachedEnv = env;
  return cachedEnv;
}

