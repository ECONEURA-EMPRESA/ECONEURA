/**
 * ECONEURA - Service Registrations
 * Registro de todos los servicios en el DI Container
 */
import { getContainer } from './container';
import { getSecretsManager } from '../secrets';
import { initializeRedis, getRedisClient } from '../cache/redisClient';
import { initializeApplicationInsights, getTelemetryClient } from '../observability/applicationInsights';
import { azureBlobAdapter } from '../storage/AzureBlobAdapter';
import { keyVaultService } from '../keyvault/KeyVaultService';
import { InMemoryDocumentStore } from '../../knowledge/infra/inMemoryDocumentStore';
import { InMemoryDocumentChunkStore } from '../../knowledge/infra/inMemoryDocumentChunkStore';
import { StubDocumentProcessor } from '../../knowledge/infra/stubDocumentProcessor';
import { PostgresEventStore } from '../persistence/PostgresEventStore';
import { PostgresConversationStore } from '../persistence/PostgresConversationStore';
import { InMemoryEventStore } from '../persistence/InMemoryEventStore';
import { InMemoryConversationStore } from '../persistence/InMemoryConversationStore';
import { logger } from '../../shared/logger';

/**
 * Tokens de servicios (para type-safe resolution)
 */
export const ServiceTokens = {
  // Secrets
  SecretsManager: Symbol('SecretsManager'),

  // Cache
  RedisClient: Symbol('RedisClient'),

  // Observability
  TelemetryClient: Symbol('TelemetryClient'),

  // Storage
  StorageService: Symbol('StorageService'),

  // Key Vault
  KeyVaultService: Symbol('KeyVaultService'),

  // Knowledge Domain
  DocumentStore: Symbol('DocumentStore'),
  DocumentChunkStore: Symbol('DocumentChunkStore'),
  DocumentProcessor: Symbol('DocumentProcessor'),

  // Persistence
  EventStore: Symbol('EventStore'),

  // Conversation
  ConversationStore: Symbol('ConversationStore')
} as const;

/**
 * Registrar todos los servicios
 */
export function registerServices(): void {
  const container = getContainer();

  // Secrets Manager (singleton)
  container.registerSingleton(ServiceTokens.SecretsManager, () => {
    return getSecretsManager();
  });

  // Redis Client (singleton)
  container.registerSingleton(ServiceTokens.RedisClient, () => {
    initializeRedis();
    const client = getRedisClient();
    if (!client) {
      throw new Error('Redis client not available');
    }
    return client;
  });

  // Telemetry Client (singleton)
  container.registerSingleton(ServiceTokens.TelemetryClient, () => {
    initializeApplicationInsights();
    const client = getTelemetryClient();
    return client; // Puede ser null si no está configurado
  });

  // Storage Service (singleton)
  container.registerSingleton(ServiceTokens.StorageService, () => {
    return azureBlobAdapter;
  });

  // Key Vault Service (singleton)
  container.registerSingleton(ServiceTokens.KeyVaultService, () => {
    return keyVaultService;
  });

  // Document Store (singleton)
  container.registerSingleton(ServiceTokens.DocumentStore, () => {
    return new InMemoryDocumentStore();
  });

  // Document Chunk Store (singleton)
  container.registerSingleton(ServiceTokens.DocumentChunkStore, () => {
    return new InMemoryDocumentChunkStore();
  });

  // Document Processor (singleton)
  container.registerSingleton(ServiceTokens.DocumentProcessor, () => {
    return new StubDocumentProcessor();
  });

  // Event Store (singleton)
  container.registerSingleton(ServiceTokens.EventStore, () => {
    if (process.env['USE_MEMORY_STORE'] === 'true') {
      logger.warn('[DI] Using InMemoryEventStore');
      return new InMemoryEventStore();
    }
    return new PostgresEventStore();
  });

  // Conversation Store (singleton)
  container.registerSingleton(ServiceTokens.ConversationStore, () => {
    if (process.env['USE_MEMORY_STORE'] === 'true') {
      logger.warn('[DI] Using InMemoryConversationStore');
      return new InMemoryConversationStore();
    }
    return new PostgresConversationStore();
  });

  // Gemini Adapter (singleton)
  // Aunque getLLMClient usa el singleton exportado, lo registramos aquí para completitud
  container.registerSingleton('GeminiClient', () => {
    const { getGeminiAdapter } = require('../llm/GeminiRestAdapter');
    return getGeminiAdapter();
  });
}

/**
 * Inicializar servicios (llamar al arrancar la aplicación)
 */
export function initializeServices(): void {
  registerServices();
  logger.info('[DI] Servicios registrados correctamente');
}

