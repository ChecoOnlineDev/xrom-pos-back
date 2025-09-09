import { Module } from '@nestjs/common';
import { TechnicalServiceService } from './technical_service.service';
import { TechnicalServiceController } from './technical_service.controller';

@Module({
    controllers: [TechnicalServiceController],
    providers: [TechnicalServiceService],
})
export class TechnicalServiceModule {}
