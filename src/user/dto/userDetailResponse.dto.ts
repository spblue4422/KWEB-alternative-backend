import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class UserDetailResponseDto {
	@IsNumber()
	@ApiProperty({ description: 'id' })
	id: number;

	@IsString()
	@ApiProperty({ description: '로그인 계정' })
	userId: string;

	@IsString()
	@ApiProperty({ description: '이름' })
	name: string;

	@IsString()
	@ApiProperty({ description: '학번/교번' })
	uniqueNum: string;

	@IsDate()
	@ApiProperty({ description: '등록 일자' })
	createdDate: Date;
}
