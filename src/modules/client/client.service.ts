// Ruta: src/modules/client/client.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { Client } from 'generated/prisma';

@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) {}

    // Este método es para el controlador de clientes, lanza un error si el teléfono existe
    async findOrCreate(data: CreateClientDto): Promise<Client> {
        // 1. Intentar buscar por número de teléfono si se proporciona
        if (data.phoneNumber) {
            const client = await this.prisma.client.findFirst({
                where: { phoneNumber: data.phoneNumber },
            });
            if (client) {
                // Modificación: Lanzar una excepción si el cliente ya existe con ese número
                throw new BadRequestException(
                    'El número de teléfono ya está asociado a otro cliente.',
                );
            }
        }

        // 2. Si no se encontró por teléfono, buscar por nombre completo
        const clientByFullName = await this.prisma.client.findFirst({
            where: {
                fullName: { contains: data.fullName },
            },
        });

        // 3. Si no se encuentra, crear un nuevo cliente
        if (!clientByFullName) {
            return await this.prisma.client.create({
                data: {
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    companyName: data.companyName,
                    isFrecuent: data.isFrecuent,
                },
            });
        }

        // Si el cliente existe por nombre pero no por teléfono, lo retornamos
        return clientByFullName;
    }

    // NUEVO MÉTODO: Dedicado al flujo de servicios, no lanza errores si el cliente existe
    async findOrCreateForService(data: CreateClientDto): Promise<Client> {
        let client: Client | null = null;

        // 1. Intentar buscar por número de teléfono si se proporciona
        if (data.phoneNumber) {
            client = await this.prisma.client.findFirst({
                where: { phoneNumber: data.phoneNumber },
            });
            if (client) {
                return client;
            }
        }

        // 2. Si no se encontró por teléfono, buscar por nombre completo
        client = await this.prisma.client.findFirst({
            where: {
                fullName: { contains: data.fullName },
            },
        });

        // 3. Si no se encuentra, crear un nuevo cliente
        if (!client) {
            return await this.prisma.client.create({
                data: {
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    companyName: data.companyName,
                    isFrecuent: data.isFrecuent,
                },
            });
        }

        // Si se encontró, retornarlo
        return client;
    }

    // Método para obtener todos los clientes
    async findAll(): Promise<Client[]> {
        return this.prisma.client.findMany();
    }

    // Método para buscar un cliente por ID
    async findById(id: number): Promise<Client | null> {
        return this.prisma.client.findUnique({
            where: { id },
        });
    }

    // Método para actualizar un cliente
    async update(id: number, data: UpdateClientDto): Promise<Client> {
        return this.prisma.client.update({
            where: { id },
            data,
        });
    }
}
