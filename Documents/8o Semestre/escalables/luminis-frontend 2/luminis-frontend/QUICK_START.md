# 🚀 Guía de Inicio Rápido - LUMINIS Frontend

## ⚡ Instalación Rápida

```bash
# 1. Navegar al directorio
cd luminis-frontend

# 2. Instalar dependencias
npm install

# 3. Ejecutar aplicación
ng serve

# 4. Abrir en navegador
# http://localhost:4200
```

## 📌 Lo que YA está funcionando

✅ Estructura completa del proyecto
✅ Navegación con rutas configuradas
✅ Header responsive con menús por rol
✅ Footer completo
✅ Página Home (landing page)
✅ Login y Register funcionales
✅ Guards de autenticación
✅ Interceptor JWT
✅ Servicios (Auth, API, Mentor)
✅ Modelos e interfaces TypeScript

## 🔨 Próximos pasos para desarrollar

1. **Completar componentes de Mentoras**
   - Implementar lista de mentoras con filtros
   - Crear vista de detalle de mentora
   - Agregar componente de tarjeta de mentora

2. **Dashboards**
   - Dashboard de Estudiante
   - Dashboard de Mentora
   - Dashboard de Administrador

3. **Funcionalidades adicionales**
   - Sistema de solicitudes
   - Gestión de perfiles
   - Sistema de reseñas

## 🎯 Estructura de Archivos Clave

```
src/app/
├── core/services/
│   ├── auth.service.ts      ← Login, logout, registro
│   ├── api.service.ts       ← Peticiones HTTP
│   └── mentor.service.ts    ← CRUD mentoras
├── core/guards/
│   ├── auth.guard.ts        ← Protege rutas auth
│   └── role.guard.ts        ← Protege por roles
├── models/index.ts          ← Todas las interfaces
├── shared/components/       ← Header, Footer
└── features/                ← Páginas por módulo
```

## 🔑 Datos de prueba (simulados)

Por ahora el frontend trabaja con datos simulados. Para conectar al backend:

1. Iniciar backend en `http://localhost:3000`
2. Los servicios ya están configurados para hacer peticiones a `/api`
3. Las respuestas deben seguir las interfaces en `models/index.ts`

## 🎨 Personalización

### Colores
Editar variables en `src/styles.scss`:
```scss
:root {
  --luminis-primary: #8B5CF6;
  --luminis-secondary: #EC4899;
  // ...
}
```

### Logo
Reemplazar en Header component:
```html
<span class="text-primary-luminis">LUMI</span>
<span class="text-secondary-luminis">NIS</span>
```

## 🐛 Solución de Problemas

**Error: Cannot find module**
```bash
npm install
```

**Puerto 4200 en uso**
```bash
ng serve --port 4201
```

**Errores de compilación**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Recursos Útiles

- [Angular Docs](https://angular.dev)
- [Bootstrap 5 Docs](https://getbootstrap.com)
- [Bootstrap Icons](https://icons.getbootstrap.com)
- [RxJS](https://rxjs.dev)

## 💡 Tips de Desarrollo

1. Usa Angular DevTools (extensión de Chrome)
2. Mantén las interfaces actualizadas en `models/`
3. Sigue la estructura de carpetas establecida
4. Usa standalone components (ya configurado)
5. Aprovecha lazy loading para optimizar

## ✨ Siguientes Features a Agregar

- [ ] Lista de mentoras con filtros
- [ ] Detalle de mentora con reseñas
- [ ] Dashboard de estudiante
- [ ] Envío de solicitudes
- [ ] Panel administrativo
- [ ] Notificaciones en tiempo real
- [ ] Chat/mensajería (opcional)

---

¡Listo para desarrollar! 🎉
