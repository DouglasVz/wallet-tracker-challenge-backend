import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const API_DESCRIPTION = `
    Welcome to the Blockchain Portfolio Tracker API documentation.

    To get started:
    1. Register a new user via the '/auth/register' endpoint.
    2. Log in at '/auth/login' to obtain your access token.
    3. Click the 'Authorize' button (or lock icon) in the Swagger UI and paste your access token to authenticate requests.
    4. If your token expires, simply log in again to receive a new one.

`;

async function bootstrap() {
  	const app = await NestFactory.create(AppModule);

  	const config = new DocumentBuilder()
	.setTitle('Blockchain Portfolio Tracker')
	.setDescription(API_DESCRIPTION)
	.setVersion('1.0')
	.addBearerAuth()
	.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document); // Swagger UI at /api

  	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
