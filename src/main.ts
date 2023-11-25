import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { swaggerSetup } from "./swagger";
import * as cookieParser from "cookie-parser";
import { setUpSession } from "./setup.session";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: true,
		cors: true,
	});

	// CORS
	app.enableCors({
		credentials: true,
		origin: "*", // 클라이언트 도메인 주소
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

	// Session
	setUpSession(app);

	await app.listen(process.env.SERVER_PORT);
}
bootstrap();
