import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserService } from "src/user/user.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private userService: UserService) {
		super();
	}

	serializeUser(user: any, done: Function): any {
		console.log("hello", user.email);
		done(null, user.email);
	}

	async deserializeUser(
		payload: any,
		done: (err: Error, payload: any) => void,
	) {
		const user = await this.userService.getUser(payload); // -> 책 내용

		if (!user) {
			done(new Error("No User"), null);
			return;
		}
		const { password, ...userInfo } = user;
		done(null, userInfo);
	}
}
