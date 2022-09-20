import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from './course.controller';
import { Course } from './entity/course.entity';
import { Lecture } from './entity/lecture.entity';
import { CourseService } from './course.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Course]),
		TypeOrmModule.forFeature([Lecture]),
	],
	controllers: [CourseController],
	providers: [CourseService],
})
export class CourseModule {}
