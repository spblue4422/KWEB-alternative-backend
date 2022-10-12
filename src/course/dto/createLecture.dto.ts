import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLectureDto {
	@IsNumber()
	@ApiProperty({ description: '코스 id' })
	courseId: number;

	@IsString()
	@ApiProperty({ description: '제목' })
	title: string;

	@IsString()
	@ApiProperty({ description: '내용' })
	content: string;
}
