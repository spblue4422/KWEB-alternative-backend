import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { CreateCourseDto } from './dto/createCourse.dto';
import { CreateLectureDto } from './dto/createLecture.dto';
import { Course } from './entity/course.entity';
import { Lecture } from './entity/lecture.entity';
import { User } from 'src/user/user.entity';
import { Application } from 'src/application/application.entity';
import { UserService } from 'src/user/user.service';
import { ApplicationService } from 'src/application/application.service';

@Injectable()
export class CourseService {
	constructor(
		@InjectRepository(Course)
		private readonly courseRepository: Repository<Course>,

		@InjectRepository(Lecture)
		private readonly lectureRepository: Repository<Lecture>,

		private userService: UserService,

		private applicationService: ApplicationService,
	) {}

	// 전체 코스 목록 조회
	async findAllCourses(): Promise<Course[]> {
		return this.courseRepository
			.find({
				select: {
					id: true,
					name: true,
					user: {
						id: true,
						userId: true,
						name: true,
					},
				},
				relations: {
					user: true,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	// 코스 조회
	async findCourseById(id: number) {
		return this.courseRepository
			.findOne({
				select: {
					id: true,
					name: true,
					description: true,
					createdDate: true,
					user: {
						id: true,
						userId: true,
						name: true,
					},
				},
				where: {
					id: id,
				},
				relations: {
					user: true,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	async findAllCoursesByUserId(id: number) {
		const applicationData: Application[] =
			await this.applicationService.findAllApplicationsById(id, 'user');
		const courseList: Course[] = [];

		await applicationData.map((dt) => {
			courseList.push(dt.course);
		});

		return courseList;
	}

	// 코스 목록 조회 - 게시자 id
	async findAllCoursesByProfId(id: number) {
		return this.courseRepository
			.find({
				select: {
					id: true,
					name: true,
					user: {
						id: true,
						userId: true,
						name: true,
					},
				},
				where: {
					user: {
						id: id,
					},
				},
				relations: {
					user: true,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	// 코스 검색
	async findAllCoursesBySearch(text: string) {
		return this.courseRepository
			.find({
				select: {
					id: true,
					name: true,
					user: {
						id: true,
						userId: true,
						name: true,
					},
				},
				where: {
					name: Like(`%${text}%`),
				},
				relations: {
					user: true,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	// 강의 조회 - 게시글 id
	async findLectureById(id: number): Promise<Lecture> {
		return this.lectureRepository
			.findOne({
				select: {
					id: true,
					title: true,
					content: true,
					createdDate: true,
					course: {
						id: true,
						name: true,
						user: {
							id: true,
							userId: true,
							name: true,
						},
					},
				},
				where: {
					id: id,
				},
				relations: {
					course: {
						user: true,
					},
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	// 강의 목록 조회 - 코스 id
	async findAllLecturesByCourseId(cid: number): Promise<Lecture[]> {
		return this.lectureRepository
			.find({
				select: {
					id: true,
					title: true,
					createdDate: true,
					course: {
						id: true,
					},
				},
				where: {
					course: {
						id: cid,
					},
				},
				relations: {
					course: {},
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	// 학생이 신청한 코스의 모든 강의 확인
	// 교수가 개설한 코스의 모든 강의 확인
	async findAllLecturesByUserId(
		status: string,
		id: number,
	): Promise<Lecture[]> {
		// userId로 수강신청한 course 목록 뽑아오기
		if (status == 'student') {
			const idArr: number[] = [];
			const data: Course[] = await this.findAllCoursesByUserId(id);

			await data.map((dt) => {
				idArr.push(dt.id);
			});

			return this.lectureRepository
				.find({
					select: {
						id: true,
						title: true,
						createdDate: true,
						course: {
							id: true,
							name: true,
							user: {
								id: true,
								userId: true,
								name: true,
							},
						},
					},
					where: {
						course: {
							id: In(idArr),
						},
					},
					relations: {
						course: {
							user: true,
						},
					},
					order: {
						createdDate: 'DESC',
					},
				})
				.catch((err) => {
					throw new InternalServerErrorException();
				});
		} else {
			return this.lectureRepository
				.find({
					select: {
						id: true,
						title: true,
						createdDate: true,
						course: {
							id: true,
							name: true,
							user: {
								id: true,
								userId: true,
								name: true,
							},
						},
					},
					where: {
						course: {
							user: {
								id: id,
							},
						},
					},
					relations: {
						course: {
							user: true,
						},
					},
					order: {
						createdDate: 'DESC',
					},
				})
				.catch((err) => {
					throw new InternalServerErrorException();
				});
		}
	}

	// 서비스를 주입받는 서비스 모음을 진지하게 고려해봄..
	// 코스를 신청한 모든 학생 조회
	async findAllUsersByCourseId(cid: number): Promise<User[]> {
		const applicationData: Application[] =
			await this.applicationService.findAllApplicationsById(
				cid,
				'course',
			);

		const userList: number[] = [];

		await applicationData.map((dt) => {
			userList.push(dt.user.id);
		});

		return await this.userService.findAllUsersByIds(userList);
	}

	// 코스 추가
	async insertCourse(createCourseDto: CreateCourseDto, userData: User) {
		const { name, description } = createCourseDto;

		const courseData = await this.courseRepository.findOne({
			where: {
				name: name,
			},
		});

		//name과 description의 sql injection을 검사해봐야함.
		if (courseData != null) {
			return {
				code: 'FAIL_COURSENAME_DUPLICATION',
				msg: '중복된 코스명입니다.',
				data: null,
			};
		}

		const result = await this.courseRepository
			.insert({
				user: userData,
				name: name,
				description: description,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return {
			code: 'SUCCESS',
			msg: '코스 추가에 성공했습니다.',
			data: result,
		};
	}

	async updateCourse(id: number, createCourseDto: CreateCourseDto) {
		const { name, description } = createCourseDto;

		const result = await this.courseRepository
			.update(id, {
				name: name,
				description: description,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return {
			code: 'SUCCESS',
			msg: '코스 정보 변경에 성공했습니다.',
			data: result,
		};
	}

	//코스 삭제시 강의 게시글도 같이 삭제되어야함.
	async deleteCourse(courseData: Course) {
		const result = await this.courseRepository
			.remove(courseData)
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return {
			code: 'SUCCESS',
			msg: '코스 삭제에 성공했습니다.',
			data: result,
		};
	}

	async insertLecture(
		createLectureDto: CreateLectureDto,
		courseData: Course,
	) {
		const { title, content } = createLectureDto;

		const result = await this.lectureRepository
			.insert({
				course: courseData,
				title: title,
				content: content,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return {
			code: 'SUCCESS',
			msg: '강의 추가에 성공했습니다.',
			data: result,
		};
	}

	async updateLecture(
		id: number,
		createLectureDto: CreateLectureDto,
		courseData: Course,
	) {
		const { title, content } = createLectureDto;

		const result = await this.lectureRepository
			.update(id, {
				course: courseData,
				title: title,
				content: content,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return {
			code: 'SUCCESS',
			msg: '강의 정보 변경에 성공했습니다.',
			data: result,
		};
	}

	async deleteLecture(lectureData: Lecture) {
		const result = await this.lectureRepository
			.remove(lectureData)
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return {
			code: 'SUCCESS',
			msg: '강의 삭제에 성공했습니다.',
			data: result,
		};
	}
}
