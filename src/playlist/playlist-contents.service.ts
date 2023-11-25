import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PlaylistContents } from "src/model/playlist-contents.model";
import { PlaylistService } from "./playlist.service";
import { Video } from "src/model/video.model";
import { User } from "src/model/user.model";

@Injectable()
export class PlaylistContentsService {
	constructor(
		@InjectModel(PlaylistContents)
		private playlistContentsModel: typeof PlaylistContents,
	) {}

	async findAll(playlistId: number) {
		try {
			const playlists = await this.playlistContentsModel.findAll({
				where: {
					playlist_id: playlistId,
				},
				include: [
					{
						model: Video,
						attributes: ["title", "createdAt"],
						include: [
							{
								model: User,
								as: "user",
								attributes: ["name"],
							},
						],
					},
				],
			});

			return {
				data: playlists,
				statusCode: 200,
				message: "Video successfully found from playlist",
			};
		} catch (error) {
			throw new HttpException(`${error.response}`, error.status);
		}
	}

	async add(videoId: string, playlistId: number) {
		try {
			const playlist = await this.playlistContentsModel.create({
				video_id: videoId,
				playlist_id: playlistId,
			});

			return {
				data: playlist,
				statusCode: 200,
				message: "Video successfully added to playlist",
			};
		} catch (error) {
			throw new HttpException(`${error.response}`, error.status);
		}
	}

	async delete(videoId: string, playlistId: number) {
		try {
			const existedVideo = await this.playlistContentsModel.findOne({
				where: {
					video_id: videoId,
					playlist_id: playlistId,
				},
			});

			if (existedVideo) {
				await existedVideo.destroy();
				return {
					statusCode: 200,
					message: "Video successfully deleted from playlist",
				};
			}

			throw new HttpException(`Video does not exist`, HttpStatus.BAD_REQUEST);
		} catch (error) {
			throw new HttpException(`${error.response}`, error.status);
		}
	}
}
