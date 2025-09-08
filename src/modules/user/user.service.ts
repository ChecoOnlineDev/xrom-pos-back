// src/modules/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    // Función de ayuda para mapear un objeto de Prisma a un UserDto seguro
    private mapUserToDto(user: any): UserDto {
        const { password, ...userDto } = user;
        return userDto as UserDto;
    }

    async create(data: CreateUserDto): Promise<UserDto> {
        const hashedPassword = await hash(data.password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        return this.mapUserToDto(newUser);
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

    async findById(id: number): Promise<UserDto> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        return this.mapUserToDto(user);
    }

    async updatePassword(id: number, hashedPassword: string) {
        return this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }

    // Métodos adicionales para el UserController
    async findAll(): Promise<UserDto[]> {
        const users = await this.prisma.user.findMany();
        return users.map((user) => this.mapUserToDto(user));
    }

    async update(id: number, data: UpdateUserDto): Promise<UserDto> {
        if (data.password) {
            data.password = await hash(data.password, 10);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data,
        });
        return this.mapUserToDto(updatedUser);
    }

    async remove(id: number): Promise<void> {
        await this.prisma.user.delete({ where: { id } });
    }
}
