import { IsString, IsNotEmpty } from "class-validator";

export class UpdatePostDto {
    @IsNotEmpty()
	@IsString()
	email: string;

	@IsNotEmpty()
	@IsString()
	title: string;

    @IsNotEmpty()
	@IsString()
	channelEmail: string;
}
