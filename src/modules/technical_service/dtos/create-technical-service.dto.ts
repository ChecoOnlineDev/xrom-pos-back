import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ClientInfoForServiceDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'Nombre completo del cliente',
    })
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @ApiPropertyOptional({
        example: '555-123-4567',
        description: 'Número de teléfono del cliente',
    })
    @IsString()
    phoneNumber: string;
}

//Dto para crear un servicio tecnico
export class CreateTechnicalServiceDto {
    @ApiProperty({ type: () => ClientInfoForServiceDto })
    @ValidateNested()
    @Type(() => ClientInfoForServiceDto)
    client: ClientInfoForServiceDto;

    @ApiProperty({
        example: 'La laptop no enciende',
        description: 'Razón del servicio. Es obligatorio.',
    })
    @IsNotEmpty()
    @IsString()
    serviceReason: string;

    @ApiPropertyOptional({
        example:
            'Se intentó encender con adaptador, pero no muestra señal de vida.',
        description: 'Notas iniciales opcionales sobre el estado del equipo.',
    })
    @IsString()
    initialNotes?: string;
}
