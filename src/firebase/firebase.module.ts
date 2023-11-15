import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FirebaseService } from "./firebase.service";
import { Video } from "src/model/video.model";
import { VideoService } from "src/video/video.service";

@Module({
	imports: [SequelizeModule.forFeature([Video])],
	providers: [FirebaseService, VideoService],
})
export class FirebaseModule {}
