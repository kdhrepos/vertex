import {
	Controller,
	Body,
	Post,
	Get,
	Query,
	Param,
	Res,
	Patch,
	UseGuards,
	Session,
	UploadedFile,
} from "@nestjs/common";
import { ApiBody, ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { FirebaseService } from "src/firebase/firebase.service";
import { Response } from "express";
import { AuthenticatedGuard } from "src/auth/auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import { InjectModel } from "@nestjs/sequelize";
import { Auth } from "src/model/auth.model";

@ApiTags("User")
@Controller("user")
export class UserController {
	constructor(
		private userService: UserService,
		private firebaseService: FirebaseService,

		@InjectModel(Auth)
		private authModel: typeof Auth,
	) { }

	@UseGuards(AuthenticatedGuard)
	@ApiBody({ description: "프로필 수정버튼을 누르면 비밀번호or이메일 인증 후 해당 유저의 프로필 수정 페이지로 이동" })
	@Post("profile/local")
	async passwordAuthorization(@Session() session: any, @Res() res: Response, @Body('password') password: string) {
		const { user: email } = session.passport;
		const loggedInUser = await this.userService.getUser(email);

		if (bcrypt.compareSync(password, loggedInUser.password)) {
			res.redirect(`/user/profile/${email}`);
		}
	}

	@UseGuards(AuthenticatedGuard)
	@ApiBody({ description: "프로필 수정버튼을 누르면 이메일 인증 후 해당 유저의 프로필 수정 페이지로 이동" })
	@Post("profile/google")
	async googleAuthorization(@Session() session: any, @Res() res: Response,) {
		const { user: email } = session.passport;
		const token = crypto.randomBytes(20).toString('hex');
		const user = await this.authModel.findOne({
			where: {
				email: email
			}
		})
		if (!user) {
			await this.authModel.create({
				email: email,
				token: token,
				ttl: 300
			});
		}
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: 'test@gmail.com', // 실제 사용하는 지메일 계정
				pass: 'asdf',//2단계 인증 후 앱 비밀번호 사용 알파벳 16자리 나올거임.
			},
		});
		let info = await transporter.sendMail({
			to: `tenteniball@gmail.com`,// 받을 계정
			subject: '인증',
			text: `프로필 수정하시려면 클릭 http://localhost:8000/user/profile/${token}`,
		});

		if (info) {
			res.status(200).json("successed");
		}
		res.status(404).json("not found");
	}

	@ApiBody({ description: "유저가 자신의 프로필 정보를 갱신" })
	@UseGuards(AuthenticatedGuard)
	@Post("profile/:userId")
	async updateUserProfile(
		@Session() session: any,
		@UploadedFile() img: Express.Multer.File,
		@Body() updateUserDto: UpdateUserDto
	) {
		const { user: email } = session.passport;
		const loggedInUser = await this.userService.getUser(email);
		if (!loggedInUser.password) {
			const updateUser = await this.userService.updateGoogleUser(email, updateUserDto);
			if (img != null || img != undefined) {
				await this.firebaseService.updateImage(img, updateUser.profile_image_path);
			}
		}
		const updateUser = await this.userService.updateLocalUser(email, updateUserDto);
		if (img != null || img != undefined) {
			await this.firebaseService.updateImage(img, updateUser.profile_image_path);
		}

	}

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
