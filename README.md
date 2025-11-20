# 🚀 ECONEURA-FULL

<div align="center">

![ECONEURA](https://img.shields.io/badge/ECONEURA-2025-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

**SaaS Multi-tenant con 11 NEURAS (IA por departamento) + CRM Premium**

[Arquitectura](#-arquitectura) • [Quick Start](#-quick-start) • [Documentación](#-documentación) • [Deployment](#-deployment)

</div>

---

## 📋 Descripción

ECONEURA-FULL es la versión 2025 del SaaS ECONEURA: **multi-tenant**, con **11 NEURAS** (una por departamento) que hablan con humanos vía LLM y orquestan agentes de automatización (Make, n8n, etc.), desplegado en **Azure**.

### ✨ Características Principales

- 🧠 **11 NEURAS** - Asistentes IA especializados por departamento (CEO, CMO, CTO, etc.)
- 🎯 **CRM Premium** - Panel completo de CRM para Marketing y Ventas
- 🏗️ **Arquitectura Enterprise** - DDD + CQRS + Event Sourcing + Hexagonal
- 🔒 **Seguridad** - RBAC, autenticación Azure AD, audit logs
- 📊 **Observabilidad** - Application Insights, métricas, logging estructurado
- 🚀 **CI/CD** - GitHub Actions con workflows optimizados
- ☁️ **Azure** - Despliegue automatizado con Bicep

---

## 🏗️ Arquitectura

```
ECONEURA-FULL/
├── packages/
│   ├── backend/          # API Node.js/TypeScript
│   │   ├── src/
│   │   │   ├── api/      # HTTP routes
│   │   │   ├── crm/      # CRM domain
│   │   │   ├── neura/    # NEURA agents
│   │   │   ├── llm/      # LLM integration
│   │   │   └── infra/    # Infrastructure adapters
│   │   └── tests/        # Tests
│   └── frontend/         # React + Vite
│       ├── src/
│       │   ├── components/
│       │   ├── hooks/
│       │   └── services/
│       └── tests/
├── infrastructure/       # Azure Bicep templates
├── scripts/              # PowerShell scripts
├── docs/                 # Documentación
└── .github/              # GitHub workflows
```

### Stack Tecnológico

**Backend:**
- Node.js 20+ / TypeScript 5.4
- Express + Zod validation
- PostgreSQL + Redis
- Application Insights

**Frontend:**
- React 18 + TypeScript
- Vite + Tailwind CSS
- Recharts + Framer Motion
- Playwright (E2E)

**Infrastructure:**
- Azure App Service (backend)
- Azure Static Web Apps (frontend)
- Azure PostgreSQL
- Azure Redis Cache
- Azure Key Vault

---

## ⚡ Quick Start

### Prerrequisitos

- Node.js >= 20.0.0
- PostgreSQL (local o Azure)
- Cuenta Azure (para deployment)

### Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/TU-REPO/ECONEURA-FULL.git
cd ECONEURA-FULL

# Instalar dependencias
npm install

# Configurar variables de entorno
cp packages/backend/.env.example packages/backend/.env
# Editar .env con tus configuraciones

# Type-check
npm run type-check:backend
npm run type-check:frontend

# Ejecutar tests
npm run test:backend

# Iniciar desarrollo
npm run dev:backend    # Backend en http://localhost:3000
npm run dev:frontend   # Frontend en http://localhost:5173
```

### Comandos Principales

```bash
# Build
npm run build                    # Build completo
npm run build:backend           # Solo backend
npm run build:frontend          # Solo frontend

# Development
npm run dev:backend             # Backend dev server
npm run dev:frontend            # Frontend dev server

# Testing
npm run test:backend            # Tests backend
npm run test:frontend           # Tests frontend
npm run test:e2e                # E2E tests (Playwright)

# Type Checking
npm run type-check:backend      # Type-check backend
npm run type-check:frontend     # Type-check frontend

# Linting
npm run lint:backend            # Lint backend
npm run lint:frontend           # Lint frontend
```

---

## 📚 Documentación

### 📖 Guías Principales

- **[Arquitectura](docs/ARCHITECTURE.md)** - Arquitectura del sistema
- **[Deployment](docs/DEPLOYMENT/)** - Guías de despliegue
- **[Development](docs/DEVELOPMENT/)** - Guías de desarrollo
- **[Operations](docs/OPERATIONS.md)** - Operaciones y monitoreo

### 🔍 Búsqueda Rápida

- **¿Cómo desplegar?** → Ver `docs/deployment/`
- **¿Problemas?** → Ver `docs/TROUBLESHOOTING-GUIA-COMPLETA.md`
- **¿Arquitectura?** → Ver `docs/ARCHITECTURE.md`
- **¿CRM?** → Ver `packages/frontend/CRM_TECHNICAL_ANALYSIS.md`

---

## 🚀 Deployment

### GitHub Actions

El proyecto incluye workflows CI/CD completos:

- **Backend CI** - Lint, type-check, tests, build, security scan
- **Frontend CI** - Lint, type-check, build, tests, E2E
- **App Deploy** - Deploy a Azure (backend + frontend)
- **Infra Deploy** - Despliegue de infraestructura con Bicep
- **Release** - Automatización de releases

### Despliegue Manual

```bash
# 1. Validar localmente
.\scripts\validate-all.ps1 -Environment staging

# 2. Build
npm run build

# 3. Deploy (requiere Azure CLI configurado)
.\scripts\deploy-local.ps1 -Environment staging
```

Ver [README-DEPLOYMENT.md](README-DEPLOYMENT.md) para más detalles.

---

## 🧪 Testing

```bash
# Tests unitarios
npm run test:backend
npm run test:frontend

# Tests E2E
npm run test:e2e

# Coverage
npm run test:backend -- --coverage
```

---

## 🔒 Seguridad

- ✅ Autenticación Azure AD
- ✅ RBAC (Role-Based Access Control)
- ✅ Input sanitization
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ CodeQL analysis
- ✅ Dependabot alerts

---

## 📊 Monorepo Structure

```
ECONEURA-FULL/
├── packages/
│   ├── backend/        # @econeura/backend
│   └── frontend/       # @econeura/web
├── infrastructure/     # Azure Bicep
├── scripts/            # PowerShell utilities
└── docs/              # Documentación
```

**Workspaces:** NPM workspaces para gestión de dependencias

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para más detalles.

---

## 👥 Equipo

**ECONEURA Development Team**

---

## 🔗 Links

- [Documentación Completa](docs/)
- [API Reference](docs/API-REFERENCE.md)
- [Changelog](CHANGELOG.md)
- [Security Policy](SECURITY.md)

---

<div align="center">

**Hecho con ❤️ por el equipo ECONEURA**

[⭐ Star en GitHub](https://github.com/TU-REPO/ECONEURA-FULL) • [📧 Contacto](mailto:info@econeura.com)

</div>
