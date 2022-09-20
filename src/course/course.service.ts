import {
	Get,
	Injectable,
	InternalServerErrorException,
	Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/createCourse.dto';
import { CreateLectureDto } from './dto/createLecture.dto';
import { Course } from './entity/course.entity';
import { Lecture } from './entity/lecture.entity';

@Injectable()
export class CourseService {
	//constructor(private readonly lectureRepository: LectureRepository) {}
	constructor(
		@InjectRepository(Course)
		private readonly courseRepository: Repository<Course>,

		@InjectRepository(Lecture)
		private readonly lectureRepository: Repository<Lecture>,
	) {}

	// 전체 강의 목록 조회
	async findAllCourses(): Promise<Course[]> {
		return this.courseRepository.find().catch((err) => {
			throw new InternalServerErrorException();
		});
	}

	// 강의 조회 - 강의 id
	async findCourseById(id: number) {
		return this.courseRepository
			.findOne({
				where: {
					id: id,
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
				where: {
					user: {
						userId: uid,
					},
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
				where: {
					id: id,
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
				where: {
					course: {
						id: cid,
					},
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	//수강신청 목록을 조회해봐야함.
	//다른 service에 넣을까?
	async findAllLecturesByUserId(uid: number) {}

	// 강의 insert/update/delete는 user가 교수인지 확인해야함.
	async insertCourse(createCourseDto: CreateCourseDto) {
		await this.courseRepository.insert({});
	}

	async updateCourse() {}

	async deleteCourse(id: number) {}

	async insertLecture(createLectureDto: CreateLectureDto) {
		await this.lectureRepository.insert({});
	}

	async updateLecture() {}

	async deleteLecture(id: number) {}
}
