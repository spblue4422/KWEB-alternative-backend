import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LectureModule } from './lecture/lecture.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [UserModule, LectureModule, TypeOrmModule.forRoot()],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
