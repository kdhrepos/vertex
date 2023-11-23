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
import { PostService } from "./post.service";
import { FirebaseService } from "src/firebase/firebase.service";
import * as path from "path";
import { CreatePostDto } from "./dto/post-dto/create-post.dto";
import { UpdatePostDto } from "./dto/post-dto/update-post.dto";
import * as bcrypt from "bcrypt";
import { UploadCommentDto } from "./dto/comment-dto/upload-comment.dto";
import { UpdateCommentDto } from "./dto/comment-dto/update-comment.dto";
import { DeleteCommentDto } from "./dto/comment-dto/delete-comment.dto";
import { PostCommentService } from "./post-comment.service";

@ApiTags("Community")
@Controller("community")
export class PostController {
	constructor(
		private postService: PostService,
		private postCommentService: PostCommentService,
		private firebaseService: FirebaseService,
	) { }

	// @ApiOperation({ description: "게시글 고유 아이디를 통해 하나의 게시글 검색" })
	// @Get("/:creator_id/post/:post_id")
	// async findPostById() {
	// 	return "this function returns one post";
	// }

	@ApiOperation({ description: "한 채널의 게시글 리스트 요청" })
	@Get("/list")
	async findPostList(@Query("channelId") channelId: string) {
		return await this.postService.findAll(channelId);
	}

	@ApiOperation({ description: "이미지 전송" })
	@Get("/image")
	async sendImage(@Res() res: Response, @Query('postId') postId: number, @Query('channelId') channelId: string) {
		const post = await this.postService.findOne(postId, channelId);
		const img = await this.firebaseService.findImage(
			post.image_file_path,
		);
		const buffer = Buffer.from(img);

		res.writeHead(200, {
			'Content-Type': 'image/png', // PNG 형식이라고 가정
			'Content-Length': buffer.length,
		});
		res.end(buffer);
	}
	@ApiOperation({ description: "채널 내 하나의 게시글 요청 (구현 x)" })
	@Get("")
	async findPost(
		@Query("postId") postId: number,
		@Query("channelId") channelId: string,
	) {
		return await this.postService.findOne(postId, channelId);
	}

	@ApiOperation({ description: "게시글의 이미지 요청" })
	@Get("image")
	async findPostImage(
		@Res() res: Response,
		@Query("postId") postId: number,
		@Query("channelId") channelId: string,
	) {
		const post = await this.postService.findOne(postId, channelId);
		return res.status(200).json({
			title: post.title,
			contents: post.contents,
			like_count: post.like_count,
			image: `http://localhost:8000/community/image?postId=${postId}&channelId=${channelId}`
		});
	}

	@ApiOperation({ description: "한 채널에 게시글 업로드" })
	@Post("")
	@UseGuards(AuthenticatedGuard)
	@UseInterceptors(FileInterceptor("img", {}))
	async uploadPost(
		@UploadedFile() img: Express.Multer.File,
		@Body() createPostDto: CreatePostDto,
		@Session() session: any,
	) {
		console.log(session);
		const { user: email } = session.passport;

		// 게시글 이미지가 없다면 그냥 null로 삽입
		const hashedFilePath =
			img !== null && img !== undefined
				? (await bcrypt.hashSync(email, 12).replace(/\//g, "")) +
				  path.extname(img.originalname)
				: null;

		await this.postService.create(createPostDto, hashedFilePath, session);

		if (img !== null && img !== undefined)
			await this.firebaseService.uploadImage(img, hashedFilePath);
	}

	@ApiOperation({ description: "한 채널의 게시글 수정" })
	@Patch("")
	@UseGuards(AuthenticatedGuard)
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
	@UseGuards(AuthenticatedGuard)
	async deletePost(@Query("postId") postId: string, @Session() session: any) {
		const post = await this.postService.delete(postId, session);
		await this.firebaseService.deleteImage(post);
	}

	@ApiOperation({ description: "게시글의 댓글들 가져오기" })
	@Get("/comment")
	async getComment(@Query("postId") postId: string) {
		return await this.postCommentService.findAll(postId);
	}

	@ApiOperation({ description: "게시글에 댓글 등록" })
	@Post("/comment")
	@UseGuards(AuthenticatedGuard)
	async createCommentToPost(
		@Body() uploadCommentDto: UploadCommentDto,
		@Session() session: any,
	) {
		return await this.postCommentService.create(uploadCommentDto, session);
	}

	@ApiOperation({ description: "게시글의 댓글 수정" })
	@Patch("/comment")
	@UseGuards(AuthenticatedGuard)
	async updateCommentToPost(
		@Body() updateCommentDto: UpdateCommentDto,
		@Session() session: any,
	) {
		return await this.postCommentService.update(updateCommentDto, session);
	}

	@ApiOperation({ description: "게시글의 댓글 삭제" })
	@Delete("/comment")
	@UseGuards(AuthenticatedGuard)
	async deleteCommentToPost(
		@Body() deleteCommentDto: DeleteCommentDto,
		@Session() session: any,
	) {
		return await this.postCommentService.delete(deleteCommentDto, session);
	}

	@ApiOperation({ description: "게시글 좋아요 누르기/취소" })
	@Post("/like")
	@UseGuards(AuthenticatedGuard)
	async likeToPost(@Query("postId") postId: string) { }
}
