# London Barber 💈

Sistema integral de gestión de citas y reservas para barbería.

## 📁 Estructura del Proyecto

```
londonBarber/
├── backend/        # API REST construida con Express, TypeScript y Prisma ORM
├── frontend/       # Interfaz de usuario (en desarrollo)
└── automation/     # Scripts y flujos de automatización
```

## 🚀 Backend

### Tecnologías
- **Node.js** con **TypeScript**
- **Express 5**
- **Prisma ORM** con PostgreSQL
- **CORS** y **dotenv**

### Endpoints principales
- `GET /health`: Verificación del estado de la API
- `/api/barbers`: Gestión de barberos
- `/api/services`: Catálogo de servicios y precios
- `/api/appointments`: Gestión y reserva de citas

### Instalación y Ejecución

1. Entrar al directorio del backend:
   ```bash
   cd backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Copiar `.env.example` a `.env` y ajustar la cadena de conexión a la base de datos PostgreSQL:
   ```bash
   cp .env.example .env
   ```

4. Ejecutar migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```

5. (Opcional) Ejecutar seeds con datos iniciales:
   ```bash
   npx prisma db seed
   ```

6. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```
