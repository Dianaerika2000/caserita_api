import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // espera al logger de Pino antes de imprimir logs
  });

  // ─── 1. Logger estructurado ───────────────────────────────────────
  app.useLogger(app.get(Logger));

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  const isProduction = config.get<string>('NODE_ENV') === 'production';

  // ─── 2. Seguridad HTTP (Helmet) ───────────────────────────────────
  app.use(helmet());

  // ─── 3. CORS ──────────────────────────────────────────────────────
  app.enableCors({
    origin: isProduction
      ? [
          'https://caserita.com', // tu web en producción
          'https://admin.caserita.com', // panel admin en producción
        ]
      : '*', // en desarrollo permite cualquier origen (app móvil, Postman, etc.)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ─── 4. Prefijo global y versionado ──────────────────────────────
  // Todas las rutas quedan así: /api/v1/users, /api/v1/auth, etc.
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ─── 5. Validación global de DTOs ────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos que no están en el DTO
      forbidNonWhitelisted: true, // lanza error si llegan campos extra
      transform: true, // convierte tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── 6. Swagger (solo en desarrollo) ─────────────────────────────
  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Caserita API')
      .setDescription('Documentación oficial de la API de Caserita')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT',
        },
        'JWT-auth', // nombre del esquema, se usa en los controladores
      )
      .addTag('auth', 'Autenticación y autorización')
      .addTag('users', 'Gestión de usuarios')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: false,
      swaggerOptions: {
        persistAuthorization: true, // recuerda el token entre recargas
      },
    });
  }

  // ─── 7. Arrancar servidor ─────────────────────────────────────────
  await app.listen(port);

  if (!isProduction) {
    console.log(`🚀 API corriendo en:      http://localhost:${port}/api/v1`);
    console.log(`📚 Swagger disponible en: http://localhost:${port}/docs`);
  }
}
void bootstrap();
