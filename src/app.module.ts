import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { ApplicationModule } from './application/application.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath:
				process.env.NODE_ENV === 'production'
					? '.prod.env'
					: '.local.env',
		}),
		// TypeOrmModule.forRoot({
		// 	// type: 'mysql',
		// 	// host: 'localhost',
		// 	// port: 3306,
		// 	// username: 'spblue4422',
		// 	// password: 'spblue4422',
		// 	// database: 'kweb',
		// 	// entities: ['dist/**/**.entity{.ts,.js}'],
		// 	// synchronize: true,
		// 	type: 'mysql',
		// 	host: 'kweb-alternative-assignment.cacq4llhxu1s.us-east-1.rds.amazonaws.com',
		// 	port: 3306,
		// 	username: 'admin',
		// 	password: 'admin1234',
		// 	database: 'kweb',
		// 	entities: ['dist/**/**.entity{.ts,.js}'],
		// 	synchronize: true,
		// }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get('DATABASE_HOST'),
				port: configService.get('DATABASE_PORT'),
				username: configService.get('DATABASE_USERNAME'),
				password: configService.get('DATABASE_PASSWORD'),
				database: configService.get('DATABASE_NAME'),
				entities: ['dist/**/**.entity{.ts,.js}'],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		UserModule,
		CourseModule,
		ApplicationModule,
	],
	controllers: [AppController],
	providers: [AppService, ConfigService],
})
export class AppModule {}
