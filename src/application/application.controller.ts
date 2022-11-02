import {
	Controller,
	Get,
	Post,
	Req,
	Res,
	Body,
	Param,
	Query,
	Delete,
	InternalServerErrorException,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { ApplicationService } from './application.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/entity/course.entity';
import { Repository } from 'typeorm';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ResultResponseDto } from 'src/util/resultResponseDto';

@Controller('application')
export class ApplicationController {
	constructor(
		@InjectRepository(Course)
		private readonly courseRepository: Repository<Course>,

		private readonly applicationService: ApplicationService,
	) {}

	// 학생 - 수강신청
	@UseGuards(AuthGuard('jwt'))
	@Post('/add')
	@ApiOperation({
		summary: '수강 신청 API',
		description: '수강 신청 추가',
	})
	@ApiCreatedResponse({
		description: '수강 신청 추가',
		type: ResultResponseDto,
	})
	async addApplication(
		@Req() req,
		@Body() cid: number,
		@Res() res: Response,
	) {
		try {
			if (req.user.status != 'student') {
				res.status(402).send({
					code: 'ERR_402',
					msg: '자격없음',
					data: null,
				});
			} else {
				const data = await this.applicationService.insertApplication(
					req.user.id,
					cid,
				);

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

	// 학생 - 수강신청 취소
	@UseGuards(AuthGuard('jwt'))
	@Delete('/delete')
	@ApiOperation({
		summary: '수강 취소 API',
		description: '수강 취소 추가',
	})
	@ApiCreatedResponse({
		description: '수강 취소 추가',
		type: ResultResponseDto,
	})
	async removeApplication(
		@Req() req,
		@Query('cid') cid: number,
		@Res() res: Response,
	) {
		try {
			if (req.user.status != 'student') {
				res.status(402).send({
					code: 'ERR_402',
					msg: '자격없음',
					data: null,
				});
			} else {
				const application =
					await this.applicationService.findApplicationById(
						req.user.id,
						cid,
					);

				const data = await this.applicationService.deleteApplication(
					application,
				);

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

	// 교수 - 자신 코스 신청한 학생 드롭
	@UseGuards(AuthGuard('jwt'))
	@Delete('/drop')
	@ApiOperation({
		summary: '수강 금지 API',
		description: '수강 금지 추가',
	})
	@ApiCreatedResponse({
		description: '수강 금지 추가',
		type: ResultResponseDto,
	})
	async dropApplication(
		@Req() req,
		@Query('uid') uid: number,
		@Query('cid') cid: number,
		@Res() res: Response,
	) {
		try {
			const course = await this.courseRepository
				.find({
					select: {
						id: true,
					},
					where: {
						id: cid,
						user: {
							id: req.user.id,
						},
					},
					relations: {
						user: true,
					},
				})
				.catch((err) => {
					throw new InternalServerErrorException();
				});
			if (!course) {
				res.status(402).send({
					code: 'ERR_402',
					msg: '자격 없음',
					data: null,
				});
			} else {
				const application =
					await this.applicationService.findApplicationById(uid, cid);
				const data = await this.applicationService.deleteApplication(
					application,
				);
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
