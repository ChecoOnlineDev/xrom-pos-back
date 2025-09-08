// src/modules/auth/dtos/response-auth.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dtos/response.dto';

export enum AuthOkCode {
    LOGIN = 'LOGIN_SUCCESS',
    REFRESH = 'REFRESH_SUCCESS',
    LOGOUT = 'LOGOUT_SUCCESS',
}

export enum AuthErrorCode {
    NO_TOKEN = 'NO_TOKEN',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    INVALID_TOKEN = 'INVALID_TOKEN',
    AUTH_ERROR = 'AUTH_ERROR',
}

export class OkAuthResponseDto extends ResponseDto {
    @ApiPropertyOptional({ enum: AuthOkCode, example: AuthOkCode.LOGIN })
    code?: AuthOkCode;
}

export class ErrorAuthResponseDto extends ResponseDto {
    @ApiPropertyOptional({
        enum: AuthErrorCode,
        example: AuthErrorCode.NO_TOKEN,
    })
    code?: AuthErrorCode;
}
