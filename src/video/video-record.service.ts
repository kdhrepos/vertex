import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { VideoRecord } from "src/model/video-record.model";
import { Video } from "src/model/video.model";

@Injectable()
export class VideoRecordService {
	constructor(
		@InjectModel(VideoRecord)
		private videoRecordModel: typeof VideoRecord,
	) {}

	private readonly logger = new Logger("Video Record Service");

	/**
	 * @param userId
	 * @description 유저가 자신의 모든 영상 시청 목록을 찾음
	 */
	async findAll(userId: string) {}

	async create(video: Video) {
		const functionName = VideoRecordService.prototype.create.name;
		try {
			const { user_email: email, file_path: filePath } = video;

			const existedRecord = await this.videoRecordModel.findOne({
				where: {
					email: email,
					filePath: filePath,
				},
			});

			if (existedRecord) {
				return;
			}

			await this.videoRecordModel.create({
				user_email: email,
				video_id: filePath,
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * @param userId
	 * @param videoId
	 * @description 유저가 시청 목록에서 비디오 삭제
	 */
	async delete(userId: string, videoId: string) {}
}
