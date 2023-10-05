import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";
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
}
