// src/modules/auth/dtos/auth.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
    @ApiProperty({
        example: 'jdoe',
        description: 'Nombre de usuario del empleado',
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        example: 'supersecreto123',
        description: 'Contraseña del empleado',
        minLength: 6,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
}

export class ChangePasswordDto {
    @ApiProperty({
        example: 'contraseña_actual123',
        description: 'Contraseña actual del usuario',
    })
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @ApiProperty({
        example: 'nueva_contraseña123',
        description: 'Nueva contraseña del usuario',
        minLength: 6,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, {
        message: 'La nueva contraseña debe tener al menos 6 caracteres',
    })
    newPassword: string;
}
