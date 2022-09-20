import { IsString, IsNumber } from 'class-validator';

export class CreateCourseDto {
	@IsNumber()
	user: number;

	@IsString()
	name: string;

	@IsString()
	description: string;
}
