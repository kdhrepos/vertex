import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePlaylistDto {
	@IsString()
	@ApiProperty({
		required: true,
		description: "플레이리스트 제목",
		example: "박효신 노래 모음",
	})
	title: string;
}
