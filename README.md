# Caserita API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="80" alt="NestJS" />
</p>

<p align="center">
  Backend oficial de la plataforma Caserita — construido con NestJS, PostgreSQL y TypeORM.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-v22_LTS-brightgreen" alt="Node" />
  <img src="https://img.shields.io/badge/nestjs-v11-red" alt="NestJS" />
  <img src="https://img.shields.io/badge/typescript-5.7-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/postgresql-16-336791" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/CI-GitHub_Actions-black" alt="CI" />
</p>

---

## Tabla de contenidos

- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Comandos disponibles](#comandos-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Convención de commits](#convención-de-commits)
- [Flujo de ramas](#flujo-de-ramas)
- [CI/CD](#cicd)
- [Documentación de la API](#documentación-de-la-api)
- [Base de datos y migraciones](#base-de-datos-y-migraciones)
- [Testing](#testing)
- [Seguridad](#seguridad)

---

## Requisitos previos

Antes de clonar el repositorio asegúrate de tener instalado:

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| Node.js | v22 LTS | `node --version` |
| npm | v10+ | `npm --version` |
| PostgreSQL | v16 | `psql --version` |
| Git | cualquier | `git --version` |

> Se recomienda usar **nvm** para gestionar versiones de Node.js y **Git Bash** como terminal en Windows.

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Vane737/caserita_api.git
cd caserita_api

# 2. Usar la versión correcta de Node
nvm use

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores locales

# 5. Crear la base de datos en PostgreSQL
# Nombre sugerido: caserita_db

# 6. Iniciar en modo desarrollo
npm run start:dev
```

Una vez iniciado:
- **API:** `http://localhost:3000/api/v1`
- **Swagger:** `http://localhost:3000/docs`

---

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores. **Nunca subas el archivo `.env` al repositorio.**

```bash
# Aplicación
NODE_ENV=development
PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=caserita_db

# JWT
JWT_SECRET=genera_una_clave_aleatoria_de_minimo_32_caracteres
JWT_EXPIRES_IN=7d
```

Para generar un `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> ⚠️ El `JWT_SECRET` debe tener **mínimo 32 caracteres**. La app no arrancará si esta validación falla.

---

## Comandos disponibles

```bash
# Desarrollo
npm run start:dev       # servidor con hot-reload
npm run start:debug     # servidor en modo debug

# Producción
npm run build           # compilar TypeScript
npm run start:prod      # iniciar desde el build

# Calidad de código
npm run lint            # ejecutar ESLint
npm run format          # formatear con Prettier

# Testing
npm run test            # unit tests
npm run test:watch      # unit tests en modo watch
npm run test:cov        # tests con reporte de cobertura
npm run test:e2e        # tests end-to-end

# Base de datos
npm run migration:generate  # generar nueva migración
npm run migration:run       # aplicar migraciones pendientes
npm run migration:revert    # revertir última migración
```

> Si ves errores de formato al hacer commit, corre `npm run format` para corregirlos automáticamente.

---

## Estructura del proyecto

```
caserita-api/
├── .github/
│   └── workflows/
│       └── ci.yml              ← pipeline de CI/CD
├── .husky/
│   ├── commit-msg              ← valida el mensaje del commit
│   └── pre-commit              ← ejecuta lint antes de cada commit
├── src/
│   ├── config/
│   │   ├── env.validation.ts   ← validación de variables de entorno con Joi
│   │   └── data-source.ts      ← configuración de migraciones TypeORM
│   ├── modules/
│   │   └── [nombre-modulo]/
│   │       ├── dto/            ← objetos de transferencia de datos
│   │       ├── entities/       ← entidades de base de datos
│   │       ├── [nombre].controller.ts
│   │       ├── [nombre].service.ts
│   │       ├── [nombre].repository.ts
│   │       └── [nombre].module.ts
│   ├── common/
│   │   ├── filters/            ← manejo global de errores
│   │   ├── guards/             ← autenticación y autorización
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── app.module.ts
│   └── main.ts
├── test/
│   └── app.e2e-spec.ts
├── .env.example                ← plantilla de variables de entorno
├── .nvmrc                      ← versión de Node.js del proyecto
├── commitlint.config.js        ← reglas de commits
└── package.json
```

> **Regla:** cada módulo de negocio (users, auth, products, etc.) tiene su propia carpeta dentro de `src/modules/`. El código compartido entre módulos va en `src/common/`.

---

## Convención de commits

Este proyecto usa **Conventional Commits**. Husky valida automáticamente cada commit y lo rechaza si no cumple el formato.

### Formato

```
tipo: descripción corta en minúsculas
```

### Tipos permitidos

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de un bug |
| `docs` | Solo cambios en documentación |
| `style` | Formato, espacios (sin cambio de lógica) |
| `refactor` | Refactorización sin nueva funcionalidad ni bug fix |
| `test` | Agregar o corregir tests |
| `chore` | Mantenimiento, actualización de dependencias |
| `perf` | Mejora de rendimiento |
| `ci` | Cambios en configuración de CI/CD |

### Ejemplos

```bash
# ✅ Válidos
feat: add user registration endpoint
fix: resolve token expiration issue
docs: update environment setup steps
chore: update nestjs to v11.1
test: add unit tests for auth service
refactor: simplify password hashing logic

# ❌ Inválidos — serán rechazados automáticamente
"agregué el login"
"WIP"
"Fix"
"arreglando cosas"
```

> **Idioma:** usar inglés para los commits. Es el estándar del proyecto.

---

## Flujo de ramas

| Rama | Propósito |
|---|---|
| `main` | Código en producción. Nunca hacer push directo. |
| `develop` | Rama de integración. Base para nuevas features. |
| `feature/nombre` | Nueva funcionalidad. Ej: `feature/auth-login` |
| `fix/nombre` | Corrección de bug. Ej: `fix/token-expiration` |
| `chore/nombre` | Mantenimiento. Ej: `chore/update-dependencies` |
| `hotfix/nombre` | Fix urgente en producción. |

### Flujo de trabajo

```bash
# 1. Partir siempre desde develop
git checkout develop
git pull origin develop
git checkout -b feature/mi-nueva-feature

# 2. Desarrollar y hacer commits
git add .
git commit -m "feat: add my new feature"

# 3. Subir la rama
git push origin feature/mi-nueva-feature

# 4. Abrir Pull Request hacia develop en GitHub
# 5. Esperar aprobación y que el CI esté en verde
# 6. Hacer merge
```

> ⚠️ **Nunca** hacer push directo a `main` o `develop`. Todo cambio entra por Pull Request con mínimo 1 aprobación.

---

## CI/CD

El pipeline de GitHub Actions se ejecuta automáticamente en cada push y Pull Request a `main` o `develop`.

### Pasos del pipeline

| Paso | Qué verifica |
|---|---|
| `install` | Instala dependencias con `npm ci` |
| `lint` | Verifica ESLint y Prettier en todo el código |
| `test:cov` | Corre todos los tests y verifica cobertura mínima |
| `build` | Compila TypeScript y verifica que no haya errores |

> Un Pull Request **no puede mergearse** si el pipeline falla. Asegúrate de correr `npm run lint` y `npm run test` localmente antes de hacer push.

---

## Documentación de la API

Swagger está disponible únicamente en entorno de desarrollo:

```
http://localhost:3000/docs
```

Todos los endpoints y DTOs deben estar decorados correctamente con `@ApiOperation`, `@ApiResponse` y `@ApiProperty` para que la documentación se genere automáticamente.

---

## Base de datos y migraciones

### Regla crítica sobre `synchronize`

| Entorno | `synchronize` | Cómo se actualiza la BD |
|---|---|---|
| `development` | `true` ✅ | Automático al cambiar entidades |
| `staging` | `false` ❌ | Solo con migraciones |
| `production` | `false` ❌ | Solo con migraciones |

> ⚠️ **NUNCA** usar `synchronize: true` en producción. Puede borrar columnas y datos reales.

### Flujo de migraciones

```bash
# 1. Generar la migración después de cambiar una entidad
npm run migration:generate -- src/migrations/NombreDescriptivo

# 2. Revisar el archivo generado antes de aplicar
# 3. Aplicar la migración
npm run migration:run

# Si algo sale mal, revertir
npm run migration:revert
```

---

## Testing

```bash
npm run test          # unit tests
npm run test:cov      # con reporte de cobertura
npm run test:e2e      # end-to-end
```

### Cobertura mínima requerida

- **Services:** 80%
- **Controllers:** 60%
- **General:** 70%

El CI rechaza Pull Requests que no alcancen la cobertura mínima.

---

## Seguridad

- **Helmet** — cabeceras HTTP de seguridad activadas globalmente
- **Rate limiting** — límite de 10 requests/segundo y 100 requests/minuto por IP
- **JWT** — todos los endpoints privados requieren token Bearer válido
- **Validación** — todos los datos de entrada pasan por DTOs con `class-validator`
- **CORS** — configurado explícitamente por entorno

> Para reportar una vulnerabilidad de seguridad, contactar directamente al equipo de desarrollo. No abrir issues públicos.

---

<p align="center">
  Caserita API — v1.0.0 — Mayo 2026
</p>
