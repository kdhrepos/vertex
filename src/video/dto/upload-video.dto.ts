import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class UploadVideoDto {
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
		description: "비디오 제목",
		example: "홀란드 & 엄지윤 하이라이트",
	})
	title: string;

	@IsString({ always: false })
	@ApiProperty({
		required: false,
		description: "비디오 설명",
		example: "개 똑같이 생겼네",
	})
	description: string;

	@ApiProperty({
		required: true,
		example: "mp4 etc...",
		description: "동영상",
	})
	video: Express.Multer.File;

	@ApiProperty({
		required: false,
		example: "jpg/jpeg/png etc...",
		description: "동영상 썸네일",
	})
	thumbnail: Express.Multer.File;
}
