import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@ApiProperty({ description: '로그인 계정' })
	userId: string;

	@IsString()
	@ApiProperty({ description: '비밀번호' })
	password: string;

	@IsString()
	@ApiProperty({ description: '이름' })
	name: string;

	@IsString()
	@ApiProperty({ description: '학번/교번' })
	uniqueNum: string;

	@IsString()
	@ApiProperty({ description: '상태' })
	status: string;
}
