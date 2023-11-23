import {
	Controller,
	Body,
	Post,
	Get,
	Query,
	Res,
	Patch,
	UseGuards,
	Session,
} from "@nestjs/common";
import { ApiBody, ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { FirebaseService } from "src/firebase/firebase.service";
import { Response } from "express";
import { AuthenticatedGuard } from "src/auth/auth.guard";

@ApiTags("User")
@Controller("user")
export class UserController {
	constructor(
		private userService: UserService,
		private firebaseService: FirebaseService,
	) {}

	@ApiBody({ description: "유저가 자신의 프로필 정보를 받아옴" })
	@UseGuards(AuthenticatedGuard)
	@Get("profile")
	async getUserProfile(@Session() session: any) {
		const { user: email } = session.passport;
		const userWithPassord = await this.userService.getUser(email);

		const { password, ...user } = userWithPassord;

		return user;
	}

	// @ApiBody({ description: "유저가 자신의 프로필 정보를 갱신" })
	// @UseGuards(AuthenticatedGuard)
	// @Patch("profile")
	// async updateUserProfile(@Session() session: any) {
	// 	const { user: email } = session.passport;
	// }

	@ApiBody({ description: "유저가 자신의 프로필 이미지를 받아옴" })
	@Get("profile/image")
	async getUserProfileImage(
		@Res() res: Response,
		@Query("userId") userId: string,
	) {
		const user = await this.userService.getUser(userId);

		if (
			user.profile_image_path !== undefined &&
			user.profile_image_path !== null
		) {
			const img = await this.firebaseService.findImage(user.profile_image_path);

			const imgFileExt = user.profile_image_path.split(".");

			const buffer = Buffer.from(img);

			res.setHeader(
				"Content-Type",
				`image/${imgFileExt[imgFileExt.length - 1]}`,
			);
			res.setHeader("Content-Length", buffer.length);

			return res.send(buffer);
		}
		return null;
	}
}
