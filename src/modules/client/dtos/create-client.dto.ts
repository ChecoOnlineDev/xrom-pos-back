import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateClientDto {
    @ApiProperty({
        example: 'Sergio Alejandro De La Cruz Garcia',
        description: 'Nombre completo del cliente',
    })
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @ApiPropertyOptional({
        example: '753-110-4567',
        description: 'Número de teléfono del cliente',
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiPropertyOptional({
        example: 'XROM SYSTEMS.',
        description: 'Nombre de la compañía',
    })
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiPropertyOptional({
        example: false,
        description: 'Indica si es un cliente frecuente',
    })
    @IsOptional()
    @IsBoolean()
    isFrecuent?: boolean;
}
