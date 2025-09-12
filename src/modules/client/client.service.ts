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

        const clientByFullName = await this.prisma.client.findFirst({
            where: {
                fullName: { contains: data.fullName },
            },
        });

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

        return clientByFullName;
    }

    async findOrCreateForService(data: CreateClientDto): Promise<Client> {
        let client: Client | null = null;

        // 1. Prioridad: Buscar por número de teléfono
        if (data.phoneNumber) {
            client = await this.prisma.client.findFirst({
                where: { phoneNumber: data.phoneNumber },
            });

            if (client) {
                // Si encontramos una coincidencia por teléfono, verificamos el nombre.
                if (client.fullName === data.fullName || !data.fullName) {
                    // El nombre coincide o no se proporcionó un nombre nuevo, reutilizamos el cliente.
                    return client;
                } else {
                    // El nombre no coincide, asumimos que es un cliente diferente.
                    // Creamos uno nuevo para mantener la integridad de los datos.
                    return await this.prisma.client.create({
                        data: {
                            fullName: data.fullName,
                            phoneNumber: data.phoneNumber,
                            companyName: data.companyName,
                            isFrecuent: data.isFrecuent,
                        },
                    });
                }
            }
        }

        // 2. Si no se encontró por teléfono, buscamos por nombre completo (si se proporciona)
        if (!client && data.fullName) {
            client = await this.prisma.client.findFirst({
                where: {
                    fullName: { contains: data.fullName },
                },
            });
            if (client) {
                // Si encontramos una coincidencia por nombre, asociamos el servicio a este cliente
                return client;
            }
        }

        // 3. Si no hay coincidencias por teléfono ni nombre, se crea un nuevo cliente
        return await this.prisma.client.create({
            data: {
                fullName: data.fullName,
                phoneNumber: data.phoneNumber,
                companyName: data.companyName,
                isFrecuent: data.isFrecuent,
            },
        });
    }

    async findAll(): Promise<Client[]> {
        return this.prisma.client.findMany();
    }

    async findById(id: number): Promise<Client | null> {
        return this.prisma.client.findUnique({
            where: { id },
        });
    }

    async update(id: number, data: UpdateClientDto): Promise<Client> {
        return this.prisma.client.update({
            where: { id },
            data,
        });
    }
}
