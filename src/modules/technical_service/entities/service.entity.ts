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
    assignedToId?: number | null;

    @ApiProperty({ enum: ServiceStatus })
    status: ServiceStatus;

    @ApiProperty()
    serviceReason: string;

    @ApiPropertyOptional()
    initialNotes?: string | null;
    @ApiPropertyOptional()
    cancellationReason?: string | null;

    @ApiPropertyOptional()
    onHoldReason?: string | null;

    @ApiPropertyOptional()
    completionDate?: Date | null;

    @ApiPropertyOptional()
    serviceSummary?: string | null;

    @ApiPropertyOptional()
    deliveredAt?: Date | null;
}
