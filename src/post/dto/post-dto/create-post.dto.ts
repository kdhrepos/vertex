import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class CreatePostDto {
	@IsEmail()
	email: string;

	@IsString()
	channelId: string;

	@IsString()
	title: string;

	@IsString()
	contents: string;

	@ApiProperty({
		required: false,
		example: "jpg/jpeg/png etc...",
		description: "게시글에 포함된 이미지",
	})
	img: Express.Multer.File;
}
