import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role, UserStatus } from 'generated/prisma';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'jdoe', description: 'Nombre de usuario' })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiPropertyOptional({
        example: 'John Doe',
        description: 'Nombre completo del usuario',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        example: 'nuevacontraseña123',
        description: 'Nueva contraseña',
    })
    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password?: string;

    @ApiPropertyOptional({
        example: Role.ADMIN,
        enum: Role,
        description: 'Rol del usuario',
    })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @ApiPropertyOptional({
        example: UserStatus.INACTIVE,
        enum: UserStatus,
        description: 'Estado de la cuenta',
    })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
}
