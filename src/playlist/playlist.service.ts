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
import { CreatePlaylistDto } from "./playlist-dto/create-playlist.dto";
import * as uuid from "uuid";

@Injectable()
export class PlaylistService {
	constructor(@InjectModel(Playlist) private playlistModel: typeof Playlist) {}

	private readonly logger = new Logger("Playlist Service");

	async findAll(@Request() req, @Response() res, playlist_id: string) {
		console.log(playlist_id);
	}

	async findOne(playlist_id: string): Promise<any> {
		const functionName = PlaylistService.prototype.findOne.name;
		try {
			const existedPlaylist = await this.playlistModel.findByPk(playlist_id, {
				raw: true,
			});
			if (existedPlaylist) {
				return existedPlaylist;
			}
			this.logger.error(`${functionName} : Playlist Does Not Exist`);
			return false;
		} catch (error) {
			this.logger.error(`${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

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

	async deleteOne(email: string, title: string) {
		const functionName = PlaylistService.prototype.deleteOne.name;
		try {
			const existedVideo = await this.playlistModel.findOne({
				where: {
					user_email: email,
					title: title,
				},
			});
			if (existedVideo) {
				await existedVideo.destroy();
				return;
			}
			this.logger.error(`${functionName} : Playlist does Not Exist`);
			return new HttpException(
				`${functionName} : Playlist Does Not Exist`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
