import { IsString, IsNotEmpty } from "class-validator";

export class DeletePostDto{
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