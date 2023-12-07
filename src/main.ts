import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { swaggerSetup } from "./swagger";
import * as cookieParser from "cookie-parser";
import { setUpSession } from "./setup.session";
import { urlencoded, json } from 'body-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: true,
		cors: true,
	});

	// Swagger Documentation
	swaggerSetup(app);

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

	// Enable Cookie
	app.use(cookieParser());
	app.use(json({ limit: '50mb' }));
	app.use(urlencoded({ limit: '50mb', extended: true }));

	// Session
	setUpSession(app);

	await app.listen(8000);
}
bootstrap();
