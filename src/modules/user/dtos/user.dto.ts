import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, UserStatus } from 'generated/prisma';

export class UserDto {
    @ApiProperty({ example: 1, description: 'ID único del usuario' })
    id: number;

    @ApiProperty({
        example: 'jdoe',
        description: 'Nombre de usuario para el login',
    })
    username: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Nombre completo del usuario',
    })
    name: string;

    @ApiProperty({
        example: Role.EMPLOYEE,
        enum: Role,
        description: 'Rol del usuario',
    })
    role: Role;

    @ApiProperty({
        example: UserStatus.ACTIVE,
        enum: UserStatus,
        description: 'Estado de la cuenta',
    })
    status: UserStatus;

    @ApiPropertyOptional({
        example: '2023-10-01T12:00:00Z',
        description: 'Fecha de creación',
    })
    created_at: Date;

    @ApiPropertyOptional({
        example: '2023-10-01T12:00:00Z',
        description: 'Fecha de última actualización',
    })
    updated_at: Date;
}
