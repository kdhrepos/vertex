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
import { PlaylistContents } from "src/model/playlist-contents.model";
import { CreatePlaylistDto } from "./playlist-dto/create-playlist.dto";
import { AddVideoToPlaylistDto } from "./playlist-contents-dto/add-video-to-playlist.dto";
import * as uuid from "uuid";

@Injectable()
export class PlaylistService {
	constructor(@InjectModel(Playlist) private playlistModel: typeof Playlist, private playlistContentsModel: typeof PlaylistContents) { }

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


	async createPlaylist(createPlaylist: CreatePlaylistDto) {
		const functionName = PlaylistService.prototype.createPlaylist.name;
		try {
			const { title } = createPlaylist;
			const duplicatedPlaylist = await this.playlistModel.findOne({
				where: {
					title: title,
				
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

	async findVideosInPlaylist(@Request() req, @Response() res, playlist_id: string) {
		const functionName = PlaylistService.prototype.findVideosInPlaylist.name;
		try {
			const existedVIdeo = await this.playlistContentsModel.findAll(
				{
					where: {
						playlist_id: playlist_id
					}
				}
			);
			if (!existedVIdeo) {
				console.log(null);
			}
			console.log(existedVIdeo);
		} catch (error) {
			this.logger.error(`${functionName} : Playlist does Not Exist`);
			return new HttpException(
				`${functionName} : Playlist Does Not Exist`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
	
	async addVideoToPlaylist(addVideoToPlaylistDto: AddVideoToPlaylistDto) {
		const functionName = PlaylistService.prototype.addVideoToPlaylist.name;
		try {
			const { playlist_id, video_id } = addVideoToPlaylistDto;
			const duplicatedPlaylist = await this.playlistContentsModel.findOne({
				where: {
					video_id: video_id
				},
			});
			if (duplicatedPlaylist) {
				this.logger.error(`${functionName} : Duplicated video`);
				throw new HttpException(
					"Duplicated Video Title",
					HttpStatus.BAD_REQUEST,
				);
			}
			return await this.playlistContentsModel.create({
				playlist_id: playlist_id,
				video_id: video_id,
			});
		} catch (error) {
			this.logger.error(
				`${functionName} : Error add video - ${error.message}`,
			);
			throw new HttpException("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteVideoToPlaylist(video_id: string) {
		const functionName = PlaylistService.prototype.deleteOne.name;
		try {
			const existedVideo = await this.playlistContentsModel.findOne({
				where: {
					video_id: video_id
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
