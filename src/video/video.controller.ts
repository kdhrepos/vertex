import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Delete,
	Patch,
} from "@nestjs/common";
import { VideoService } from "./video.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Video")
@Controller("video")
export class VideoController {
	constructor(private videoService: VideoService) {}

	// @ApiOperation({ description: "추천 알고리즘을 통한 비디오 요청" })
	// @Get("/")
	// async findVideosByAlgorithm() {}

	@ApiOperation({ description: "하나의 비디오 시청을 위해 비디오 요청" })
	@Get(":video_id")
	async findVideoById(@Param("video_id") params) {
		return params;
	}

	@ApiOperation({ description: "검색을 통해 비디오 요청" })
	@Get("search/:search_query")
	async findVideosBySearch(@Param("search_query") params) {
		return params;
	}

	@ApiOperation({ description: "비디오 수정" })
	@Patch(":video_id")
	async updateVideo() {}

	@ApiOperation({ description: "비디오 업로드" })
	@Post("upload")
	async uploadVideo() {}

	@ApiOperation({ description: "비디오 삭제" })
	@Delete(":video_id")
	async deleteVideo() {
		return "This deletes a video";
	}

	@ApiOperation({ description: "비디오 다운로드 요청" })
	@Get("/download/:video_id")
	async downloadVideo() {}
}
