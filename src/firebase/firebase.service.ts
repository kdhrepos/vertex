import { Injectable, Logger } from "@nestjs/common";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

@Injectable()
export class FirebaseService {
	private readonly firebase: FirebaseApp;

	private readonly firebaseConfiguration = {
		// apiKey: `${process.env.FIREBASE_API_KEY}`,
		// authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}`,
		// projectId: `${process.env.FIREBASE_PROJECT_ID}`,
		// storageBucket: `${process.env.FIREBASE_STORAGE}`,
		// appId: `${process.env.FIREBASE_APP_ID}`,
		// messagingSenderId: "606232107300",
		// measurementId: "G-DTQ0C1PHH0",
		apiKey: "AIzaSyDkxjQN_kjK6vhe4toVhU6gkWBYPpmwm4o",
		authDomain: "vertex-403708.firebaseapp.com",
		projectId: "vertex-403708",
		storageBucket: "vertex-403708.appspot.com",
		messagingSenderId: "606232107300",
		appId: "1:606232107300:web:39dbf8a927b415cdf5bbb1",
		measurementId: "G-DTQ0C1PHH0",
	};

	private readonly logger = new Logger("Firebase Service");

	constructor() {
		this.firebase = initializeApp(this.firebaseConfiguration);
	}

	async uploadVideo(user_id: string, video: Express.Multer.File) {
		try {
			if (!video) {
				this.logger.error("Invalid video object.");
				return;
			}

			const firebaseStorage = getStorage(this.firebase);
			const videoDirRef = ref(firebaseStorage, `videos/${video.originalname}`);

			uploadBytes(videoDirRef, video.buffer);
		} catch (error) {
			console.error("Error uploading to Firebase:", error);
		}
	}

	async deleteVideo() {}
}
