import {
    Injectable,
    UnauthorizedException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto, ChangePasswordDto } from './dtos/auth.dto';
import { ResponseStatus } from 'src/common/dtos/response.dto';
import { compare, hash } from 'bcryptjs';
import { Role } from 'generated/prisma';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signIn(
        signInDto: AuthLoginDto,
    ): Promise<{ access_token: string; refresh_token: string }> {
        const { username, password } = signInDto;
        const user = await this.userService.findByUsername(username);

        // Validar que el usuario exista
        if (!user) {
            throw new UnauthorizedException({
                status: ResponseStatus.ERROR,
                message: 'El usuario ingresado no existe',
            });
        }

        // Comparar la contraseña hasheada
        if (!(await compare(password, user.password))) {
            throw new UnauthorizedException({
                status: ResponseStatus.ERROR,
                message: 'La contraseña es incorrecta',
            });
        }

        // Crear payload para los tokens
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
        };

        // Generar tokens
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: '5m',
        });
        const refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });

        return {
            access_token,
            refresh_token,
        };
    }

    async refreshToken(
        refreshToken: string,
    ): Promise<{ access_token: string }> {
        try {
            // Se asume que el `JwtModule` está configurado para verificar el secret del refresh token.
            const payload = await this.jwtService.verifyAsync(refreshToken);
            const newAccessToken = await this.jwtService.signAsync(
                { sub: payload.sub, username: payload.username },
                { expiresIn: '15m' },
            );
            return { access_token: newAccessToken };
        } catch {
            throw new ForbiddenException('Invalid refresh token');
        }
    }

    async changePassword(
        userId: number,
        changePasswordDto: ChangePasswordDto,
    ): Promise<void> {
        const { currentPassword, newPassword } = changePasswordDto;

        const user = await this.userService.findByUsername(userId.toString()); // Asume que findByUsername puede recibir el id
        if (!user) {
            throw new UnauthorizedException({
                status: ResponseStatus.ERROR,
                message: 'Usuario no encontrado',
            });
        }

        const isCurrentPasswordValid = await compare(
            currentPassword,
            user.password,
        );
        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException({
                status: ResponseStatus.ERROR,
                message: 'La contraseña actual es incorrecta',
            });
        }

        const isSamePassword = await compare(newPassword, user.password);
        if (isSamePassword) {
            throw new BadRequestException({
                status: ResponseStatus.ERROR,
                message:
                    'La nueva contraseña debe ser diferente a la contraseña actual',
            });
        }

        const hashedNewPassword = await hash(newPassword, 10);
        await this.userService.updatePassword(userId, hashedNewPassword);
    }
}
