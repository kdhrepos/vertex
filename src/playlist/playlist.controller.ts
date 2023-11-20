import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Request,
	Response,
	Body,
	UseGuards,
	Query,
	Session,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PlaylistService } from "./playlist.service";
import { PlaylistContentsService } from "./playlist-contents.service";
import { AuthenticatedGuard } from "src/auth/auth.guard";

@ApiTags("Playlist")
@Controller("playlist")
export class PlaylistController {
	constructor(
		private playlistService: PlaylistService,
		private playlistContentsService: PlaylistContentsService,
	) {}

	@ApiOperation({ description: "유저의 재생목록 리스트 요청" })
	@UseGuards(AuthenticatedGuard)
	@Get("")
	async findPlaylist(@Param("playlist_id") playlist_id) {
		// return this.playlistService.findAll(playlist_id);
	}

	@ApiOperation({ description: "재생목록 리스트 생성" })
	@UseGuards(AuthenticatedGuard)
	@Post("")
	async createPlaylist(
		@Query("listName") listName: string,
		@Session() session: any,
	) {
		return this.playlistService.create(listName, session);
	}

	@ApiOperation({ description: "재생목록 리스트 삭제" })
	@UseGuards(AuthenticatedGuard)
	@Delete("")
	async deletePlaylist(
		@Query("listName") listName: string,
		@Session() session: any,
	) {
		return await this.playlistService.delete(listName, session);
	}

	@ApiOperation({ description: "유저의 재생목록 내 컨텐츠 요청" })
	@UseGuards(AuthenticatedGuard)
	@Get("contents")
	async findContents(@Query("playlistId") playlistId: number) {
		return this.playlistContentsService.findAll(playlistId);
	}

	@ApiOperation({ description: "재생목록에 비디오 추가" })
	@UseGuards(AuthenticatedGuard)
	@Post("contents")
	async addToPlaylist(
		@Body("videoId") videoId: string,
		@Body("playlistId") playlistId: number,
	) {
		return this.playlistContentsService.add(videoId, playlistId);
	}

	@ApiOperation({ description: "재생목록의 비디오 삭제" })
	@UseGuards(AuthenticatedGuard)
	@Delete("contents")
	async deleteToPlaylist(
		@Body("videoId") videoId: string,
		@Body("playlistId") playlistId: number,
	) {
		await this.playlistContentsService.delete(videoId, playlistId);
	}
}
