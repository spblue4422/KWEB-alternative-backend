import { IsString, IsNumber } from 'class-validator';

export class CreateLectureDto {
	@IsNumber()
	courseId: number;

	@IsString()
	title: string;

	@IsString()
	content: string;
}
