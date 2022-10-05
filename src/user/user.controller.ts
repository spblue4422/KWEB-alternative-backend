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
import { identity } from 'rxjs';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// 모든 유저 서치... 필요할까?
	// 일단은 닫아두고 나중에 어드민 계정을 만든다면 추가해도 될듯.
	@UseGuards(AuthGuard('jwt'))
	@Get('/all')
	async getAllUsers(@Req() req: Request, @Res() res: Response) {
		try {
			const data = await this.userService.findAllUsers();
			res.status(200).send({ code: 'SUCCESS', msg: '성공', data: data });
		} catch (err) {
			res.status(500).send(err);
		}
	}

	// 본인 정보 확인 / 교수의 학생 정보 확인
	@UseGuards(AuthGuard('jwt'))
	@Get('/:uid')
	async getUserDetail(
		@Req() req,
		@Param('uid') uid: string,
		@Res() res: Response,
	) {
		try {
			if (
				req.user.userId == uid ||
				(req.user.userId != uid && req.user.status == 'professor')
			) {
				const data = await this.userService.findUserByUserId(uid);
				if (!data) {
					res.status(404).send({ code: '', msg: '', data: null });
				} else {
					res.status(200).send({
						code: 'SUCCESS',
						msg: '성공',
						data: data,
					});
				}
			} else {
				res.status(401).send({
					code: '',
					msg: '자격 없음',
					data: null,
				});
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	// 회원가입
	@Post('/add')
	async addUser(
		@Req() req: Request,
		@Body() createUserDto: CreateUserDto,
		@Res() res: Response,
	) {
		try {
			const data = await this.userService.insertUser(createUserDto);

			res.status(200).send(data);
		} catch (err) {
			res.status(500).send(err);
		}
	}

	//토큰 정보 확인 및 비교 필요
	// 어드민 계정이 추가된다면, 조건에 추가하면 될듯
	@UseGuards(AuthGuard('jwt'))
	@Delete('/remove/:uid')
	async removeUser(
		@Req() req,
		@Param('uid') uid: string,
		@Res() res: Response,
	) {
		try {
			if (req.user.userId != uid) {
				res.status(401).send({ code: '', msg: '', data: null });
			} else {
				const user = await this.userService.findUserByUserId(uid);
				const data = await this.userService.deleteUser(user);

				res.status(200).send(data);
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}
}
