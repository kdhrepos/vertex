import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
	FirebaseStorage,
	deleteObject,
	getDownloadURL,
	getStorage,
	getStream,
	getBytes,
	ref,
	uploadBytes,
} from "firebase/storage";
import { Video } from "src/model/video.model";
import * as path from "path";
import { Response } from "express";
import { error } from "console";

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

	constructor() {
		this.firebase = initializeApp(this.firebaseConfiguration);
		this.firebaseStorage = getStorage(this.firebase);
	}

	async uploadVideo(hashedFilePath: string, video: Express.Multer.File) {
		try {
			if (!video) return;

			// Firebase Storage 내 Video 파일 경로 생성
			let videoPath = "videos/";
			videoPath += hashedFilePath;
			videoPath += path.extname(video.originalname);

			const videoDirRef = ref(this.firebaseStorage, videoPath);

			// 비디오 업로드
			const videoResult = await uploadBytes(videoDirRef, video.buffer);

			// 비디오가 올바르게 업로드 되었다면 성공 메시지 반환
			if (videoResult) {
				return {
					statusCode: 200,
					message: "Video successfully uploaded",
				};
			}
			return {
				statusCode: 500,
				message: "Video successfully failed",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateVideo(videoData: Video, video: Express.Multer.File) {
		try {
			if (!video) {
				return {
					statusCode: 400,
					message: "Invalid video object",
				};
			}

			const {
				id: filePath,
				user_email: email,
				title,
				description,
				video_file_extension: videoFileExtension,
				thumbnail_file_extension: thumbnailFileExtension,
			} = videoData;

			// Firebase Storage 내 Video 파일 경로 생성
			let videoPath = "videos/";
			videoPath += filePath;
			videoPath += videoFileExtension;

			const videoDirRef = ref(this.firebaseStorage, videoPath);

			const result = uploadBytes(videoDirRef, video.buffer);

			if (result) {
				return {
					statusCode: 200,
					message: "Video successfully updated",
				};
			}
			return {
				statusCode: 500,
				message: "Video update failed",
			};
		} catch (error) {
			return new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findVideo(videoPath: string) {
		try {
			videoPath = "videos/" + videoPath;
			const videoDirRef = ref(this.firebaseStorage, videoPath);
			const videoUrl = await getDownloadURL(videoDirRef);

			return videoUrl;
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteVideo(video: Video) {
		const functionName = FirebaseService.prototype.deleteVideo.name;
		try {
			let { id: videoPath, video_file_extension: videoFileExtension } = video;
			videoPath = "videos/" + videoPath + videoFileExtension;

			const videoDirRef = ref(this.firebaseStorage, videoPath);

			return deleteObject(videoDirRef)
				.then(result => {
					return {
						statusCode: 200,
						message: "Video successfully deleted",
					};
				})
				.catch(error => {
					return {
						statusCode: 500,
						message: `${error}`,
					};
				});
		} catch (error) {
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async downloadVideo(video: Video): Promise<string> {
		const functionName = FirebaseService.prototype.downloadVideo.name;
		try {
			const { id: filePath, video_file_extension: videoFileExtension } = video;

			const videoPath = "videos/" + filePath + videoFileExtension;
			const videoDirRef = ref(this.firebaseStorage, videoPath);
			const downloadURL = await getDownloadURL(videoDirRef);
			return downloadURL;
		} catch (error) {
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findImage(imgPath: string) {
		const functionName = FirebaseService.prototype.findImage.name;
		try {
			const imagePath = "images/" + imgPath;
			const imgDirRef = ref(this.firebaseStorage, imagePath);
			const imgUrl = await getDownloadURL(imgDirRef);

			return imgUrl;
		} catch (error) {
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
	async uploadImage(img: Express.Multer.File, imgPath: any) {
		const functionName = FirebaseService.prototype.uploadImage.name;
		try {
			if (!img) return;

			const imagePath = "images/" + imgPath;
			const imgDirRef = ref(this.firebaseStorage, imagePath);
			const imgResult = uploadBytes(imgDirRef, img.buffer);

			if (!imgResult)
				return {
					statusCode: 500,
					message: "Image Upload Error",
				};

			return {
				statusCode: 200,
				message: "Image successfully uploaded",
			};
		} catch (error) {
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
	async updateImage(img: Express.Multer.File, imgPath: any) {
		const functionName = FirebaseService.prototype.uploadImage.name;
		try {
			if (!img) {
				return new HttpException(
					"Invalid Image Object",
					HttpStatus.BAD_REQUEST,
				);
			}

			const imagePath = "images/" + imgPath;
			const imgDirRef = ref(this.firebaseStorage, imagePath);
			const imgResult = uploadBytes(imgDirRef, img.buffer);

			if (!imgResult)
				return {
					statusCode: 500,
					message: "Image Update Error",
				};

			return {
				statusCode: 200,
				message: "Image successfully deleted",
			};
		} catch (error) {
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
	async deleteImage(imgPath: string) {
		const functionName = FirebaseService.prototype.deleteImage.name;
		try {
			if (!imgPath) return;

			const imagePath = "images/" + imgPath;
			const imgDirRef = ref(this.firebaseStorage, imagePath);
			const imgResult = deleteObject(imgDirRef);

			if (!imgResult)
				return {
					statusCode: 500,
					message: "Image Delete Error",
				};

			return {
				statusCode: 200,
				message: "Image successfully deleted",
			};
		} catch (error) {
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
