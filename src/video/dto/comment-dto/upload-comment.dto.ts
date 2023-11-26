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
		description: "비디오의 댓글",
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

	@IsString()
	@ApiProperty({
		required: true,
		description: "DB 상에서 비디오의 ID",
		example: "e51017a0ac8c793be6b07fdcb447267abfb5acbee87e585d81823af67e8681a0",
	})
	videoId: string;
}
