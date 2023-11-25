import { INestApplication } from "@nestjs/common";
import RedisStore from "connect-redis";
import * as session from "express-session";
import { Redis } from "ioredis";
import * as passport from "passport";

export function setUpSession(app: INestApplication): void {
	const client = new Redis({
		port: Number(process.env.REDIS_PORT),
		host: process.env.REDIS_HOST,
	});

	app.use(
		session({
			secret: "secret",
			saveUninitialized: false,
			resave: false,
			store: new RedisStore({
				client: client,
				ttl: 30,
			}),
			cookie: {
				httpOnly: false,
				secure: false,
				maxAge: 10000,
				sameSite: "none",
			},
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());
}
