import {
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PostService } from "./post.service";

@ApiTags("Community")
@Controller("community")
export class PostController {
	constructor(private postService: PostService) {}

	@ApiOperation({ description: "게시글 고유 아이디를 통해 하나의 게시글 검색" })
	@Get("/:creator_id/post/:post_id")
	async findPostById() {
		return "this function returns one post";
	}

	@ApiOperation({ description: "한 채널의 게시글 리스트 요청" })
	@Get("/:creator_id/post-list")
	async findPostsByCreatorId() {}

	@ApiOperation({ description: "한 채널에 게시글 업로드" })
	@Post("/aaa")
	@UseInterceptors(FileInterceptor("img", {}))
	async createPost(@UploadedFile() file: Express.Multer.File) {}

	@ApiOperation({ description: "한 채널의 게시글 수정" })
	@Patch("/:creator_id/post/:post_id")
	async updatePost() {}

	@ApiOperation({ description: "한 채널의 게시글 삭제" })
	@Delete("/:creator_id/post/:post_id")
	async deletePost() {}

	@ApiOperation({ description: "게시글에 댓글 등록" })
	@Get("/:creator_id/comment/:post_id")
	async createCommentToPost(@Param("post_id") params) {
		return params;
	}

	@ApiOperation({ description: "게시글의 댓글 수정" })
	@Patch("/:creator_id/comment/:post_id")
	async updateCommentToPost(@Param("post_id") params) {
		return params;
	}

	@ApiOperation({ description: "게시글 좋아요/싫어요 누르기" })
	@Post("/:creator_id/like/:post_id")
	async likeToPost(@Param("post_id") params) {
		return params;
	}
}
