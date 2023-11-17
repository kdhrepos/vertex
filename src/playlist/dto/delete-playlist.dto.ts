import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class DeletePlaylistDto{

	@IsEmail()
	email: string;

    @IsString()
	@ApiProperty({
		required: true,
		description: "플레이리스트 제목",
		example: "박효신 노래 모음",
	})
	title: string;
}