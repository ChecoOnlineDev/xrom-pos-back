import { Module } from '@nestjs/common';
import { TechnicalServiceService } from './technical_service.service';
import { TechnicalServiceController } from './technical_service.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClientModule } from '../client/client.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@/config/config.module';

@Module({
    imports: [PrismaModule, ClientModule, AuthModule, ConfigModule],
    controllers: [TechnicalServiceController],
    providers: [TechnicalServiceService],
    exports: [TechnicalServiceService],
})
export class TechnicalServiceModule {}
