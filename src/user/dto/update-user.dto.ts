import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class UpdateUserDto {
	@IsEmail()
	@ApiProperty({
		example: "qweqwe@naver.com",
		description: "사용자 이메일",
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

	@ApiProperty({
		example: "jpg/jpeg/png etc...",
		description:
			"채널의 배경 이미지 파일",
		required: false,
	})
	channelImage: Express.Multer.File;
}
