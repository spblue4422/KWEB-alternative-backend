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
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ResultResponseDto } from 'src/util/resultResponseDto';
import { UserDetailResponseDto } from './dto/userDetailResponse.dto';
import { AllUserResponseDto } from './dto/allUserResponse.dto';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// 모든 유저 서치... 필요할까?
	// 일단은 닫아두고 나중에 어드민 계정을 만든다면 추가해도 될듯.
	@UseGuards(AuthGuard('jwt'))
	@Get('/all')
	@ApiOperation({
		summary: '전체 유저 조회 API',
		description: '전체 유저 조회',
	})
	@ApiCreatedResponse({
		description: '전체 유저 조회',
		type: AllUserResponseDto,
	})
	async getAllUsers(@Req() req: Request, @Res() res: Response) {
		try {
			const data: User[] = await this.userService.findAllUsers();
			res.status(200).send({
				code: 'SUCCESS',
				msg: '성공',
				data: data,
			});
		} catch (err) {
			res.status(500).send({
				code: 'ERR_500',
				msg: '서버 에러',
				data: err,
			});
		}
	}

	//본인 정보 조회
	@UseGuards(AuthGuard('jwt'))
	@Get('/my')
	async getMyInfoDetail(@Req() req, @Res() res) {
		try {
			const data: User = await this.userService.findUserByUserId(
				req.user.userId,
			);
			res.status(200).send({
				code: 'SUCCESS',
				msg: '성공',
				data: data,
			});
		} catch (err) {
			res.status(500).send({
				code: 'ERR_500',
				msg: '서버 에러',
				data: err,
			});
		}
	}

	// 교수 전용
	@UseGuards(AuthGuard('jwt'))
	@Get('/:uid')
	@ApiOperation({
		summary: '타 유저 정보 조회 API',
		description: '타 유저 정보 조회',
	})
	@ApiCreatedResponse({
		description: '타 유저 정보 조회',
		type: UserDetailResponseDto,
	})
	async getUserDetail(
		@Req() req,
		@Param('uid') uid: string,
		@Res() res: Response,
	) {
		try {
			if (req.user.status == 'professor') {
				const data = await this.userService.findUserByUserId(uid);
				if (!data) {
					res.status(404).send({
						code: 'ERR_404',
						msg: '데이터가 존재하지 않음',
						data: null,
					});
				} else {
					res.status(200).send({
						code: 'SUCCESS',
						msg: '성공',
						data: data,
					});
				}
			} else {
				res.status(402).send({
					code: 'ERR_402',
					msg: '자격 없음',
					data: null,
				});
			}
		} catch (err) {
			res.status(500).send({
				code: 'ERR_500',
				msg: '서버 에러',
				data: err,
			});
		}
	}

	// 회원가입
	@Post('/add')
	@ApiOperation({
		summary: '유저 정보 추가 API',
		description: '유저 정보 추가',
	})
	@ApiCreatedResponse({
		description: '유저 정보 추가',
		type: ResultResponseDto,
	})
	async addUser(
		@Req() req: Request,
		@Body() createUserDto: CreateUserDto,
		@Res() res: Response,
	) {
		try {
			const data = await this.userService.insertUser(createUserDto);

			res.status(200).send(data);
		} catch (err) {
			res.status(500).send({
				code: 'ERR_500',
				msg: '서버 에러',
				data: err,
			});
		}
	}

	// 토큰 정보 확인 및 비교 필요
	// 어드민 계정이 추가된다면, 조건에 추가하면 될듯
	// 현재 상위에 바인딩된 정보가 삭제되면 하위 정보들 모두 삭제 (ex. 유저정보가 삭제되면 해당 유저가 쓴 게시물 모두 삭제)
	// 나중엔 로직을 좀 수정해서 삭제된 게시물들의 결과 데이터도 표시하게끔 개선하면 좋을듯
	@UseGuards(AuthGuard('jwt'))
	@Delete('/remove/:uid')
	@ApiOperation({
		summary: '유저 정보 삭제 API',
		description: '유저 정보 삭제',
	})
	@ApiCreatedResponse({
		description: '유저 정보 삭제',
		type: ResultResponseDto,
	})
	async removeUser(
		@Req() req,
		@Param('uid') uid: string,
		@Res() res: Response,
	) {
		try {
			if (req.user.userId != uid) {
				res.status(402).send({
					code: 'ERR_402',
					msg: '자격 없음',
					data: null,
				});
			} else {
				const user = await this.userService.findUserByUserId(uid);
				const data = await this.userService.deleteUser(user);

				res.status(200).send(data);
			}
		} catch (err) {
			res.status(500).send({
				code: 'ERR_500',
				msg: '서버 에러',
				data: err,
			});
		}
	}
}
