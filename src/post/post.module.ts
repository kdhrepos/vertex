import { Module } from "@nestjs/common";

import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostLikeController } from "./post-like.controller";
import { PostCommentController } from "./post-comment.controller";
import { PostCommentService } from "./post-comment.service";
import { PostLikeService } from "./post-like.service";

import { SequelizeModule } from "@nestjs/sequelize";
import { Post } from "src/model/post.model";

@Module({
	imports: [SequelizeModule.forFeature([Post])],
	controllers: [PostController, PostLikeController, PostCommentController],
	providers: [PostService, PostLikeService, PostCommentService],
})
export class PostModule {}
