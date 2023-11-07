import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { Swagger } from "./swagger";
import * as passport from "passport";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";

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

	app.use(cookieParser());

	// Session
	app.use(
		session({
			secret: process.env.SESSION_KEY,
			resave: false,
			cookie: { maxAge: 3600000, httpOnly: true },
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());

	// CORS
	app.enableCors();

	await app.listen(process.env.SERVER_PORT);
}
bootstrap();
