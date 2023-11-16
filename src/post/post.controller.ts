import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Body,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PostService } from "./post.service";
import { AuthenticatedGuard } from "src/auth/auth.guard";
import { CreatePostDto } from "./dto/create-post.dto";
import { FirebaseService } from "src/firebase/firebase.service";
import { generateId } from "src/generate-id";

@ApiTags("Community")
@Controller("community")
export class PostController {
	constructor(
		private postService: PostService,
		private firebaseService: FirebaseService
	) {}

	@ApiOperation({ description: "게시글 고유 아이디를 통해 하나의 게시글 검색" })
	@Get("/:creator_id/post/:post_id")
	async findPostById() {
		return "this function returns one post";
	}

	@ApiOperation({ description: "한 채널의 게시글 리스트 요청" })
	@Get("/:creator_id/post-list")
	async findPostsByCreatorId() {
		return "this function returns all post in the chanel";
	}

	@ApiOperation({ description: "한 채널에 게시글 업로드" })
	@Post("/create")
	@UseGuards(AuthenticatedGuard)
	@UseInterceptors(FileInterceptor("img", {}))
	async createPost(
		@Body() createPostDto: CreatePostDto,
		@UploadedFile() img: Express.Multer.File
	) {
		const {email, title} = createPostDto;
		const imgPath = generateId(`${email}${title}${img.originalname}`)
		
		if(!(await this.postService.findOnePost(imgPath))) {
			const resultFirebase = await this.firebaseService.uploadImage(img, imgPath);
			const resultPostServ = await this.postService.createPost(createPostDto, imgPath);

			if(resultFirebase && resultPostServ) return true;
			else {
				return new HttpException(
					"Failed to createPost or uploadImage on DataBase",
					HttpStatus.FAILED_DEPENDENCY
				);
			}
		}
		else {
			throw new HttpException(
				"Duplicated Video Title",
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@ApiOperation({ description: "한 채널의 게시글 수정" })
	@Patch("/:creator_id/post/:post_id")
	@UseGuards(AuthenticatedGuard)
	async updatePost() {}

	@ApiOperation({ description: "한 채널의 게시글 삭제" })
	@Delete("/:creator_id/post/:post_id")
	@UseGuards(AuthenticatedGuard)
	async deletePost() {}

	@ApiOperation({ description: "게시글에 댓글 등록" })
	@Get("/:creator_id/comment/:post_id")
	@UseGuards(AuthenticatedGuard)
	async createCommentToPost(@Param("post_id") params) {
		return params;
	}

	@ApiOperation({ description: "게시글의 댓글 수정" })
	@Patch("/:creator_id/comment/:post_id")
	@UseGuards(AuthenticatedGuard)
	async updateCommentToPost(@Param("post_id") params) {
		return params;
	}

	@ApiOperation({ description: "게시글 좋아요/싫어요 누르기" })
	@Post("/:creator_id/like/:post_id")
	@UseGuards(AuthenticatedGuard)
	async likeToPost(@Param("post_id") params) {
		return params;
	}
}
