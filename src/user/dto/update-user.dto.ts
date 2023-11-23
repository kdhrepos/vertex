import { ApiProperty } from "@nestjs/swagger";
import {
	IsString,
	IsNotEmpty,
	IsStrongPassword,
	IsEmail,
} from "class-validator";

export class UpdateUserDto {
	@IsStrongPassword({
		minLength: 8,
		minUppercase: 1,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	@ApiProperty({
		example: "asd123",
		description: "사용자 인증을 위한 패스워드",
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
}
