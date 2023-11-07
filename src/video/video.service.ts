import {
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	Logger,
	Request,
	Response,
} from "@nestjs/common";
import { Video } from "../model/video.model";
import { InjectModel } from "@nestjs/sequelize";
import { createReadStream, statSync } from "fs";

@Injectable()
export class VideoService {
	constructor(
		@InjectModel(Video)
		private videoModel: typeof Video,
	) {}

	private readonly logger = new Logger("Video Service");

	/**
	 *
	 * @param req
	 * @param res
	 * @param videoId
	 * @description 비디오 id를 통해 하나의 비디오를 찾음
	 */
	async findOne(@Request() req, @Response() res, videoId: string) {
		const functionName = VideoService.prototype.findOne.name;
		try {
			const videoPath = `C:\\Users\\ehdgu\\Desktop\\vertex\\src\\video\\${videoId}.mp4`;

			const stat = statSync(videoPath);
			const fileSize = stat.size;
			const range = req.headers.range;

			if (range) {
				const parts = range.replace(/bytes=/, "").split("-");
				const start = parseInt(parts[0], 10);
				const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
				const chunksize = end - start + 1;
				const file = createReadStream(videoPath, { start, end });
				const head = {
					"Content-Range": `bytes ${start}-${end}/${fileSize}`,
					"Accept-Ranges": "bytes",
					"Content-Length": chunksize,
					"Content-Type": "video/mp4",
				};
				res.writeHead(206, head);
				file.pipe(res);
			} else {
				const head = {
					"Content-Length": fileSize,
					"Content-Type": "video/mp4",
				};
				res.writeHead(200, head);
				createReadStream(videoPath).pipe(res);
			}
		} catch (error) {
			this.logger.error(`${error}`);
			throw new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * @param userId
	 * @description 사용자 id를 통해 그 사용자가 업로드한 비디오들을 찾음
	 */
	async findAll(userId: string) {}

	/**
	 * @param userId
	 * @param videoFile
	 */
	async create(userId: string, video: Express.Multer.File) {
		// const firebase = initializeApp({});
		// const firebaseStorage = getStorage(firebase);
		// const storageReference = ref(firebaseStorage);
	}

	/**
	 * @param userId
	 * @param videoId
	 * @param videoInfo // 비디오 메타 데이터
	 */
	async update(userId: string, videoId: string, videoInfo: any) {}

	/**
	 * @param userId
	 * @param videoId
	 */
	async delete(userId: string, videoId: string) {}
}
