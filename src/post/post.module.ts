import { Module } from "@nestjs/common";

import { PostController } from "./post.controller";
import { PostCommentService } from "./post-comment.service";
import { PostLikeService } from "./post-like.service";

import { SequelizeModule } from "@nestjs/sequelize";
import { Post } from "src/model/post.model";
import { PostService } from "./post.service";
import { Comment } from "src/model/commet.model";
import { Like } from "src/model/like.model";

@Module({
	imports: [SequelizeModule.forFeature([Post, Like, Comment])],
	controllers: [PostController],
	providers: [PostService, PostLikeService, PostCommentService],
})
export class PostModule {}
