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

	private readonly logger = new Logger("Playlist Contents Service");

	async findAll(playlistId: number) {
		const functionName = PlaylistContentsService.prototype.findAll.name;
		try {
			return await this.playlistContentsModel.findAll({
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
		} catch (error) {
			this.logger.error(`${functionName} : ${error.message}`);
			return new HttpException(
				`${functionName} : ${error.message}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
	async add(videoId: string, playlistId: number) {
		const functionName = PlaylistContentsService.prototype.add.name;
		try {
			const duplicatedPlaylist = await this.playlistContentsModel.findOne({
				where: {
					video_id: videoId,
					playlist_id: playlistId,
				},
			});

			if (duplicatedPlaylist) {
				this.logger.error(`${functionName} : Duplicated Video`);
				return new HttpException("Duplicated Video", HttpStatus.BAD_REQUEST);
			}

			return await this.playlistContentsModel.create({
				video_id: videoId,
				playlist_id: playlistId,
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error.message}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async delete(videoId: string, playlistId: number) {
		const functionName = PlaylistContentsService.prototype.delete.name;
		try {
			const existedVideo = await this.playlistContentsModel.findOne({
				where: {
					video_id: videoId,
					playlist_id: playlistId,
				},
			});

			if (existedVideo) {
				await existedVideo.destroy();
				return;
			}

			this.logger.error(`${functionName} : Video does Not Exist`);
			return new HttpException(
				`${functionName} : Video Does Not Exist`,
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
