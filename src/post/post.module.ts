import { Module } from "@nestjs/common";

import { PostController } from "./post.controller";
import { PostCommentService } from "./post-comment.service";
import { PostLikeService } from "./post-like.service";

import { SequelizeModule } from "@nestjs/sequelize";
import { Post } from "src/model/post.model";
import { Comment } from "src/model/comment.model";
import { FirebaseService } from "src/firebase/firebase.service";
import { VideoService } from "src/video/video.service";
import { Video } from "src/model/video.model";
import { Like } from "src/model/like.model";
import { VideoLikeService } from "src/video/video-like.service";
import { PostService } from "./post.service";
import { User } from "src/model/user.model";

@Module({
	imports: [SequelizeModule.forFeature([Post, Comment, Video, Like, User])],
	controllers: [PostController],
	providers: [
		PostService,
		PostLikeService,
		PostCommentService,
		FirebaseService,
		VideoService,
	],
})
export class PostModule {}
