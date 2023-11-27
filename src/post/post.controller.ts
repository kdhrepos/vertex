import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Body,
	Res,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	HttpException,
	HttpStatus,
	Session,
	Query,
} from "@nestjs/common";
import { Request, Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthenticatedGuard } from "src/auth/auth.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FirebaseService } from "src/firebase/firebase.service";
import * as path from "path";
import { CreatePostDto } from "./dto/post-dto/create-post.dto";
import { UpdatePostDto } from "./dto/post-dto/update-post.dto";
import * as bcrypt from "bcrypt";
import { UploadCommentDto } from "./dto/comment-dto/upload-comment.dto";
import { UpdateCommentDto } from "./dto/comment-dto/update-comment.dto";
import { DeleteCommentDto } from "./dto/comment-dto/delete-comment.dto";
import { PostCommentService } from "./post-comment.service";
import { PostService } from "./post.service";
import { PostLikeService } from "./post-like.service";

@ApiTags("Community")
@Controller("community")
export class PostController {
	constructor(
		private postService: PostService,
		private postLikeService:PostLikeService,
		private postCommentService: PostCommentService,
		private firebaseService: FirebaseService,
	) {}

	// @ApiOperation({ description: "게시글 고유 아이디를 통해 하나의 게시글 검색" })
	// @Get("/:creator_id/post/:post_id")
	// async findPostById() {
	// 	return "this function returns one post";
	// }

	@ApiOperation({ description: "새로운 게시글 리스트 요청" })
	@Get("list/new")
	async findNewPosts() {
		return await this.postService.findNewPosts();
	}

	@ApiOperation({ description: "한 채널의 게시글 리스트 요청" })
	@Get("list")
	async findPostList(@Query("channelId") channelId: string) {
		return await this.postService.findAll(channelId);
	}

	@ApiOperation({
		description: "채널 내 하나의 게시글 데이터 요청 (이미지 포함)",
	})
	@Get("image")
	async findPost(
		@Res() res: Response,
		@Query("postId") postId: number,
	) {
		const post = await this.postService.findOne(postId);
		const img = await this.firebaseService.findImage(post.image_file_path);

		const imgFileExt = post.image_file_path.split(".");

		const buffer = Buffer.from(img);

		res.setHeader("Content-Type", `image/${imgFileExt[imgFileExt.length - 1]}`);
		res.setHeader("Content-Length", buffer.length);

		return res.send(buffer);
	}	

	@ApiOperation({ description: "한 채널에 게시글 업로드" })
	@Post("")
	@UseInterceptors(FileInterceptor("img", {}))
	async uploadPost(
		@UploadedFile() img: Express.Multer.File,
		@Body() createPostDto: CreatePostDto,
	) {
		// 게시글 이미지가 없다면 그냥 null로 삽입
		const hashedFilePath =
			img !== null || img !== undefined
				? (await bcrypt.hashSync("asdasdasjid", 12).replace(/\//g, "")) +
				  path.extname(img.originalname)
				: null;

		if (img !== null && img !== undefined)
			await this.firebaseService.uploadImage(img, hashedFilePath);

		return await this.postService.create(createPostDto, hashedFilePath);
	}

	@ApiOperation({ description: "한 채널의 게시글 수정" })
	@Patch("")
	@UseInterceptors(FileInterceptor("img", {}))
	async updatePost(
		@UploadedFile() img: Express.Multer.File,
		@Body() updatePostDto: UpdatePostDto,
	) {
		const post = await this.postService.update(updatePostDto);
		if (img != null || img != undefined) {
			await this.firebaseService.updateImage(img, post.image_file_path);
		}
	}

	@ApiOperation({ description: "한 채널의 게시글 삭제" })
	@Delete("")
	async deletePost(
		@Query("postId") postId: string,
		@Query("email") email: string,
	) {
		const post = await this.postService.delete(postId, email);
		const { image_file_path: imgPath } = post;
		return await this.firebaseService.deleteImage(imgPath);
	}

	@ApiOperation({ description: "게시글의 댓글들 가져오기" })
	@Get("/comment")
	async getComment(@Query("postId") postId: string) {
		return await this.postCommentService.findAll(postId);
	}

	@ApiOperation({ description: "게시글에 댓글 등록" })
	@Post("/comment")
	async createCommentToPost(@Body() uploadCommentDto: UploadCommentDto) {
		return await this.postCommentService.create(uploadCommentDto);
	}

	@ApiOperation({ description: "게시글의 댓글 수정" })
	@Patch("/comment")
	async updateCommentToPost(@Body() updateCommentDto: UpdateCommentDto) {
		return await this.postCommentService.update(updateCommentDto);
	}

	@ApiOperation({ description: "게시글의 댓글 삭제" })
	@Delete("/comment")
	async deleteCommentToPost(@Body() deleteCommentDto: DeleteCommentDto) {
		return await this.postCommentService.delete(deleteCommentDto);
	}

	@ApiOperation({ description: "게시글 좋아요 누르기/취소" })
	@Post("like")
	async likeToPost(@Query("postId") postId: number, @Query("email") email: string,) {
			return await this.postLikeService.create(postId,email);
	}

	@ApiOperation({ description: "하나의 게시글에 좋아요 눌렀는지 체크" })
	@Get("like")
	async checkLikeToVideo(
		@Body("postId") postId: string,
		@Body("email") email: string,
	) {
			return await this.postLikeService.findOne(postId, email);
	}
}
