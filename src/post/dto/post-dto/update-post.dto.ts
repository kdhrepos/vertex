import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class UpdatePostDto {
	@IsNumber()
	postId: number;

	@IsString()
	title: string;

	@IsString()
	channelEmail: string;

	@IsString()
	contents: string;

	@ApiProperty({
		required: false,
		example: "jpg/jpeg/png etc...",
		description: "게시글에 포함된 이미지",
	})
	img: Express.Multer.File;
}
