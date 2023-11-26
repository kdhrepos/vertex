import { HttpException, HttpStatus, Logger, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Playlist } from "src/model/playlist.model";

@Injectable()
export class PlaylistService {
	constructor(
		@InjectModel(Playlist)
		private playlistModel: typeof Playlist,
	) {}

	async findAll(userId: string) {
		try {
			const playlists = await this.playlistModel.findAll({
				where: {
					user_email: userId,
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

	async create(listName: string, isPrivate: boolean, userId: string) {
		try {
			const duplicatedPlaylist = await this.playlistModel.findOne({
				where: {
					user_email: userId,
					list_name: listName,
				},
			});

			if (duplicatedPlaylist)
				throw new HttpException(
					`Duplicated Playlist Title`,
					HttpStatus.BAD_REQUEST,
				);

			return await this.playlistModel.create({
				user_email: userId,
				is_private: isPrivate,
				list_name: listName,
			});
		} catch (error) {
			throw new HttpException(`${error.response}`, error.status);
		}
	}

	async delete(listName: string, userId: string) {
		try {
			const existedVideo = await this.playlistModel.findOne({
				where: {
					user_email: userId,
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

			return {
				statusCode: 400,
				message: "Delete Failed",
			};
		} catch (error) {
			throw new HttpException(`${error.response}`, error.status);
		}
	}
}
