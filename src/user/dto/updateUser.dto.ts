import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
	@IsString()
	@ApiProperty({ description: '비밀번호' })
	password: string;

	@IsString()
	@ApiProperty({ description: '이름' })
	name: string;

	@IsString()
	@ApiProperty({ description: '상태' })
	status: string;
}
