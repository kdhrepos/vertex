import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";

export class UpdateCommentDto {
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

	@IsString()
	@ApiProperty({
		required: true,
		description: "수정할 비디오의 댓글",
		example: "대상혁",
	})
	content: string;

	@IsNumber({ allowNaN: true }, { always: false })
	@ApiProperty({
		required: true,
		description: "대댓글일때 댓글의 부모의 아이디",
		example: "0이라면 일반 댓글, 0 이상이라면 대댓글",
		type: Number,
	})
	parentId: number | null;

	@IsString()
	@ApiProperty({
		required: true,
		description: "DB 상에서 비디오의 ID",
		example: "e51017a0ac8c793be6b07fdcb447267abfb5acbee87e585d81823af67e8681a0",
	})
	videoId: string;
}
