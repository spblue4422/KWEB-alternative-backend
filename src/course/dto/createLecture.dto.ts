import { IsString, IsNumber } from 'class-validator';

export class CreateLectureDto {
	@IsNumber()
	course: number;

	@IsString()
	title: string;

	@IsString()
	content: string;
}
