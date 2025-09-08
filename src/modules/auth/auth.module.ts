// src/modules/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule as NestConfigModule } from '@nestjs/config'; // Renombra para evitar conflictos
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from 'src/config/config.module'; // Importa tu módulo de configuración
import { AuthGuard } from './guards/auth.guard';

@Module({
    imports: [
        forwardRef(() => UserModule),
        ConfigModule, // Usa tu ConfigModule personalizado
        NestConfigModule, // Si aún necesitas el módulo global, renómbralo
        JwtModule.registerAsync({
            imports: [NestConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('secretJwt'),
                signOptions: { expiresIn: '15m' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard],
    exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
