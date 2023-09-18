import { Controller, Get, Param, Post,Body,Delete } from '@nestjs/common';
import { VideoService } from './video.service';
import { UUID } from 'crypto';
import { CreateVideoDto } from './dto/create-video.dto';
import { DeleteVideoDto } from './dto/delete-video.dto';

@Controller('video')
export class VideoController {
    constructor(private videoService: VideoService){
    }

    @Get("/:id")
    async findVideoById(@Param("id") videoId : UUID) {
        return "This returns one video by id"
    }

    @Post()
    async createVideo(@Body() createVideoDto : CreateVideoDto ){
        return "This makes a video"
    }

    @Delete()
    async deleteVideoById(@Body() deleteVideoDto : DeleteVideoDto){
        return "This deletes a video"
    }
}
