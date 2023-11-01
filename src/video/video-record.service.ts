import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { VideoRecord } from "src/model/video-record.model";

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

	/**
	 * @param userId
	 * @description 유저가 영상을 시청하면 시청 목록에 추가
	 */
	async create(userId: string) {}

	/**
	 * @param userId
	 * @param videoId
	 * @description 유저가 시청 목록에서 비디오 삭제
	 */
	async delete(userId: string, videoId: string) {}
}
