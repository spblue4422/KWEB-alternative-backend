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

	@UseGuards(AuthGuard('jwt'))
	@Get('/all')
	async getAllCourses(@Req() req: Request, @Res() res: Response) {
		try {
			const data: Course[] = await this.courseService.findAllCourses();

			//console.log(data);

			res.status(200).send({ code: 'SUCCESS', msg: '성공', data: data });
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/:id')
	async getCourseDetail(
		@Req() req: Request,
		@Param('id') id,
		@Res() res: Response,
	) {
		try {
			const data: Course = await this.courseService.findCourseById(id);

			if (!data) {
				res.status(404).send({ code: '', msg: '', data: null });
			} else {
				res.status(200).send({
					code: 'SUCCESS',
					msg: '성공',
					data: data,
				});
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/list')
	async getAllCoursesByProfId(
		@Req() req: Request,
		@Query('uid') uid: string,
		@Res() res: Response,
	) {
		try {
			const data: Course[] =
				await this.courseService.findAllCoursesByUserId(uid);

			res.status(200).send({ code: 'SUCCESS', msg: '성공', data: data });
		} catch (err) {
			res.status(500).send(err);
		}
	}

	// 신청한 사람인지 확인해보고 가져와야 하지 않을까?
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
				res.status(404).send({ code: '', msg: '', data: null });
			} else {
				res.status(200).send({
					code: 'SUCCESS',
					msg: '성공',
					data: data,
				});
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
					req.user.userId,
				);
				// add성공했을때 return도 좀 수정해야할듯?
				res.status(200).send({ data: data });
			} else {
				res.status(401).send({ code: '', msg: '', data: null });
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete('/remove/:id')
	async removeCourse(@Req() req, @Param('id') id, @Res() res: Response) {
		try {
			// 이 로직이 서비스 안으로 들어간다면?
			const course = await this.courseService.findCourseById(id);
			if (!course) {
				res.status(400).send({
					code: '',
					msg: '데이터 없음',
					data: null,
				});
			} else {
				if (req.user.id != course.user.id) {
					res.status(401).send({
						code: '',
						msg: '자격 없음',
						data: null,
					});
				} else {
					const data = await this.courseService.deleteCourse(course);

					res.status(200).send({ data: data });
				}
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('/lectures/add')
	async addLecture(
		@Req() req,
		@Body() createLectureDto: CreateLectureDto,
		@Res() res: Response,
	) {
		try {
			// 이 로직도 안으로 넣어버린다면?
			const course = await this.courseService.findCourseById(
				createLectureDto.courseId,
			);
			if (!course) {
				res.status(404).send({
					code: '',
					msg: '존재하지 않는 강의',
					data: null,
				});
			} else {
				if (
					req.user.status == 'professor' &&
					req.user.id == course.user.id
				) {
					const data = await this.courseService.insertLecture(
						createLectureDto,
						course,
					);
					res.status(200).send({
						data: data,
					});
				} else {
					res.status(401).send({
						code: '',
						msg: '자격 없음',
						data: null,
					});
				}
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	//이거 삭제의 조건은 뭘로 해야할까? 강의 주인만? 당연한거 아닌가 ㅋㅋ;
	@UseGuards(AuthGuard('jwt'))
	@Delete('/lectures/remove')
	async removeLecture(@Req() req: Request, @Res() res: Response) {}
}
