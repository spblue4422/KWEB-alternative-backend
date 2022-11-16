import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLectureDto {
	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ description: '코스 id' })
	courseId: number;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: '제목' })
	title: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: '내용' })
	content: string;
}
