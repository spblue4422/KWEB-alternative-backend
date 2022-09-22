import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from './course.controller';
import { Course } from './entity/course.entity';
import { Lecture } from './entity/lecture.entity';
import { CourseService } from './course.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([Course]),
		TypeOrmModule.forFeature([Lecture]),
		AuthModule,
	],
	controllers: [CourseController],
	providers: [CourseService],
})
export class CourseModule {}
