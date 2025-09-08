import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('secretJwt'),
                signOptions: { expiresIn: '15m' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard], // Agregamos AuthGuard como un proveedor
    exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
