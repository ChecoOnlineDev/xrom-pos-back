import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from 'src/config/config.module';

@Module({
    imports: [PrismaModule, AuthModule, ConfigModule],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
