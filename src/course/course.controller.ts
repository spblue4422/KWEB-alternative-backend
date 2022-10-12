import {
	Body,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { ApplicationService } from 'src/application/application.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CourseService } from './course.service';
import { ResultResponseDto } from 'src/util/resultResponseDto';
import { CreateCourseDto } from './dto/createCourse.dto';
import { CreateLectureDto } from './dto/createLecture.dto';
import { Course } from './entity/course.entity';
import { Lecture } from './entity/lecture.entity';
import { UserDetailResponseDto } from 'src/user/dto/userDetailResponse.dto';

@Controller('courses')
export class CourseController {
	constructor(
		private courseService: CourseService,
		private userService: UserService,
		private applicationService: ApplicationService,
	) {}

	// 모든 코스 조회
	@UseGuards(AuthGuard('jwt'))
	@Get('/all')
	@ApiOperation({
		summary: '전체 코스 조회 API',
		description: '전체 코스 조회',
	})
	@ApiCreatedResponse({
		description: '전체 코스 조회',
		type: Course,
	})
	async getAllCourses(@Req() req: Request, @Res() res: Response) {
		try {
			const data: Course[] = await this.courseService.findAllCourses();

			res.status(200).send({ code: 'SUCCESS', msg: '성공', data: data });
		} catch (err) {
			res.status(500).send(err);
		}
	}

	// 교수 아이디로 코스 목록 조회
	@UseGuards(AuthGuard('jwt'))
	@Get('/list')
	@ApiOperation({
		summary: '게시자 ID로 코스 조회 API',
		description: '게시자 ID로 코스 조회',
	})
	@ApiCreatedResponse({
		description: '게시자 ID로 코스 조회',
		type: Course,
	})
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

	// 코스별 신청 유저 확인
	@UseGuards(AuthGuard('jwt'))
	@Get('/users/list')
	@ApiOperation({
		summary: '코스 신청한 유저 조회 API',
		description: '코스 신청한 유저 조회',
	})
	@ApiCreatedResponse({
		description: '코스 신청한 유저 조회',
		type: UserDetailResponseDto,
	})
	async getAllUsersByCourseId(
		@Req() req,
		@Query('cid') cid: number,
		@Res() res: Response,
	) {
		try {
			const course: Course = await this.courseService.findCourseById(cid);
			if (req.user.id == course.user.id) {
				const data: User[] =
					await this.courseService.findAllUsersByCourseId(cid);

				res.status(200).send({
					code: 'SUCCESS',
					msg: '성공',
					data: data,
				});
			} else {
				res.status(401).send({
					code: '',
					msg: '자격 없음',
					data: null,
				});
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	// 코스 정보 확인
	@UseGuards(AuthGuard('jwt'))
	@Get('/:id')
	@ApiOperation({
		summary: '코스 조회 API',
		description: '코스 조회',
	})
	@ApiCreatedResponse({
		description: '코스 조회',
		type: Course,
	})
	async getCourseDetail(
		@Req() req: Request,
		@Param('id') id: number,
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

	// 학생 - 신청한 코스의 모든 강의 조회
	// 교수 - 개설한 코스의 모든 강의 조회
	@UseGuards(AuthGuard('jwt'))
	@Get('/lectures/list/my')
	@ApiOperation({
		summary: '개설/신청 전체 강의 조회 API',
		description: '개설/신청 전체 강의 조회',
	})
	@ApiCreatedResponse({
		description: '개설/신청 전체 강의 조회',
		type: Lecture,
	})
	async getAllLecturesByUserId(@Req() req, @Res() res: Response) {
		try {
			// status에 따라 서비스 내부에서 결정
			const data: Lecture[] =
				await this.courseService.findAllLecturesByUserId(
					req.user.status,
					req.user.id,
					req.user.userId,
				);

			res.status(200).send({ code: 'SUCCESS', msg: '', data: data });
		} catch (err) {
			res.status(500).send(err);
		}
	}

	// 코스별 강의 목록 조회
	@UseGuards(AuthGuard('jwt'))
	@Get('/lectures/list')
	@ApiOperation({
		summary: '코스 강의 목록 조회 API',
		description: '코스 강의 목록 조회',
	})
	@ApiCreatedResponse({
		description: '코스 강의 목록 조회',
		type: Lecture,
	})
	async getAllLecturesByCourseId(
		@Req() req,
		@Query('cid') cid: number,
		@Res() res: Response,
	) {
		try {
			if (req.user.status == 'student') {
				//학생일때
				const applicationData =
					await this.applicationService.findApplicationById(
						req.user.id,
						cid,
					);

				if (!applicationData) {
					res.status(403).send({
						code: '',
						msg: '신청하지 않은 강의입니다.',
						data: null,
					});
				} else {
					const data: Lecture[] =
						await this.courseService.findAllLecturesByCourseId(cid);

					res.status(200).send({
						code: 'SUCCESS',
						msg: '성공',
						data: data,
					});
				}
			} else {
				//교수일때
				const data: Lecture[] =
					await this.courseService.findAllLecturesByCourseId(cid);

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

	// 강의 조회
	@UseGuards(AuthGuard('jwt'))
	@Get('/lectures/:id')
	@ApiOperation({
		summary: '강의 조회 API',
		description: '강의 조회',
	})
	@ApiCreatedResponse({
		description: '강의 조회',
		type: Lecture,
	})
	async getLectureById(
		@Req() req,
		@Param('id') id: number,
		@Res() res: Response,
	) {
		try {
			const data: Lecture = await this.courseService.findLectureById(id);

			if (!data) {
				res.status(404).send({
					code: '',
					msg: '존재하지 않는 강의',
					data: null,
				});
			} else {
				const applicationData =
					await this.applicationService.findApplicationById(
						req.user.id,
						data.course.id,
					);

				if (req.user.status == 'student' && !applicationData) {
					res.status(403).send({
						code: '',
						msg: '신청하지 않은 코스',
						data: null,
					});
				} else {
					res.status(200).send({
						code: 'SUCCESS',
						msg: '성공',
						data: data,
					});
				}
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	// 코스 추가
	@UseGuards(AuthGuard('jwt'))
	@Post('/add')
	@ApiOperation({
		summary: '코스 정보 추가 API',
		description: '코스 정보 추가',
	})
	@ApiCreatedResponse({
		description: '코스 정보 추가',
		type: ResultResponseDto,
	})
	async addCourse(
		@Req() req,
		@Body() createCourseDto: CreateCourseDto,
		@Res() res: Response,
	) {
		try {
			if (req.user.status == 'professor') {
				const user: User = await this.userService.findUserByUserId(
					req.user.userId,
				);

				const data = await this.courseService.insertCourse(
					createCourseDto,
					user,
				);
				res.status(200).send(data);
			} else {
				res.status(401).send({
					code: '',
					msg: '자격이 없습니다',
					data: null,
				});
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	// 코스 삭제
	@UseGuards(AuthGuard('jwt'))
	@Delete('/remove/:id')
	@ApiOperation({
		summary: '코스 정보 삭제 API',
		description: '코스 정보 삭제',
	})
	@ApiCreatedResponse({
		description: '코스 정보 삭제',
		type: ResultResponseDto,
	})
	async removeCourse(@Req() req, @Param('id') id, @Res() res: Response) {
		try {
			const course = await this.courseService.findCourseById(id);
			if (!course) {
				res.status(400).send({
					code: '',
					msg: '존재하지 않는 코스',
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

					res.status(200).send(data);
				}
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

	// 강의 추가
	@UseGuards(AuthGuard('jwt'))
	@Post('/lectures/add')
	@ApiOperation({
		summary: '강의 정보 추가 API',
		description: '강의 정보 추가',
	})
	@ApiCreatedResponse({
		description: '강의 정보 추가',
		type: ResultResponseDto,
	})
	async addLecture(
		@Req() req,
		@Body() createLectureDto: CreateLectureDto,
		@Res() res: Response,
	) {
		try {
			const course = await this.courseService.findCourseById(
				createLectureDto.courseId,
			);
			if (!course) {
				res.status(404).send({
					code: '',
					msg: '존재하지 않는 코스',
					data: null,
				});
			} else {
				if (req.user.id == course.user.id) {
					const data = await this.courseService.insertLecture(
						createLectureDto,
						course,
					);
					res.status(200).send(data);
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

	// 강의 삭제
	@UseGuards(AuthGuard('jwt'))
	@Delete('/lectures/remove')
	@ApiOperation({
		summary: '강의 정보 삭제 API',
		description: '강의 정보 삭제',
	})
	@ApiCreatedResponse({
		description: '강의 정보 삭제',
		type: ResultResponseDto,
	})
	async removeLecture(
		@Req() req,
		@Param('id') id: number,
		@Res() res: Response,
	) {
		try {
			const lecture: Lecture = await this.courseService.findLectureById(
				id,
			);
			if (!lecture) {
				res.status(400).send({
					code: '',
					msg: '존재하지 않는 강의',
					data: null,
				});
			} else {
				if (req.user.id == lecture.course.user.id) {
					res.status(401).send({
						code: '',
						msg: '자격 없음',
						data: null,
					});
				} else {
					const data = await this.courseService.deleteLecture(
						lecture,
					);

					res.status(200).send({ data: data });
				}
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}
}
