import {
	Get,
	Injectable,
	InternalServerErrorException,
	Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecture } from './entity/lecture.entity';
import { LectureBoard } from './entity/lectureboard.entity';
import { LectureRepository } from './lecture.repository';

@Injectable()
export class LectureService {
	//constructor(private readonly lectureRepository: LectureRepository) {}
	constructor(
		@InjectRepository(Lecture)
		private readonly lectureRepository: Repository<Lecture>,

		@InjectRepository(LectureBoard)
		private readonly boardRepository: Repository<LectureBoard>,
	) {}

	// 전체 강의 목록 조회
	async findAllLectures() {
		return this.lectureRepository.find().catch((err) => {
			throw new InternalServerErrorException();
		});
	}

	// 강의 조회 - 강의 id
	async findLectureById(id: number) {
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

	// 강의 목록 조회 - 게시자 id
	async findAllLecturesByUserId(uid: number) {
		return this.lectureRepository
			.find({
				where: {
					user: {
						id: uid,
					},
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	// 강의 게시글 조회 - 게시글 id
	async findLectureBoardById(id: number) {
		return this.boardRepository
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
	async findAllLectureBoardByLectureId(lid: number) {
		return this.boardRepository
			.find({
				where: {
					lecture: {
						id: lid,
					},
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	//수강신청 목록을 조회해봐야함.
	//다른 service에 넣을까?
	async findAllLectureBoardByUserId(uid: number) {}

	// 강의 insert/update/delete는 user가 교수인지 확인해야함.
	async insertLecture() {
		await this.lectureRepository.insert({});
	}

	async updateLecture() {}

	async deleteLecture(id: number) {}

	async insertLectureBoard() {
		await this.boardRepository.insert({});
	}

	async updateLectureBoard() {}

	async deleteLectureBoard(id: number) {}
}
