import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
    ResponseUserArrDto,
    ResponseUserObjDto,
} from './dtos/response-user.dto';
import { ResponseDto, ResponseStatus } from 'src/common/dtos/response.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { ErrorAuthResponseDto } from '../auth/dtos/response-auth.dto';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@ApiUnauthorizedResponse({
    description: 'Error de autenticacion o token invalido',
    type: ErrorAuthResponseDto,
})
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @Roles(Role.ADMIN) //Solo los administradores pueden registrar nuevos empleados
    @ApiOperation({
        summary: 'Crear un nuevo empleado',
        description: 'Registra un nuevo empleado en el sistema.',
    })
    @ApiBody({ type: CreateUserDto })
    @ApiCreatedResponse({
        description: 'Empleado creado exitosamente',
        type: ResponseUserObjDto,
    })
    async create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<ResponseUserObjDto> {
        const user = await this.userService.create(createUserDto);
        return {
            status: ResponseStatus.SUCCESS,
            message: 'Empleado creado exitosamente',
            data: user,
        };
    }

    @Get()
    @Roles(Role.ADMIN) //Solo los administradores pueden ver la lista de empleados
    @ApiOperation({
        summary: 'Obtener todos los empleados',
        description: 'Devuelve una lista de todos los empleados del sistema.',
    })
    @ApiOkResponse({
        description: 'Lista de empleados obtenida correctamente',
        type: ResponseUserArrDto,
    })
    async findAll(): Promise<ResponseUserArrDto> {
        const users = await this.userService.findAll();
        return {
            status: ResponseStatus.SUCCESS,
            message: 'Lista de empleados obtenida correctamente',
            data: users,
        };
    }

    @Get(':id')
    @Roles(Role.ADMIN) //Solo los administradores pueden ver los detalles de un empleado especifico
    @ApiOperation({
        summary: 'Obtener un empleado por ID',
        description:
            'Devuelve los detalles de un empleado específico por su ID.',
    })
    @ApiParam({ name: 'id', description: 'ID del empleado' })
    @ApiOkResponse({
        description: 'Detalles del empleado',
        type: ResponseUserObjDto,
    })
    @ApiNotFoundResponse({
        description: 'Empleado no encontrado',
        type: ResponseDto,
    })
    @ApiBadRequestResponse({ description: 'ID inválido', type: ResponseDto })
    async findOne(@Param('id') id: string): Promise<ResponseUserObjDto> {
        const user = await this.userService.findById(Number(id));
        return {
            status: ResponseStatus.SUCCESS,
            message: 'Empleado obtenido correctamente',
            data: user,
        };
    }

    @Put(':id')
    @Roles(Role.ADMIN) //solo los administradores pueden actualizar los datos de un empleado que no sea el mismo
    @ApiOperation({
        summary: 'Actualizar un empleado',
        description: 'Actualiza los datos de un empleado existente por su ID.',
    })
    @ApiParam({ name: 'id', description: 'ID del empleado' })
    @ApiBody({ type: UpdateUserDto })
    @ApiOkResponse({
        description: 'Empleado actualizado exitosamente',
        type: ResponseUserObjDto,
    })
    @ApiNotFoundResponse({
        description: 'Empleado no encontrado',
        type: ResponseDto,
    })
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<ResponseUserObjDto> {
        const user = await this.userService.update(Number(id), updateUserDto);
        return {
            status: ResponseStatus.SUCCESS,
            message: 'Empleado actualizado exitosamente',
            data: user,
        };
    }

    @Delete(':id')
    @Roles(Role.ADMIN) //Solo los administradores pueden eliminar empleados
    @ApiOperation({
        summary: 'Eliminar (borrado lógico) un empleado',
        description: 'Elimina un empleado específico por su ID.',
    })
    @ApiParam({ name: 'id', description: 'ID del empleado' })
    @ApiOkResponse({
        description: 'Empleado eliminado exitosamente',
        type: ResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Empleado no encontrado',
        type: ResponseDto,
    })
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<ResponseDto> {
        await this.userService.remove(Number(id));
        return {
            status: ResponseStatus.SUCCESS,
            message: 'Empleado eliminado exitosamente',
        };
    }
}
