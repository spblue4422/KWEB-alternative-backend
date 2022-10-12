import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setUpSwagger(app: INestApplication): void {
	const options = new DocumentBuilder()
		.setTitle('KWEB Alternative Backend API Docs')
		.setDescription('KWEB Alternative Backend API description')
		.setVersion('1.0.0')
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api-docs', app, document);
}
