// src/config/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
    constructor(private configService: NestConfigService) {}

    get jwtSecret(): string {
        const value = this.configService.get<string>('secretJwt');
        if (!value) throw new Error('JWT secret is not defined');
        return value;
    }

    get port(): number {
        const value = this.configService.get<number>('port');
        if (!value) throw new Error('Port is not defined');
        return Number(value);
    }

    get environment(): string {
        const value = this.configService.get<string>('env');
        if (!value) throw new Error('Environment is not defined');
        return value;
    }
}
