import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUserDto) {
        // Hashear la contraseña antes de guardar el usuario
        const hashedPassword = await hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }

    async findByUsername(username: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            throw new NotFoundException(
                `Usuario con nombre de usuario ${username} no encontrado.`,
            );
        }
        return user;
    }

    async findById(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        return user;
    }

    async updatePassword(id: number, hashedPassword: string) {
        return this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
}
