import { IsString, IsNumber } from 'class-validator';

export class CreateCourseDto {
	@IsNumber()
	userId: number;

	@IsString()
	name: string;

	@IsString()
	description: string;
}
