import { Controller, Body, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("User")
@Controller("user")
export class UserController {
	constructor() {}

	// @ApiBody({ type: CreateUserDto })
	@Post("/sign-up")
	createUser() {
		return "user successfully made";
	}
}
