import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setUpSwagger } from './util/swagger';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import path from 'path';

// dotenv.config({
// 	path: path.resolve(
// 		process.env.NODE_ENV === 'production' ? '.prod.env' : '.local.env',
// 	),
// });

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.use(cookieParser());
	setUpSwagger(app);
	app.enableCors({ origin: 'http://localhost:3210', credentials: true });

	await app.listen(3000);
}
bootstrap();
