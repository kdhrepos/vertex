import { IsEmail, IsString, IsNotEmpty, IsUUID } from "class-validator";


export class AddVideoToPlaylistDto{
	@IsEmail()
	video_id: string;

    @IsUUID()
	playlist_id: number;

}