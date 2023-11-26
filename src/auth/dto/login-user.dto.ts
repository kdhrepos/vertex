import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsDate, IsOptional } from "class-validator";

export class LoginUserDto {
	@IsEmail()
	@ApiProperty({
		example: "qweqwe@naver.com",
		description: "Local 회원가입을 위한 이메일",
		required: true,
	})
	email: string;

	@IsString()
	@ApiProperty({
		example: "asd123",
		description: "Local 회원가입을 위한 패스워드 (strong password)",
		required: true,
	})
	password: string;
}
