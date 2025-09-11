import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('clients')
export class ClientController {
    constructor(private clientService: ClientService) {}

    @Post()
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @ApiOperation({
        summary: 'Crea un nuevo cliente o lo encuentra si ya existe',
    })
    @ApiResponse({
        status: 201,
        description: 'Cliente creado o encontrado exitosamente.',
    })
    async createOrFind(@Body() createClientDto: CreateClientDto) {
        return this.clientService.findOrCreate(createClientDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Obtiene todos los clientes' })
    async findAll() {
        return this.clientService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Obtiene un cliente por ID' })
    async findById(@Param('id') id: string) {
        return this.clientService.findById(Number(id));
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Actualiza los datos de un cliente' })
    async update(
        @Param('id') id: string,
        @Body() updateClientDto: UpdateClientDto,
    ) {
        return this.clientService.update(Number(id), updateClientDto);
    }
}
