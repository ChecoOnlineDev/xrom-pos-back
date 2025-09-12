// Ruta: src/modules/technical_service/technical_service.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from '../client/client.service';
import { CreateTechnicalServiceDto } from './dtos/create-technical-service.dto';
import { Service } from 'generated/prisma';
import { ServiceEntity } from './entities/service.entity';
import { serializeDates } from '@/common/utils/serialize-date.util';

@Injectable()
export class TechnicalServiceService {
    constructor(
        private prisma: PrismaService,
        private clientService: ClientService,
    ) {}

    private async generateUniqueFolio(): Promise<string> {
        let folio: string = '';
        let isUnique = false;
        let attempt = 0;

        // Genera un folio y verifica su unicidad, reintentando si es necesario
        while (!isUnique && attempt < 5) {
            const randomSuffix = Math.random()
                .toString(36)
                .substr(2, 6)
                .toUpperCase();
            folio = `SRV-${new Date().getFullYear()}-${randomSuffix}`;
            const existingService = await this.prisma.service.findUnique({
                where: { folioNumber: folio },
            });
            if (!existingService) {
                isUnique = true;
            }
            attempt++;
        }

        if (!isUnique) {
            throw new InternalServerErrorException(
                'No se pudo generar un folio único para el servicio. Intenta de nuevo.',
            );
        }

        return folio;
    }

    async createTechnicalService(
        createServiceDto: CreateTechnicalServiceDto,
        userId: number,
    ): Promise<ServiceEntity> {
        // 1. Encontrar o crear el cliente
        const client = await this.clientService.findOrCreateForService(
            createServiceDto.client,
        );

        // 2. Generar un folio único
        const folioNumber = await this.generateUniqueFolio();

        // 3. Crear el registro del servicio en la base de datos
        const newService = await this.prisma.service.create({
            data: {
                folioNumber,
                clientId: client.id,
                receivedById: userId,
                receptionDate: new Date(),
                serviceReason: createServiceDto.serviceReason,
                initialNotes: createServiceDto.initialNotes,
                status: 'PENDING',
            },
        });

        // 4. Transformar el objeto de Prisma al DTO de respuesta.
        const serviceData: ServiceEntity = serializeDates({
            ...newService,
            assignedToId: newService.assignedToId ?? undefined,
            initialNotes: newService.initialNotes ?? undefined,
            cancellationReason: newService.cancellationReason ?? undefined,
            onHoldReason: newService.onHoldReason ?? undefined,
            completionDate: newService.completionDate ?? undefined,
            serviceSummary: newService.serviceSummary ?? undefined,
            deliveredAt: newService.deliveredAt ?? undefined,
        });

        return serviceData;
    }
}
