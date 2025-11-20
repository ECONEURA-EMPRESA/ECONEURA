# ⚡ COMANDOS RÁPIDOS - CRM

## 🚀 COMANDOS LISTOS PARA COPIAR Y PEGAR

### 1. VERIFICAR Y COMPILAR
```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
npm run type-check
npm run build
```

### 2. INICIAR SERVIDOR
```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
npm run dev
```

### 3. PROBAR HEALTH CHECK (en otra terminal)
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health
```

### 4. EJECUTAR MIGRACIONES SQL
```powershell
psql -U postgres -d econeura_app -f database\migrations\002_crm_premium.sql
psql -U postgres -d econeura_app -f database\migrations\003_crm_indexes.sql
```

### 5. VERIFICAR TABLAS
```powershell
psql -U postgres -d econeura_app -c "\dt crm_*"
```

### 6. VER LOGS
```powershell
Get-Content logs\combined.log -Wait -Tail 50
```

---

## ✅ TODO EN UNA LÍNEA

```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend; npm run type-check; npm run build; npm run dev
```

---

**Listo para ejecutar!** 🚀

