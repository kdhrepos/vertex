import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class UpdateVideoDto {
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

	@IsString()
	@ApiProperty({
		required: true,
		description: "DB 상에서 비디오의 ID",
		example: "e51017a0ac8c793be6b07fdcb447267abfb5acbee87e585d81823af67e8681a0",
	})
	videoId: string;
}
