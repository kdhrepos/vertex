import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile } from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "src/model/user.model";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			userNameField: "email",
		});
	}

	async validate(email: string, password: string): Promise<any> {
		const user = await this.authService.validateUser(email, password);
		if (!user) return null;
		return user;
	}
}
