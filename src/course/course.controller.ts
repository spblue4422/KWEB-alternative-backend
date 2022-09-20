import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	Req,
	Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CourseService } from './course.service';
import { Course } from './entity/course.entity';
import { Lecture } from './entity/lecture.entity';

@Controller('courses')
export class CourseController {
	constructor(private courseService: CourseService) {}

	@Get('/all')
	async getAllCourses(@Req() req: Request, @Res() res: Response) {
		try {
			const data: Course[] = await this.courseService.findAllCourses();

			res.status(200).send({ data: data });
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@Get('/:id')
	async getCourseDetail(
		@Req() req: Request,
		@Param('id') id,
		@Res() res: Response,
	) {
		try {
			const data: Course = await this.courseService.findCourseById(id);

			if (!data) {
				res.status(404).send({ data: data });
			} else {
				res.status(200).send({ data: data });
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@Get('/users/:uid')
	async getAllCoursesByProfId(
		@Req() req: Request,
		@Query('uid') uid: string,
		@Res() res: Response,
	) {
		try {
			const data: Course[] =
				await this.courseService.findAllCoursesByUserId(uid);

			res.status(200).send({ data: data });
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@Get('/lectures/:id')
	async getLectureById(
		@Req() req: Request,
		@Param('id') id,
		@Res() res: Response,
	) {
		try {
			const data: Lecture = await this.courseService.findLectureById(id);

			if (!data) {
				res.status(404).send({ data: data });
			} else {
				res.status(200).send({ data: data });
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@Post()
	async createCourse(@Req() req: Request, @Body() body, @Res() res: Response) {}

	@Delete()
	async removeCourse(@Req() req: Request, @Res() res: Response) {}

	@Post()
	async createLecture(@Req() req: Request, @Res() res: Response) {}

	@Delete()
	async removeLecture(@Req() req: Request, @Res() res: Response) {}
}
