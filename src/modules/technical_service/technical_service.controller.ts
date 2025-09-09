import { Controller } from '@nestjs/common';
import { TechnicalServiceService } from './technical_service.service';

@Controller('technical-service')
export class TechnicalServiceController {
  constructor(private readonly technicalServiceService: TechnicalServiceService) {}
}
