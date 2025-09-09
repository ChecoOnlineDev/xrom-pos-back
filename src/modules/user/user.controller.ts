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
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
    ResponseUserArrDto,
    ResponseUserObjDto,
} from './dtos/response-user.dto';
import { ResponseDto, ResponseStatus } from 'src/common/dtos/response.dto';

@ApiTags('Usuarios')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
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
