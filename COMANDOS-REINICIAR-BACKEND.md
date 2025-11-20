# 🚀 COMANDOS PARA REINICIAR BACKEND

## ✅ PASOS CLAROS

### **1. Ir a la carpeta del backend**:
```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
```

### **2. Reiniciar el servidor**:
```powershell
npm run dev
```

---

## ✅ QUÉ DEBERÍAS VER

Cuando arranque correctamente, deberías ver:

```
]: [Redis] REDIS_URL no configurado, Redis deshabilitado
]: [RateLimit] Redis no disponible, usando memory store (no distribuido)
]: [AzureBlobAdapter] AZURE_STORAGE_CONNECTION_STRING no configurado, usando almacenamiento local
]: [Startup] Variables de entorno validadas correctamente
]: [DI] Servicios registrados correctamente
]: [Startup] Servicios inicializados correctamente
]: [Server] Rutas de webhooks CRM registradas
]: [Server] Rutas de autenticación registradas
]: [Server] Rutas de invoke registradas
]: [Server] Rutas CRM registradas
]: ✅ ECONEURA backend escuchando en el puerto 3000
```

**IMPORTANTE**: Debe decir `✅ ECONEURA backend escuchando en el puerto 3000`

---

## 🧪 VERIFICAR QUE FUNCIONA

### **En otra terminal PowerShell**, ejecuta:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET
```

**Deberías ver**: `StatusCode: 200`

---

## ✅ SI TODO ESTÁ BIEN

1. ✅ Backend arrancó en puerto 3000
2. ✅ Health check responde 200
3. ✅ Puedes probar el chat en el frontend

---

## ❌ SI HAY ERRORES

### **Error: Puerto 3000 en uso**:
```powershell
# Cerrar proceso en puerto 3000
netstat -ano | findstr :3000
# Luego matar el proceso (reemplaza PID con el número que aparezca)
taskkill /PID <PID> /F
```

### **Error: Módulos no encontrados**:
```powershell
npm install
```

### **Error: TypeScript**:
```powershell
npm run type-check
```

---

## 🎯 DESPUÉS DE ARRANCAR

1. ✅ Verifica que el backend está corriendo (puerto 3000)
2. ✅ Prueba el chat en el frontend
3. ✅ El error 500 debería estar resuelto
4. ✅ El warning de Sentry no debería aparecer

---

**¡Listo para probar!** 🚀


