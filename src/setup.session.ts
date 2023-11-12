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
			secret: "secret", // 세션에 사용될 시크릿 값. 감춰두자.
			saveUninitialized: false,
			resave: false,
			store: new RedisStore({
				// 세션 스토어 설정. 여기서 RedisStore를 설정해서 client에 위에서 설정한 레디스를 입력하자.
				client: client,
				ttl: 30, // time to live
			}),
			cookie: {
				// httpOnly: true,
				// secure: true,
				maxAge: 3600000, //세션이 redis에 저장되는 기간은 maxAge로 조절한다.(ms)
			},
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());
}
