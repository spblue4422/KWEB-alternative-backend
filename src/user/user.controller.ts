import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	Res,
	Query,
	Body,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// 모든 유저 서치... 필요할까?
	@Get('/all')
	async getAllUsers(@Req() req: Request, @Res() res: Response) {
		try {
			const data = await this.userService.findAllUsers();
			res.status(200).send({ data: data });
		} catch (err) {
			res.status(500).send(err);
		}
	}

	// 본인 정보 확인 / 교수의 학생 정보 확인 / 교수의 교수 정보 확인은...?
	@Get()
	async getUserDetail(
		@Req() req: Request,
		@Query('uid') uid: string,
		@Res() res: Response,
	) {
		try {
			const data = await this.userService.findUserById(uid);
			if (!data) {
				res.status(404).send({ data: data });
			} else {
				res.status(200).send({ data: data });
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@Post('/add')
	async addUser(
		@Req() req: Request,
		@Body() createUserDto: CreateUserDto,
		@Res() res: Response,
	) {
		try {
			const data = await this.userService.insertUser(createUserDto);
			res.status(200).send({ data: data });
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@Delete('remove')
	async removeUser(@Req() req: Request) {}
}
