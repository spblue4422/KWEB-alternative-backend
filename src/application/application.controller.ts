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
import { Application } from './application.entity';

@Controller('application')
export class ApplicationController {
	constructor(private readonly applicationService: ApplicationService) {}

	@UseGuards(AuthGuard('jwt'))
	@Post('/add')
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

				res.status(200).send({ data: data });
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete('/delete')
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

				res.status(200).send({ data: data });
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}
}
