import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { Client } from 'generated/prisma';

@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) {}

    // Lógica principal: Buscar cliente por nombre completo o teléfono
    async findOrCreate(data: CreateClientDto): Promise<Client> {
        let client: Client | null;

        // 1. Intentar buscar por número de teléfono si se proporciona
        if (data.phoneNumber) {
            client = await this.prisma.client.findFirst({
                where: { phoneNumber: data.phoneNumber },
            });
            if (client) {
                return client;
            }
        }

        // 2. Si no se encontró por teléfono, buscar por nombre completo (ajustado para MySQL)
        // La consulta con "contains" no es case-sensitive en MySQL por defecto
        // y es una forma de realizar una "búsqueda inteligente".
        client = await this.prisma.client.findFirst({
            where: {
                fullName: {
                    contains: data.fullName,
                },
            },
        });

        // 3. Si no se encuentra, crear un nuevo cliente
        if (!client) {
            client = await this.prisma.client.create({
                data: {
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    companyName: data.companyName,
                    isFrecuent: data.isFrecuent,
                },
            });
        }
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
