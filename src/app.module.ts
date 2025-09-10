import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TechnicalServiceModule } from './modules/technical_service/technical_service.module';
import { ClientModule } from './modules/client/client.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        UserModule,
        AuthModule,
        TechnicalServiceModule,
        ClientModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        // Configuracion del middleware
    }
}
