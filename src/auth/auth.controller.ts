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
	@ApiOperation({ description: "구글 소셜 로그인" })
	@Get("login/google")
	@UseGuards(GoogleAuthGuard)
	async googleAuth(@Request() req, @Response() res) {
		const { user } = req;

		return user;
	}
}
