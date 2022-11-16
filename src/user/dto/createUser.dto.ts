import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: '로그인 계정' })
	userId: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: '비밀번호' })
	password: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: '이름' })
	name: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: '학번/교번' })
	uniqueNum: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: '상태' })
	status: string;
}
