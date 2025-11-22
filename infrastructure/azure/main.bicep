targetScope = 'resourceGroup'

@description('Nombre del entorno (dev, staging, prod)')
param environment string = 'dev'

@description('Ubicación por defecto para los recursos')
param location string = 'westeurope'

@description('Nombre base del sistema ECONEURA-FULL')
param baseName string = 'econeura-full'

@description('Habilitar despliegue de Event Store/Read Models (Cosmos DB)')
param enableEventStore bool = false

@secure()
@description('Password del usuario administrador de PostgreSQL (se pasa al módulo database)')
param postgresAdminPassword string

@secure()
@description('Valor dummy o real para OPENAI_API_KEY que se guardará en Key Vault')
param openAiApiKey string

@secure()
@description('Valor dummy o real para DATABASE_URL que se guardará en Key Vault como placeholder')
param databaseUrlPlaceholder string

// Módulo core: naming / tags comunes (el Resource Group se crea fuera)
module core 'core.bicep' = {
  name: 'core'
  params: {
    environment: environment
    location: location
    baseName: baseName
  }
}

// Monitoring (Application Insights / Log Analytics) – debe existir antes que el resto
module monitoring 'monitoring.bicep' = {
  name: 'monitoring'
  params: {
    environment: environment
    location: location
    baseName: baseName
  }
}

// PostgreSQL (DB transaccional principal)
module database 'database.bicep' = {
  name: 'database'
  params: {
    environment: environment
    location: location
    baseName: baseName
    postgresAdminPassword: postgresAdminPassword
  }
}

// Key Vault para secretos
module keyvault 'keyvault.bicep' = {
  name: 'keyvault'
  params: {
    environment: environment
    location: location
    baseName: baseName
    databaseUrlPlaceholder: databaseUrlPlaceholder
    openAiApiKey: openAiApiKey
  }
}

// Redis Cache para rate limiting distribuido
module redis 'redis.bicep' = {
  name: 'redis'
  params: {
    environment: environment
    location: location
    baseName: baseName
    redisSku: 'C1' // C1 = 1GB (Standard), recomendado para producción
    enableAutoPause: environment == 'dev' // Auto-pause solo en dev
  }
}

// Storage Account para Blob Storage (documentos RAG)
module storage 'storage.bicep' = {
  name: 'storage'
  params: {
    environment: environment
    location: location
    baseName: baseName
    accessTier: 'Hot'
    redundancy: 'LRS' // LRS = más barato, GRS = más resiliente
  }
}

// Backend App Service (API Node.js)
module appBackend 'app-backend.bicep' = {
  name: 'app-backend'
  params: {
    environment: environment
    location: location
    baseName: baseName
    appInsightsConnectionString: monitoring.outputs.appInsightsConnectionString
    databaseHost: database.outputs.databaseHost
    databaseName: database.outputs.databaseName
    redisHost: redis.outputs.redisHost
    storageAccountName: storage.outputs.storageAccountNameOutput
  }
}

// Frontend (Static Web App o App Service)
module appFrontend 'app-frontend.bicep' = {
  name: 'app-frontend'
  params: {
    environment: environment
    location: location
    baseName: baseName
  }
}


// Event Store (Cosmos DB) - opcional
module eventStore 'eventstore.bicep' = if (enableEventStore) {
  name: 'eventstore'
  params: {
    environment: environment
    location: location
    baseName: baseName
  }
}

// Read Models (Cosmos DB) - opcional
module readModels 'readmodels.bicep' = if (enableEventStore) {
  name: 'readmodels'
  params: {
    environment: environment
    location: location
    baseName: baseName
  }
}


