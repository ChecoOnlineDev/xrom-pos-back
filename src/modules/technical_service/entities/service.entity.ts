import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceStatus } from 'generated/prisma';

export class ServiceEntity {
    @ApiProperty()
    folioNumber: string;

    @ApiProperty()
    clientId: number;

    @ApiProperty()
    receptionDate: Date;

    @ApiProperty()
    receivedById: number;

    @ApiPropertyOptional()
    assignedToId?: number;

    @ApiProperty({ enum: ServiceStatus })
    status: ServiceStatus;

    @ApiProperty()
    serviceReason: string;

    @ApiPropertyOptional()
    initialNotes?: string;

    @ApiPropertyOptional()
    cancellationReason?: string;

    @ApiPropertyOptional()
    onHoldReason?: string;

    @ApiPropertyOptional()
    completionDate?: Date;

    @ApiPropertyOptional()
    serviceSummary?: string;

    @ApiPropertyOptional()
    deliveredAt?: Date;
}
