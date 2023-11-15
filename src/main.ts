import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { swaggerSetup } from "./swagger";
import * as passport from "passport";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import * as mysql2 from "mysql2/promise";
import * as MySQLStore from "express-mysql-session";
import { setUpSession } from "./setup.session";
import { RedisService } from "./redis/redis.service";

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

	// Session
	setUpSession(app);

	// CORS
	// app.enableCors();

	await app.listen(process.env.SERVER_PORT);
}
bootstrap();
