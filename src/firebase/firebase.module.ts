import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FirebaseService } from "./firebase.service";
import { Video } from "src/model/video.model";

@Module({
	imports: [SequelizeModule.forFeature([Video])],
	providers: [FirebaseService],
})
export class FirebaseModule {}
