import { Module } from "@nestjs/common";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";
import { PlaylistContentsService } from "./playlist-contents.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Playlist } from "src/model/playlist.model";
import { PlaylistContents } from "src/model/playlist-contents.model";

@Module({
	imports: [SequelizeModule.forFeature([Playlist, PlaylistContents])],
	controllers: [PlaylistController],
	providers: [PlaylistService, PlaylistContentsService],
})
export class PlaylistModule {}
