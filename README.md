# XelleDocumentos
# 🧪 XelleSystem — LIMS/CRM para Gestión de Laboratorios

**Descripción:** XelleSystem es un sistema integral de Laboratorio LIMS (Laboratory Information Management System) y CRM integrado, diseñado para laboratorios y centros de análisis. Proporciona una interfaz web moderna (frontend), gestión de formatos de documentos (plantillas FO-*), módulos especializados, backend escalable y capacidades de deployment containerizado. El sistema permite generar, gestionar y auditar documentos de laboratorio con integridad verificable mediante hashes MD5/SHA256.

**Tecnologías principales:**
- **Frontend:** HTML5, CSS3, JavaScript vanilla (módulos), arquitectura modular sin frameworks
- **Backend:** Java 11+ (Spring Boot 2.7+, en desarrollo)
- **Contenedores:** Docker + Docker Compose para desarrollo y producción
- **Base de datos:** PostgreSQL 12+ (recomendado), MySQL 8.0+, SQLite (desarrollo)
- **Seguridad:** Autenticación JWT, manifiesto de integridad MD5/SHA256, auditoría completa
- **CI/CD:** GitHub Actions, Docker Registry

---

## 📋 Tabla de Contenidos

1. [Estructura del Proyecto](#-estructura-del-repositorio-detallada)
2. [Características Principales](#-características-principales)
3. [Requisitos del Sistema](#-requisitos-del-sistema)
4. [Instalación y Configuración](#-instalación-y-configuración)
5. [Ejecución Local](#-ejecución-local)
6. [Módulos y Características](#-módulos-y-características)
7. [Seguridad y Auditoría](#-seguridad-y-auditoría)
8. [Docker y Containerización](#-docker-y-containerización)
9. [Backend (Java/Spring Boot)](#-backend-javasspring-boot)
10. [Desarrollo y Extensión](#-desarrollo-y-extensión)
11. [Deployment a Producción](#-deployment-a-producción)
12. [Mantenimiento y Operaciones](#-mantenimiento-y-operaciones)
13. [Troubleshooting](#-troubleshooting)
14. [Contribuir](#-contribuir)
15. [FAQ](#-faq)
16. [Licencia y Contacto](#-licencia-y-contacto)

---

## 🧩 Estructura del Repositorio (Detallada)

```
XelleSystem/
├── frontend/                          # Interfaz web (HTML, CSS, JS)
│   ├── index.html                    # Página principal y router
│   ├── login.html                    # Pantalla de autenticación
│   ├── dashboard.html                # Dashboard de inicio
│   ├── lims-core.js                  # Núcleo de la aplicación
│   ├── colores.py                    # Utilidad de paleta de colores
│   ├── hashes.md                     # Manifiesto MD5 (auditoría)
│   ├── estructura_completa.txt       # Árbol de directorios
│   │
│   ├── css/                          # Estilos
│   │   ├── styles.css               # Estilos generales
│   │   └── lims-theme.css           # Tema específico LIMS
│   │
│   ├── js/                          # Scripts JavaScript
│   │   ├── core/
│   │   │   ├── auth.js              # Sistema de autenticación
│   │   │   └── main.js              # Lógica principal
│   │   ├── config-users.js          # Configuración de usuarios
│   │   └── utils/                   # Utilidades compartidas
│   │
│   ├── modules/                     # Módulos especializados
│   │   ├── admin/
│   │   │   └── admin.js             # Gestión de usuarios y roles
│   │   ├── almacen/
│   │   │   └── almacen.js           # Control de inventario
│   │   ├── banco-celulas/
│   │   │   └── banco-celulas.js     # Gestión de líneas celulares
│   │   ├── comercial/               # Funciones comerciales
│   │   ├── configuracion/           # Parámetros globales
│   │   ├── cosmeticos/              # Análisis cosméticos
│   │   ├── lab-calidad/             # Control de calidad
│   │   └── sgc/                     # Sistema de Gestión de Calidad
│   │
│   ├── formats/                     # Plantillas de documentos
│   │   ├── FO-LC-*.html            # Formatos Lab Calidad (16-45)
│   │   ├── FO-OP-*.html            # Formatos Operación (OP-01, 15-20)
│   │   ├── format-app.js           # Lógica de plantillas
│   │   ├── format-app-comercial.js # Plantillas comerciales
│   │   ├── format-styles.css       # Estilos de plantillas
│   │   └── formats-offLine/        # Versiones offline
│   │       └── *-OffLine.html
│   │
│   ├── assets/                     # Recursos estáticos
│   │   └── icons/                  # Iconos y símbolos
│   │
│   └── docs/                       # Documentación
│       ├── Dirección IP Config.docx
│       ├── LIMS y CRM para Laboratorios.pdf
│       └── Figure_1.png
│
├── backend/                         # Backend Java/Spring Boot
│   ├── pom.xml                     # Dependencias Maven
│   ├── mvnw / mvnw.cmd             # Maven Wrapper
│   ├── HELP.md                     # Ayuda Spring Boot
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/xelle/xellesystem/
│   │   │   │       ├── XelleSystemApplication.java
│   │   │   │       ├── controller/           # REST Controllers
│   │   │   │       ├── service/              # Lógica de negocio
│   │   │   │       ├── repository/           # Acceso a datos (JPA)
│   │   │   │       ├── entity/               # Modelos de datos
│   │   │   │       ├── config/               # Configuración Spring
│   │   │   │       ├── security/             # Seguridad, JWT
│   │   │   │       └── util/                 # Utilidades
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.properties    # Configuración
│   │   │       ├── application-dev.properties
│   │   │       ├── application-prod.properties
│   │   │       └── db/
│   │   │           ├── schema.sql           # DDL inicial
│   │   │           └── data.sql             # Datos de prueba
│   │   │
│   │   └── test/
│   │       ├── java/
│   │       │   └── com/xelle/xellesystem/
│   │       │       └── [unit tests]
│   │       └── resources/
│   │
│   └── target/                     # Build output
│       ├── classes/
│       └── generated-sources/
│
├── docker-compose.yml              # Orquestación de servicios
├── Dockerfile                      # Imagen para backend
├── Dockerfile.frontend             # Imagen para frontend (nginx)
│
├── .github/
│   └── workflows/                 # GitHub Actions
│       ├── test.yml
│       ├── build.yml
│       └── deploy.yml
│
├── .env                           # Variables de entorno (git ignore)
├── .env.example                   # Plantilla de variables
├── .gitignore
├── docker-compose.yml
├── estructura_completa.txt        # Árbol del proyecto
├── hashes.md                      # Manifiesto MD5 (auditoría)
├── README.md                      # Este archivo
└── md5_list.txt                   # Lista alternativa de hashes
```

---

## 🚀 Características Principales

### 🎯 Núcleo LIMS (Laboratory Information Management System)

#### Gestión de Formatos
- **30+ Plantillas Especializadas** (FO-LC-16 a FO-LC-45, FO-OP-*)
  - **FO-LC (Lab Calidad):** Análisis químicos, calibración, validación de métodos
  - **FO-OP (Operación):** Procedimientos, calibración de equipos, mantenimiento
- **Modo Online y Offline**
  - Aplicaciones web con almacenamiento local (IndexedDB)
  - Sincronización automática cuando se recupera conexión
  - Datos protegidos contra pérdida por desconexión
- **Generación Dinámica de Documentos**
  - Exportación a PDF (con qr-code, firma digital)
  - Descarga en Excel con cálculos incorporados

#### 8 Módulos Especializados

| Módulo | Descripción | Funcionalidades |
|--------|-------------|-----------------|
| **🔐 Admin** | Gestión de usuarios y permisos | Crear/editar usuarios, roles, permisos granulares, auditoría de accesos |
| **📦 Almacén** | Inventario y materiales | Control de stock, códigos de barras, alertas de reorden, historial de movimientos |
| **🧬 Banco de Células** | Líneas celulares y cultivos | Trazabilidad de líneas, condiciones de cultivo, criopreservación, origen |
| **💄 Cosméticos** | Análisis de productos | Composición, pruebas de seguridad, compatibilidad, lotes |
| **🧪 Lab Calidad** | Control de calidad | Métodos validados, muestreo estadístico, gráficos de control, capacidad |
| **📊 Comercial** | Gestión de clientes y órdenes | Cotizaciones, órdenes de compra, facturación, historial de clientes |
| **⚙️ Configuración** | Parámetros globales | Integraciones, plantillas, umbrales, moneda, idioma |
| **🏢 SGC** | Gestión de Calidad | Procedimientos normalizados, documentación, no conformidades |

### 🔒 Seguridad e Identidad

- **Autenticación Robusta**
  - Login con usuario/contraseña
  - Token JWT con expiración configurable (15 min acceso, 7 días refresh)
  - 2FA opcional (TOTP basado en tiempo)
  - Protección contra ataques CSRF
  
- **Control de Acceso (RBAC)**
  - 5 niveles de rol: Admin, Supervisor, Analista, Técnico, Visualizador
  - Permisos granulares por módulo y acción
  - Restricción de acceso a datos sensibles
  
- **Auditoría e Integridad**
  - Manifiesto MD5/SHA256 de todos los archivos
  - Trazabilidad completa: quién, qué, cuándo, dónde
  - Logs inmutables en base de datos
  - Firma digital en documentos (cuando sea requerida)
  - Cumplimiento con 21 CFR Part 11 (FDA)

### 📱 Interfaz de Usuario

- **Diseño Responsive**
  - Desktop, tablet, móvil (desde 320px de ancho)
  - Touch-friendly controls
  
- **Temas Visuales**
  - Claro/oscuro configurable por usuario
  - Paleta de colores profesionales (LIMS-theme.css)
  - Tipografía legible, contraste accesible (WCAG AA)
  
- **Dashboard Personalizable**
  - Widget de resumen de actividades
  - Accesos rápidos a módulos frecuentes
  - Notificaciones en tiempo real
  - Calendarios de eventos del laboratorio
  
- **Offline-First**
  - Funciona sin internet
  - Sincronización automática
  - Indicador de estado de conexión

### 📊 Reportes y Análisis

- **Reportes Predefinidos**
  - Análisis por rango de fechas
  - Gráficos: tendencias, distribuciones, capacidad de procesos
  - Tablas con sorting y filtrado
  
- **Exportación de Datos**
  - PDF con logos, firmas digitales
  - Excel con fórmulas y gráficos
  - CSV para importación en otros sistemas
  
- **Auditoría y Trazabilidad**
  - Historial completo de cambios
  - Comparación antes/después
  - Logs de acceso filtrados por usuario/fecha/módulo

---

## 🛠️ Requisitos del Sistema

### Para Desarrollo Local

| Componente | Versión Mínima | Mínima Recomendada | Notas |
|-----------|-------------|-------------------|-------|
| **OS** | Windows 10 / Ubuntu 18.04 / macOS 10.14 | Windows 11 / Ubuntu 22.04 / macOS 12+ | - |
| **Node.js** | 14 | 18+ | Opcional (para herramientas de build) |
| **Python** | 3.6 | 3.9+ | Opcional (para servir frontend) |
| **Git** | 2.20 | 2.36+ | Control de versiones |
| **Docker** | 19.03 | 20.10+ | **Recomendado para desarrollo** |
| **Docker Compose** | 1.25 | 2.0+ | Orquestación multi-contenedor |
| **Java/JDK** | 11 | 17 LTS | Backend Java |
| **Maven** | 3.6 | 3.8+ | Build tool Java |
| **PowerShell** | 5.1 | 7+ | Para scripts (Windows/multiplataforma) |

### Para Producción

| Componente | Versión | Notas |
|-----------|---------|-------|
| **Docker** | 20.10+ | Orquestación en Kubernetes opcional |
| **Kubernetes** | 1.20+ | Para escalado (opcional) |
| **PostgreSQL** | 12+ | **Recomendado para production** |
| **Nginx** | 1.20+ | Reverse proxy, load balancing |
| **SSL/TLS** | TLS 1.2+ | Certificados Let's Encrypt o corporativos |
| **Memory** | 4GB+ | Mínimo para 2+ contenedores |
| **CPU** | 2 cores | Mínimo recomendado |
| **Storage** | 20GB+ | SSD recomendado para base de datos |

### Navegadores Soportados

| Navegador | Versión Mínima | Notas |
|-----------|-------------|-------|
| Chrome/Chromium | 90 | Recomendado |
| Firefox | 88 | Excelente soporte |
| Safari | 14 | macOS/iOS |
| Edge | 90 | Basado en Chromium |

---

## 📥 Instalación y Configuración

### Paso 1: Clonar Repositorio

```bash
# Clone con HTTPS
git clone https://github.com/xelle/xellesystem.git
cd XelleSystem

# O con SSH
git clone git@github.com:xelle/xellesystem.git
cd XelleSystem
```

### Paso 2: Crear y Configurar Variables de Entorno

**2a. Crear `.env` en raíz del proyecto:**

```bash
cp .env.example .env
# Luego editar .env con tus valores
```

**2b. Contenido recomendado de `.env`:**

```env
# ===== BASE DE DATOS =====
DB_HOST=localhost
DB_PORT=5432
DB_NAME=xellesystem
DB_USER=xelle
DB_PASSWORD=tu_contraseña_super_segura_123!
DB_ADMIN_PASSWORD=admin_pass_123!

# ===== BACKEND (JAVA/SPRING) =====
SPRING_PROFILE=development
SPRING_PORT=8080
JAVA_OPTS=-Xmx1024m -Xms512m
JAVA_VERSION=17

# ===== FRONTEND =====
FRONTEND_PORT=8000
FRONTEND_HOST=0.0.0.0
API_BASE_URL=http://localhost:8080/api
NODE_ENV=development

# ===== SEGURIDAD =====
JWT_SECRET=tu_jwt_secret_muy_largo_y_aleatorio_minimo_32_caracteres
JWT_EXPIRATION_MS=900000
REFRESH_TOKEN_EXPIRATION_MS=604800000
ENCRYPTION_KEY=tu_clave_encriptacion_256bit
ENABLE_2FA=false

# ===== DOCKER =====
DOCKER_REGISTRY=docker.io
IMAGE_VERSION=latest
COMPOSE_FILE=docker-compose.yml

# ===== LOGGING Y MONITOREO =====
LOG_LEVEL=INFO
LOG_FILE=logs/xellesystem.log
SENTRY_DSN=https://your-sentry-url (opcional)

# ===== EMAIL (Para notificaciones) =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_app_password
SMTP_FROM=noreply@xelle.local

# ===== INTEGRACIONES (Futuro) =====
ACTIVE_DIRECTORY_ENABLED=false
LDAP_URL=ldap://your-ldap-server
```

**⚠️ IMPORTANTE:**
- **No** incluya `.env` en git
- `.env.example` debe incluirse (sin valores reales)
- Permisos restrictivos: `chmod 600 .env` (Linux/macOS)

### Paso 3: Verificar Requisitos

```bash
# Verificar Docker
docker --version
docker-compose --version

# Verificar Java (si se usa)
java -version
mvn --version

# Verificar Python (si se usa para servir frontend)
python --version
```

### Paso 4: Inicialización de Base de Datos

#### Opción A: Con Docker Compose (Recomendado)

```bash
# Docker crea y populará la BD automáticamente
docker-compose up -d db
docker-compose logs -f db  # Ver logs de inicialización
```

#### Opción B: Inicialización Manual (PostgreSQL)

```bash
# Conectarse a PostgreSQL
psql -U postgres -h localhost -p 5432

# En la consola psql:
CREATE DATABASE xellesystem;
CREATE USER xelle WITH PASSWORD 'tu_contraseña_segura_123!';
ALTER ROLE xelle SET client_encoding TO 'utf8';
ALTER ROLE xelle SET default_transaction_isolation TO 'read committed';
ALTER ROLE xelle SET default_transaction_deferrable TO on;
ALTER ROLE xelle SET default_transaction_read_committed TO on;
GRANT ALL PRIVILEGES ON DATABASE xellesystem TO xelle;
\c xellesystem
GRANT ALL ON SCHEMA public TO xelle;

# Cargar schema
\i backend/resources/db/schema.sql
\i backend/resources/db/data.sql
```

---

## 🖥️ Ejecución Local

### Opción A: Docker Compose (Recomendado)

```bash
# 1. Construir imágenes
docker-compose build

# 2. Iniciar servicios
docker-compose up -d

# 3. Verificar estado
docker-compose ps

# Esperado:
# NAME              STATUS
# xellesystem_db    Up (healthy)
# xellesystem_backend  Up
# xellesystem_frontend Up

# 4. Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# 5. Detener servicios
docker-compose down

# 5.1. Detener y eliminar volúmenes (reset completo)
docker-compose down -v
```

**Acceso después de `up`:**
- **Frontend:** http://localhost:8000
- **Backend API:** http://localhost:8080
- **PostgreSQL:** localhost:5432 (herramientas SQL)
- **Adminer (DB UI):** http://localhost:8081

### Opción B: Desarrollo Local (Sin Docker)

#### Frontend

```bash
cd frontend

# Opción 1: Python 3
python -m http.server 8000

# Opción 2: Node.js (http-server)
npm install -g http-server
http-server . -p 8000

# Opción 3: Live Server con reload (VSCode)
# Instalar extensión "Live Server"
# Botón derecho en index.html > "Open with Live Server"
```

**Acceso:** http://localhost:8000

#### Backend (Java/Spring)

```bash
cd backend

# Windows
mvnw.cmd clean install
mvnw.cmd spring-boot:run

# Linux/macOS
./mvnw clean install
./mvnw spring-boot:run
```

**Acceso:** http://localhost:8080

#### Base de Datos (PostgreSQL Local)

```bash
# Instalar PostgreSQL (seguir guías del OS)
# En Ubuntu:
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Crear BD manualmente (ver Paso 4 arriba)
```

### Opción C: Solo Frontend (Sin Backend)

```bash
cd frontend
python -m http.server 8000

# El frontend funcionará con datos mock
# (sin conectar a backend real)
```

---

## 🧑‍💻 Acceso y Primeros Pasos

### Credenciales de Prueba (Desarrollo)

```
╔═══════════════════════════════════════════════════════════════╗
║ USUARIO ADMINISTRATIVO                                        ║
├─────────────────────────────────────────────────────────────────
║ Email:    admin@xelle.local                                   ║
║ Password: Admin123!                                           ║
║ 2FA:      (deshabilitado por defecto)                        ║
╚═══════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════╗
║ USUARIO ANALISTA                                              ║
├─────────────────────────────────────────────────────────────────
║ Email:    analista@xelle.local                                ║
║ Password: Analista123!                                        ║
╚═══════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════╗
║ USUARIO TÉCNICO                                               ║
├─────────────────────────────────────────────────────────────────
║ Email:    tecnico@xelle.local                                 ║
║ Password: Tecnico123!                                         ║
╚═══════════════════════════════════════════════════════════════╝
```

⚠️ **CAMBIAR CONTRASEÑAS en producción**

### Flujo de Login

1. Abrir http://localhost:8000/login.html
2. Ingresar credenciales
3. Clickear "Ingresar"
4. Redirige a Dashboard (/dashboard.html)
5. Navegar por módulos desde menú lateral

### Navegación por Módulos

```
http://localhost:8000/index.html?module=NOMBRE
```

Módulos disponibles:
- `admin` — Gestión de usuarios
- `almacen` — Inventario
- `banco-celulas` — Líneas celulares
- `comercial` — Clientes y órdenes
- `configuracion` — Parámetros
- `cosmeticos` — Análisis cosméticos
- `lab-calidad` — Control de calidad
- `sgc` — Gestión de calidad

**Ejemplo:** http://localhost:8000/index.html?module=lab-calidad

---

## 🔧 Módulos y Características Detalladas

### 1. Módulo Admin

**Ruta:** `/modules/admin/admin.js`  
**Acceso:** Solo Administrador

**Funcionalidades:**
- Crear/editar/eliminar usuarios
- Asignar roles y permisos
- Ver historial de accesos
- Exportar logs de auditoría
- Gestionar sesiones activas
- Bloquear/desbloquear usuarios

**Endpoints API:**
```
GET    /api/users                    # Listar usuarios
GET    /api/users/{id}               # Obtener usuario
POST   /api/users                    # Crear usuario
PUT    /api/users/{id}               # Editar usuario
DELETE /api/users/{id}               # Eliminar usuario
GET    /api/roles                    # Listar roles
POST   /api/audit/logs               # Obtener logs de auditoría
```

### 2. Módulo Almacén

**Ruta:** `/modules/almacen/almacen.js`  
**Acceso:** Admin, Supervisor, Técnico

**Funcionalidades:**
- Control de inventario
- Códigos de barras (lectura de escáner)
- Alertas de reorden automáticas
- Historial de movimientos (entrada/salida)
- Localización en estantes
- Caducidad y lotes
- Reportes de stock

**Tabla de datos:** `inventory`

### 3. Módulo Lab de Calidad

**Ruta:** `/modules/lab-calidad/lab-calidad.js`  
**Acceso:** Todos

**Funcionalidades:**
- Gestión de métodos analíticos
- Muestreo estadístico
- Gráficos de control (Shewhart, CUSUM)
- Cálculo de capacidad de procesos (Cp, Cpk)
- Validación de métodos
- Trazabilidad de análisis
- Reportes de conformidad

**Formatos asociados:** FO-LC-16 a FO-LC-45

### 4. Módulo Cosméticos

**Ruta:** `/modules/cosmeticos/cosmeticos.js`  
**Acceso:** Admin, Supervisor, Analista

**Funcionalidades:**
- Base de datos de ingredientes
- Pruebas de seguridad
- Compatibilidad de fórmulas
- Trazabilidad de lotes
- Certificaciones de producto
- Almacenamiento de documentos

### 5. Módulo Comercial

**Ruta:** `/modules/comercial/comercial.js`  
**Acceso:** Admin, Supervisor, Visualizador

**Funcionalidades:**
- Gestión de clientes
- Órdenes de compra
- Cotizaciones
- Facturación
- Historial de pedidos
- Contactos y direcciones
- Métodos de pago

### 6. Módulo Banco de Células

**Ruta:** `/modules/banco-celulas/banco-celulas.js`  
**Acceso:** Técnico (lectura), Admin/Supervisor (escritura)

**Funcionalidades:**
- Registro de líneas celulares
- Trazabilidad de origen
- Condiciones de cultivo
- Criopreservación y descongelación
- Pasajes y diluciones
- Verificación de identidad
- Documentación de derivación

### 7. Módulo Configuración

**Ruta:** `/modules/configuracion/configuracion.js`  
**Acceso:** Solo Administrador

**Funcionalidades:**
- Parámetros globales del sistema
- Integración con servicios externos
- Plantillas de email
- Umbrales de alertas
- Zona horaria, idioma, moneda
- Configuración de backups

### 8. Módulo SGC (Sistema de Gestión de Calidad)

**Ruta:** `/modules/sgc/sgc.js`  
**Acceso:** Admin, Supervisor, Analista

**Funcionalidades:**
- Procedimientos normalizados (SOPs)
- No conformidades y acciones correctivas
- Auditorías internas
- Documentación de cambios
- Registros de capacitación
- Objetivos de calidad

---

## 🔒 Seguridad y Auditoría

### Autenticación

#### JWT (JSON Web Tokens)

```
Headers en solicitudes API:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Structure:**
```json
{
  "sub": "user@xelle.local",
  "iss": "xellesystem",
  "iat": 1706000000,
  "exp": 1706900000,
  "roles": ["ADMIN"],
  "permissions": ["read_users", "write_users"]
}
```

**Expiración:**
- Access Token: 15 minutos
- Refresh Token: 7 días

#### Login Process

```javascript
// POST /api/auth/login
{
  "username": "admin@xelle.local",
  "password": "Admin123!"
}

// Response
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 900,
  "user": {
    "id": "uuid",
    "email": "admin@xelle.local",
    "roles": ["ADMIN"]
  }
}
```

### Control de Acceso (RBAC)

**5 Roles Predefinidos:**

```
┌─────────────────────┬──────────────────────────────────────┐
│ ROL                 │ PERMISOS                             │
├─────────────────────┼──────────────────────────────────────┤
│ ADMIN               │ Acceso total, gestión del sistema   │
│ SUPERVISOR          │ Supervisión, aprobaciones, reportes │
│ ANALYST             │ Entrada de datos, análisis          │
│ TECHNICIAN          │ Operación de equipos, mantenimiento │
│ VIEWER              │ Lectura de reportes, visualización  │
└─────────────────────┴──────────────────────────────────────┘
```

**Permisos Granulares:**

```javascript
{
  "admin@xelle.local": {
    "modules": {
      "users": ["create", "read", "update", "delete"],
      "inventory": ["create", "read", "update", "delete"],
      "reports": ["create", "read", "export"]
    }
  }
}
```

### Manifiesto de Integridad

**Ubicación:** `frontend/hashes.md`

**Propósito:** Detectar cambios no autorizados en archivos estáticos

**Formato:**
```
# MD5 hashes for frontend
Generated: 2026-02-04 10:30:00

Hash                             File
----                             ----
5d41402abc4b2a76b9719d911017c592  index.html
6512bd43d9caa6e02c990b0a82652dca  css/styles.css
...
```

**Regeneración:**

```powershell
# Windows PowerShell
$root='C:\Users\WINDOWS\Desktop\XelleSystem\'; 
$out="${root}frontend/hashes.md"

"# MD5 hashes for frontend" | Out-File -Encoding utf8 $out
"Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File -Encoding utf8 -Append $out
"Hash  File" | Out-File -Encoding utf8 -Append $out
"----  ----" | Out-File -Encoding utf8 -Append $out

Get-ChildItem -Path "${root}frontend" -Recurse -File | Sort-Object FullName | ForEach-Object {
  $h = Get-FileHash -Algorithm MD5 -Path $_.FullName
  $rel = $_.FullName.Substring($root.Length).Replace('\','/')
  '{0}  {1}' -f $h.Hash, $rel | Out-File -Encoding utf8 -Append $out
}
```

```bash
# Linux/macOS
find frontend -type f -exec md5sum {} \; | sort > hashes.md
```

**Validación Periódica:**

```powershell
# Verificar cambios
$root='C:\Users\WINDOWS\Desktop\XelleSystem\'
$tmp="${root}hashes-new.md"

Get-ChildItem -Path "${root}frontend" -Recurse -File | Sort-Object FullName | ForEach-Object {
  $h = Get-FileHash -Algorithm MD5 -Path $_.FullName
  $rel = $_.FullName.Substring($root.Length).Replace('\','/')
  '{0}  {1}' -f $h.Hash, $rel
} | Out-File -Encoding utf8 $tmp

# Comparar
Compare-Object (Get-Content "${root}frontend/hashes.md") (Get-Content $tmp) | Where-Object { $_.SideIndicator -ne '==' }
```

### Auditoría Completa

**Tabla: `audit_logs`**

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,        -- CREATE, READ, UPDATE, DELETE, LOGIN, EXPORT
  resource_type VARCHAR(100),          -- users, reports, inventory, etc.
  resource_id UUID,
  changes JSONB,                       -- before/after values
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20)                   -- SUCCESS, FAILURE
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_action ON audit_logs(action);
```

**Consultas de Auditoría:**

```sql
-- Cambios en últimas 24 horas
SELECT * FROM audit_logs 
WHERE timestamp > NOW() - INTERVAL '1 day'
ORDER BY timestamp DESC;

-- Actividad de usuario específico
SELECT * FROM audit_logs 
WHERE user_id = '...'
ORDER BY timestamp DESC;

-- Intentos fallidos de login
SELECT * FROM audit_logs 
WHERE action = 'LOGIN' AND status = 'FAILURE'
ORDER BY timestamp DESC;
```

### Cumplimiento Normativo

**21 CFR Part 11 (FDA) - Registros y Firmas Electrónicas:**

- ✅ Validación de integridad de datos
- ✅ Trazabilidad de cambios
- ✅ Autenticación de usuarios
- ✅ Auditoría de accesos
- ✅ Encriptación de datos sensibles
- ✅ Firma digital de documentos
- ✅ Retención de registros

**ISO/IEC 27001 - Seguridad de la Información:**

- ✅ Control de acceso
- ✅ Encriptación
- ✅ Auditoría
- ✅ Copias de seguridad
- ✅ Incidentes de seguridad

---

## 🐳 Docker y Containerización

### docker-compose.yml Explicado

```yaml
version: '3.8'

services:
  # ===== PostgreSQL Database =====
  db:
    image: postgres:15-alpine
    container_name: xellesystem_db
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/resources/db:/docker-entrypoint-initdb.d
    ports:
      - "${DB_PORT}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - xellesystem

  # ===== Backend (Java/Spring) =====
  backend:
    build:
      context: ./backend
      dockerfile: ../Dockerfile
    container_name: xellesystem_backend
    depends_on:
      db:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/${DB_NAME}
      SPRING_DATASOURCE_USERNAME: ${DB_USER}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      SPRING_PROFILE: ${SPRING_PROFILE}
      JAVA_OPTS: ${JAVA_OPTS}
    ports:
      - "${SPRING_PORT}:8080"
    volumes:
      - ./backend/logs:/app/logs
    networks:
      - xellesystem
    restart: on-failure

  # ===== Frontend (Nginx) =====
  frontend:
    build:
      context: ./frontend
      dockerfile: ../Dockerfile.frontend
    container_name: xellesystem_frontend
    ports:
      - "${FRONTEND_PORT}:80"
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
    depends_on:
      - backend
    networks:
      - xellesystem
    restart: on-failure

  # ===== Adminer (Database UI - Development Only) =====
  adminer:
    image: adminer:latest
    container_name: xellesystem_adminer
    ports:
      - "8081:8080"
    depends_on:
      - db
    networks:
      - xellesystem
    environment:
      ADMINER_DEFAULT_SERVER: db

volumes:
  postgres_data:
    driver: local

networks:
  xellesystem:
    driver: bridge
```

### Comandos Útiles de Docker

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs de un servicio
docker-compose logs backend -f    # -f = follow
docker-compose logs db -f

# Ejecutar comando en contenedor
docker-compose exec backend bash
docker-compose exec db psql -U xelle -d xellesystem

# Reconstruir imágenes
docker-compose build --no-cache

# Limpiar datos y empezar de cero
docker-compose down -v

# Ver recursos usados
docker stats

# Actualizar variable de entorno
docker-compose up -d --build

# Acceder a bash del contenedor
docker-compose exec backend /bin/bash
```

### Build de Imágenes

#### Backend (Dockerfile)

```dockerfile
FROM maven:3.8-openjdk-17 AS builder
WORKDIR /build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

#### Frontend (Dockerfile.frontend)

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Deployment en Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: xellesystem
spec:
  replicas: 3
  selector:
    matchLabels:
      app: xellesystem
  template:
    metadata:
      labels:
        app: xellesystem
    spec:
      containers:
      - name: backend
        image: xelle/xellesystem-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: DB_HOST
          value: postgres-service
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

---

## ☕ Backend (Java/Spring Boot)

### Estructura del Proyecto Java

```
backend/
├── pom.xml
├── src/main/java/com/xelle/xellesystem/
│   ├── XelleSystemApplication.java          # Main class
│   │
│   ├── controller/
│   │   ├── AuthController.java              # /api/auth
│   │   ├── UserController.java              # /api/users
│   │   ├── ReportController.java            # /api/reports
│   │   └── ...
│   │
│   ├── service/
│   │   ├── UserService.java                 # Lógica de usuarios
│   │   ├── AuthService.java                 # Autenticación
│   │   ├── ReportService.java               # Generación de reportes
│   │   └── ...
│   │
│   ├── repository/
│   │   ├── UserRepository.java              # JPA Repository
│   │   ├── ReportRepository.java
│   │   └── ...
│   │
│   ├── entity/
│   │   ├── User.java                        # Modelo User
│   │   ├── Report.java                      # Modelo Report
│   │   ├── AuditLog.java                    # Log de auditoría
│   │   └── ...
│   │
│   ├── config/
│   │   ├── SecurityConfig.java              # Configuración Spring Security
│   │   ├── JwtConfig.java                   # Configuración JWT
│   │   └── DatabaseConfig.java              # Configuración BD
│   │
│   ├── security/
│   │   ├── JwtTokenProvider.java            # Generación/validación JWT
│   │   ├── AuthenticationFilter.java        # Filtro de autenticación
│   │   └── CustomUserDetailsService.java    # Detalles de usuario
│   │
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java      # Manejo de excepciones
│   │   ├── CustomException.java             # Excepciones personalizadas
│   │   └── ...
│   │
│   └── util/
│       ├── PasswordEncoder.java             # Encriptación de contraseñas
│       ├── DateUtils.java                   # Utilidades de fecha
│       └── ...
│
├── src/main/resources/
│   ├── application.properties                # Configuración por defecto
│   ├── application-dev.properties           # Desarrollo
│   ├── application-prod.properties          # Producción
│   │
│   └── db/
│       ├── schema.sql                       # DDL tablas
│       ├── data.sql                         # Datos iniciales
│       └── migrations/                      # Migraciones (Flyway/Liquibase)
│
└── src/test/
    └── java/...                             # Unit tests
```

### Dependencias Principales (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>2.7.14</version>
    </dependency>

    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- JWT (jjwt) -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>

    <!-- Hibernate Validator -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Lombok (para reducir boilerplate) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Endpoints API Principales

#### Autenticación

```
POST /api/auth/login
  Body: { "username": "...", "password": "..." }
  Response: { "accessToken": "...", "refreshToken": "...", "user": {...} }

POST /api/auth/logout
  Headers: Authorization: Bearer <token>

POST /api/auth/refresh
  Body: { "refreshToken": "..." }
```

#### Usuarios

```
GET /api/users                          # Listar usuarios
GET /api/users/{id}                     # Obtener usuario por ID
POST /api/users                         # Crear usuario
PUT /api/users/{id}                     # Actualizar usuario
DELETE /api/users/{id}                  # Eliminar usuario
GET /api/users/email/{email}            # Buscar por email
POST /api/users/{id}/change-password    # Cambiar contraseña
POST /api/users/{id}/2fa/enable         # Habilitar 2FA
```

#### Reportes

```
GET /api/reports                        # Listar reportes
GET /api/reports/{id}                   # Obtener reporte
POST /api/reports                       # Crear reporte
PUT /api/reports/{id}                   # Actualizar reporte
GET /api/reports/{id}/export?format=pdf # Descargar PDF
GET /api/reports/{id}/export?format=xlsx # Descargar Excel
```

#### Auditoría

```
GET /api/audit/logs                     # Listar logs
GET /api/audit/logs/user/{userId}       # Logs de usuario
GET /api/audit/logs/action/{action}     # Logs por acción
POST /api/audit/export                  # Exportar auditoria
```

### Configuración Spring Boot (application.properties)

```properties
# ===== Server =====
server.port=8080
server.servlet.context-path=/api
server.shutdown=graceful

# ===== Database =====
spring.datasource.url=jdbc:postgresql://localhost:5432/xellesystem
spring.datasource.username=xelle
spring.datasource.password=password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL10Dialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# ===== JWT =====
jwt.secret=tu_jwt_secret_muy_largo_y_aleatorio_minimo_32_caracteres
jwt.expiration=900000

# ===== Logging =====
logging.level.root=INFO
logging.level.com.xelle=DEBUG
logging.file.name=logs/xellesystem.log

# ===== Profile =====
spring.profiles.active=dev
```

---

## 🚀 Desarrollo y Extensión

### Agregar Nuevo Módulo

#### Pasos:

1. **Crear estructura de carpetas:**

```bash
mkdir -p frontend/modules/mi-modulo
touch frontend/modules/mi-modulo/mi-modulo.js
touch frontend/modules/mi-modulo/styles.css
```

2. **Crear archivo JavaScript del módulo:**

```javascript
// frontend/modules/mi-modulo/mi-modulo.js

const MiModulo = {
  name: 'Mi Módulo',
  description: 'Descripción del módulo',
  version: '1.0.0',
  
  init() {
    console.log('Mi Módulo iniciado');
    this.setupEventListeners();
    this.loadData();
  },
  
  setupEventListeners() {
    // Configurar listeners
  },
  
  loadData() {
    // Cargar datos desde API
    fetch('/api/mi-modulo')
      .then(res => res.json())
      .then(data => this.render(data))
      .catch(err => console.error(err));
  },
  
  render(data) {
    // Renderizar interfaz
  }
};

// Registrar módulo
ModuleRegistry.register('mi-modulo', MiModulo);
```

3. **Agregar permisos en backend:**

```sql
INSERT INTO permissions (role_id, module, action)
VALUES 
  ('admin', 'mi-modulo', 'create'),
  ('admin', 'mi-modulo', 'read'),
  ('analyst', 'mi-modulo', 'read');
```

### Agregar Nuevo Formato

1. **Crear archivo HTML:**

```bash
touch frontend/formats/FO-CUSTOM-01.html
```

2. **Estructura básica:**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FO-CUSTOM-01 - Mi Formato</title>
  <link rel="stylesheet" href="format-styles.css">
</head>
<body>
  <div class="format-container">
    <h1>Formato Personalizado</h1>
    <!-- Contenido del formato -->
  </div>
  <script src="format-app.js"></script>
</body>
</html>
```

3. **Regenerar hashes:**

```powershell
# Ejecutar script en README (sección Hashes)
```

### Contribuir al Backend

#### Crear nuevo servicio:

```java
// service/MiServicio.java
package com.xelle.xellesystem.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MiServicio {
  
  public String obtenerDatos() {
    // Implementación
    return "datos";
  }
}
```

#### Crear nuevo controlador:

```java
// controller/MiController.java
package com.xelle.xellesystem.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mi-recurso")
public class MiController {
  
  @GetMapping
  public List<?> listar() {
    // Implementación
  }
  
  @PostMapping
  public ResponseEntity<?> crear(@RequestBody MiDTO dto) {
    // Implementación
  }
}
```

---

## 🌐 Deployment a Producción

### Pre-requisitos de Producción

- [ ] Certificado SSL/TLS válido
- [ ] Base de datos PostgreSQL configurada y respaldada
- [ ] Nginx o Apache como reverse proxy
- [ ] Firewall correctamente configurado
- [ ] Monitoreo y alertas activadas
- [ ] Plan de respaldo (backup) automatizado
- [ ] Logs centralizados (ELK, Splunk, etc.)
- [ ] Plan de recuperación ante desastres (DR)

### Deployment con Docker Compose (Producción)

#### 1. Ajustar docker-compose.yml para producción

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: xellesystem_db
    restart: always
    volumes:
      - /backups/postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    networks:
      - xellesystem

  backend:
    image: registry.example.com/xellesystem-backend:1.0.0
    restart: always
    depends_on:
      - db
    environment:
      SPRING_PROFILE: production
      JAVA_OPTS: "-Xmx2g -Xms1g"
    secrets:
      - jwt_secret
      - db_password
    networks:
      - xellesystem

  frontend:
    image: registry.example.com/xellesystem-frontend:1.0.0
    restart: always
    networks:
      - xellesystem

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/nginx/ssl:ro
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
      - frontend
    networks:
      - xellesystem

secrets:
  db_password:
    file: /run/secrets/db_password
  jwt_secret:
    file: /run/secrets/jwt_secret

networks:
  xellesystem:
    driver: bridge
```

#### 2. Configuración Nginx (nginx.conf)

```nginx
upstream backend {
  server backend:8080;
}

upstream frontend {
  server frontend:80;
}

server {
  listen 80;
  server_name example.com;
  
  # Redirigir HTTP a HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name example.com;
  
  # Certificados SSL
  ssl_certificate /etc/nginx/ssl/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  
  # Compresión
  gzip on;
  gzip_types text/plain text/css application/json;
  
  # Frontend
  location / {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  
  # Backend API
  location /api/ {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }
  
  # Seguridad headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

#### 3. Script de Deployment

```bash
#!/bin/bash
# deploy.sh

set -e

PROJECT_DIR="/opt/xellesystem"
LOG_FILE="/var/log/xellesystem/deploy.log"

echo "[$(date)] Starting deployment..." >> $LOG_FILE

# Pull latest code
cd $PROJECT_DIR
git pull origin main >> $LOG_FILE 2>&1

# Build images
docker-compose build --no-cache >> $LOG_FILE 2>&1

# Run migrations (if needed)
docker-compose exec -T backend java -cp "target/*" \
  org.flywaydb.core.Flyway -locations=classpath:db/migration -configFiles=application.properties migrate \
  >> $LOG_FILE 2>&1

# Deploy with zero downtime
docker-compose up -d --no-deps --build backend >> $LOG_FILE 2>&1
docker-compose up -d --no-deps --build frontend >> $LOG_FILE 2>&1

# Wait for services
sleep 30

# Health check
if ! curl -f http://localhost:8080/api/health > /dev/null; then
  echo "[$(date)] HEALTH CHECK FAILED" >> $LOG_FILE
  docker-compose logs backend >> $LOG_FILE
  exit 1
fi

echo "[$(date)] Deployment completed successfully" >> $LOG_FILE
```

#### 4. Automatizar con Cron

```bash
# /etc/cron.d/xellesystem-deploy
# Deploy diarios a las 2 AM
0 2 * * * root /opt/xellesystem/deploy.sh >> /var/log/xellesystem/cron.log 2>&1
```

### Deployment en Kubernetes (Recomendado para escala)

#### 1. Crear namespace

```bash
kubectl create namespace xellesystem
kubectl create namespace xellesystem-prod
```

#### 2. Secrets

```bash
kubectl create secret generic xellesystem-secrets \
  --from-literal=db-password=tu_password_segura \
  --from-literal=jwt-secret=tu_jwt_secret_largo \
  -n xellesystem-prod
```

#### 3. Helm Chart (recommended)

```bash
# Usar Helm para simplificar deployment
helm repo add xelle-labs https://charts.example.com
helm install xellesystem xelle-labs/xellesystem \
  -n xellesystem-prod \
  -f values-prod.yaml
```

---

## 🔧 Mantenimiento y Operaciones

### Respaldos Automáticos (Backups)

#### PostgreSQL Backup Script

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="xellesystem"

# Crear backup
docker-compose exec -T db pg_dump -U xelle $DB_NAME | \
  gzip > $BACKUP_DIR/xellesystem_$DATE.sql.gz

# Mantener solo últimos 30 días
find $BACKUP_DIR -name "xellesystem_*.sql.gz" -mtime +30 -delete

echo "Backup created: xellesystem_$DATE.sql.gz"
```

**Cronograma:**

```cron
# Backup cada 6 horas
0 */6 * * * /opt/xellesystem/backup.sh
```

### Monitoreo

#### Docker Stats

```bash
# Monitoreo en tiempo real
docker stats --no-stream

# Con influxDB y Grafana
docker-compose -f docker-compose.monitoring.yml up -d
```

#### Health Checks

```bash
# Backend health
curl http://localhost:8080/api/health

# Database health
docker-compose exec db pg_isready -U xelle

# Frontend health
curl http://localhost:8000 -I
```

### Logs y Diagnóstico

```bash
# Ver logs del backend
docker-compose logs backend -f --tail=100

# Buscar errores
docker-compose logs backend | grep ERROR

# Exportar logs
docker-compose logs > xellesystem_logs.txt

# Limpiar logs antiguos
docker exec $(docker-compose ps -q backend) \
  find /app/logs -mtime +30 -delete
```

### Actualizaciones

#### Actualizar Stack

```bash
# 1. Backup de BD
./backup.sh

# 2. Pull new images
docker-compose pull

# 3. Rebuild si es necesario
docker-compose build --no-cache

# 4. Up con nuevas imágenes
docker-compose up -d

# 5. Verificar
docker-compose ps
curl http://localhost:8080/api/health
```

---

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. "Conexión rechazada en puerto 8080"

```bash
# Verificar si el puerto está en uso
lsof -i :8080          # Linux/macOS
netstat -ano | findstr :8080  # Windows

# Verificar logs del backend
docker-compose logs backend

# Solución: esperar a que la BD se inicie
docker-compose down
docker-compose up -d
sleep 20
docker-compose up -d backend
```

#### 2. "No se puede conectar a la base de datos"

```bash
# Verificar estado de BD
docker-compose ps db

# Verificar logs de BD
docker-compose logs db

# Reiniciar BD
docker-compose restart db
docker-compose logs db -f

# Verificar credenciales en .env
grep "DB_" .env

# Conectar manualmente
docker-compose exec db psql -U xelle -d xellesystem
```

#### 3. "CORS errors en el navegador"

```javascript
// En backend (SecurityConfig.java)
@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
      .addMapping("/api/**")
      .allowedOrigins("http://localhost:8000", "https://example.com")
      .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
      .allowCredentials(true)
      .maxAge(3600);
  }
}
```

#### 4. "Out of Memory" en Docker

```bash
# Aumentar memoria asignada
docker-compose.yml:
services:
  backend:
    environment:
      JAVA_OPTS: "-Xmx2g -Xms1g"  # 2GB máximo
```

#### 5. "403 Forbidden" en API

```bash
# Verificar token JWT
curl -H "Authorization: Bearer tu_token" http://localhost:8080/api/users

# Verificar permisos de usuario
# Ver logs: docker-compose logs backend | grep "403\|Forbidden"
```

### Recolectar Información para Debug

```bash
# Generar reporte de diagnóstico
cat > diagnóstico.sh << 'EOF'
#!/bin/bash
echo "=== Docker Info ===" > diagnostic_report.txt
docker-compose ps >> diagnostic_report.txt
echo -e "\n=== Logs Backend ===" >> diagnostic_report.txt
docker-compose logs backend --tail=100 >> diagnostic_report.txt
echo -e "\n=== Logs Database ===" >> diagnostic_report.txt
docker-compose logs db --tail=50 >> diagnostic_report.txt
echo -e "\n=== Environment ===" >> diagnostic_report.txt
docker-compose exec backend env | grep -E "SPRING|JAVA|DB" >> diagnostic_report.txt
echo -e "\n=== Health Checks ===" >> diagnostic_report.txt
curl -s http://localhost:8080/api/health >> diagnostic_report.txt
echo "Reporte guardado en: diagnostic_report.txt"
EOF
chmod +x diagnóstico.sh
./diagnóstico.sh
```

---

## 🤝 Contribuir

### Proceso de Contribución

1. **Fork el repositorio**

```bash
# En GitHub, hacer click en "Fork"
git clone https://github.com/tu-usuario/xellesystem.git
cd xellesystem
```

2. **Crear rama de feature**

```bash
git checkout -b feature/mi-funcionalidad
# o
git checkout -b fix/mi-bugfix
```

3. **Realizar cambios**

```bash
# Editar archivos
# Actualizar hashes si cambias frontend
```

4. **Commit**

```bash
git add .
git commit -m "feat(modulo): descripción clara de cambios"
# Mensaje format: type(scope): descripción
# Types: feat, fix, docs, style, refactor, test, chore
```

5. **Actualizar hashes**

```powershell
# Si modificaste archivos en frontend/
# Ejecutar script de regeneración de hashes (ver README)
git add frontend/hashes.md
git commit -m "chore(frontend): regenerar hashes"
```

6. **Push y Pull Request**

```bash
git push origin feature/mi-funcionalidad
# Abrir PR en GitHub
```

### Guías de Estilo

#### JavaScript

```javascript
// ✅ Bueno
const obtenerUsuarios = async () => {
  const response = await fetch('/api/users');
  const data = await response.json();
  return data;
};

// ❌ Malo
function getUsers() {
  var users;
  fetch('/api/users').then(r => r.json()).then(d => users = d);
  return users;
}
```

#### Java

```java
// ✅ Bueno
@Service
@Slf4j
public class UserService {
  
  @Transactional(readOnly = true)
  public User getUserById(UUID id) {
    log.debug("Fetching user: {}", id);
    return userRepository.findById(id)
      .orElseThrow(() -> new UserNotFoundException(id));
  }
}

// ❌ Malo
public class UserService {
  public User getUserById(String id) {
    try {
      return UserRepository.find(id);
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }
}
```

---

## ❓ FAQ

### Preguntas Frecuentes

**P: ¿Puedo usar MySQL en lugar de PostgreSQL?**
R: Sí, pero PostgreSQL es recomendado. Cambiar en `docker-compose.yml` y ajustar `application.properties`.

**P: ¿Cómo cambio el puerto 8080 del backend?**
R: Modificar `.env`: `SPRING_PORT=3000` y en `docker-compose.yml` el mapeo de puertos.

**P: ¿Qué hacer si olvido la contraseña de admin?**
R: En development, borrar volumen de BD y reiniciar. En production, usar script de reset seguro:
```sql
UPDATE users SET password = bcrypt('NewPassword123!') 
WHERE email = 'admin@xelle.local';
```

**P: ¿Es posible usar XelleSystem sin Docker?**
R: Sí, instalando servicios localmente (Node, Python, Java, PostgreSQL). Ver Sección "Opción B: Desarrollo Local".

**P: ¿Cuál es el tamaño mínimo de disco para producción?**
R: 50GB recomendado (incluye SO, aplicación, BD, logs, backups).

**P: ¿Se puede ejecutar en la nube (AWS, Azure, GCP)?**
R: Sí. Recomendado usar servicios gerenciados:
- **AWS:** RDS (PostgreSQL), ECS/Fargate, CloudFront
- **Azure:** Azure Database for PostgreSQL, App Service, Azure CDN
- **GCP:** Cloud SQL, Cloud Run, Cloud Load Balancing

**P: ¿Cómo escalo XelleSystem para más usuarios?**
R: 
1. Usar Kubernetes en lugar de Docker Compose
2. Base de datos replicada/clustered
3. Load balancer (Nginx, HAProxy)
4. CDN para archivos estáticos

---

## 📄 Licencia y Contacto

### Licencia

XelleSystem está licenciado bajo **MIT License** con restricciones de uso comercial.

```
Copyright (c) 2026 Xelle Labs S.A.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions...
```

Consultar archivo `LICENSE` en la raíz del repositorio.

### Contacto

| Rol | Contacto | Responsabilidad |
|-----|----------|-----------------|
| **Mantenedor Principal** | dev-lead@xelle.local | Decisiones arquitectónicas, releases |
| **DevOps** | devops@xelle.local | Infraestructura, deployment, CI/CD |
| **Seguridad** | security@xelle.local | Auditoría, cumplimiento normativo, CVE |
| **Soporte Técnico** | support@xelle.local | Issues, troubleshooting, usuario final |
| **Documentación** | docs@xelle.local | README, API docs, wiki |

### Enlaces Útiles

- 📖 **Documentación Oficial:** [https://docs.xellesystem.io](https://docs.xellesystem.io)
- 🐛 **Reportar Issues:** [GitHub Issues](https://github.com/xelle/xellesystem/issues)
- 💬 **Discussiones:** [GitHub Discussions](https://github.com/xelle/xellesystem/discussions)
- 📚 **Wiki:** [GitHub Wiki](https://github.com/xelle/xellesystem/wiki)
- 🔐 **Reporte de Vulnerabilidades:** security@xelle.local (no publicar en issues)

---

**Última actualización:** 4 de febrero de 2026  
**Versión del documento:** 2.0  
**Autor:** Equipo de Desarrollo Xelle

---
