import { Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { LectureService } from './lecture.service';
import { Lecture } from './entity/lecture.entity';

@Controller('lecture')
export class LectureController {
	constructor(private lectureService: LectureService) {}

	@Get()
	async getAllLectures(@Req() req: Request, @Res() res: Response) {
		try {
			const data: Lecture[] = await this.lectureService.findAllLectures();

			// 필요없을듯?
			// if (!data) {
			// 	res.status(400).send({ data: '강의가 조회되지 않습니다.' });
			// } else {
			// 	res.status(200).send({ data: data });
			// }
			res.status(200).send({ data: data });
		} catch (e) {
			res.status(500).send(e);
		}
	}

	@Get()
	getLectureDetail(@Req() req: Request, @Res() res: Response) {}

	@Get()
	getAllLecturesByProfId(@Req() req: Request, @Res() res: Response) {}

	@Post()
	async createLecture(@Req() req: Request, @Res() res: Response) {}

	@Delete()
	async removeLecture(@Req() req: Request, @Res() res: Response) {}

	@Post()
	async createLectureBoard(@Req() req: Request, @Res() res: Response) {}

	@Delete()
	async removeLectureBoard(@Req() req: Request, @Res() res: Response) {}
}
