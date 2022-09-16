import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';

@Injectable()
export class LectureRepository {
	constructor(
		@InjectRepository(Lecture)
		private readonly lectureRepository: Repository<Lecture>,
	) {}
}
