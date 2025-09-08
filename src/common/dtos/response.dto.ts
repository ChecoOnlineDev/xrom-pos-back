import { ApiProperty } from '@nestjs/swagger';

export enum ResponseStatus {
    SUCCESS = 'success',
    ERROR = 'error',
}

export class ResponseDto {
    @ApiProperty({ enum: ResponseStatus })
    status: ResponseStatus;

    @ApiProperty()
    message: string;
}
