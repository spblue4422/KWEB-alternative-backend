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
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/createCourse.dto';
import { CreateLectureDto } from './dto/createLecture.dto';
import { Course } from './entity/course.entity';
import { Lecture } from './entity/lecture.entity';

@Controller('courses')
export class CourseController {
	constructor(private courseService: CourseService) {}

	@Get('/all')
	async getAllCourses(@Req() req: Request, @Res() res: Response) {
		try {
			const data: Course[] = await this.courseService.findAllCourses();

			console.log(data);

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

	@Get('/list')
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

	@UseGuards(AuthGuard('jwt'))
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

	// 교수인 사람만 가능
	@UseGuards(AuthGuard('jwt'))
	@Post('/add')
	async addCourse(
		@Req() req,
		@Body() createCourseDto: CreateCourseDto,
		@Res() res: Response,
	) {
		try {
			if (req.user.status == 'professor') {
				const data = await this.courseService.insertCourse(
					createCourseDto,
				);
				res.status(200).send({ data: data });
			} else {
				res.status(401).send({ msg: '자격없음' });
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete('/remove')
	async removeCourse(@Req() req, @Res() res: Response) {}

	@UseGuards(AuthGuard('jwt'))
	@Post('/lectures/add')
	async addLecture(
		@Req() req,
		@Body() createLectureDto: CreateLectureDto,
		@Res() res: Response,
	) {
		try {
			const course = await this.courseService.findCourseById(
				createLectureDto.courseId,
			);
			if (
				req.user.status == 'professor' &&
				req.user.id == course.user.userId
			) {
				const data = await this.courseService.insertLecture(
					createLectureDto,
				);
				res.status(200).send({ data: data });
			} else {
				res.status(401).send({ msg: '자격 없음' });
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	//이거 삭제의 조건은 뭘로 해야할까? 강의 주인만?
	@UseGuards(AuthGuard('jwt'))
	@Delete('/lectures/remove')
	async removeLecture(@Req() req: Request, @Res() res: Response) {}
}
