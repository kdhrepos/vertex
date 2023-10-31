import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { Swagger } from "./swagger.document";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bodyParser: true });

	// Swagger Documentation
	Swagger.swaggerSetup(app);

	// Validation Pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	// CORS
	app.enableCors();

	await app.listen(8000);
}
bootstrap();
