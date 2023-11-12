import {
	Controller,
	Get,
	Response,
	Request,
	UseGuards,
	Post,
	Body,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import {
	AuthenticatedGuard,
	GoogleAuthGuard,
	LocalAuthGuard,
} from "./auth.guard";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

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

	@ApiOperation({ description: "일반 로그인 접근 Route" })
	@Post("login/local")
	@UseGuards(LocalAuthGuard)
	localAuth(@Request() req: any) {
		console.log(req.user);
		return req.user;
	}

	@ApiOperation({ description: "이미 로그인한 사용자가 확인하는 Route" })
	@Get("login/authenticated")
	@UseGuards(AuthenticatedGuard)
	authenticated(@Request() req: any, @Response() res: any) {
		const { user } = req;
		if (!user) {
			return res.send(user);
		}
		return res.send(user);
	}

	@ApiOperation({ description: "" })
	@Post("signin/local")
	@UseInterceptors(FileInterceptor("profile-image", {}))
	async signin(
		@Body() createUserDto: CreateUserDto,
		@UploadedFile() profileImage: Express.Multer.File,
	) {
		return await this.authService.registerUser(createUserDto, profileImage);
	}
}
