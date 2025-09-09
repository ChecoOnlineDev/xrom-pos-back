import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    MinLength,
    IsEnum,
    IsOptional,
} from 'class-validator';
import { Role } from 'generated/prisma';

export class CreateUserDto {
    @ApiProperty({ example: 'jdoe', description: 'Nombre de usuario' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Nombre completo del usuario',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: 'supersecreto123',
        description: 'Contraseña del usuario',
        minLength: 6,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @ApiProperty({
        example: Role.EMPLOYEE,
        enum: Role,
        description: 'Rol del usuario',
    })
    @IsNotEmpty()
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
