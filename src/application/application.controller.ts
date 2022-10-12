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
				res.status(401).send({ code: '', msg: '자격없음', data: null });
			} else {
				const data = await this.applicationService.insertApplication(
					req.user.id,
					cid,
				);

				res.status(200).send(data);
			}
		} catch (err) {
			res.status(500).send(err);
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
				res.status(401).send({ code: '', msg: '자격없음', data: null });
			} else {
				const data = await this.applicationService.deleteApplication(
					req.user.id,
					cid,
				);

				res.status(200).send(data);
			}
		} catch (err) {
			res.status(500).send(err);
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
			if (req.user.status != 'professor') {
				res.status(401).send({
					code: '',
					msg: '자격 없음',
					data: null,
				});
			} else {
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
					const data =
						await this.applicationService.deleteApplication(
							uid,
							cid,
						);
					res.status(200).send(data);
				} else {
					res.status(400).send({
						code: '',
						msg: '본인의 강의가 아니거나, 잘못된 id',
						data: null,
					});
				}
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}
}
