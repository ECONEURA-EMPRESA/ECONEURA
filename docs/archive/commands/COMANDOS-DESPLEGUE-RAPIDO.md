# 🚀 COMANDOS DE DESPLIEGUE RÁPIDO

## ⚠️ IMPORTANTE: Estar en el directorio correcto

```powershell
# 1. Navegar al directorio del proyecto
cd C:\Users\Usuario\ECONEURA-FULL

# 2. Verificar que estás en el lugar correcto
Test-Path scripts\deploy-local.ps1
# Debe retornar: True

# 3. Ejecutar script de despliegue
.\scripts\deploy-local.ps1 -PostgresPassword "TU-PASSWORD-POSTGRES"
```

---

## 📋 PASOS COMPLETOS

### Paso 1: Navegar al proyecto
```powershell
cd C:\Users\Usuario\ECONEURA-FULL
```

### Paso 2: Verificar que el script existe
```powershell
Test-Path scripts\deploy-local.ps1
```

### Paso 3: Ejecutar despliegue
```powershell
.\scripts\deploy-local.ps1 -PostgresPassword "tu-password-postgres"
```

**Reemplaza `"tu-password-postgres"` con tu password real de PostgreSQL.**

---

## 🔧 SI EL SCRIPT NO FUNCIONA

### Opción A: Ejecutar migraciones manualmente

```powershell
# 1. Crear base de datos
psql -U postgres
CREATE DATABASE econeura_app;
\q

# 2. Ejecutar migraciones
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
psql -U postgres -d econeura_app -f database\migrations\002_crm_premium.sql
psql -U postgres -d econeura_app -f database\migrations\003_crm_indexes.sql
```

### Opción B: Configurar .env manualmente

```powershell
# 1. Navegar a backend
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend

# 2. Crear .env si no existe
if (-not (Test-Path .env)) {
    @"
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:TU-PASSWORD@localhost:5432/econeura_app
REDIS_URL=redis://localhost:6379
CRM_WEBHOOK_SECRET=
"@ | Out-File -FilePath .env -Encoding utf8
}

# 3. Generar CRM_WEBHOOK_SECRET
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# 4. Agregar el secret generado a .env (editar manualmente)
notepad .env
```

### Opción C: Instalar dependencias e iniciar

```powershell
# 1. Instalar dependencias
cd C:\Users\Usuario\ECONEURA-FULL
npm install

# 2. Iniciar backend
cd packages\backend
npm run dev
```

---

## ✅ VERIFICACIÓN RÁPIDA

```powershell
# Health check
Invoke-WebRequest -Uri http://localhost:3000/health

# Verificar tablas
psql -U postgres -d econeura_app -c "\dt crm_*"
```

---

**Última actualización:** 16 Noviembre 2025

