import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Request,
	Response,
	Body,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PlaylistService } from "./playlist.service";
import { PlaylistContentsService } from "./playlist-contents.service";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";
import { DeletePlaylistDto } from "./dto/delete-playlist.dto";

@ApiTags("Playlist")
@Controller("playlist")
export class PlaylistController {
	constructor(
		private playlistService: PlaylistService,
		private playlistContentsService: PlaylistContentsService,
	) {}

	@ApiOperation({ description: "유저의 재생목록 리스트 요청" })
	@Get(":playlist_id")
	async findPlaylist(
		@Request() req,
		@Response() res,
		@Param("playlist_id") playlist_id,
	) {
		return this.playlistService.findAll(req, res, playlist_id);
	}

	@ApiOperation({ description: "재생목록 리스트 생성" })
	@Post(":playlist_id")
	async createPlaylist(@Body() createPlaylistDto: CreatePlaylistDto) {
		return this.playlistService.create(createPlaylistDto);
	}

	@ApiOperation({ description: "재생목록 리스트 삭제" })
	@Delete(":playlist_id")
	async deletePlaylist(@Body() deleteVideoDto: DeletePlaylistDto) {
		const { email, title } = deleteVideoDto;
		await this.playlistService.deleteOne(email, title);
	}

	@ApiOperation({ description: "유저의 재생목록 내 컨텐츠 요청" })
	@Get("contents/:playlist_id")
	findContents() {}

	@ApiOperation({ description: "재생목록에 비디오 추가" })
	@Post("contents/:video_id")
	addToPlaylist() {}

	@ApiOperation({ description: "재생목록의 비디오 삭제" })
	@Delete("contents/:video_id")
	deleteToPlaylist() {}
}
