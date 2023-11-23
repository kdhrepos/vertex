import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FirebaseService } from "./firebase.service";
import { Video } from "src/model/video.model";
import { VideoService } from "src/video/video.service";
import { Like } from "src/model/like.model";

@Module({
	imports: [SequelizeModule.forFeature([Video, Like])],
	providers: [FirebaseService],
})
export class FirebaseModule {}
