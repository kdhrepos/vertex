import { ApiProperty } from "@nestjs/swagger";
import {
	IsString,
	IsStrongPassword,
	IsEmail,
	IsOptional,
} from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsStrongPassword({
		minLength: 8,
		minUppercase: 1,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})

	@IsOptional()
	@ApiProperty({
		example: "asd123",
		description: "사용자 인증을 위한 패스워드",
		required: true,
	})
	password: string;

	@IsOptional()
	@IsString({ always: false })
	@ApiProperty({
		example: "Hello I'm Kim",
		description: "사용자의 채널 설명으로, 필수 요건 아님",
		required: false,
	})
	description: string;

	@IsOptional()
	@ApiProperty({
		example: "jpg/jpeg/png etc...",
		description:
			"사용자의 프로필 이미지 파일로, html 태그 이름은 profile-image",
		required: false,
	})
	profileImage: Express.Multer.File;
}
