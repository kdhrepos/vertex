import { IsString } from "class-validator";


export class DeleteVideoToPlaylistDto{
	@IsString()
	video_id: string;


}