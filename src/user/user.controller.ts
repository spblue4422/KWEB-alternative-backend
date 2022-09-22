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
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// 모든 유저 서치... 필요할까?
	@UseGuards(AuthGuard('jwt'))
	@Get('/all')
	async getAllUsers(@Req() req: Request, @Res() res: Response) {
		console.log(req.user);
		try {
			const data = await this.userService.findAllUsers();
			res.status(200).send({ data: data });
		} catch (err) {
			res.status(500).send(err);
		}
	}

	// 본인 정보 확인 / 교수의 학생 정보 확인 / 교수의 교수 정보 확인은...?
	@UseGuards(AuthGuard('jwt'))
	@Get('/:uid')
	async getUserDetail(
		@Req() req,
		@Param('uid') uid: string,
		@Res() res: Response,
	) {
		try {
			const data = await this.userService.findUserById(uid);

			if (!data) {
				res.status(404).send({ data: data });
			} else {
				if (
					req.user.userId == uid ||
					(req.user.userId != uid && req.user.status == 'professor')
				) {
					res.status(200).send({ data: data });
				} else {
					res.status(401).send({ data: data, message: '자격 없음' });
				}
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

	//토큰 정보 확인 및 비교 필요
	@UseGuards(AuthGuard('jwt'))
	@Delete('/remove')
	async removeUser(@Req() req: Request) {}
}
