import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";

export class UpdateCommentDto {
	@IsNumber()
	@ApiProperty({
		required: true,
		description: "1",
		example: "댓글의 id",
	})
	commentId: number;

	@IsString()
	@ApiProperty({
		required: true,
		description: "수정할 비디오의 댓글",
		example: "대상혁",
	})
	content: string;

	@IsNumber()
	@ApiProperty({
		required: true,
		description: "DB 상에서 게시글의 ID",
		example: "1",
	})
	postId: number;
}
