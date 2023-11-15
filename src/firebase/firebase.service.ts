import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import * as bcrypt from "bcrypt";
import { Video } from "src/model/video.model";
import { InjectModel } from "@nestjs/sequelize";
import { UploadVideoDto } from "src/video/dto/upload-video.dto";
import * as path from "path";

@Injectable()
export class FirebaseService {
	private readonly firebase: FirebaseApp;

	private readonly firebaseConfiguration = {
		apiKey: `${process.env.FIREBASE_API_KEY}`,
		authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}`,
		projectId: `${process.env.FIREBASE_PROJECT_ID}`,
		storageBucket: `${process.env.FIREBASE_STORAGE}`,
		appId: `${process.env.FIREBASE_APP_ID}`,
		messagingSenderId: `${process.env.FIREBASE_SENDER_ID}`,
		measurementId: `${process.env.FIREBASE_MEASUREMENT_ID}`,
	};

	private readonly logger = new Logger("Firebase Service");

	constructor(
		@InjectModel(Video)
		private videoModel: typeof Video,
	) {
		this.firebase = initializeApp(this.firebaseConfiguration);
	}

	async uploadVideo(
		uploadVideoDto: UploadVideoDto,
		video: Express.Multer.File,
		thumbnail?: Express.Multer.File,
	) {
		const functionName = FirebaseService.prototype.uploadVideo.name;
		try {
			if (!video) {
				this.logger.error(`${functionName} : Invalid Video Object`);
				return;
			}

			const { email, title, description } = uploadVideoDto;
			const hashedFilePath = bcrypt
				.hashSync(`${email}${title}${video.originalname}`, 12)
				.replace(/\//g, "_");

			// Firebase Storage 내 Video 파일 경로 생성
			let videoPath = "videos/";
			videoPath += hashedFilePath;
			videoPath += path.extname(video.originalname);

			// Firebase Storage 내 Thumbnail 이미지 경로 생성
			let thumbnailPath = "thumbnail/";
			thumbnailPath += hashedFilePath;
			thumbnailPath += path.extname(thumbnail.originalname);

			const firebaseStorage = getStorage(this.firebase);
			const videoDirRef = ref(firebaseStorage, videoPath);
			const thumbnailDirRef = ref(firebaseStorage, thumbnailPath);

			const videoResult = uploadBytes(videoDirRef, video.buffer);
			uploadBytes(thumbnailDirRef, thumbnail.buffer);

			// 비디오가 올바르게 업로드 되었다면 메타 데이터를 DB에 저장
			if (videoResult) {
				this.videoModel.create({
					video_path: hashedFilePath,
					thumbnail_path: thumbnail === null ? null : hashedFilePath,
					title: title,
					description: description === null ? null : description,
					user_email: email,
				});

				return true;
			}
			throw new HttpException(
				"Video Upload Error",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			throw new HttpException(
				"Video Upload Error",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findVideo() {}

	async deleteVideo() {}
}
