@description('Nombre del entorno (dev, staging, prod)')
param environment string

@description('Ubicación para Redis Cache')
param location string

@description('Nombre base del sistema ECONEURA-FULL')
param baseName string

@description('Nombre del Redis Cache (opcional)')
@allowed([
  ''
])
param redisCacheName string = ''

@description('SKU de Redis (C0=250MB, C1=1GB, C2=2.5GB)')
@allowed([
  'C0'
  'C1'
  'C2'
])
param redisSku string = 'C0'

@description('Habilitar auto-pause en dev (solo para C0)')
param enableAutoPause bool = false

var resolvedCacheName = empty(redisCacheName) ? 'redis-${baseName}-${environment}' : redisCacheName

@description('Tags comunes para Redis')
var redisTags = {
  environment: environment
  system: baseName
  component: 'redis'
}

resource redisCache 'Microsoft.Cache/redis@2023-08-01' = {
  name: resolvedCacheName
  location: location
  properties: {
    sku: {
      name: redisSku
      family: 'C'
      capacity: redisSku == 'C0' ? 0 : 1 // C0=0 (250MB), C1=1 (1GB)
    }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    redisVersion: '7'
    // Auto-pause solo disponible en tier Basic (C0)
    // En producción, usar Standard tier (C1+) para alta disponibilidad
  }
  tags: redisTags
}

// Firewall rule: permitir acceso desde App Service (se configurará manualmente o vía script)
// Nota: En producción, configurar firewall rules específicas

@description('Host del Redis Cache')
output redisHost string = '${redisCache.name}.redis.cache.windows.net:6380'

@description('Connection string del Redis (sin password, se obtiene desde portal o Key Vault)')
output redisConnectionString string = 'rediss://${redisCache.name}.redis.cache.windows.net:6380'

@description('Nombre del Redis Cache creado')
output redisCacheNameOutput string = redisCache.name

