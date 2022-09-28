import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
	//constructor(private readonly lectureRepository: LectureRepository) {}
	constructor(
		@InjectRepository(Course)
		private readonly courseRepository: Repository<Course>,

		@InjectRepository(Lecture)
		private readonly lectureRepository: Repository<Lecture>,

		private userService: UserService,

		private applicationService: ApplicationService,
	) {}

	// 전체 강의 목록 조회
	async findAllCourses(): Promise<Course[]> {
		return this.courseRepository
			.find({
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
				relations: {
					user: true,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	// 강의 조회 - 강의 id => password도 같이 나오는거 아닌가??
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

	// 강의 목록 조회 - 게시자 id
	async findAllCoursesByUserId(uid: string) {
		return this.courseRepository
			.find({
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
					user: {
						userId: uid,
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

	// 강의 게시글 조회 - 게시글 id
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
					},
				},
				where: {
					id: id,
				},
				relations: {
					course: true,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	// 강의 게시글 목록 조회 - 강의 id
	async findAllLecturesByCourseId(cid: number): Promise<Lecture[]> {
		return this.lectureRepository
			.find({
				select: {
					id: true,
					title: true,
					createdDate: true,
					course: {
						id: true,
						user: {
							id: true,
							userId: true,
							name: true,
						},
						name: true,
						description: true,
					},
				},
				where: {
					course: {
						id: cid,
					},
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

	//수강신청 목록을 조회해봐야함.
	//다른 service에 넣을까?
	//학생이 신청한 강의, 게시글 확인
	async findAllLecturesByUserId(uid: number): Promise<Lecture[]> {
		// userId로 수강신청한 course 목록 뽑아오기
		const applicationData: Application[] =
			await this.applicationService.findAllApplicationsById(uid, 'user');

		const courseList: number[] = [];

		await applicationData.map((dt) => {
			courseList.push(dt.course.id);
		});

		return await this.lectureRepository
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
							name: true,
						},
					},
				},
				where: {
					course: {
						id: In(courseList),
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

	//서비스를 주입받는 서비스 모음을 진지하게 고려해봄..
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

	// 강의 insert/update/delete는 user가 교수인지 확인해야함.
	async insertCourse(createCourseDto: CreateCourseDto, userId: string) {
		const { name, description } = createCourseDto;
		const userData = await this.userService.findUserByUserId(userId);

		if (!userData) {
			return { code: '', msg: '없는 유저입니다.', data: null };
		}

		const courseData = await this.courseRepository.findOne({
			where: {
				name: name,
			},
		});

		if (courseData != null) {
			return { code: '', msg: '중복된 강의명입니다.', data: null };
		}

		await this.courseRepository
			.insert({
				user: userData,
				name: name,
				description: description,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return { code: 'SUCCESS', msg: '강의 정보 추가에 성공했습니다.' };
	}

	async updateCourse() {}

	//코스 삭제시 강의 게시글도 같이 삭제되어야함.
	async deleteCourse(courseData: Course) {}

	async insertLecture(
		createLectureDto: CreateLectureDto,
		courseData: Course,
	) {
		const { courseId, title, content } = createLectureDto;

		await this.lectureRepository
			.insert({
				course: courseData,
				title: title,
				content: content,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return { code: 'SUCCESS', msg: '강의 게시물 추가에 성공했습니다.' };
	}

	async updateLecture() {}

	async deleteLecture(lectureData: Lecture) {
		await this.lectureRepository.remove(lectureData).catch((err) => {
			throw new InternalServerErrorException();
		});

		return { code: 'SUCCESS', msg: '강의 게시물 삭제에 성공했습니다.' };
	}
}
