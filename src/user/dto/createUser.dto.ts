import { IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	userId: string;

	@IsString()
	password: string;

	@IsString()
	name: string;

	@IsString()
	uniqueNum: string;

	@IsString()
	status: string;
}
