# ✅ COMANDOS PARA POWERSHELL

## ⚠️ DIFERENCIA IMPORTANTE

**PowerShell NO usa `&&`** (eso es bash/cmd)

**✅ En PowerShell usa `;` o comandos separados:**

```powershell
# ❌ INCORRECTO (bash/cmd)
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend && npm run dev

# ✅ CORRECTO (PowerShell - opción 1)
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend; npm run dev

# ✅ CORRECTO (PowerShell - opción 2)
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
npm run dev
```

---

## 🚀 COMANDOS CORRECTOS PARA POWERSHELL

### 1. Ir al directorio backend:
```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
```

### 2. Compilar:
```powershell
npm run build
```

### 3. Verificar tipos:
```powershell
npm run type-check
```

### 4. Iniciar servidor:
```powershell
npm run dev
```

---

## 📋 COMANDOS EN UNA LÍNEA (PowerShell)

```powershell
# Usar punto y coma (;)
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend; npm run dev

# O usar -and (pero no funciona igual que &&)
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend -and npm run dev  # ❌ No funciona así
```

**Mejor opción:** Ejecutar comandos separados:
```powershell
cd C:\Users\Usuario\ECONEURA-FULL\packages\backend
npm run dev
```

---

## ✅ VERIFICACIÓN

```powershell
# Ver directorio actual
pwd

# Debe mostrar:
# C:\Users\Usuario\ECONEURA-FULL\packages\backend

# Verificar package.json
ls package.json
```

---

**Última actualización:** 17 Noviembre 2025

