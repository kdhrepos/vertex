import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Post")
@Controller("post")
export class PostController {
	@ApiOperation({ description: "게시글 고유 아이디를 통해 하나의 게시글 검색" })
	@Get(":id")
	findPostById() {
		return "this function returns one post";
	}

	@ApiOperation({ description: "한 채널의 게시글 리스트 요청" })
	@Get("/community/:creator_id")
	findPostsByUserId() {}

	@ApiOperation({ description: "한 채널에 게시글 업로드" })
	@Post("/community/:creator_id")
	createPost() {}

	@ApiOperation({ description: "한 채널의 게시글 수정" })
	@Patch("/community/:post_id")
	updatePost() {}

	@ApiOperation({ description: "한 채널의 게시글 삭제" })
	@Delete("/community/:post_id")
	DeletePostDto() {}

	@ApiOperation({ description: "게시글에 댓글 등록" })
	@Get("/comment/:post_id")
	async uploadCommentToPost(@Param("post_id") params) {
		return params;
	}

	@ApiOperation({ description: "게시글의 댓글 수정" })
	@Patch("/comment/:post_id")
	async updateCommentToPost(@Param("post_id") params) {
		return params;
	}

	@ApiOperation({ description: "게시글 좋아요/싫어요 누르기" })
	@Post("/like/:post_id")
	async likeToPost(@Param("post_id") params) {
		return params;
	}
}
