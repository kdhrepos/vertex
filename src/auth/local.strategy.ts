import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			usernameField: "email",
			passwordField: "password",
		});
	}

	async validate(email: string, password: string): Promise<any> {
		// const user = await this.authService.validateUser(email, password);
		// if (!user) {
		// 	return new UnauthorizedException();
		// }
		// return user;
	}
}
