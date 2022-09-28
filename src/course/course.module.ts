import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from './course.controller';
import { Course } from './entity/course.entity';
import { Lecture } from './entity/lecture.entity';
import { CourseService } from './course.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ApplicationModule } from 'src/application/application.module';

@Module({
	imports: [
		UserModule,
		TypeOrmModule.forFeature([Course]),
		TypeOrmModule.forFeature([Lecture]),
		AuthModule,
		ApplicationModule,
	],
	controllers: [CourseController],
	providers: [CourseService],
	exports: [CourseService],
})
export class CourseModule {}
