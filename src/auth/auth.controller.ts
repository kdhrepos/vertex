import {
	Controller,
	Get,
	Response,
	Request,
	UseGuards,
<<<<<<< HEAD
	Redirect,	
=======
	Post,
	Body,
	UploadedFile,
	UseInterceptors,
	Delete,
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
	getSchemaPath,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "src/user/user.service";
import { DeleteUserDto } from "./dto/delete-user.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
	) {}

	@ApiOperation({ description: "구글 소셜 로그인 접근 Route" })
	@Get("login/google")
	@UseGuards(GoogleAuthGuard)
	async googleAuth(@Request() req) {}

	@ApiOperation({ description: "구글 소셜 로그인 콜백 Route" })
	@ApiResponse({ description: "구글 소셜 로그인 성공 시 유저 정보 반환" })
	@Get("google")
	@UseGuards(GoogleAuthGuard)
	async googleAuthRedirect(@Request() req, @Response() res) {
		console.log(req.user);
		const { user } = req;
		if (!user) {
			return res.send(user);
		}
		return res.send(user);
	}
<<<<<<< HEAD
=======

	@ApiOperation({ description: "일반 로그인 접근 Route" })
	@Post("login/local")
	@UseGuards(LocalAuthGuard)
	localAuth(@Request() req: any) {
		console.log(req.user);
		return req.user;
	}
}
