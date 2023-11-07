import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Playlist } from "src/model/playlist.model";

@Injectable()
export class PlaylistService {
	constructor(@InjectModel(Playlist) private playlistModel: typeof Playlist) {}

	private readonly logger = new Logger("Playlist Service");

	async findAll() {}

	async findOne() {}

	async create() {}

	async update() {}

	async delete() {}
}
