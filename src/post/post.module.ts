import { Module } from "@nestjs/common";

import { PostController } from "./post.controller";
import { PostCommentService } from "./post-comment.service";
import { PostLikeService } from "./post-like.service";

import { SequelizeModule } from "@nestjs/sequelize";
import { Post } from "src/model/post.model";
import { PostService } from "./post.service";
import { Comment } from "src/model/comment.model";
import { Like } from "src/model/like.model";
import { FirebaseService } from "src/firebase/firebase.service";
import { VideoService } from "src/video/video.service";
import { Video } from "src/model/video.model";

@Module({
	imports: [SequelizeModule.forFeature([Post, Like, Comment, Video])],
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
