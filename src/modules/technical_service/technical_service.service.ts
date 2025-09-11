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
        //Utilizamos el metodo del modulo client para buscar o crear un cliente
        const client = await this.clientService.findOrCreate(
            createServiceDto.client,
        );

        //Creamos un folio unico que identifique el servicio tecnico
        const folioNumber = `SRV-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Crear el servicio con el cliente ya registrado
        return this.prisma.service.create({
            data: {
                folioNumber,
                clientId: client.id,
                receivedById: userId, // Corregido: usa el campo correcto
                receptionDate: new Date(),
                serviceReason: createServiceDto.serviceReason,
                initialNotes: createServiceDto.initialNotes,
                status: 'PENDING',
            },
        });
    }
}
