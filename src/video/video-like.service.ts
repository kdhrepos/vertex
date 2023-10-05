import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class VideoLikeService {
	private readonly logger = new Logger("Video Like Service");
}
