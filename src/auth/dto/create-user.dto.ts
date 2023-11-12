import { ApiProperty } from "@nestjs/swagger";
import {
	IsString,
	IsNotEmpty,
	IsStrongPassword,
	IsEmail,
} from "class-validator";

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty({
		example: "qweqwe@naver.com",
		description: "Local 회원가입을 위한 이메일",
		required: true,
	})
	email: string;

	@IsString()
	@ApiProperty({
		example: "김동현",
		description: "사용자 이름",
		required: true,
	})
	name: string;

	@IsStrongPassword({
		minLength: 8,
		minUppercase: 1,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	@ApiProperty({
		example: "asd123",
		description: "Local 회원가입을 위한 패스워드 (strong password)",
		required: true,
	})
	password: string;

	@ApiProperty({
		example: "Hello I'm Kim",
		description: "사용자의 채널 설명으로, 필수 요건 아님",
		required: false,
	})
	description: string;

	@ApiProperty({
		example: "jpg/jpeg/png etc...",
		description:
			"사용자의 프로필 이미지 파일로, html 태그 이름은 profile-image",
		required: false,
	})
	profileImage: Express.Multer.File;
}
