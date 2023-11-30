import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Video } from "../model/video.model";
import { InjectModel } from "@nestjs/sequelize";
import { UpdateVideoDto } from "./dto/video-dto/update-video.dto";
import { User } from "src/model/user.model";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";

@Injectable()
export class VideoService {
	constructor(
		@InjectModel(Video)
		private videoModel: typeof Video,
		@InjectModel(User)
		private userModel: typeof User,
	) {}
	async findVideoByAlgorithm(page:number) {
		try {
			const videos = await this.videoModel.findAll({
				order:[['view_count','DESC']],
				offset: page * 12,
				limit : 12
			});

			console.log("LENGTH", videos.length);

			return {
				data: videos,
				statusCode: 200,
				message: "Videos are successfully found",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findNewVideos(page:number){
		try {
			const videos = await this.videoModel.findAll({
				order:[['createdAt','DESC']],
				offset:page * 12,
				limit : 12
			});

			return {
				data: videos,
				statusCode: 200,
				message: "Videos are successfully found",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findAll(channelId: string,page:number) {
		try {
			const videos = await this.videoModel.findAll({
				where: {
					user_email: channelId,
				},
				offset: page * 12,
				limit : 12,
			});

			return {
				data: videos,
				statusCode: 200,
				message: "Videos are successfully found",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findOne(videoId: string): Promise<any> {
		try {
			const existedVideo = await this.videoModel.findOne({
				where:{
					id:videoId
				},
				raw:true,
			})
			if (existedVideo) {
				return existedVideo;
			}
			return false;
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findBySearch(query : string,page:number){
		try {
			const videos = await this.videoModel.findAll({
				where:{
					title: {
						[Op.like]: `%${query}%`,
					},
				},
				offset : page * 12,
				limit : 12,
			})
			return {
				data: videos,
				statusCode : 200,
				message:"Videos are successfully found"
			}
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async create(
		videoId: string,
		title: string,
		email: string,
		description: string,
		videoFileExtension: string,
		thumbnailFileExtension: string,
	) {
		try {
			const user = await this.userModel.findOne({
				where:{
					email: email
				}
			})

			return this.videoModel.create({
				id: videoId,
				title: title,
				description: description === null ? null : description,
				user_email: email,
				name: user.name,
				video_file_extension: videoFileExtension,
				thumbnail_file_extension: thumbnailFileExtension,
			}).catch(error=>{
				console.log(error)
			})
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateOne(updateVideoDto: UpdateVideoDto, email: string) {
		const functionName = VideoService.prototype.updateOne.name;
		try {
			const { title, description, videoId } = updateVideoDto;
			await this.videoModel.update(
				{ user_email: email, title: title, description: description },
				{
					where: {
						id: videoId,
						user_email: email,
						title: title,
					},
				},
			);
		} catch (error) {
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async deleteOne(videoId: string) {
		try {
			const video = await this.videoModel.findOne({
				where: {
					id: videoId,
				},
			});

			if (video) {
				await video.destroy();
			}
			return video;
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateView(videoId: string) {
		try {
			await this.videoModel.update(
				{ view_count: Sequelize.literal("view_count+1") },
				{
					where: {
						id: videoId,
					},
				},
			);
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateLike(videoId :string, liked: boolean) {
		const functionName = VideoService.prototype.updateLike.name;
		try {
			await this.videoModel.update(
				// 좋아요를 누르지 않았다면 +1, 좋아요를 눌렀었다면 취소이므로 -1
				{ like_count: liked ? Sequelize.literal('like_count+1') : Sequelize.literal('like_count-1') },
				{
					where: {
						id: videoId,
					},
				},
			);
			const likeModel = await this.videoModel.findOne({
				where: {
					id:videoId
				}
			})
			return await likeModel.like_count;
		} catch (error) {
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
