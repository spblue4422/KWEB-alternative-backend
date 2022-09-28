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

	async findApplicationById(
		userId: number,
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
						id: userId,
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
			//course
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
						course: {
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
		}
	}

	async insertApplication(userId: number, courseId: number) {
		//const userData = await this.userService.findUserByUserId(userId);
		const userData = await this.userRepository
			.findOne({
				where: {
					id: userId,
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
		//const courseData = await this.courseService.findCourseById(courseId);

		if (!userData) {
			return {
				code: '',
				msg: '유저 정보가 존재하지 않습니다.',
				data: null,
			};
		} else if (!courseData) {
			return {
				code: '',
				msg: '강의 정보가 존재하지 않습니다.',
				data: null,
			};
		}

		const applicationData = await this.findApplicationById(
			userId,
			courseId,
		);

		if (applicationData != null) {
			return { code: '', msg: '이미 신청된 강의입니다', data: null };
		}

		await this.applicationRepository
			.insert({
				user: userData,
				course: courseData,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return { code: 'SUCCESS', msg: '수강신청에 성공했습니다.' };
	}

	//없으면 삭제 못하는거니까 user, course 확인할 필요는 없을듯
	async deleteApplication(userId: number, courseId: number) {
		const applicationData = await this.findApplicationById(
			userId,
			courseId,
		);
		if (!applicationData) {
			return { code: '', msg: '신청하지 않은 강의입니다.', data: null };
		}

		await this.applicationRepository
			.remove(applicationData)
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return { code: 'SUCCESS', msg: '신청 삭제에 성공했습니다.' };
	}
}
