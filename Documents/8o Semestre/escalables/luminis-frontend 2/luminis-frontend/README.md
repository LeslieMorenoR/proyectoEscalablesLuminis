# 🌟 LUMINIS - Red de Mentoría para Mujeres

Frontend desarrollado en Angular para el proyecto de Aplicaciones Web Escalables.

## 📋 Descripción

LUMINIS es una plataforma web que conecta a mujeres estudiantes con profesionales experimentadas mediante un sistema de mentoría estructurado. La aplicación facilita el crecimiento profesional, académico y personal de las participantes.

## 🛠️ Stack Tecnológico

- **Framework:** Angular 21 (última versión)
- **CSS:** Bootstrap 5 + Angular Material
- **Lenguaje:** TypeScript
- **Estilos:** SCSS
- **Arquitectura:** Componentes standalone, Lazy loading

## 📁 Estructura del Proyecto

```
src/app/
├── core/                    # Servicios singleton, guards, interceptors
│   ├── guards/              # authGuard, roleGuard
│   ├── interceptors/        # jwtInterceptor
│   └── services/            # AuthService, ApiService, MentorService
├── shared/                  # Componentes reutilizables
│   └── components/          # Header, Footer
├── features/                # Módulos por funcionalidad
│   ├── auth/               # Login, Register
│   ├── home/               # Página principal
│   ├── mentors/            # Búsqueda y perfiles de mentoras
│   ├── student/            # Dashboard estudiante
│   ├── mentor-dashboard/   # Dashboard mentora
│   └── admin/              # Panel administrador
└── models/                  # Interfaces y tipos TypeScript
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 18 o superior
- npm 9 o superior

### Pasos de Instalación

1. **Instalar dependencias**
```bash
npm install
```

2. **Ejecutar en modo desarrollo**
```bash
ng serve
```

3. **Abrir en navegador**
```
http://localhost:4200
```

## 🔧 Configuración del Backend

Actualmente el frontend está configurado para conectarse a:
```
http://localhost:3000/api
```

Para cambiar la URL del backend, edita:
- `src/app/core/services/auth.service.ts`
- `src/app/core/services/api.service.ts`

## 👥 Roles de Usuario

La aplicación maneja 4 roles diferentes:

1. **Visitante** - Ver home, explorar áreas, ver perfiles públicos
2. **Estudiante** - Buscar mentoras, enviar solicitudes, gestionar perfil
3. **Mentora** - Recibir solicitudes, gestionar perfil profesional
4. **Administrador** - Acceso completo, gestión de usuarios y áreas

## 🎨 Componentes Implementados

### ✅ Completados
- Header, Footer, Home, Login, Register

### 🚧 Generados (pendientes)
- Mentor List/Detail, Dashboards, Admin

## 📝 Scripts Disponibles

```bash
npm start              # Desarrollo
npm run build         # Producción
npm test              # Tests
```

## 👨‍💻 Autor

Leslie Anais Moreno Ramos  
Ingeniería en Sistemas Inteligentes  
UASLP - 2026
