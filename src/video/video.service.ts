import { Inject, Injectable, Logger } from "@nestjs/common";
import { Video } from "../model/video.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class VideoService {
	constructor(
		@InjectModel(Video)
		private videoModel: typeof Video,
	) {}

	private readonly logger = new Logger("Video Service");
}
