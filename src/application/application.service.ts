import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { User } from 'src/user/user.entity';
import { Course } from 'src/course/entity/course.entity';

@Injectable()
export class ApplicationService {
	constructor(
		@InjectRepository(Application)
		private readonly applicationRepository: Repository<Application>,

		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(Course)
		private readonly courseRepository: Repository<Course>, //private readonly userService: UserService, //private readonly courseService: CourseService,
	) {}

	// 신청 조회
	async findApplicationById(
		id: number,
		courseId: number,
	): Promise<Application> {
		return this.applicationRepository
			.findOne({
				select: {
					id: true,
					user: {
						id: true,
						userId: true,
						name: true,
					},
					course: {
						id: true,
						name: true,
					},
					createdDate: true,
				},
				where: {
					user: {
						id: id,
					},
					course: {
						id: courseId,
					},
				},
				relations: {
					user: true,
					course: true,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	// 유저/코스 별 신청 상황 조회
	async findAllApplicationsById(
		id: number,
		target: string,
	): Promise<Application[]> {
		if (target == 'user') {
			return this.applicationRepository
				.find({
					select: {
						id: true,
						user: {
							id: true,
							userId: true,
							name: true,
						},
						course: {
							id: true,
							name: true,
						},
						createdDate: true,
					},
					where: {
						user: {
							id: id,
						},
					},
					relations: {
						user: true,
						course: true,
					},
				})
				.catch((err) => {
					throw new InternalServerErrorException();
				});
		} else {
			return this.applicationRepository
				.find({
					select: {
						id: true,
						user: {
							id: true,
							userId: true,
							name: true,
						},
						course: {
							id: true,
							name: true,
							user: {
								id: true,
								userId: true,
								name: true,
							},
						},
						createdDate: true,
					},
					where: {
						course: {
							id: id,
						},
					},
					relations: {
						user: true,
						course: { user: true },
					},
				})
				.catch((err) => {
					throw new InternalServerErrorException();
				});
		}
	}

	// 수강신청
	async insertApplication(id: number, courseId: number) {
		const userData = await this.userRepository
			.findOne({
				where: {
					id: id,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
		const courseData = await this.courseRepository
			.findOne({
				where: {
					id: courseId,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		if (!userData) {
			return {
				code: 'FAIL_USER_NOT_EXIST',
				msg: '유저 정보가 존재하지 않습니다.',
				data: null,
			};
		} else if (!courseData) {
			return {
				code: 'FAIL_COURSE_NO_EXIST',
				msg: '코스 정보가 존재하지 않습니다.',
				data: null,
			};
		}

		const applicationData = await this.findApplicationById(id, courseId);

		if (applicationData != null) {
			return {
				code: 'FAIL_ALREADY_APPLIED',
				msg: '이미 신청한 강의입니다',
				data: null,
			};
		}

		const result = await this.applicationRepository
			.insert({
				user: userData,
				course: courseData,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return {
			code: 'SUCCESS',
			msg: '수강 신청에 성공했습니다.',
			data: result,
		};
	}

	//없으면 삭제 못하는거니까 user, course 확인할 필요는 없을듯
	async deleteApplication(applicationData: Application) {
		// const applicationData = await this.findApplicationById(id, courseId);
		// if (!applicationData) {
		// 	return { code: 'FAIL', msg: '신청하지 않은 강의입니다.', data: null };
		// }
		const result = await this.applicationRepository
			.remove(applicationData)
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return {
			code: 'SUCCESS',
			msg: '수강 정보 삭제에 성공했습니다.',
			data: result,
		};
	}
}
