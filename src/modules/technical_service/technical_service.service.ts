// Ruta: src/modules/technical_service/technical_service.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from '../client/client.service';
import { CreateTechnicalServiceDto } from './dtos/create-technical-service.dto';
import { Service } from 'generated/prisma';

@Injectable()
export class TechnicalServiceService {
    constructor(
        private prisma: PrismaService,
        private clientService: ClientService,
    ) {}

    async createTechnicalService(
        createServiceDto: CreateTechnicalServiceDto,
        userId: number,
    ): Promise<Service> {
        // Usamos el nuevo método findOrCreateForService
        const client = await this.clientService.findOrCreateForService(
            createServiceDto.client,
        );

        const folioNumber = `SRV-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        return this.prisma.service.create({
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
    }
}
