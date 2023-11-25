import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsDate, IsOptional } from "class-validator";

export class CreateUserDto {
	@IsEmail()
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

	@IsString()
	@ApiProperty({
		example: "asd123",
		description: "Local 회원가입을 위한 패스워드 (strong password)",
		required: true,
	})
	password: string;

	@IsString({ always: false })
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

	@IsOptional()
	@IsDate()
	@ApiProperty({
		example: "2000-06-15",
		description: "사용자의 생년월일",
		required: false,
	})
	birthday: Date | null;

	@IsString()
	@ApiProperty({
		example: "M / F",
		description: "사용자의 성별 (문자열)",
		required: false,
	})
	gender: string;
}
