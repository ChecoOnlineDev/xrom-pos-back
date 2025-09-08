// src/modules/auth/guards/auth.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from 'src/config/config.service';
import { ResponseStatus } from 'src/common/dtos/response.dto';
import { AuthErrorCode } from '../dtos/response-auth.dto';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException({
                status: ResponseStatus.ERROR,
                message: 'No se proporcionó un token de autenticación.',
                code: AuthErrorCode.NO_TOKEN,
            });
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.jwtSecret,
            });
            request['user'] = payload;
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedException({
                    status: ResponseStatus.ERROR,
                    message:
                        'Token expirado. Por favor, inicia sesión de nuevo.',
                    code: AuthErrorCode.TOKEN_EXPIRED,
                });
            }
            if (err.name === 'JsonWebTokenError') {
                throw new UnauthorizedException({
                    status: ResponseStatus.ERROR,
                    message:
                        'Token inválido. Por favor, inicia sesión de nuevo.',
                    code: AuthErrorCode.INVALID_TOKEN,
                });
            }
            throw new UnauthorizedException({
                status: ResponseStatus.ERROR,
                message:
                    'Error de autenticación. Por favor, inicia sesión de nuevo.',
                code: AuthErrorCode.AUTH_ERROR,
            });
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
