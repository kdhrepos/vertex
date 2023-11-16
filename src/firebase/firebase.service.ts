import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
	FirebaseStorage,
	deleteObject,
	getStorage,
	getStream,
	ref,
	uploadBytes,
} from "firebase/storage";
import { Video } from "src/model/video.model";
import { UploadVideoDto } from "src/video/dto/video-dto/upload-video.dto";
import * as path from "path";
import { VideoService } from "src/video/video.service";
import { Response } from "express";
import { generateId } from "src/generate-id";

@Injectable()
export class FirebaseService {
	private readonly firebase: FirebaseApp;
	private readonly firebaseStorage: FirebaseStorage;

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

	constructor(private videoService: VideoService) {
		this.firebase = initializeApp(this.firebaseConfiguration);
		this.firebaseStorage = getStorage(this.firebase);
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
				return new HttpException(
					"Invalid Video Object",
					HttpStatus.BAD_REQUEST,
				);
			}

			const { email, title, description } = uploadVideoDto;

			const hashedFilePath = generateId(
				`${email}${title}${video.originalname}`,
			);

			// Firebase Storage 내 Video 파일 경로 생성
			let videoPath = "videos/";
			videoPath += hashedFilePath;
			videoPath += path.extname(video.originalname);

			// Firebase Storage 내 Thumbnail 이미지 경로 생성
			let thumbnailPath = "thumbnail/";
			thumbnailPath += hashedFilePath;
			thumbnailPath += path.extname(thumbnail.originalname);

			const videoDirRef = ref(this.firebaseStorage, videoPath);
			const thumbnailDirRef = ref(this.firebaseStorage, thumbnailPath);

			const videoResult = uploadBytes(videoDirRef, video.buffer);
			uploadBytes(thumbnailDirRef, thumbnail.buffer);

			// 비디오가 올바르게 업로드 되었다면 메타 데이터를 DB에 저장
			if (videoResult) {
				this.videoService.create(
					hashedFilePath,
					title,
					description,
					email,
					path.extname(video.originalname),
					path.extname(thumbnail.originalname),
				);

				return true;
			}
			return new HttpException(
				"Video Upload Error",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateVideo(
		videoData: Video,
		video: Express.Multer.File,
		thumbnail?: Express.Multer.File,
	) {
		const functionName = FirebaseService.prototype.uploadVideo.name;
		try {
			if (!video) {
				this.logger.error(`${functionName} : Invalid Video Object`);
				return new HttpException(
					"Invalid Video Object",
					HttpStatus.BAD_REQUEST,
				);
			}

			const {
				user_email: email,
				title,
				description,
				video_file_extension: videoFileExtension,
				thumbnail_file_extension: thumbnailFileExtension,
				file_path: filePath,
			} = videoData;

			// Firebase Storage 내 Video 파일 경로 생성
			let videoPath = "videos/";
			videoPath += filePath;
			videoPath += videoFileExtension;

			// Firebase Storage 내 Thumbnail 이미지 경로 생성
			let thumbnailPath = "thumbnail/";
			thumbnailPath += filePath;
			thumbnailPath += thumbnailFileExtension;

			const videoDirRef = ref(this.firebaseStorage, videoPath);
			const thumbnailDirRef = ref(this.firebaseStorage, thumbnailPath);

			uploadBytes(videoDirRef, video.buffer);
			uploadBytes(thumbnailDirRef, thumbnail.buffer);
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findVideo(res: Response, video: Video) {
		const functionName = FirebaseService.prototype.findVideo.name;
		try {
			const { file_path: filePath, video_file_extension: videoFileExtension } =
				video;

			const videoPath = "videos/" + filePath + videoFileExtension;
			const videoDirRef = ref(this.firebaseStorage, videoPath);
			const videoStream = getStream(videoDirRef);
			res.setHeader("Content-Type", "video/mp4");
			res.setHeader("Content-Disposition", 'inline; filename="video.mp4"');
			videoStream.pipe(res);
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async deleteVideo(video: Video) {
		const functionName = FirebaseService.prototype.deleteVideo.name;
		try {
			let { file_path: videoPath, video_file_extension: videoFileExtension } =
				video;
			videoPath = "videos/" + videoPath + videoFileExtension;

			const videoDirRef = ref(this.firebaseStorage, videoPath);

			deleteObject(videoDirRef);
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findThumbnail() {}

	async uploadImage(img: Express.Multer.File, imgPath: string) {
		const functionName = FirebaseService.prototype.uploadImage.name;
		try {
			if (!img) {
				this.logger.error(`${functionName} : Invalid Image Object`);
				throw new HttpException("Invalid Image Object", HttpStatus.BAD_REQUEST);
			}

			let imagePath = "images/";
			imagePath += imgPath;
			imagePath += path.extname(img.originalname);

			const imgDirRef = ref(this.firebaseStorage, imagePath);
			const imgResult = uploadBytes(imgDirRef, img.buffer);

			if (!imgResult) {
				throw new HttpException(
					"Image Upload Error",
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
			return true;
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
	async deleteImage() {}
	async findImage() {}
}
