import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env.validation';
import { CategoriesModule } from './modules/categories/categories.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    // ─── 1. Configuración de entorno ─────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true, // disponible en toda la app sin reimportar
      validationSchema: envValidationSchema, // valida el .env al arrancar
      envFilePath: '.env',
    }),

    // ─── 2. Base de datos ─────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true, // carga las entidades automáticamente
        // synchronize: config.get<string>('NODE_ENV') === 'development',
        logging: config.get<string>('NODE_ENV') === 'development',
        ssl: true,
      }),
    }),

    // ─── 3. Rate limiting ─────────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10, // cambia 3 → 10
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // ─── 4. Logging estructurado ──────────────────────────────────
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
    // ─── 5. Health checks ─────────────────────────────────────────
    TerminusModule,
    CategoriesModule,
    StoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
