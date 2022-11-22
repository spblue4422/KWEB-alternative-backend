import { Controller, Req, Post, Res, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ResultResponseDto } from 'src/util/resultResponseDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// 로그인
	@UseGuards(AuthGuard('local'))
	@Post('/login')
	@ApiOperation({
		summary: '로그인 API',
		description: '로그인',
	})
	@ApiCreatedResponse({
		description: '로그인',
		type: ResultResponseDto,
	})
	async login(@Req() req, @Res({ passthrough: true }) res: Response) {
		const data = await this.authService.userLogin(req.user);
		const token = data.token;
		await res.cookie('Authorization', token, {
			sameSite: 'none',
			secure: true,
			domain: 'localhost',
		});

		return { code: 'SUCCESS', msg: '로그인 성공', data: data };
	}

	//로그아웃
	@UseGuards(AuthGuard('jwt'))
	@Get('/logout')
	@ApiOperation({
		summary: '로그아웃 API',
		description: '로그아웃',
	})
	@ApiCreatedResponse({
		description: '로그아웃',
		type: ResultResponseDto,
	})
	async logout(@Req() req, @Res() res: Response) {
		await res.cookie('Authorization', 'logout', {
			sameSite: 'none',
			secure: true,
			domain: 'localhost',
			maxAge: 0,
		});

		const data = { code: 'SUCCESS', msg: '로그아웃 성공', data: null };

		res.status(200).send(data);
	}
}
