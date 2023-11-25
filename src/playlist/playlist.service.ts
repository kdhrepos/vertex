import { HttpException, HttpStatus, Logger, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Playlist } from "src/model/playlist.model";

@Injectable()
export class PlaylistService {
	constructor(
		@InjectModel(Playlist)
		private playlistModel: typeof Playlist,
	) {}

	async findAll(session: any) {
		try {
			const { user: email } = session.passport;

			const playlists = await this.playlistModel.findAll({
				where: {
					user_email: email,
				},
			});

			if (playlists) {
				return {
					data: playlists,
					statusCode: 200,
					message: "Playlists are successfully found",
				};
			}
		} catch (error) {
			throw new HttpException(`${error.response}`, error.status);
		}
	}

	async create(listName: string, isPrivate: boolean, session: any) {
		try {
			const { passport } = session;
			const email = passport.user;

			const duplicatedPlaylist = await this.playlistModel.findOne({
				where: {
					user_email: email,
					list_name: listName,
				},
			});

			if (duplicatedPlaylist)
				throw new HttpException(
					`Duplicated Playlist Title`,
					HttpStatus.BAD_REQUEST,
				);

			return await this.playlistModel.create({
				user_email: email,
				is_private: isPrivate,
				list_name: listName,
			});
		} catch (error) {
			throw new HttpException(`${error.response}`, error.status);
		}
	}

	async delete(listName: string, session: any) {
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
				return {
					statusCode: 200,
					message: "Successfully Deleted",
				};
			}
			throw new HttpException(
				`Playlist Does Not Exist`,
				HttpStatus.BAD_REQUEST,
			);
		} catch (error) {
			throw new HttpException(`${error.response}`, error.status);
		}
	}
}
