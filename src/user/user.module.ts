import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/model/user.model";
import { FirebaseService } from "src/firebase/firebase.service";
import { Auth } from "src/model/auth.model";
import { Video } from "src/model/video.model";
import { Like } from "src/model/like.model";

@Module({
	imports: [SequelizeModule.forFeature([User,Video,Like,Auth])],
	controllers: [UserController],
	providers: [UserService, FirebaseService],
})
export class UserModule {}
