import { Controller, Delete, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	findUser() {}

	@Post()
	addUser() {}

	@Delete()
	deleteUser() {}
}
