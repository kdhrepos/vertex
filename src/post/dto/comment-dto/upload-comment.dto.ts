import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class UploadCommentDto {
	@IsEmail()
	@ApiProperty({
		required: true,
		description: "비디오 주인의 이메일",
		example: "asd@naver.com",
	})
	email: string;

	@IsString()
	@ApiProperty({
		required: true,
		description: "게시글의 댓글",
		example: "대상혁",
	})
	content: string;

	@IsOptional()
	@IsNumber({}, { always: false })
	@ApiProperty({
		required: true,
		description: "대댓글일때 댓글의 부모의 아이디",
		example: "0이라면 일반 댓글, 0 이상이라면 대댓글",
	})
	parentId: number | null;

	@IsNumber()
	@ApiProperty({
		required: true,
		description: "DB 상에서 게시글의 ID",
		example: "1",
	})
	postId: number;
}
