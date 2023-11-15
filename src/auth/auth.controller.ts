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

	@ApiOperation({
		description: "소셜 로그인을 통한 회원가입이 아닌 일반 회원가입",
	})
	@ApiExtraModels(CreateUserDto)
	@ApiOkResponse({
		status: 200,
		description: "성공 시 DB에 생성된 유저 정보 반환",
	})
	@ApiBadRequestResponse({
		status: 400,
		description: "에러 반환",
	})
	@Post("signin/local")
	@UseInterceptors(FileInterceptor("profile", {}))
	async signin(
		@Body() createUserDto: CreateUserDto,
		@UploadedFile() profileImage?: Express.Multer.File,
	) {
		return await this.userService.createUser(createUserDto, profileImage);
	}

	@ApiOperation({ description: "소셜, 일반 모두 포함한 회원탈퇴 기능" })
	@ApiExtraModels(DeleteUserDto)
	@ApiOkResponse({
		status: 200,
		description: "회원 탈퇴 성공 시 boolean 값 true 반환 (문자열 x)",
	})
	@ApiBadRequestResponse({
		status: 400,
		description: "에러 반환",
	})
	@Delete("signout")
	async signout(@Body() deleteUserDto: DeleteUserDto) {
		return await this.userService.deleteUser(deleteUserDto);
	}
}
