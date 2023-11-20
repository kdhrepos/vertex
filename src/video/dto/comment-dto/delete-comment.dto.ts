import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";

export class DeleteCommentDto {
	@IsNumber()
	@ApiProperty({
		required: true,
		description: "댓글의 id",
		example: "1",
	})
	id: number;

	@IsString()
	@ApiProperty({
		required: true,
		description: "DB 상에서 비디오의 ID",
		example: "e51017a0ac8c793be6b07fdcb447267abfb5acbee87e585d81823af67e8681a0",
	})
	videoId: string;
}
