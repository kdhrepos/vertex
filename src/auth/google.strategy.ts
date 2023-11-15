import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile } from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "src/model/user.model";
import { UserService } from "src/user/user.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(private userService: UserService) {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/auth/google`,
			scope: ["email", "profile"],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		const { id, name, emails } = profile;

		const providerId = id;
		const email = emails[0].value;

		const user: User = await this.userService.findByEmailOrSave(
			email,
			name.familyName + name.givenName,
			providerId,
		);

		if (!user) {
			return null;
		}
		return user;
	}
}
