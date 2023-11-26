import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

	async validateUser(loginUserDto: LoginUserDto) {
		const { email, password } = loginUserDto;

		const user = await this.userService.getUserByEmail(email);

		const { password: hashedPassword, ...userInfo } = user;

		if (bcrypt.compareSync(password, hashedPassword)) {
			return {
				data: userInfo,
				statusCode: 200,
				message: "Login Success",
			};
		}

		if (!user) {
			return {
				data: null,
				statusCode: 400,
				message: "Login Failed",
			};
		}
	}
}
