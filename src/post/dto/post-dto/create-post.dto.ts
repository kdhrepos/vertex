import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreatePostDto {
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
