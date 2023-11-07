import {
	Controller,
	Get,
	Response,
	Request,
	UseGuards,
	Redirect,	
} from "@nestjs/common";
import { GoogleAuthGuard } from "./auth.guard";
import { ApiOperation } from "@nestjs/swagger";

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
}
