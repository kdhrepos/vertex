import { Controller, Delete, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Playlist")
@Controller("playlist")
export class PlaylistController {
	@ApiOperation({ description: "유저의 재생목록 리스트 요청" })
	@Get(":playlist_id")
	findPlaylist() {}

	@ApiOperation({ description: "재생목록 리스트 생성" })
	@Post(":playlist_id")
	createPlaylist() {}

	@ApiOperation({ description: "재생목록 리스트 삭제" })
	@Delete(":playlist_id")
	deletePlaylist() {}

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
