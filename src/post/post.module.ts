import { Module } from "@nestjs/common";

import { PostController } from "./post.controller";
import { PostCommentService } from "./post-comment.service";
import { PostLikeService } from "./post-like.service";

import { SequelizeModule } from "@nestjs/sequelize";
import { Post } from "src/model/post.model";
import { PostLike } from "src/model/post-like.model";
import { PostComment } from "src/model/post-comment.model";
import { PostService } from "./post.service";

@Module({
	imports: [SequelizeModule.forFeature([Post, PostLike, PostComment])],
	controllers: [PostController],
	providers: [PostService, PostLikeService, PostCommentService],
})
export class PostModule {}
