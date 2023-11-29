import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";

export class DeleteCommentDto {
	@IsEmail()
	@ApiProperty({
		required: true,
		description: "비디오 주인의 이메일",
		example: "asd@naver.com",
	})
	email: string;

	@IsNumber()
	@ApiProperty({
		required: true,
		description: "댓글의 id",
		example: "1",
	})
	id: number;

	@IsNumber()
	@ApiProperty({
		required: true,
		description: "DB 상에서 게시글의 ID",
		example: "1",
	})
	postId: number;
}
