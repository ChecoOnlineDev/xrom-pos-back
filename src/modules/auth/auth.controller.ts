import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Request,
    Get,
    Put,
    Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, ChangePasswordDto } from './dtos/auth.dto';
import {
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiOperation,
    ApiTags,
    ApiBearerAuth,
    ApiBody,
    ApiParam,
    ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import {
    OkAuthResponseDto,
    ErrorAuthResponseDto,
} from './dtos/response-auth.dto';
import { ResponseDto, ResponseStatus } from 'src/common/dtos/response.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Iniciar sesión',
        description:
            'Permite a los empleados autenticarse con sus credenciales.',
    })
    @ApiOkResponse({
        description: 'Autenticación exitosa',
        type: OkAuthResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Credenciales inválidas',
        type: ErrorAuthResponseDto,
    })
    @ApiBody({ type: AuthLoginDto })
    @Post('login')
    async signIn(@Body() signInDto: AuthLoginDto) {
        return this.authService.signIn(signInDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
    @ApiOkResponse({ description: 'Datos del usuario extraídos del token' })
    getProfile(@Request() req: any) {
        return req.user;
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put('change-password/:user_id')
    @ApiOperation({ summary: 'Cambiar contraseña del usuario autenticado' })
    @ApiParam({ name: 'user_id', description: 'ID del usuario' })
    @ApiOkResponse({
        description: 'Contraseña cambiada exitosamente',
        type: ResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Contraseña actual incorrecta o usuario no autenticado',
        type: ErrorAuthResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Nueva contraseña igual a la actual',
        type: ResponseDto,
    })
    async changePassword(
        @Param('user_id') user_id: number,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<ResponseDto> {
        await this.authService.changePassword(
            Number(user_id),
            changePasswordDto,
        );
        return {
            status: ResponseStatus.SUCCESS,
            message: 'Contraseña cambiada exitosamente',
        };
    }
}
