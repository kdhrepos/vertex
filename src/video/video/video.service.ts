import { Inject, Injectable } from '@nestjs/common';
import { Video } from '../../models/video.model';

@Injectable()
export class VideoService {
    constructor(
        @Inject('VIDEO_REPOSITORY')
        private videoRepository: typeof Video
      ) {}
      
      async findAll(): Promise<Video[]> {
        return this.videoRepository.findAll();
      }

      // async findOneByValue(attribute : any) : Promise<Video> {
      //   return this.videoRepository.findOne();
      // }
}
