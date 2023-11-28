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
	UseInterceptors,
	UploadedFile,
	UploadedFiles
} from "@nestjs/common";
import { ApiBody, ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { FirebaseService } from "src/firebase/firebase.service";
import { Response } from "express";
import { AuthenticatedGuard } from "src/auth/auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import * as bcrypt from "bcrypt"
import * as path from "path"


@ApiTags("User")
@Controller("user")
export class UserController {
	constructor(
		private userService: UserService,
		private firebaseService: FirebaseService,
	) {}

	@ApiBody({ description: "유저가 자신의 프로필 정보를 받아옴" })
	@Get("profile")
	async getUserProfile(@Query("email") email:string) {
		if(!email)
			return {
				statusCode : 400
			}

		const userWithPassord = await this.userService.getUserByEmail(email);
		const { password, ...user } = userWithPassord;

		return user;
	}

	@ApiBody({ description: "유저가 자신의 프로필 정보를 갱신" })
	@UseInterceptors(
		FileFieldsInterceptor([{ name: "profileImage" }, { name: "channelImage" }]),
	)
	@Patch("profile")
	async updateUserProfile(
		@Body() updateUserDto:UpdateUserDto,
		@UploadedFiles()
		files: {
			profileImage?: Express.Multer.File[];
			channelImage?:Express.Multer.File[];
		},
	) {
		let profileImagePath=null;

		if(files.profileImage !== null && files.profileImage !== undefined){
			profileImagePath = (await bcrypt.hashSync(`${Date.now()}`, 12).replace(/\//g, "")) +
			path.extname(files.profileImage[0].originalname);
		}


		let channelImagePath=null;

		if(files.channelImage !== null && files.channelImage !== undefined){
			channelImagePath = (await bcrypt.hashSync(`${Date.now()}`, 12).replace(/\//g, "")) +
			path.extname(files.channelImage[0].originalname);
		}

		if(profileImagePath !==null)
			this.firebaseService.uploadImage(files.profileImage[0],profileImagePath);
		if(channelImagePath!==null)
			this.firebaseService.uploadImage(files.channelImage[0],channelImagePath);

		return await this.userService.updateUser(updateUserDto,profileImagePath,channelImagePath);
	}



	@ApiBody({ description: "유저가 자신의 프로필 이미지를 받아옴" })
	@Get("profile/image")
	async getUserProfileImage(
		@Res() res: Response,
		@Query("email") email: string,
	) {
		const user = await this.userService.getUserByEmail(email);
		if (
			user.profile_image_path !== undefined &&
			user.profile_image_path !== null
		) {
			const imgUrl = await this.firebaseService.findImage(user.profile_image_path);
			return res.send(imgUrl);
		}
		return res.send(null);
	}

	@ApiBody({ description: "유저가 자신의 카드 이미지를 받아옴" })
	@Get("channel/image")
	async getChannelImage(
		@Res() res: Response,
		@Query("email") email: string,
	) {
		const user = await this.userService.getUserByEmail(email);
		if (
			user.channel_image_path !== undefined &&
			user.channel_image_path !== null
		) {
			const imgUrl = await this.firebaseService.findImage(user.channel_image_path);
			return res.send(imgUrl);
		}
		return res.send(null);
	}

	// @ApiBody({ description: "유저가 자신의 프로필 이미지를 받아옴" })
	// @Get("profile/image")
	// async getUserProfileImage(
	// 	@Res() res: Response,
	// 	@Query("userId") userId: string,
	// ) {
	// 	const user = await this.userService.getUserByEmail(userId);

	// 	if (
	// 		user.profile_image_path !== undefined &&
	// 		user.profile_image_path !== null
	// 	) {
	// 		const img = await this.firebaseService.findImage(user.profile_image_path);

	// 		const imgFileExt = user.profile_image_path.split(".");

	// 		const buffer = Buffer.from(img);

	// 		res.setHeader(
	// 			"Content-Type",
	// 			`image/${imgFileExt[imgFileExt.length - 1]}`,
	// 		);
	// 		res.setHeader("Content-Length", buffer.length);

	// 		return res.send(buffer);
	// 	}
	// 	return null;
	// }
}
