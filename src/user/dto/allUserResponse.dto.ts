import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class AllUserResponseDto {
	@IsNumber()
	@ApiProperty({ description: 'id' })
	id: number;

	@IsString()
	@ApiProperty({ description: '로그인 계정' })
	userId: string;
}
