import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { bcrypt } from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

	// private readonly logger = new Logger("Auth Service");

	async registerUser(
		createUserDto: CreateUserDto,
		profileImage: Express.Multer.File,
	) {
		return this.userService.createUser(createUserDto, profileImage);
	}

	async unregisterUser() {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.getUser(email);

		if (!user) {
			return null;
		}

		const { password: hashedPassword, ...userInfo } = user;

		// if (bcrypt.compareSync(password, hashedPassword)) {
		// 	return userInfo;
		// }
		if (password === hashedPassword) {
			return userInfo;
		}
		return new UnauthorizedException();
	}
}
