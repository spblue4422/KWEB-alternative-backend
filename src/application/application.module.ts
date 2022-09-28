import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Application } from './application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CourseModule } from 'src/course/course.module';
import { User } from 'src/user/user.entity';
import { Course } from 'src/course/entity/course.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Application]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([Course]),
		UserModule,
		//CourseModule,
		//AuthModule,
	],
	providers: [ApplicationService],
	controllers: [ApplicationController],
	exports: [ApplicationService],
})
export class ApplicationModule {}
