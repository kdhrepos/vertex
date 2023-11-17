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
import * as uuid from "uuid";

@Injectable()
export class PlaylistService {
	constructor(@InjectModel(Playlist) private playlistModel: typeof Playlist) {}

	private readonly logger = new Logger("Playlist Service");

	async findAll(@Request() req, @Response() res, playlist_id: string) {
		console.log(playlist_id);
	}

	async findOne() {}

	async create(
		createPlaylistDto: CreatePlaylistDto
	) {
		const functionName = PlaylistService.prototype.create.name;
		try {
			const { email, title } = createPlaylistDto;
			const duplicatedPlaylist = await this.playlistModel.findOne({
				where: {
					list_name: title,
				},
			});
			if (duplicatedPlaylist) {
				this.logger.error(`${functionName} : Duplicated Playlist Title`);
				throw new HttpException(
					"Duplicated Video Title",
					HttpStatus.BAD_REQUEST,
				);
			}
			return await this.playlistModel.create({
				id: uuid.v4(),
				user_email: email,
				list_name: title,
			});
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
