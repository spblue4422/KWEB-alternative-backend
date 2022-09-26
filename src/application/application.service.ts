import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';
import { Repository } from 'typeorm';
import { Application } from './application.entity';

@Injectable()
export class ApplicationService {
	constructor(
		@InjectRepository(Application)
		private readonly applicationRepository: Repository<Application>,

		private readonly userService: UserService,

		private readonly courseService: CourseService,
	) {}

	async findApplication(userId: number, courseId: number) {
		const data = await this.applicationRepository
			.findOne({
				where: {
					user: {
						id: userId,
					},
					course: {
						id: courseId,
					},
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return data;
	}

	async findAllApplicationById(id: number, target: string) {
		if (target == 'user') {
			const data = await this.applicationRepository
				.find({
					where: {
						user: {
							id: id,
						},
					},
				})
				.catch((err) => {
					throw new InternalServerErrorException();
				});

			return data;
		} else {
			//course
			const data = await this.applicationRepository
				.find({
					where: {
						course: {
							id: id,
						},
					},
				})
				.catch((err) => {
					throw new InternalServerErrorException();
				});

			return data;
		}
	}

	async insertApplication(userId: string, courseId: number) {
		const userData = await this.userService.findUserByUserId(userId);
		const courseData = await this.courseService.findCourseById(courseId);

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

		const applicationData = await this.findApplication(
			userData.id,
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
		const applicationData = await this.findApplication(userId, courseId);
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
