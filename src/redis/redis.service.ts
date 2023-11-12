import { INestApplication, Injectable, Logger } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { Redis } from "ioredis";
import { User } from "src/model/user.model";
import * as session from "express-session";
import * as passport from "passport";
import { UserService } from "src/user/user.service";
import { error, group } from "console";

@Injectable()
export class RedisService {
	private client: Redis = new Redis({
		port: Number(process.env.REDIS_PORT),
		host: process.env.REDIS_HOST,
	});

	private logger: Logger = new Logger("Redis Service");
}
