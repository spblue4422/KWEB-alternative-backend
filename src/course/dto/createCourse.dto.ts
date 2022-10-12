import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
	@IsString()
	@ApiProperty({ description: '코스명' })
	name: string;

	@IsString()
	@ApiProperty({ description: '설명' })
	description: string;
}
