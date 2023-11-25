import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/model/user.model";

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor() {
		super();
	}

	/**
	 * @description 세션에는 이메일만 저장함
	 * @param user
	 * @param done
	 */
	serializeUser(user: User, done: Function): any {
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
		done(null, payload);
	}
}
