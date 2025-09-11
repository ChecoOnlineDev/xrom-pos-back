import { Module, forwardRef } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@/config/config.module';

@Module({
    imports: [PrismaModule, forwardRef(() => AuthModule), ConfigModule],
    providers: [ClientService],
    controllers: [ClientController],
    exports: [ClientService],
})
export class ClientModule {}
