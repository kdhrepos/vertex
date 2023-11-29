import {
	Controller,
	Get,
	UseGuards,
	Post,
	Body,
	UploadedFile,
	UseInterceptors,
	Delete,
	Query,
	Res,
	Req,
} from "@nestjs/common";
import {
	AuthenticatedGuard,
	GoogleAuthGuard,
	LocalAuthGuard,
} from "./auth.guard";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiExtraModels,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "src/user/user.service";
import { DeleteUserDto } from "../user/dto/delete-user.dto";
import * as bcrypt from "bcrypt";
import { FirebaseService } from "src/firebase/firebase.service";
import * as path from "path";
import { Request, Response } from "express";
import { LoginUserDto } from "./dto/login-user.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
		private firebaseService: FirebaseService,
	) {}

	@ApiOperation({ description: "구글 소셜 로그인 접근 Route" })
	@Get("login/google")
	// @UseGuards(GoogleAuthGuard)
	async googleAuth(@Req() req) {}

	@ApiOperation({ description: "구글 소셜 로그인 콜백 Route" })
	@ApiResponse({ description: "구글 소셜 로그인 성공 시 유저 정보 반환" })
	@Get("google")
	// @UseGuards(GoogleAuthGuard)
	async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
		const { user } = req;
		if (!user) {
			return res.send(user);
		}
		return res.send(user);
	}

	@ApiOperation({ description: "일반 로그인 접근 Route" })
	@Post("login/local")
	async localAuth(@Body() loginUserDto: LoginUserDto) {
		console.log(loginUserDto)
		return await this.authService.validateUser(loginUserDto);
	}

	@ApiOperation({
		description: "소셜 로그인을 통한 회원가입이 아닌 일반 회원가입",
	})
	@ApiExtraModels(CreateUserDto)
	@Post("signup/local")
	@UseInterceptors(FileInterceptor("profile", {}))
	async signin(
		@Body() createUserDto: CreateUserDto,
		@UploadedFile() profileImage?: Express.Multer.File,
	) {
		console.log(createUserDto)
		const { email, name } = createUserDto;
		const hashedFilePath =
			profileImage !== null && profileImage !== undefined
				? (await bcrypt.hashSync(`${email}${name}`, 12).replace(/\//g, "")) +
				  path.extname(profileImage.originalname)
				: null;

		this.firebaseService.updateImage(profileImage, hashedFilePath);
		return await this.userService.createUser(createUserDto);
	}

	@ApiOperation({ description: "소셜, 일반 모두 포함한 회원탈퇴 기능" })
	@Delete("signout")
	async signout(@Body() deleteUserDto: DeleteUserDto) {
		return await this.userService.deleteUser(deleteUserDto);
	}

	@ApiOperation({ description: "이메일 중복 체크" })
	@Get("check/email")
	async checkDuplicatedEmail(
		@Res() res: Response,
		@Query("email") email: string,
	) {
		const user = await this.userService.getUserByEmail(email);
		if (user) {
			return res.json({
				status: false,
				msg: "Invalid Email",
			});
		}
		return res.json({
			status: true,
			msg: "Valid Email",
		});
	}
}
