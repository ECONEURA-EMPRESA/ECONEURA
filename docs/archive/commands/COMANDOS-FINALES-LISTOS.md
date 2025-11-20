# 🚀 COMANDOS FINALES - LISTOS PARA COPIAR

## ✅ TODOS LOS PROBLEMAS CORREGIDOS

1. ✅ Error circular dependency en `applicationInsights.ts`
2. ✅ Script PowerShell sin emojis
3. ✅ Comando para generar secret corregido
4. ✅ Sintaxis PowerShell corregida

---

## 📋 COMANDOS PARA TERMINAL NUEVA

### PASO 1: Configurar .env

```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend

$bytes = New-Object byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)

@"
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:TU-PASSWORD@localhost:5432/econeura_app
REDIS_URL=redis://localhost:6379
CRM_WEBHOOK_SECRET=$secret
"@ | Out-File -FilePath .env -Encoding utf8

Write-Host "Secret generado: $secret" -ForegroundColor Green
```

**⚠️ Reemplaza `TU-PASSWORD` con tu password real de PostgreSQL**

---

### PASO 2: Crear Base de Datos (Si no existe)

#### Opción A: Si psql está en PATH
```powershell
psql -U postgres -c "CREATE DATABASE econeura_app;"
```

#### Opción B: Si psql NO está en PATH
```powershell
# Agregar PostgreSQL al PATH temporalmente
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"
psql -U postgres -c "CREATE DATABASE econeura_app;"
```

#### Opción C: Usar pgAdmin (GUI)
1. Abre pgAdmin
2. Click derecho en "Databases" → "Create" → "Database"
3. Nombre: `econeura_app`
4. Click "Save"

---

### PASO 3: Ejecutar Migraciones (Si psql funciona)

```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend

# Si psql no está en PATH, agregarlo primero:
# $env:Path += ";C:\Program Files\PostgreSQL\16\bin"

psql -U postgres -d econeura_app -f database\migrations\002_crm_premium.sql
psql -U postgres -d econeura_app -f database\migrations\003_crm_indexes.sql
```

**O ejecutar SQL manualmente en pgAdmin:**
1. Abre pgAdmin
2. Conecta a `econeura_app`
3. Click derecho en la base de datos → "Query Tool"
4. Copia y pega el contenido de `002_crm_premium.sql`
5. Ejecuta (F5)
6. Repite con `003_crm_indexes.sql`

---

### PASO 4: Instalar Dependencias (Si no lo hiciste)

```powershell
cd C:\Users\Usuario\ECONEURA-FULL
npm install
```

---

### PASO 5: Iniciar Backend

```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
npm run dev
```

**Verificar en los logs:**
- `ECONEURA backend escuchando en el puerto 3000`
- `[PostgresPool] Pool inicializado`
- Sin errores críticos

---

### PASO 6: Verificar Health Check (En otra terminal)

```powershell
Invoke-WebRequest -Uri http://localhost:3000/health
```

**Respuesta esperada:**
```json
{"status":"ok"}
```

---

## 🎯 COMANDOS TODO-EN-UNO (SIN PostgreSQL CLI)

Si no tienes `psql` en PATH, puedes hacer todo manualmente:

### 1. Crear base de datos (pgAdmin)
- Abre pgAdmin
- Crea base de datos `econeura_app`

### 2. Ejecutar migraciones (pgAdmin)
- Abre Query Tool en `econeura_app`
- Ejecuta SQL de `002_crm_premium.sql`
- Ejecuta SQL de `003_crm_indexes.sql`

### 3. Configurar .env (PowerShell)
```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)
@"
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:TU-PASSWORD@localhost:5432/econeura_app
REDIS_URL=redis://localhost:6379
CRM_WEBHOOK_SECRET=$secret
"@ | Out-File -FilePath .env -Encoding utf8
```

### 4. Iniciar backend
```powershell
cd C:\Users\Usuario\ECONEURA-FULL
npm install
cd packages\backend
npm run dev
```

---

## ✅ CHECKLIST FINAL

- [ ] `.env` configurado con `DATABASE_URL` y `CRM_WEBHOOK_SECRET`
- [ ] Base de datos `econeura_app` creada
- [ ] Migraciones ejecutadas (002 y 003)
- [ ] Dependencias instaladas
- [ ] Backend iniciado sin errores
- [ ] Health check responde OK

---

**Última actualización:** 16 Noviembre 2025

