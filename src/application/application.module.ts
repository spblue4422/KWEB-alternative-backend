import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Application } from './application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [TypeOrmModule.forFeature([Application]), AuthModule],
	providers: [ApplicationService],
	controllers: [ApplicationController],
})
export class ApplicationModule {}
