import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
    HttpStatus,
} from '@nestjs/common';
import { TechnicalServiceService } from './technical_service.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { CreateTechnicalServiceDto } from './dtos/create-technical-service.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
    ApiResponse,
} from '@nestjs/swagger';
import { ResponseStatus } from 'src/common/dtos/response.dto';
import { CreateServiceResponseDto } from './dtos/response-technical-service.dto';
import { ServiceEntity } from './entities/service.entity';

@ApiTags('Servicios Técnicos')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('technical-service')
export class TechnicalServiceController {
    constructor(
        private readonly technicalServiceService: TechnicalServiceService,
    ) {}

    @Post()
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Registra un nuevo servicio técnico' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Servicio creado exitosamente',
        type: CreateServiceResponseDto,
    })
    async create(
        @Body() createServiceDto: CreateTechnicalServiceDto,
        @Req() req: any,
    ): Promise<CreateServiceResponseDto> {
        const userId = req.user.sub;
        const newService =
            await this.technicalServiceService.createTechnicalService(
                createServiceDto,
                userId,
            );

        const serviceData = {
            ...newService,
            assignedToId: newService.assignedToId ?? undefined,
            initialNotes: newService.initialNotes ?? undefined,
            cancellationReason: newService.cancellationReason ?? undefined,
            onHoldReason: newService.onHoldReason ?? undefined,
            completionDate: newService.completionDate ?? undefined,
            serviceSummary: newService.serviceSummary ?? undefined,
            deliveredAt: newService.deliveredAt ?? undefined,
        };

        return {
            status: ResponseStatus.SUCCESS,
            message: 'Servicio técnico registrado exitosamente.',
            data: serviceData,
        };
    }
}
