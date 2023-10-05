import { Module } from "@nestjs/common";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";
import { PlaylistContentsService } from "./playlist-contents.service";

@Module({
	imports: [],
	controllers: [PlaylistController],
	providers: [PlaylistService, PlaylistContentsService],
})
export class PlaylistModule {}
