import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureController } from './lecture.controller';
import { Lecture } from './entity/lecture.entity';
import { LectureService } from './lecture.service';

@Module({
	imports: [TypeOrmModule.forFeature([Lecture])],
	controllers: [LectureController],
	providers: [LectureService],
})
export class LectureModule {}
