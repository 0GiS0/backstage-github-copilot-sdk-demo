# BACKSTAGE_ENTITY_NAME

BACKSTAGE_ENTITY_DESCRIPTION

## Inicio rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Esto inicia Vite en `http://localhost:5173` y Electron simultáneamente. Los cambios se verán reflejados en tiempo real con hot-reload.

### Compilación

```bash
npm run build
```

Compila la aplicación para producción.

### Empaquetado

```bash
npm run dist
```

Crea un instalador para tu sistema operativo actual.

## Scripts

- `npm start` - Ejecuta la aplicación
- `npm run dev` - Desarrollo con Vite + Electron
- `npm run build` - Compila la aplicación
- `npm run dist` - Empaqueta para distribución

## Estructura

```
src/
  ├── main.ts      # Proceso principal de Electron
  ├── preload.ts   # Script de preload
  ├── App.tsx      # Componente React
  └── App.css      # Estilos
index.html         # Punto de entrada HTML
vite.config.ts     # Config de Vite
tsconfig.json      # Config de TypeScript
```

## Debugging en VS Code

Abre "Run and Debug" (Ctrl+Shift+D) y selecciona "Main + renderer" para debuguear tanto el proceso principal como el renderer.

## Seguridad

- ✅ Context Isolation
- ✅ Sandbox
- ✅ Preload script aislado

## Tecnologías

- **Electron 31+**
- **React 18**
- **TypeScript**
- **Vite**

## Licencia

Este proyecto está licenciado bajo la MIT License - ver el archivo LICENSE para detalles.
