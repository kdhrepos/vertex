import { Injectable, Logger } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { bcrypt } from "bcrypt";

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

	// private readonly logger = new Logger("Auth Service");

	async validateUser(email: string, password: string) {
		const user = await this.userService.getUser(email);

		if (!user) {
			return null;
		}

		const { password: hashedPassword, ...userInfo } = user;

		if (bcrypt.compareSync(password, hashedPassword)) {
			return userInfo;
		}
		return null;
	}
}
