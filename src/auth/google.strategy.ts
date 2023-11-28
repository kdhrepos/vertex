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
			clientID:
				"606232107300-rvju7vreed3eme9ah8kclnga5ounttad.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: `https://careful-horribly-ladybird.ngrok-free.app:8000/auth/google`,
			scope: ["email", "profile"],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		const { id, name, emails } = profile;

		console.log(profile);

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
