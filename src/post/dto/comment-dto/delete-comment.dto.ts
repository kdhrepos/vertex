import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";

export class DeleteCommentDto {
	@IsNumber()
	@ApiProperty({
		required: true,
		description: "댓글의 id",
		example: "1",
	})
	commentId: number;

	@IsNumber()
	@ApiProperty({
		required: true,
		description: "DB 상에서 게시글의 ID",
		example: "1",
	})
	postId: number;
}
