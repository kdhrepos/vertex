import { ApiProperty } from "@nestjs/swagger";
import {
	IsNotEmpty,
	IsStrongPassword,
	IsEmail,
	IsOptional,
} from "class-validator";

export class DeleteUserDto {
	@IsEmail()
	@ApiProperty({
		example: "qweqwe@naver.com",
		description: "회원 탈퇴를 위한 이메일",
		required: true,
	})
	email: string;

	@IsOptional()
	@IsStrongPassword({
		minLength: 8,
		minUppercase: 1,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	@ApiProperty({
		example: "asd123",
		description: "회원 탈퇴를 위한 패스워드로, 소셜 로그인에는 없음",
		required: true,
	})
	password: string;
}
