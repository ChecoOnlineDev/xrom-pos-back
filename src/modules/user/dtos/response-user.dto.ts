// src/modules/user/dtos/response-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { UserDto } from './user.dto';

export class ResponseUserArrDto extends ResponseDto {
    @ApiProperty({ type: () => UserDto, isArray: true })
    data: UserDto[];
}

export class ResponseUserObjDto extends ResponseDto {
    @ApiProperty({ type: () => UserDto })
    data: UserDto;
}
