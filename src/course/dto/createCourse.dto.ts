import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: '코스명' })
	name: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: '설명' })
	description: string;
}
