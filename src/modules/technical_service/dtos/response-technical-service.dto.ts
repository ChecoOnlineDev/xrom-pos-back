import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ServiceEntity } from '../entities/service.entity';

export class CreateServiceResponseDto extends ResponseDto {
    @ApiProperty({ type: () => ServiceEntity })
    data: ServiceEntity;
}
