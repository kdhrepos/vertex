import {
	HttpException,
	HttpStatus,
	Logger,
	Request,
	Response,
	Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Playlist } from "src/model/playlist.model";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";

@Injectable()
export class PlaylistService {
	constructor(@InjectModel(Playlist) private playlistModel: typeof Playlist) {}

	private readonly logger = new Logger("Playlist Service");

	async findAll(@Request() req, @Response() res, playlist_id: string) {
		console.log(playlist_id);
	}

	async findOne() {}

	async createPlaylist(createPlaylist: CreatePlaylistDto) {
		const functionName = PlaylistService.prototype.createPlaylist.name;
		try {
			const { title } = createPlaylist;
			const duplicatedPlaylist = await this.playlistModel.findOne({
				where: {
					title: title,
				},
			});
			if (duplicatedPlaylist) {
				this.logger.error(`${functionName} : Duplicated Playlist Title`);
				throw new HttpException(
					"Duplicated Video Title",
					HttpStatus.BAD_REQUEST,
				);
			}
			const newPlaylist = await this.playlistModel.create({
				title: title,
			});
			return newPlaylist;
		} catch (error) {
			this.logger.error(
				`${functionName} : Error creating playlist - ${error.message}`,
			);
			throw new HttpException("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async update() {}

	async delete() {}
}
