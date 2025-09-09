// src/app.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TechnicalServiceModule } from './modules/technical_service/technical_service.module';

// ... otros imports si los hubiera

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        UserModule,
        AuthModule,
        TechnicalServiceModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        // Tu configuración de middleware va aquí
    }
}
