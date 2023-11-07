import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PlaylistContents } from "src/model/playlist-contents.model";

@Injectable()
export class PlaylistContentsService {
	constructor(
		@InjectModel(PlaylistContents)
		private playlistContentsModel: typeof PlaylistContents,
	) {}

	private readonly logger = new Logger("Playlist Contents Service");

	async findAll() {}

	async create() {}

	async delete() {}
}
