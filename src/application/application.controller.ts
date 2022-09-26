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
			const data = await this.applicationService.insertApplication(
				req.user.userId,
				cid,
			);

			return data;
		} catch (err) {
			throw new InternalServerErrorException();
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
		} catch (err) {
			throw new InternalServerErrorException();
		}
	}
}
