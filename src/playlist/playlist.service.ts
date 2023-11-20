import { HttpException, HttpStatus, Logger, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Playlist } from "src/model/playlist.model";

@Injectable()
export class PlaylistService {
	constructor(
		@InjectModel(Playlist)
		private playlistModel: typeof Playlist,
	) {}

	private readonly logger = new Logger("Playlist Service");

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

	async create(listName: string, session: any) {
		const functionName = PlaylistService.prototype.create.name;
		try {
			const { passport } = session;
			const email = passport.user;

			const duplicatedPlaylist = await this.playlistModel.findOne({
				where: {
					user_email: email,
					list_name: listName,
				},
			});

			if (duplicatedPlaylist) {
				this.logger.error(`${functionName} : Duplicated Playlist Title`);
				return new HttpException(
					"Duplicated Playlist Title",
					HttpStatus.BAD_REQUEST,
				);
			}
			return await this.playlistModel.create({
				user_email: email,
				list_name: listName,
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error.message}`);
			return new HttpException(
				"Server Error",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async delete(listName: string, session: any) {
		const functionName = PlaylistService.prototype.delete.name;
		try {
			const { passport } = session;
			const email = passport.user;
			const existedVideo = await this.playlistModel.findOne({
				where: {
					user_email: email,
					list_name: listName,
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
			this.logger.error(`${functionName} : ${error.message}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
