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
>>>>>>> 4403cc6b906c84275bb0d3319da2029915a7a317
} from "@nestjs/common";
import { GoogleAuthGuard, LocalAuthGuard } from "./auth.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	@ApiOperation({ description: "구글 소셜 로그인 접근 Route" })
	@Get("login/google")
	@UseGuards(GoogleAuthGuard)
	async googleAuth(@Request() req) {}

	@ApiOperation({ description: "구글 소셜 로그인 콜백 Route" })
	@Get("google")
	@UseGuards(GoogleAuthGuard)
	async googleAuthRedirect(@Request() req, @Response() res) {
		const { user } = req;

		return user;
	}
<<<<<<< HEAD
=======

	@ApiOperation({ description: "일반 로그인 접근 Route" })
	@Post("login/local")
	@UseGuards(LocalAuthGuard)
	localAuth(@Request() req: any) {
		return req.user;
	}
>>>>>>> 4403cc6b906c84275bb0d3319da2029915a7a317
}
