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
	@Get("")
	async findPlaylist(@Query("userId") userId: string) {
		return await this.playlistService.findAll(userId);
	}

	@ApiOperation({ description: "재생목록 리스트 생성" })
	@Post("")
	async createPlaylist(
		@Body("userId") userId: string,
		@Body("listName") listName: string,
		@Body("isPrivate") isPrivate: boolean,
	) {
		return await this.playlistService.create(listName, isPrivate, userId);
	}

	@ApiOperation({ description: "재생목록 리스트 삭제" })
	@Delete("")
	async deletePlaylist(
		@Body("listName") listName: string,
		@Body("userId") userId: string,
	) {
		return await this.playlistService.delete(listName, userId);
	}

	@ApiOperation({ description: "유저의 재생목록 내 컨텐츠 요청" })
	@Get("contents")
	async findContents(@Query("playlistId") playlistId: number) {
		return this.playlistContentsService.findAll(playlistId);
	}

	@ApiOperation({ description: "재생목록에 비디오 추가" })
	@Post("contents")
	async addToPlaylist(
		@Body("videoId") videoId: string,
		@Body("playlistId") playlistId: number,
	) {
		return await this.playlistContentsService.add(videoId, playlistId);
	}

	@ApiOperation({ description: "재생목록의 비디오 삭제" })
	@Delete("contents")
	async deleteToPlaylist(
		@Body("videoId") videoId: string,
		@Body("playlistId") playlistId: number,
	) {
		await this.playlistContentsService.delete(videoId, playlistId);
	}
}
