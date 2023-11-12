import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { RedisService } from "src/redis/redis.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(
		private userService: UserService,
		private redisService: RedisService,
	) {
		super();
	}

	/**
	 * @description 세션에는 이메일만 저장함
	 * @param user
	 * @param done
	 */
	serializeUser(user: any, done: Function): any {
		console.log("serializeUser");
		done(null, user.email);
	}

	/**
	 * @param payload
	 * @param done
	 * @returns {email} user.email
	 */
	async deserializeUser(
		payload: any,
		done: (err: Error, payload: any) => void,
	) {
		console.log("deserializeUser");
		done(null, payload);
	}
}
