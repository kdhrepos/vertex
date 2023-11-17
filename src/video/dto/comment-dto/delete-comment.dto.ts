import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";

export class DeleteCommentDto {
	@IsNumber()
	@ApiProperty({
		required: true,
		description: "1",
		example: "댓글의 id",
	})
	id: number;

	@IsEmail()
	@ApiProperty({
		required: true,
		description: "asd@naver.com",
		example: "유저의 이메일",
	})
	email: string;

	@IsBoolean()
	@ApiProperty({
		required: true,
		description: "비디오 댓글인지 게시글 댓글인지 표시",
		example: "true / false",
	})
	isVideo: boolean;

	@IsString()
	@ApiProperty({
		required: true,
		description: "DB 상에서 비디오의 ID",
		example: "$2b$12$s1O5h66GFZ0oXR3eLDiuF.J9uglYTEXus71.BMFAp5zcTqgjXz9M2",
	})
	path: string;
}
